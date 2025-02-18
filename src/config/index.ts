import { injectable } from "inversify";

import dotenv from "dotenv";
dotenv.config();

const config = {
  app_name: "Node Starter App",

  server: {
    port: parseInt(process.env.PORT || "3000", 10),
  },

  auth: {
    jwt: {
      secret: process.env.JWT_SECRET || "",
      expires_in: (Number(process.env.JWT_EXPIRY_IN_MINUTES) || 60) * 60, // Default: 1 Hours
    },
  },

  db: {
    postgres: {
      port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
      host: process.env.POSTGRES_HOST || "127.0.0.1",
      user: process.env.POSTGRES_USER || "postgres",
      password: process.env.POSTGRES_PASSWORD || "",
      database: process.env.POSTGRES_DB,
    },
  },
};

type ConfigType = typeof config;

@injectable()
export class ConfigService {
  private config: ConfigType;

  constructor() {
    this.config = config;
  }

  get<T extends keyof ConfigType>(key: T): ConfigType[T] {
    return this.config[key];
  }

  get app_name() {
    return this.get("app_name");
  }

  get server() {
    return this.get("server");
  }

  get auth() {
    return this.get("auth");
  }

  get db() {
    return this.get("db");
  }
}
