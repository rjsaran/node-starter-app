/* eslint-disable @typescript-eslint/no-unused-vars */
import { injectable } from "inversify";

import { IAuthService } from "../app/auth/interfaces/auth.service.interface";

@injectable()
export class FakeAuthService implements IAuthService {
  generateToken(_clientId: string, _clientSecret: string): Promise<string> {
    return Promise.resolve("jwt_token");
  }

  validateToken(_token?: string): boolean {
    return true;
  }
}
