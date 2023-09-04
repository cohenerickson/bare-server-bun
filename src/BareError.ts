import { JSONResponse } from "./JSONResponse";

const CODES = {
  UNKNOWN: 500,
  MISSING_BARE_HEADER: 400,
  INVALID_BARE_HEADER: 400,
  FORBIDDEN_BARE_HEADER: 401,
  UNKNOWN_BARE_HEADER: 400,
  INVALID_HEADER: 400,
  HOST_NOT_FOUND: 500,
  CONNECTION_RESET: 500,
  CONNECTION_REFUSED: 500,
  CONNECTION_TIMEOUT: 500
} as const;

type ID = `${"error" | "request" | "bare" | "response"}.${string}` | "unknown";

export class BareError extends Error {
  static UNKNOWN = "UNKNOWN" as const;
  static MISSING_BARE_HEADER = "MISSING_BARE_HEADER" as const;
  static INVALID_BARE_HEADER = "INVALID_BARE_HEADER" as const;
  static FORBIDDEN_BARE_HEADER = "FORBIDDEN_BARE_HEADER" as const;
  static UNKNOWN_BARE_HEADER = "UNKNOWN_BARE_HEADER" as const;
  static INVALID_HEADER = "INVALID_HEADER" as const;
  static HOST_NOT_FOUND = "HOST_NOT_FOUND" as const;
  static CONNECTION_RESET = "CONNECTION_RESET" as const;
  static CONNECTION_REFUSED = "CONNECTION_REFUSED" as const;
  static CONNECTION_TIMEOUT = "CONNECTION_TIMEOUT" as const;

  #code: keyof typeof CODES;
  #id: ID;
  #message?: string;

  constructor(code: keyof typeof CODES, id: ID, message?: string) {
    super();

    this.name = "BareError";
    this.#code = code;
    this.#id = id;
    this.#message = message;
  }

  response(): Response {
    return new JSONResponse(
      {
        code: this.#code,
        id: this.#id,
        message: this.#message,
        stack: this.stack
      },
      {
        status: CODES[this.#code]
      }
    );
  }
}

export const NotFoundError = new BareError(
  BareError.UNKNOWN,
  "error.NotFoundError",
  "Not Found"
).response();
