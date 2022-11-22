import BareError from "~/util/BareError";

export default async function Root(
  request: Request,
  server: any
): Promise<Response> {
  return new BareError(BareError.UNKNOWN, "unknown", {
    message: "Not implemented."
  });
}
