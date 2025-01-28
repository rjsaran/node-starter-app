import "reflect-metadata";

import { container } from "../core/ioc.config";

import { TYPES } from "../core/types";
import { IDatabaseService } from "../core/interfaces/database.service.interface";
import { TestDatabaseService } from "./database.service";
import { DataSource } from "typeorm";
import { createDatabase, seedDatabase } from "../scripts/db-seed";

let connection: DataSource;

beforeAll(async () => {
  // TODO: use .env.test file instead
  await createDatabase("testdb");

  container
    .rebind<IDatabaseService>(TYPES.IDatabaseService)
    .to(TestDatabaseService);

  const databaseService = container.get<IDatabaseService>(
    TYPES.IDatabaseService
  );

  connection = await databaseService.getConnection();
});

afterAll(async () => {
  await connection.dropDatabase();
  await connection.destroy();
});

beforeEach(async () => {
  await connection.synchronize(true);

  await seedDatabase();
});
