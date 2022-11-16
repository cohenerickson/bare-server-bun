import handleHttpRequest from "./handleHttpRequest";
import handleNewWsMeta from "./handleNewWsMeta";
import upgradeWsRequest from "./upgradeWsRequest";
import handleWsMeta from "./handleWsMeta";

export default async function Root(
  request: Request,
  server: any
): Promise<Response | void> {
  const url = new URL(request.url);
  if (/^\/v1\/ws-new-meta/.test(url.pathname)) {
    return await handleNewWsMeta(request);
  } else if (/^\/v1\/ws-meta/.test(url.pathname)) {
    return await handleWsMeta(request);
  } else if (request.headers.get("upgrade") === "websocket") {
    return await upgradeWsRequest(request, server);
  } else {
    return await handleHttpRequest(request);
  }
}
