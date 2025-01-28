/* eslint-disable @typescript-eslint/no-unused-vars */
import { injectable } from "inversify";

import { IAuthService } from "../app/auth/interfaces/auth.service.interface";
import { LoginDto } from "../app/auth/dto/login.dto";
import { LoginResponseDto } from "../app/auth/dto/login.response.dto";
import { AuthUser } from "../core/middleware/auth.middleware";

@injectable()
export class FakeAuthService implements IAuthService {
  login(_payload?: LoginDto): Promise<LoginResponseDto> {
    return Promise.resolve({
      accessToken: "jwt_token",
    });
  }

  verifyToken(_token?: string): AuthUser {
    return {
      id: "123",
      email: "account@nodestarterapp.com",
    };
  }
}
