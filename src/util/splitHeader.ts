const MAX_HEADER_VALUE = 3072;

// https://github.com/tomphttp/bare-server-node/blob/fca1f3bf3c102447ea6e44554ed74840fd0c8a0c/src/splitHeaderUtil.ts
export default function splitHeaders(headers: Headers): Headers {
  const output = new Headers(headers);

  if (headers.has("x-bare-headers")) {
    const value = headers.get("x-bare-headers")!;

    if (value.length > MAX_HEADER_VALUE) {
      output.delete("x-bare-headers");

      let split = 0;

      for (let i = 0; i < value.length; i += MAX_HEADER_VALUE) {
        const part = value.slice(i, i + MAX_HEADER_VALUE);

        const id = split++;
        output.set(`x-bare-headers-${id}`, `;${part}`);
      }
    }
  }

  return output;
}
