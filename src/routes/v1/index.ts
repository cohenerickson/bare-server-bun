import handleHttpRequest from "./handleHttpRequest";
import handleNewWsMeta from "./handleNewWsMeta";
import handleWsRequest from "./handleWsRequest";
import handleWsMeta from "./handleWsMeta";

export default async function Root(
  request: Request
): Promise<Response> {
  const url = new URL(request.url);
  if (/^\/v1\/ws-new-meta/.test(url.pathname)) {
    return await handleNewWsMeta(request);
  } else if (/^\/v1\/ws-meta/.test(url.pathname)) {
    return await handleWsMeta(request);
  } else if (request.headers.get("upgrade") === "websocket") {
    return await handleWsRequest(request);
  } else {
    return await handleHttpRequest(request);
  }
}
