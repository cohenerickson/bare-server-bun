import { memoryUsage } from 'bun:jsc';
import v1 from "./v1";

const PORT = process.argv[2] || 8080

export default {
  port: PORT,
  async fetch (request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/v1")) {
      return await v1(request);
    }
    
    return new Response(JSON.stringify({
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
};

console.log(`Server running at http://localhost:${PORT}/`);
