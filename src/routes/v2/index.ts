import BareError from "~/util/BareError";

export default async function Root(
  request: Request,
  server: any
): Promise<Response> {
  const url = new URL(request.url);
  if (/^\/v1\/ws-new-meta/.test(url.pathname)) {
    // return await handleNewWsMeta(request);
  } else if (/^\/v1\/ws-meta/.test(url.pathname)) {
    // return await handleWsMeta(request);
  } else if (request.headers.get("upgrade") === "websocket") {
    // return await upgradeWsRequest(request, server);
  } else {
    // return await handleHttpRequest(request);
  }

  return new Response();
}
