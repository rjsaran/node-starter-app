import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpPost,
  requestBody,
} from "inversify-express-utils";

import { TYPES } from "../../../core/types";
import { validateBody } from "../../../core/middleware/body-validator.middeware";
import { GenerateTokenDTO } from "../auth.dto";
import { IAuthService } from "../interfaces/auth.service.interface";

@controller("/auth")
export class AuthController extends BaseHttpController {
  constructor(
    @inject(TYPES.IAuthService) private readonly authService: IAuthService
  ) {
    super();
  }

  @httpPost("/token", validateBody(GenerateTokenDTO))
  async generate(@requestBody() dto: GenerateTokenDTO) {
    const { client_id, client_secret } = dto;

    const accessToken = await this.authService.generateToken(
      client_id,
      client_secret
    );

    return {
      access_token: accessToken,
    };
  }
}
