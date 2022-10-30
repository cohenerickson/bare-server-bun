import global from "~/global";
import ErrorObject from "~/types/ErrorObject";

type ErrorType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export default class BareError extends Response {
  constructor(
    type: ErrorType,
    id: string,
    extras?: {
      message?: string;
      stack?: string;
    }
  ) {
    const error: ErrorObject = {
      code: BareError.ErrorCodes[type],
      id: id,
      message: extras?.message ?? BareError.ErrorMessages[type]
    };

    if (global.options.stackTrace) {
      error.stack = extras?.stack ?? new Error().stack;
    }

    if (global.options.logLevel ?? 0 > 0) {
      console.error("ERROR", error);
    }

    super(JSON.stringify(error, null, 2), {
      status: BareError.ErrorStatuses[type],
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  static UNKNOWN: 0 = 0;
  static MISSING_BARE_HEADER: 1 = 1;
  static INVALID_BARE_HEADER: 2 = 2;
  static FORBIDDEN_BARE_HEADER: 3 = 3;
  static UNKNOWN_BARE_HEADER: 4 = 4;
  static INVALID_HEADER: 5 = 5;
  static HOST_NOT_FOUND: 6 = 6;
  static CONNECTION_RESET: 7 = 7;
  static CONNECTION_REFUSED: 8 = 8;
  static CONNECTION_TIMEOUT: 9 = 9;

  static ErrorCodes: {
    [key in ErrorType]: string;
  } = {
    [BareError.UNKNOWN]: "UNKNOWN",
    [BareError.MISSING_BARE_HEADER]: "MISSING_BARE_HEADER",
    [BareError.INVALID_BARE_HEADER]: "INVALID_BARE_HEADER",
    [BareError.FORBIDDEN_BARE_HEADER]: "FORBIDDEN_BARE_HEADER",
    [BareError.UNKNOWN_BARE_HEADER]: "UNKNOWN_BARE_HEADER",
    [BareError.INVALID_HEADER]: "INVALID_HEADER",
    [BareError.HOST_NOT_FOUND]: "HOST_NOT_FOUND",
    [BareError.CONNECTION_RESET]: "CONNECTION_RESET",
    [BareError.CONNECTION_REFUSED]: "CONNECTION_REFUSED",
    [BareError.CONNECTION_TIMEOUT]: "CONNECTION_TIMEOUT"
  };

  static ErrorMessages: { [key in ErrorType]: string } = {
    [BareError.UNKNOWN]:
      "The Bare Server could not identify the cause of the issue.",
    [BareError.MISSING_BARE_HEADER]:
      "The request did not include a required bare header.",
    [BareError.INVALID_BARE_HEADER]:
      "A header contained an unparsable/invalid value.",
    [BareError.FORBIDDEN_BARE_HEADER]: "A header contained a forbidden value.",
    [BareError.UNKNOWN_BARE_HEADER]:
      "An unknown header beginning with X-Bare- was sent to the server.",
    [BareError.INVALID_HEADER]: "The Bare Server forbids a header value.",
    [BareError.HOST_NOT_FOUND]: "The DNS lookup for the host failed.",
    [BareError.CONNECTION_RESET]:
      "The connection to the remote was closed before receving the response headers.",
    [BareError.CONNECTION_REFUSED]: "The connection to the remote was refused.",
    [BareError.CONNECTION_TIMEOUT]:
      "The remote didn't respond with headers/body in time."
  };

  static ErrorStatuses: {
    [key in ErrorType]: number;
  } = {
    [BareError.UNKNOWN]: 500,
    [BareError.MISSING_BARE_HEADER]: 400,
    [BareError.INVALID_BARE_HEADER]: 400,
    [BareError.FORBIDDEN_BARE_HEADER]: 403,
    [BareError.UNKNOWN_BARE_HEADER]: 400,
    [BareError.INVALID_HEADER]: 400,
    [BareError.HOST_NOT_FOUND]: 500,
    [BareError.CONNECTION_RESET]: 500,
    [BareError.CONNECTION_REFUSED]: 500,
    [BareError.CONNECTION_TIMEOUT]: 500
  };
}
