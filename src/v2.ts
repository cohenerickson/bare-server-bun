import BareError from "./BareError";

export default async function v1 (request: Request): Promise<Response> {
  throw new BareError("UNKNOWN", "unknown", "Not Implemented.");
}
