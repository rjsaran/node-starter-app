import { inject, injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";

import { NextFunction, Request, Response } from "express";
import { TYPES } from "../types";
import { IAuthService } from "../../app/auth/interfaces/auth.service.interface";
import { UnauthorizedException } from "../exception";

@injectable()
export class AuthMiddleware extends BaseMiddleware {
  @inject(TYPES.IAuthService) private readonly authService: IAuthService;

  public async handler(req: Request, _res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return next(new UnauthorizedException());
    }

    try {
      const isVerified = await this.authService.validateToken(token);

      if (!isVerified) {
        throw new UnauthorizedException();
      }
    } catch (err) {
      return next(err);
    }

    next();
  }
}
