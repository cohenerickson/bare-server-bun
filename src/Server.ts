import { Serve } from "bun";
import ServerOptions from "~/types/ServerOptions";
import HandleRoot from "./routes/root";
import HandleV1 from "./routes/v1";
import HandleV2 from "./routes/v2";
import BareError from "./util/BareError";

export default class BareServer {
  options: ServerOptions = {};
  route: string = "/";
  websocket: any = {
    open: (socket: any) => {
      console.log(socket.data.url);
    },
    message(ws: WebSocket, message: any) {
      ws.send(message);
    }
  };

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
      websocket: this.websocket,
      error: this.error.bind(this)
    } as unknown as Serve);
  }

  async handleRoute(request: Request, server: any): Promise<Response | void> {
    let path = new URL(request.url).pathname.substring(this.route.length);

    if (!/^\//.test(path)) path = `/${path}`;

    if (/^\/?$/.test(path)) {
      return await HandleRoot(request, this.options);
    } else if (/^\/v1\/?/.test(path)) {
      return await HandleV1(request, server);
    } else if (/^\/v2\/?/.test(path)) {
      return await HandleV2(request, server);
    }

    return new Response("Not found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain"
      }
    });
  }

  async fetch(request: Request, server: any): Promise<Response | void> {
    return await this.handleRoute(request, server);
  }

  async error(error: Error): Promise<Response> {
    return new BareError(BareError.UNKNOWN, `error.${error.name}`, {
      message: error.message,
      stack: error.stack
    });
  }
}
