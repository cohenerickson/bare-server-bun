export class JSONResponse extends Response {
  constructor(body: any, init?: ResponseInit) {
    super(JSON.stringify(body, null, 2), {
      ...init,
      headers: {
        ...init?.headers,
        "Content-type": "application/json"
      }
    });
  }
}
