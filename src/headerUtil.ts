export function mergeHeaders(
  base: Headers,
  merge: Headers,
  forward: string[]
): Headers {
  const returnHeaders = new Headers(base);

  for (const header of forward) {
    if (merge.has(header)) {
      returnHeaders.set(header, merge.get(header)!);
    }
  }

  return returnHeaders;
}

export const forbiddenForwardHeaders = [
  "connection",
  "transfer-encoding",
  "host",
  "connection",
  "origin",
  "referer"
];

export const forbiddenPassHeaders = [
  "vary",
  "connection",
  "transfer-encoding",
  "access-control-allow-headers",
  "access-control-allow-methods",
  "access-control-expose-headers",
  "access-control-max-age",
  "access-control-request-headers",
  "access-control-request-method"
];

export function basePassHeaders(cache: boolean): string[] {
  let basePassHeaders: string[] = [];

  if (cache) {
    basePassHeaders = basePassHeaders.concat([
      "last-modified",
      "etag",
      "cache-control"
    ]);
  }

  return basePassHeaders;
}

export function baseForwardHeaders(cache: boolean): string[] {
  let baseForwardHeaders = [
    "accept-encoding",
    "accept-language",
    "sec-websocket-extensions",
    "sec-websocket-key",
    "sec-websocket-version"
  ];

  if (cache) {
    baseForwardHeaders = baseForwardHeaders.concat([
      "if-modified-since",
      "if-none-match",
      "cache-control"
    ]);
  }

  return baseForwardHeaders;
}
