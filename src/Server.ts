import ServerOptions from "~/types/ServerOptions";
import HandleRoot from "./routes/root";
import HandleV1 from "./routes/v1";
import HandleV2 from "./routes/v2";
import BareError from "./util/BareError";

export default class BareServer {
  options: ServerOptions = {};
  route: string = "/";
  constructor(route: string, options: ServerOptions = {}) {
    this.options = options;
    this.route = route;
  }

  shouldRoute(request: Request): boolean {
    return new URL(request.url).pathname.startsWith(this.route);
  }

  listen(port: number): void {
    Bun.serve({
      port,
      fetch: this.fetch.bind(this),
      error: this.error.bind(this)
    });
  }

  async handleRoute(request: Request): Promise<Response> {
    let path = new URL(request.url).pathname.substring(this.route.length);

    if (!/^\//.test(path)) path = `/${path}`;

    if (/^\/?$/.test(path)) {
      return await HandleRoot(request, this.options);
    } else if (/^\/v1\/?/.test(path)) {
      return await HandleV1(request);
    } else if (/^\/v2\/?/.test(path)) {
      return await HandleV2(request);
    }

    return new Response("Not found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain"
      }
    });
  }

  async fetch(request: Request): Promise<Response> {
    return await this.handleRoute(request);
  }

  async error(error: Error): Promise<Response> {
    return new BareError(BareError.UNKNOWN, `error.${error.name}`, {
      message: error.message,
      stack: error.stack
    });
  }
}
