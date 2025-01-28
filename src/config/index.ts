import { injectable } from "inversify";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

const config = {
  app_name: "Node Starter App",

  server: {
    port: parseInt(process.env.PORT || "3000", 10),
  },

  auth: {
    jwt: {
      secret: process.env.JWT_SECRET || "",
      expires_in: 24 * 60 * 60, // 24 Hours
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

  api: {
    service_a: {
      base_url: process.env.SERVICE_A_BASE_URL || "http://api.service.a.com",
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

  get api() {
    return this.get("api");
  }
}
