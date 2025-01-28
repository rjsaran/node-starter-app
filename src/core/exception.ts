export class BaseException extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);

    // Error.captureStackTrace is V8 exclusive, being extra careful here
    Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);

    // Saving class name
    this.name = this.constructor.name;

    // this will be http status to be set in the response headers
    // `500` is the default value if not specified.
    this.statusCode = statusCode;

    this.toString = (): string => {
      return `${this.message}`;
    };
  }

  public toJSON(): {
    message: string;
    statusCode: number;
  } {
    return {
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}

export class InternalServerException extends BaseException {
  constructor(message?: string) {
    super(500, message || "Internal Server Error");
  }
}

export class NotFoundException extends BaseException {
  constructor(message?: string) {
    super(404, message || "Not found");
  }
}

export class BadRequestException extends BaseException {
  constructor(message?: string) {
    super(400, message || "Bad Request");
  }
}

export class UnauthorizedException extends BaseException {
  constructor(message?: string) {
    super(401, message || "Unauthorized");
  }
}

export class ForbiddenException extends BaseException {
  constructor(message?: string) {
    super(403, message || "Forbidden");
  }
}

export class ValidationException extends BaseException {
  constructor(message?: string) {
    super(400, message || "Validation Error");
  }
}
