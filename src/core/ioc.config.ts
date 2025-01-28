import { Container } from "inversify";
import { TYPES } from "./types";

import { Server } from "../server";
import { ConfigService } from "../config";
import { LoggerService } from "./services/logger.service";
import { ErrorMiddleware } from "./middleware/error.middleware";

import { IDatabaseService } from "./interfaces/database.service.interface";
import { PostgresDatabaseService } from "./services/postgres.database.service";
import { IAuthService } from "../app/auth/interfaces/auth.service.interface";
import { AuthService } from "../app/auth/services/auth.service";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { IUserService } from "../app/auth/interfaces/user.service.interface";
import { UserService } from "../app/auth/services/user.service";
import { HttpService } from "./services/http.service";

export const container = new Container();

container.bind<Server>(TYPES.Server).to(Server);
container.bind<ConfigService>(TYPES.ConfigService).to(ConfigService);
container.bind<LoggerService>(TYPES.LoggerService).to(LoggerService);

container.bind<ErrorMiddleware>(ErrorMiddleware).toSelf();
container.bind<AuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware);

container
  .bind<IDatabaseService>(TYPES.IDatabaseService)
  .to(PostgresDatabaseService);

container.bind<IAuthService>(TYPES.IAuthService).to(AuthService);
container.bind<IUserService>(TYPES.IUserService).to(UserService);

container.bind<HttpService>(TYPES.APIServiceA).toDynamicValue((context) => {
  const configService = context.container.get<ConfigService>(
    TYPES.ConfigService
  );
  return new HttpService(configService.api.service_a.base_url);
});
