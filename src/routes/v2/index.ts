import BareError from "~/util/BareError";
import ServerOptions from "~/types/ServerOptions";

export default async function Root(
  request: Request,
  options: ServerOptions
): Promise<Response> {
  return new BareError(BareError.UNKNOWN, "unknown", {
    message: "Not implemented."
  });
}
