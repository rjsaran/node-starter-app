import { inject, injectable } from "inversify";
import { NextFunction, Request, Response } from "express";

import { container } from "../ioc.config";

import { LoggerService } from "../services/logger.service";
import { BaseException, InternalServerException } from "../exception";
import { TYPES } from "../types";

@injectable()
export class ErrorMiddleware {
  constructor(
    @inject(TYPES.LoggerService)
    private readonly logger: LoggerService
  ) {}

  use(
    exception: BaseException,
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (exception) {
      if (exception instanceof BaseException) {
        return res.status(exception.statusCode).json(exception.toJSON());
      }

      const internalServerException = new InternalServerException();

      this.logger.error(exception);

      return res
        .status(internalServerException.statusCode)
        .json(internalServerException.toJSON());
    }

    next();
  }
}

export default () => {
  const errorMiddleware = container.get<ErrorMiddleware>(ErrorMiddleware);

  return errorMiddleware.use.bind(errorMiddleware);
};
