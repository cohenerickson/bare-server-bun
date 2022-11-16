import BareServer from "~/index";

const bareServer = new BareServer("/bare/", {
  maintainer: {
    email: "contact@cohenerickson.com",
    website: "https://cohenerickson.com"
  }
});

Bun.serve({
  port: 8080,
  async fetch(request: Request): Promise<Response> {
    if (bareServer.shouldRoute(request)) {
      return bareServer.handleRoute(request);
    } else {
      return new Response("Hello world!");
    }
  }
});

console.log("Bare server Bun listening on port 8080");
console.log("Press Ctrl+C to quit");
