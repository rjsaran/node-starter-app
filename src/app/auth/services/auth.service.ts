import { inject, injectable } from "inversify";
import jwt from "jsonwebtoken";

import { LoginDto } from "../dto/login.dto";
import { ConfigService } from "../../../config";
import { TYPES } from "../../../core/types";
import { UnauthorizedException } from "../../../core/exception";
import { IAuthService, JwtConfig } from "../interfaces/auth.service.interface";
import { LoggerService } from "../../../core/services/logger.service";
import { AuthUser } from "../../../core/middleware/auth.middleware";
import { IUserService } from "../interfaces/user.service.interface";
import { LoginResponseDto } from "../dto/login.response.dto";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.IUserService)
    private readonly userService: IUserService,
    @inject(TYPES.ConfigService)
    private readonly config: ConfigService,
    @inject(TYPES.LoggerService)
    private readonly logger: LoggerService
  ) {}

  private generateToken(payload: AuthUser, config: JwtConfig): string {
    return jwt.sign(payload, config.secret, {
      expiresIn: config.expiresIn,
    });
  }

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userService.getUserByEmail(dto.email);

    if (!user.validatePassword(dto.password)) {
      throw new UnauthorizedException();
    }

    const payload: AuthUser = {
      id: user.id,
      email: user.email,
    };

    const config: JwtConfig = {
      secret: this.config.auth.jwt.secret,
      expiresIn: this.config.auth.jwt.expires_in,
    };

    const accessToken = this.generateToken(payload, config);

    return {
      accessToken: accessToken,
    };
  }

  verifyToken(token: string): AuthUser {
    try {
      const authUser = jwt.verify(
        token,
        this.config.auth.jwt.secret
      ) as AuthUser;

      return authUser;
    } catch (err) {
      this.logger.error(err);

      throw new UnauthorizedException();
    }
  }
}
