import BareError from "~/util/BareError";

export default async function upgradeWs(request: Request): Promise<Response> {
  return new BareError(BareError.UNKNOWN, "unknown", {
    message: "Not implemented."
  });
}
