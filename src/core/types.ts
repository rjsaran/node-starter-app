import { CURRENCY_PRECISION } from "./constants";

export const TYPES = {
  Server: Symbol.for("Server"),
  ConfigService: Symbol.for("ConfigService"),
  LoggerService: Symbol.for("LoggerService"),

  DatabaseService: Symbol.for("DatabaseService"),

  IAuthService: Symbol.for("IAuthService"),

  AuthMiddleware: Symbol.for("AuthMiddleware"),

  LedgerService: Symbol.for("LedgerService"),
  LedgerAccountService: Symbol.for("LedgerAccountService"),
  LedgerTransactionService: Symbol.for("LedgerTransactionService"),
  LedgerEntryService: Symbol.for("LedgerEntryService"),
  LedgerReportService: Symbol.for("LedgerReportService"),
};

export type CurrencyCode = keyof typeof CURRENCY_PRECISION;
