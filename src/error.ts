type ErrorCode = "UNKNOWN" | "MISSING_BARE_HEADER" | "INVALID_BARE_HEADER" | "FORBIDDEN_BARE_HEADER" | "UNKNOWN_BARE_HEADER" | "INVALID_HEADER" | "HOST_NOT_FOUND" | "CONNECTION_RESET" | "CONNECTION_REFUSED" | "CONNECTION_TIMEOUT";

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

export default function BareError (code: ErrorCode = "UNKNOWN", id: string = "unknown", message: string, stack?: string) {
  let body = {
    code,
    id,
    message,
    stack
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: errorCodes[code],
    headers: {
      "Content-Type": "application/json"
    }
  });
}
