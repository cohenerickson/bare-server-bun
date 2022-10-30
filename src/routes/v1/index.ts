import { ServerOptions } from "../../types/ServerOptions";
import BareError from "~/util/BareError";

export default async function Root(
  request: Request,
  options: ServerOptions
): Promise<Response> {
  return new BareError(BareError.UNKNOWN, "unknown");
}
