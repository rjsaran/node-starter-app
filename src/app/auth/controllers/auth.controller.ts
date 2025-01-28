import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpPost,
  requestBody,
} from "inversify-express-utils";

import { LoginDto } from "../dto/login.dto";
import { AuthService } from "../services/auth.service";
import { TYPES } from "../../../core/types";
import { validateBody } from "../../../core/middleware/body-validator.middeware";
import { LoginResponseDto } from "../dto/login.response.dto";

@controller("/auth")
export class AuthController extends BaseHttpController {
  constructor(
    @inject(TYPES.IAuthService) private readonly authService: AuthService
  ) {
    super();
  }

  @httpPost("/login", validateBody(LoginDto))
  login(@requestBody() dto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(dto);
  }
}
