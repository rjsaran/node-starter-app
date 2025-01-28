import { NextFunction, Request, Response } from "express";
import { ClassConstructor, plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { ValidationException } from "../exception";

export function validateBody(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dto: ClassConstructor<any>,
  skipMissingProperties = false
) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const dtoObj = plainToClass(dto, req.body);
    const errors = await validate(dtoObj, { skipMissingProperties });

    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints!))
        .flat();

      return next(new ValidationException(errorMessages.join(", ")));
    }

    req.body = dtoObj;
    next();
  };
}
