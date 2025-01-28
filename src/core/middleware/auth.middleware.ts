import { inject, injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";

import { NextFunction, Request, Response } from "express";
import { TYPES } from "../types";
import { IAuthService } from "../../app/auth/interfaces/auth.service.interface";
import { UnauthorizedException } from "../exception";

export type AuthUser = {
  id: string;
  email: string;
};

export type ReqWithUser = Request & { user?: AuthUser };

@injectable()
export class AuthMiddleware extends BaseMiddleware {
  @inject(TYPES.IAuthService) private readonly authService: IAuthService;

  public async handler(req: ReqWithUser, _res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) throw new UnauthorizedException();

    try {
      const userData = (await this.authService.verifyToken(token)) as AuthUser;

      req.user = userData;
    } catch (err) {
      return next(err);
    }

    next();
  }
}
