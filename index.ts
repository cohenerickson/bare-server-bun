import { BareServer } from "./src/Server";

const server = new BareServer({
  maintainer: {
    email: "cohenerickson@gmail.com",
    website: "https://cohenerickson.com/"
  },
  logLevel: 2,
  stackTrace: true
});

server.listen(8080);

console.log("Bare server Bun listening on port 8080");
console.log("Press Ctrl+C to quit");
