import { Serve, Server, ServerWebSocket } from "bun";
import { NotFoundError } from "./BareError";
import { JSONResponse } from "./JSONResponse";
import { versions } from "./versions";

const VERSION_REGEX = new RegExp(
  `^/(?<version>${Object.keys(versions).join("|")})/?`
);

export type WebSocketDataType = {
  version: keyof typeof versions;
  request: Request;
  id: string;
};

export class BareServer {
  #serve: Serve<WebSocketDataType>;
  #server?: Server;

  constructor(maintainer?: { email: string; website: string }) {
    this.#serve = {
      async fetch(request, server) {
        const path = new URL(request.url).pathname;

        if (/^\/?$/.test(path)) {
          return new JSONResponse({
            versions: Object.keys(versions),
            language: "Bun",
            memoryUsage:
              Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) /
              100,
            project: {
              name: "bare-server-bun",
              description: "TOMPHTTP Bare Server built with Bun",
              repository: "https://github.com/cohenerickson/bare-server-bun",
              version: "0.0.1"
            }
          });
        } else if (VERSION_REGEX.test(path)) {
          const version = path.match(VERSION_REGEX)!.groups!
            .version as keyof typeof versions;

          return await versions[version].fetch(request, server);
        } else {
          return NotFoundError;
        }
      },
      websocket: {
        async open(ws) {
          const open = versions[ws.data.version].websocket.open;
          try {
            if (open) await open(ws);
          } catch (e) {
            console.log(e);
            ws.close();
          }
        },
        async message(ws, data) {
          const message = versions[ws.data.version].websocket.message;
          try {
            if (message) await message(ws, data);
          } catch (e) {
            console.log(e);
            ws.close();
          }
        },
        async close(ws, code, reason) {
          const close = versions[ws.data.version].websocket.close;
          try {
            if (close) await close(ws, code, reason);
          } catch (e) {
            console.log(e);
            ws.close();
          }
        }
      }
    };
  }

  listen(port?: number, hostname?: string) {
    if (this.#server) {
      throw new Error("Server already running");
    }

    this.#server = Bun.serve(Object.assign(this.#serve, { port, hostname }));
  }

  stop() {
    if (!this.#server) {
      throw new Error("Server not running");
    }
    this.#server?.stop();
  }

  get port(): number {
    if (!this.#server) {
      throw new Error("Server not running");
    }
    return this.#server.port;
  }

  get hostname(): string {
    if (!this.#server) {
      throw new Error("Server not running");
    }
    return this.#server.hostname;
  }
}
