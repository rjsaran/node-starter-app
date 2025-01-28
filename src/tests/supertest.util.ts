import "reflect-metadata";

import supertest from "supertest";

import { Server } from "../server";
import { container } from "../core/ioc.config";
import { TYPES } from "../core/types";

export const testServer = container.get<Server>(TYPES.Server);

export const agent = supertest(testServer.expressApp);
