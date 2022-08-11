import { ErrorCode } from "./types/ErrorCode";

const errorCodes: {[key: string]: number} = {
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
}

export default class BareError extends Error {
  code: ErrorCode;
  id: string;
  status: number;

  constructor (code: ErrorCode = "UNKNOWN", id: string = "unknown", message: string, stack?: string) {
    super(message);
    this.name = "BareError";
    this.code = code;
    this.id = id;
    this.status = errorCodes[code];
    if (stack) this.stack = stack;
  }
}
