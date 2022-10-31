import BareError from "./BareError";
import RequestOptions from "~/types/RequestOptions";

export default function httpRequest(
  options: RequestOptions
): Promise<Response> {
  return new Promise((resolve): void => {
    fetch(
      `${options.protocol}//${options.host}:${options.port}${options.path}`,
      {
        method: options.method,
        headers: options.headers
      }
    )
      .then((response: Response): void => {
        resolve(response);
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
