import "reflect-metadata";

import { container } from "./core/ioc.config";
import { TYPES } from "./core/types";
import { Server } from "./server";

const server = container.get<Server>(TYPES.Server);

server.bootstrap();
