export const TYPES = {
  Server: Symbol.for("Server"),
  ConfigService: Symbol.for("ConfigService"),
  LoggerService: Symbol.for("LoggerService"),

  AuthMiddleware: Symbol.for("AuthMiddleware"),
  IDatabaseService: Symbol.for("IDatabaseService"),
  IAuthRepository: Symbol.for("IAuthRepository"),

  IAuthService: Symbol.for("IAuthService"),
  IUserService: Symbol.for("IUserService"),

  APIServiceA: Symbol.for("APIServiceA"),
};
