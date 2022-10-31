import BareError from "~/util/BareError";
import httpRequest from "~/util/HttpRequest";

export default async function handleHttpRequest(
  request: Request
): Promise<Response> {
  /*
    Start Validate Headers
  */
  {
    const requiredHeaders: string[] = [
      "X-Bare-Host",
      "X-Bare-Port",
      "X-Bare-Protocol",
      "X-Bare-Path",
      "X-Bare-Headers",
      "X-Bare-Forward-Headers"
    ];

    for (let i = 0; i < requiredHeaders.length; i++) {
      if (!request.headers.has(requiredHeaders[i])) {
        return new BareError(
          BareError.MISSING_BARE_HEADER,
          `request.headers.${requiredHeaders[i]}`
        );
      }
      switch (requiredHeaders[i]) {
        case "X-Bare-Host":
          if (!/^.+?\..+/.test(request.headers.get(requiredHeaders[i]) ?? "")) {
            return new BareError(
              BareError.INVALID_BARE_HEADER,
              `request.headers.${requiredHeaders[i]}`
            );
          }
          break;
        case "X-Bare-Port":
          const number = Number(request.headers.get(requiredHeaders[i]));
          if (isNaN(number)) {
            return new BareError(
              BareError.INVALID_BARE_HEADER,
              `request.headers.${requiredHeaders[i]}`
            );
          } else if (number < 0 || number > 65353) {
            return new BareError(
              BareError.INVALID_BARE_HEADER,
              `request.headers.${requiredHeaders[i]}`
            );
          }
          break;
        case "X-Bare-Protocol":
          if (
            !/^(http|ws)s:$/.test(request.headers.get("X-Bare-Protocol") ?? "")
          ) {
            return new BareError(
              BareError.INVALID_BARE_HEADER,
              `request.headers.${requiredHeaders[i]}`
            );
          }
          break;
        case "X-Bare-Path":
          if (!/^\/.*/.test(request.headers.get(requiredHeaders[i]) ?? "")) {
            return new BareError(
              BareError.INVALID_BARE_HEADER,
              `request.headers.${requiredHeaders[i]}`
            );
          }
          break;
        case "X-Bare-Headers":
          try {
            const json = JSON.parse(
              request.headers.get(requiredHeaders[i]) ?? ""
            );

            if (Array.isArray(json)) throw new Error();
          } catch {
            return new BareError(
              BareError.INVALID_BARE_HEADER,
              `request.headers.${requiredHeaders[i]}`
            );
          }
          break;
        case "X-Bare-Forward-Headers":
          try {
            const json = JSON.parse(
              request.headers.get(requiredHeaders[i]) ?? ""
            );

            if (!Array.isArray(json)) throw new Error();
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

    const validHeaders: string[] = requiredHeaders.map((x: string) => x);
    validHeaders.concat(["X-Bare-Pass-Headers", "X-Bare-Pass-Status"]);

    for (let i = 0; i < requestHeadersKeys.length; i++) {
      if (/^x-bare/i.test(requestHeadersKeys[i])) {
        if (
          !validHeaders
            .map((x) => x.toLowerCase())
            .includes(requestHeadersKeys[i].toLowerCase())
        ) {
          return new BareError(
            BareError.UNKNOWN_BARE_HEADER,
            `request.headers.${requestHeadersKeys[i]}`
          );
        } else if (
          requestHeadersKeys[i].toLowerCase() === "x-bare-pass-headers"
        ) {
          const disallowedHeaders = [
            "vary",
            "connection",
            "transfer-encoding",
            "access-control-allow-headers",
            "access-control-allow-methods",
            "access-control-expose-headers",
            "access-control-max-age",
            "access-control-request-headers",
            "access-control-request-method"
          ];
          try {
            let json = JSON.parse(
              request.headers.get(requestHeadersKeys[i]) as string
            );

            if (!Array.isArray(json)) throw new Error();
            json = json.map((x: string): string => x.toLowerCase());
            for (let i = 0; i < disallowedHeaders.length; i++) {
              if (json.includes(disallowedHeaders[i])) {
                throw new Error();
              }
            }
          } catch {
            return new BareError(
              BareError.INVALID_BARE_HEADER,
              `request.headers.${requiredHeaders[i]}`
            );
          }
        }
      }
    }
  }
  /*
    End Validate Headers
  */

  return await httpRequest(request);
}
