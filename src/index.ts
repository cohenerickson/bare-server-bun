import { BareServer } from "./BareServer";

const server = new BareServer();

server.listen(3000);

Bun.serve({
  port: 8080,
  fetch(req, server) {
    if (server.upgrade(req)) {
      return;
    }
    return new Response("Upgrade failed :(", { status: 500 });
  },
  websocket: {
    message(ws, data) {
      ws.send(data);
    }
  }
});

console.log("Listening on port 3000");
