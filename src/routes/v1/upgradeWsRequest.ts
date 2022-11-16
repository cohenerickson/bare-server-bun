import BareError from "~/util/BareError";
import { decodeProtocol, validateProtocol } from "~/util/encodeProtocol";

export default async function upgradeWs(
  request: Request,
  server: any
): Promise<Response | void> {
  if (request.method !== "GET") {
    return new BareError(BareError.UNKNOWN, "request.method", {
      message: "Invalid request method."
    });
  }

  /*
    Start Validate Headers
  */
  {
    const requiredHeaders: string[] = ["Sec-WebSocket-Protocol"];

    for (let i = 0; i < requiredHeaders.length; i++) {
      if (!request.headers.has(requiredHeaders[i])) {
        return new BareError(
          BareError.MISSING_BARE_HEADER,
          `request.headers.${requiredHeaders[i]}`
        );
      }
      switch (requiredHeaders[i]) {
        case "Sec-WebSocket-Protocol":
          try {
            const headerValue = request.headers.get(requiredHeaders[i]) ?? "";
            if (
              !/^bare, ?[!#$%&'*+-.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ^_`abcdefghijklmnopqrstuvwxyz|~]+$/.test(
                headerValue
              ) ||
              !validateProtocol(headerValue.split(/, ?/)[1])
            )
              throw new Error();

            const protocol = JSON.parse(
              decodeProtocol(headerValue.split(/, ?/)[1])
            );
            if (!("remote" in protocol)) throw new Error();
            if (!("host" in protocol.remote)) throw new Error();
            if (!("port" in protocol.remote)) throw new Error();
            if (!("path" in protocol.remote)) throw new Error();
            if (!("protocol" in protocol.remote)) throw new Error();
            if (!("headers" in protocol)) throw new Error();
            if (!("forward_headers" in protocol)) throw new Error();
          } catch {
            return new BareError(
              BareError.INVALID_BARE_HEADER,
              `request.headers.${requiredHeaders[i]}`
            );
          }
          break;
      }
    }

    const requestHeadersKeys = Object.keys(
      Object.fromEntries(request.headers as any)
    );

    for (let i = 0; i < requestHeadersKeys.length; i++) {
      if (/^x-bare/i.test(requestHeadersKeys[i])) {
        if (
          !requiredHeaders
            .map((x) => x.toLowerCase())
            .includes(requestHeadersKeys[i].toLowerCase())
        ) {
          return new BareError(
            BareError.UNKNOWN_BARE_HEADER,
            `request.headers.${requestHeadersKeys[i]}`
          );
        }
      }
    }
  }
  /*
    End Validate Headers
  */

  if (
    server.upgrade(request, {
      data: {
        headers: Object.fromEntries(request.headers as any),
        url: request.url
      }
    })
  )
    return;
}
