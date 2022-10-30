import ServerOptions from "~/types/ServerOptions";
import BareError from "~/util/BareError";

export default async function Root(
  request: Request,
  options: ServerOptions
): Promise<Response> {
  /*
    Start Validate Headers
  */
  {
    const requiredHeaders = [
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
            const json = JSON.parse(
              request.headers.get(requiredHeaders[i]) as string
            );

            if (!Array.isArray(json)) throw new Error();
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

  return new BareError(BareError.UNKNOWN, "unknown", {
    message: "Not implemented."
  });
}
