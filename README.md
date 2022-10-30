# bare-server-bun

Installing:
```bash
npm install github:cohenerickson/bare-server-bun
```

Creating a bare server:
```js
import { BareServer } from "bare-server-bun";

const server = new BareServer({
  maintainer: {
    email: "cohenerickson@gmail.com",
    website: "https://cohenerickson.com/"
  }
});

server.listen(8080);

console.log("Bare server Bun listening on port 8080");
console.log("Press Ctrl+C to quit");
```
