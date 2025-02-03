import { inject, injectable } from "inversify";
import { container } from "./core/ioc.config";

import { InversifyExpressServer } from "inversify-express-utils";

import bodyParser from "body-parser";
import express from "express";
import morgan from "morgan";

require("express-async-errors");

import { ConfigService } from "./config";
import { LoggerService } from "./core/services/logger.service";
import errorMiddleware from "./core/middleware/error.middleware";

import "./app/auth/controllers/auth.controller";
import { TYPES } from "./core/types";

@injectable()
export class Server {
  _expressApp: express.Application;

  constructor(
    @inject(TYPES.LoggerService)
    private readonly logger: LoggerService,
    @inject(TYPES.ConfigService)
    private readonly config: ConfigService
  ) {
    this._expressApp = this.__setupExpressApp();
  }

  private __setupExpressApp() {
    const server = new InversifyExpressServer(container, null, {
      rootPath: "/api",
    });

    server
      .setConfig((app) => {
        app.disable("x-powered-by");

        app.use(bodyParser.json());

        app.use(morgan("combined"));
      })
      .setErrorConfig((app) => {
        app.use(errorMiddleware());
      });

    return server.build();
  }

  public get expressApp(): express.Application {
    return this._expressApp;
  }

  public bootstrap() {
    const port = this.config.server.port;

    this._expressApp.listen(port, () => {
      this.logger.info(`App is listening on http://127.0.0.1:${port}`);
    });
  }
}
