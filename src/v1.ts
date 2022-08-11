import BareError from "./error";

// https://stackoverflow.com/a/106223/14635947
const validateIpAddress = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
const validateHostname = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;

export default async function v1 (request: Request): Promise<Response> {
  // Get bare headers
  const host = request.headers.get("X-Bare-Host") as string;
  const port = request.headers.get("X-Bare-Port") as string;
  const protocol = request.headers.get("X-Bare-Protocol") as string;
  const path = request.headers.get("X-Bare-Path") as string;
  const headers = request.headers.get("X-Bare-Headers") as string;
  const forwardHeaders = request.headers.get("X-Bare-Forward-Headers") as string;

  // Check if bare headers exist
  if (!host) {
    return BareError("MISSING_BARE_HEADER", "request.headers.x-bare-host", "Header was not specified.");
  }
  if (!port) {
    return BareError("MISSING_BARE_HEADER", "request.headers.x-bare-port", "Header was not specified.");
  }
  if (!protocol) {
    return BareError("MISSING_BARE_HEADER", "request.headers.x-bare-protocol", "Header was not specified.");
  }
  if (!path) {
    return BareError("MISSING_BARE_HEADER", "request.headers.x-bare-path", "Header was not specified.");
  }
  if (!headers) {
    return BareError("MISSING_BARE_HEADER", "request.headers.x-bare-headers", "Header was not specified.");
  }
  if (!forwardHeaders) {
    return BareError("MISSING_BARE_HEADER", "request.headers.x-bare-forward-headers", "Header was not specified.");
  }

  // Validate bare headers
  if (!validateIpAddress.test(host) && !validateHostname.test(host)) {
    return BareError("INVALID_BARE_HEADER", "request.headers.x-bare-host", "Header contained an unparsable/invalid value.");
  }
  if (!(parseInt(port) > 0)) {
    return BareError("INVALID_BARE_HEADER", "request.headers.x-bare-port", "Header contained an unparsable/invalid value.");
  }
  if (!/^https?:$/.test(protocol)) {
    return BareError("INVALID_BARE_HEADER", "request.headers.x-bare-protocol", "Header contained an unparsable/invalid value.");
  }
  if (!/^\/[/.a-zA-Z0-9-?&=#%]*$/.test(path)) {
    return BareError("INVALID_BARE_HEADER", "request.headers.x-bare-path", "Header contained an unparsable/invalid value.");
  }
  try { JSON.parse(headers);} catch {
    return BareError("INVALID_BARE_HEADER", "request.headers.x-bare-headers", "Header contained an unparsable/invalid value.");
  }
  try { JSON.parse(forwardHeaders); } catch {
    return BareError("INVALID_BARE_HEADER", "request.headers.x-bare-forward-headerss", "Header contained an unparsable/invalid value.");
  }

  const bareFetchURL = new URL(`${protocol}//${host}:${port}${path}`);

  let fetchData: RequestInit = {
    method: request.method,
    headers: JSON.parse(headers)
  }
  if (!["GET", "HEAD"].includes(request.method)) fetchData.body = await request.blob();

  const response = await fetch(bareFetchURL.toString(), fetchData);
  const responseData = await response.blob();

  return new Response(responseData, {
    status: 200,
    headers: {
      "Content-Encoding": response.headers.get("Content-Encoding") as string,
      "Content-Length": response.headers.get("Content-Length") as string,
      "X-Bare-Status": response.status.toString(),
      "X-Bare-Status-text": response.statusText,
      "X-Bare-Headers": JSON.stringify(Object.fromEntries(response.headers.entries()))
    }
  });
}
