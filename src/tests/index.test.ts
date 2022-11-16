const location = new URL("http://0.0.0.0:8080/");

test('"/"', async () => {
  const response = await fetch(location.origin);
  const responseData: any = await response.json();
  expect(responseData).toMatchObject({
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
  });
});

test('"/NotFound"', async () => {
  const response = await fetch(location.origin + "/NotFound");
  expect(response.status).toBe(400)
});

test('"/v1"', async () => {
  const response = await fetch(location.origin + "/v1");
  const responseData: any = await response.json();
  expect(responseData).toMatchObject({});
});
