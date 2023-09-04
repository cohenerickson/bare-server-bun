import { Server, WebSocketHandler } from "bun";
import { BareError, NotFoundError } from "./BareError";
import { JSONResponse } from "./JSONResponse";
import { WebSocketDataType } from "./BareServer";
import { v4 } from "uuid";
import {
  baseForwardHeaders,
  forbiddenForwardHeaders,
  mergeHeaders
} from "./headerUtil";
import z from "zod";

const WS_MAP = new Map<string, WebSocket>();

const zConnectMsg = z.object({
  type: z.string().refine((type) => type === "connect"),
  remote: z.string().url(),
  protocols: z.array(z.string()),
  headers: z.record(z.string(), z.string()),
  forwardHeaders: z.array(z.string())
});

export async function fetch(
  request: Request,
  server: Server
): Promise<Response | undefined> {
  const path = new URL(request.url).pathname.replace(/^\/v3/, "");

  if (/^\/?$/.test(path)) {
    if (request.headers.get("upgrade")?.toLowerCase() === "websocket") {
      const upgrade = server.upgrade<WebSocketDataType>(request, {
        data: {
          version: "v3",
          request,
          id: v4()
        }
      });

      if (upgrade) {
        return;
      } else {
        return new BareError(
          BareError.UNKNOWN,
          "unknown",
          "WebSocket upgrade failed"
        ).response();
      }
    }

    return new JSONResponse({});
  } else {
    return NotFoundError;
  }
}

export const websocket: WebSocketHandler<WebSocketDataType> = {
  async open(ws) {
    setTimeout(() => {
      const remote = WS_MAP.get(ws.data.id);

      if (!remote) {
        ws.close();
      }
    }, 10000);
  },
  async message(ws, data) {
    const remote = WS_MAP.get(ws.data.id);

    if (!remote) {
      let json: z.infer<typeof zConnectMsg>;

      try {
        json = JSON.parse(data as string);
      } catch {
        return ws.close();
      }

      if (!zConnectMsg.safeParse(json).success) {
        return ws.close();
      }

      if (
        json.forwardHeaders.some((header) =>
          forbiddenForwardHeaders.includes(header)
        )
      ) {
        return ws.close();
      }

      const remote = new WebSocket(json.remote, {
        protocols: json.protocols,
        headers: mergeHeaders(
          new Headers(json.headers),
          ws.data.request.headers,
          json.forwardHeaders.concat(
            baseForwardHeaders(
              new URLSearchParams(new URL(ws.data.request.url).search).has(
                "cache"
              )
            )
          )
        )
      });

      // TODO: Find a way to get headers from the remote
      remote.onopen = (event: any) => {
        ws.send(
          JSON.stringify({
            type: "open",
            protocol: "",
            setCookies: []
          }),
          true
        );
      };

      remote.onmessage = (event: MessageEvent<string | Buffer>) => {
        ws.send(event.data, true);
      };

      remote.onclose = (event: CloseEvent) => {
        ws.close(event.code, event.reason);
      };

      remote.onerror = (event: Event<EventTarget>) => {
        ws.close();
      };

      WS_MAP.set(ws.data.id, remote);
    } else {
      remote.send(data);
    }
  },
  async close(ws, code, reason) {
    const remote = WS_MAP.get(ws.data.id);

    if (remote) {
      remote.close(code, reason);

      WS_MAP.delete(ws.data.id);
    }
  }
};
