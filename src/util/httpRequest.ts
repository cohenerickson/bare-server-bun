import BareError from "./BareError";
import passHeaders from "./passHeaders";
import passStatus from "./passStatus";

export default function httpRequest(
  incomingRequest: Request
): Promise<Response> {
  const options = {
    protocol: incomingRequest.headers.get("X-Bare-Protocol") ?? "",
    host: incomingRequest.headers.get("X-Bare-Host") ?? "",
    port: incomingRequest.headers.get("X-Bare-Port") ?? "",
    path: incomingRequest.headers.get("X-Bare-Path") ?? "",
    method: incomingRequest.method,
    headers: passHeaders(
      incomingRequest.headers.get("X-Bare-Forward-Headers") ?? "",
      incomingRequest.headers
    )
  };

  return new Promise((resolve, reject): void => {
    const externalURL = `${options.protocol}//${options.host}:${options.port}${options.path}`;
    console.log(externalURL);
    fetch(externalURL, {
      method: options.method,
      headers: options.headers
    })
      .then((response: Response): void => {
        console.log(response.status);
        // @ts-ignore - TS doesn't think that body exists on Response
        const res = new Response(response.body, {
          status: passStatus(
            incomingRequest.headers.get("X-Bare-Pass-Status") ?? "",
            response.status
          ),
          headers: {
            "Content-Encoding": response.headers.get("Content-Encoding") ?? "",
            "X-Bare-Status": response.status.toString(),
            "X-Bare-Status-Text": response.statusText,
            "X-Bare-Headers":
              JSON.stringify(Object.fromEntries(response.headers as any)) ??
              "{}",
            ...passHeaders(
              incomingRequest.headers.get("X-Bare-Pass-Headers") ?? "",
              response.headers
            )
          }
        });
        resolve(res);
        //resolve(response);
      })
      .catch((error: Error) => {
        switch ((<Error & { code?: string }>error).code) {
          case "ENOTFOUND":
            resolve(
              new BareError(BareError.HOST_NOT_FOUND, "request", {
                message: error.message,
                stack: error.stack
              })
            );
            break;
          case "ECONNRESET":
          case "ConnectionClosed":
            resolve(
              new BareError(BareError.CONNECTION_RESET, "response", {
                message: error.message,
                stack: error.stack
              })
            );
            break;
          case "ECONNREFUSED":
            resolve(
              new BareError(BareError.CONNECTION_REFUSED, "response", {
                message: error.message,
                stack: error.stack
              })
            );
            break;
          case "ETIMEOUT":
            resolve(
              new BareError(BareError.CONNECTION_TIMEOUT, "response", {
                message: error.message,
                stack: error.stack
              })
            );
            break;
          default:
            resolve(
              new BareError(BareError.UNKNOWN, `error.${error.name}`, {
                message: error.message,
                stack: error.stack
              })
            );
        }
      });
  });
}
