import BareError from "~/util/BareError";
import crypto from "node:crypto";

export default async function newWsMeta(request: Request): Promise<Response> {
  if (request.method !== "GET") {
    return new BareError(BareError.UNKNOWN, "request.method", {
      message: "Invalid request method."
    });
  }
  return new Response(crypto.randomBytes(32).toString("hex"), {
    headers: {
      "content-type": "text/plain"
    }
  });
}
