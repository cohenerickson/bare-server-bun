import BareError from "~/util/BareError";
import WsMeta from "./WsMeta";

export default async function wsMeta(request: Request): Promise<Response> {
  if (request.method !== "GET") {
    return new BareError(BareError.UNKNOWN, "request.method", {
      message: "Invalid request method."
    });
  }

  /*
    Start Validate Headers
  */
  {
    const requiredHeaders: string[] = ["X-Bare-ID"];

    for (let i = 0; i < requiredHeaders.length; i++) {
      if (!request.headers.has(requiredHeaders[i])) {
        return new BareError(
          BareError.MISSING_BARE_HEADER,
          `request.headers.${requiredHeaders[i]}`
        );
      }
      switch (requiredHeaders[i]) {
        case "X-Bare-ID":
          if (!WsMeta.has(request.headers.get(requiredHeaders[i]) ?? "")) {
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

  return new Response(
    JSON.stringify(
      WsMeta.get(request.headers.get("X-Bare-ID") ?? "") ?? {},
      null,
      2
    ),
    {
      headers: {
        "content-type": "application/json"
      }
    }
  );
}
