import { memoryUsage } from "bun:jsc";
import { ServerOptions } from "./types/ServerOptions";
import v1 from "./v1";
import v2 from "./v2";

export class BareServer {
  options: ServerOptions = {};
  constructor (options: ServerOptions = {}) {
    this.options = options;
  }

  listen (port: number): void {
    Bun.serve({
      port,
      fetch: this.fetch.bind(this),
      error: this.error.bind(this)
    });
  }

  async fetch (request: Request): Promise<Response> {
    const url = new URL(request.url);
  
    if (url.pathname.startsWith("/v1")) {
      return await v1(request);
    } else if (url.pathname.startsWith("/v2")) {
      return await v2(request);
    }
    
    return new Response(JSON.stringify({
      versions: [
        "v1",
        "v2"
      ],
      language: "Bun",
      memoryUsage: parseFloat((memoryUsage().current / 8000000).toFixed(2)),
      maintainer: this.options.maintainer,
      project: {
        name: "bare-server-bun",
        description: "TOMP bare server implementation using Bun.",
        email: "cohenerickson@gmail.com",
        repository: "https://github.com/cohenerickson/bare-server-bun.git"
      }
    }, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  error (error: any): Response {
    return new Response(JSON.stringify({
      code: error.code || "UNKNOWN",
      id: error.id || "error",
      message: error.message,
      stack: error.stack
    }, null, 2), {
      status: error.status || 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
