export const rootResponse = {
  versions: [expect.toBeOneOf(["v1", "v2"])],
  language: expect.toBeOneOf([
    "NodeJS",
    "Deno",
    "Bun",
    "ServiceWorker",
    "Java",
    "PHP",
    "Rust",
    "C",
    "C++",
    "C#",
    "Ruby",
    "Go",
    "Crystal",
    "Shell"
  ]),
  memoryUsage: expect.any(Number),
  maintainer: {
    email: expect.toBeOneOf([undefined, expect.any(String)]),
    website: expect.toBeOneOf([undefined, expect.any(String)])
  },
  project: {
    name: expect.toBeOneOf([undefined, expect.any(String)]),
    description: expect.toBeOneOf([undefined, expect.any(String)]),
    email: expect.toBeOneOf([undefined, expect.any(String)]),
    website: expect.toBeOneOf([undefined, expect.any(String)]),
    repository: expect.toBeOneOf([undefined, expect.any(String)]),
    version: expect.toBeOneOf([undefined, expect.any(String)])
  }
};

export const bareError = {
  code: expect.toBeOneOf([
    "UNKNOWN",
    "MISSING_BARE_HEADER",
    "INVALID_BARE_HEADER",
    "FORBIDDEN_BARE_HEADER",
    "UNKNOWN_BARE_HEADER",
    "INVALID_HEADER",
    "HOST_NOT_FOUND",
    "CONNECTION_RESET",
    "CONNECTION_REFUSED",
    "CONNECTION_TIMEOUT",
    expect.stringMatching(/^IMPL_/)
  ]),
  id: expect.any(String),
  message: expect.toBeOneOf([undefined, expect.any(String)]),
  stack: expect.toBeOneOf([undefined, expect.any(String)])
};

export const testHeaders = {
  "X-Bare-Host": "example.com",
  "X-Bare-Port": "443",
  "X-Bare-Protocol": "https:",
  "X-Bare-Path": "/",
  "X-Bare-Headers": JSON.stringify({}),
  "X-Bare-Forward-Headers": JSON.stringify([])
};

export const requiredHeaders = [
  "X-Bare-Host",
  "X-Bare-Port",
  "X-Bare-Protocol",
  "X-Bare-Path",
  "X-Bare-Headers",
  "X-Bare-Forward-Headers"
];
