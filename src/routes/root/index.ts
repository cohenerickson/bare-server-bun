import { heapStats } from "bun:jsc";
import ServerOptions from "~/types/ServerOptions";
import * as packageJSON from "../../../package.json";

export default async function Root(
  request: Request,
  options: ServerOptions
): Promise<Response> {
  return new Response(
    JSON.stringify(
      {
        versions: ["v1"],
        language: "Bun",
        memoryUsage:
          Math.round((heapStats().heapSize / 1024 / 1024) * 100) / 100,
        maintainer: options.maintainer,
        project: {
          name: "bare-server-bun",
          description:
            "TOMP bare server implementation using native Bun API's.",
          email: "contact@cohenerickson.com",
          website: "https://cohenerickson.com",
          repository: "https://github.com/cohenerickson/bare-server-bun.git",
          version: (packageJSON as any).default.version
        }
      },
      null,
      2
    ),
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}
