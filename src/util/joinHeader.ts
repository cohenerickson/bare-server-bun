import BareError from "./BareError";

// https://github.com/tomphttp/bare-server-node/blob/fca1f3bf3c102447ea6e44554ed74840fd0c8a0c/src/splitHeaderUtil.ts
export default function joinHeaders(headers: Headers): Headers | BareError {
  const output = new Headers(headers);

  const prefix = "x-bare-headers";

  if (headers.has(`${prefix}-0`)) {
    const join: string[] = [];

    // typescript doesn't like itterating over a Headers object
    // so we have to convert it to an array first
    for (const [header, value] of Array.from(headers.entries())) {
      if (!header.startsWith(prefix)) {
        continue;
      }

      if (!value.startsWith(";")) {
        return new BareError(
          BareError.INVALID_BARE_HEADER,
          `request.headers.${header}`
        );
      }

      const id = parseInt(header.slice(prefix.length + 1));

      join[id] = value.slice(1);

      output.delete(header);
    }

    output.set(prefix, join.join(""));
  }

  return output;
}
