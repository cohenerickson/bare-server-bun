import ServerOptions from "~/types/ServerOptions";
import HandleRoot from "./routes/root";
import HandleV1 from "./routes/v1";
import HandleV2 from "./routes/v2";
import BareError from "./util/BareError";

export class BareServer {
  options: ServerOptions = {};
  constructor(options: ServerOptions = {}) {
    this.options = options;
  }

  listen(port: number): void {
    Bun.serve({
      port,
      fetch: this.fetch.bind(this),
      error: this.error.bind(this)
    });
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (/^\/?$/.test(url.pathname)) {
      return await HandleRoot(request, this.options);
    } else if (/^\/v1\/?/.test(url.pathname)) {
      return await HandleV1(request);
    } else if (/^\/v2\/?/.test(url.pathname)) {
      return await HandleV2(request);
    }

    return new Response("Not found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain"
      }
    });
  }

  async error(error: Error): Promise<Response> {
    return new BareError(BareError.UNKNOWN, `error.${error.name}`, {
      message: error.message,
      stack: error.stack
    });
  }
}
