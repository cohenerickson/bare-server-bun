import {
  bareError,
  rootResponse,
  testHeaders,
  requiredHeaders
} from "./expectations";

const location = new URL("http://0.0.0.0:8080/");

test('"/"', async () => {
  const response: Response = await fetch(location.origin);
  const responseData: any = await response.json();
  expect(responseData).toMatchObject(rootResponse);
});

test('"/404"', async () => {
  const response: Response = await fetch(location.origin + "/NotFound");
  const responseData: any = await response.json();
  expect(responseData).toMatchObject(bareError);
});

test('"/v1" with all headers', async () => {
  const response: Response = await fetch(location.origin + "/v1", {
    headers: testHeaders
  });
  const responseData: any = await response.text();
  expect(responseData).toMatch(/Example Domain/);
});

test.each(requiredHeaders)(
  '"/v1" with invalid "%s" header',
  async (header: string) => {
    console.log(Object.assign({}, testHeaders, { [header]: "" }));
    const response: Response = await fetch(location.origin + "/v1", {
      headers: Object.assign({}, testHeaders, { [header]: "" })
    });
    const responseData: any = await response.json();
    expect(responseData).toMatchObject(
      Object.assign({}, bareError, {
        code: "INVALID_BARE_HEADER",
        id: `request.headers.${header}`
      })
    );
  }
);

test.each(requiredHeaders)(
  '"/v1" with missing "%s" header',
  async (header: string) => {
    console.log(Object.assign({}, testHeaders, { [header]: "" }));
    const headers: { [key: string]: string } = Object.assign({}, testHeaders);
    delete headers[header];
    const response: Response = await fetch(location.origin + "/v1", {
      headers: headers
    });
    const responseData: any = await response.json();
    expect(responseData).toMatchObject(
      Object.assign({}, bareError, {
        code: "MISSING_BARE_HEADER",
        id: `request.headers.${header}`
      })
    );
  }
);
