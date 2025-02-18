import { Container } from "inversify";
import { TYPES } from "./types";

import { Server } from "../server";
import { ConfigService } from "../config";
import { LoggerService } from "./services/logger.service";
import { ErrorMiddleware } from "./middleware/error.middleware";

import { IDatabaseService } from "./interfaces/database.service.interface";
import { PostgresDatabaseService } from "./services/postgres.database.service";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { LedgerAccountService } from "../app/ledger/services/ledger-account.service";
import { LedgerService } from "../app/ledger/services/ledger.service";
import { AuthService } from "../app/auth/services/auth.service";
import { LedgerTransactionService } from "../app/ledger/services/ledger-transaction.service";
import { LedgerEntryService } from "../app/ledger/services/ledger-entry.service";
import { LedgerReportService } from "../app/ledger/services/ledger-report.service";

export const container = new Container();

container.bind<Server>(TYPES.Server).to(Server).inSingletonScope();

container
  .bind<ConfigService>(TYPES.ConfigService)
  .to(ConfigService)
  .inSingletonScope();

container
  .bind<LoggerService>(TYPES.LoggerService)
  .to(LoggerService)
  .inSingletonScope();

container.bind<ErrorMiddleware>(ErrorMiddleware).toSelf().inSingletonScope();

container
  .bind<IDatabaseService>(TYPES.DatabaseService)
  .to(PostgresDatabaseService)
  .inSingletonScope();

container
  .bind<AuthMiddleware>(TYPES.AuthMiddleware)
  .to(AuthMiddleware)
  .inRequestScope();

container
  .bind<LedgerAccountService>(TYPES.LedgerAccountService)
  .to(LedgerAccountService)
  .inSingletonScope();

container
  .bind<LedgerService>(TYPES.LedgerService)
  .to(LedgerService)
  .inSingletonScope();

container
  .bind<LedgerTransactionService>(TYPES.LedgerTransactionService)
  .to(LedgerTransactionService)
  .inSingletonScope();

container
  .bind<LedgerEntryService>(TYPES.LedgerEntryService)
  .to(LedgerEntryService)
  .inSingletonScope();

container
  .bind<LedgerReportService>(TYPES.LedgerReportService)
  .to(LedgerReportService)
  .inSingletonScope();

container
  .bind<AuthService>(TYPES.IAuthService)
  .to(AuthService)
  .inSingletonScope();
