import { inject, injectable } from "inversify";
import { Repository } from "typeorm";
import { sign, verify } from "jsonwebtoken";

import { AppClient } from "../auth.entity";
import { TYPES } from "../../../core/types";
import { IDatabaseService } from "../../../core/interfaces/database.service.interface";
import { UnauthorizedException } from "../../../core/exception";
import { ConfigService } from "../../../config";
import { LoggerService } from "../../../core/services/logger.service";
import { IAuthService } from "../interfaces/auth.service.interface";
import { HashUtils } from "../../../utils/hash.utils";

@injectable()
export class AuthService implements IAuthService {
  private repository: Repository<AppClient>;

  constructor(
    @inject(TYPES.DatabaseService)
    private readonly databaseService: IDatabaseService,
    @inject(TYPES.ConfigService)
    private readonly configService: ConfigService,
    @inject(TYPES.LoggerService)
    private readonly logger: LoggerService
  ) {}

  private async getRepository(): Promise<Repository<AppClient>> {
    if (!this.repository) {
      this.repository = await this.databaseService.getRepository(AppClient);
    }

    return this.repository;
  }

  async generateToken(clientId: string, clientSecret: string): Promise<string> {
    const repository = await this.getRepository();

    const client = await repository.findOne({
      where: { id: clientId, is_active: true },
    });

    if (!client) {
      throw new UnauthorizedException();
    }

    const hashedSecret = HashUtils.createSha256(clientSecret);

    if (client.secret_hash !== hashedSecret) {
      throw new UnauthorizedException();
    }

    const accessToken = sign(
      { client_id: client.id },
      this.configService.auth.jwt.secret,
      {
        expiresIn: this.configService.auth.jwt.expires_in,
      }
    );

    return accessToken;
  }

  validateToken(token: string): boolean {
    try {
      const decoded = verify(token, this.configService.auth.jwt.secret);
      return !!decoded;
    } catch (e) {
      this.logger.error(`Error validating token ${e}`);

      return false;
    }
  }
}
