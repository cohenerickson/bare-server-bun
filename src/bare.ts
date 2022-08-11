import { memoryUsage } from 'bun:jsc';

export default class Bare extends Response {
  constructor(request: Request) {
    super(JSON.stringify({
      versions: [
        "v1"
      ],
      language: "Bun",
      memoryUsage: parseFloat((memoryUsage().current / 8000 / 1000).toFixed(2)),
      project: {
        name: "Bare server Bun",
        description: "TOMP bare server implementation using Bun",
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
}
