import "reflect-metadata";

import { Client } from "pg";
import { container } from "../core/ioc.config";

import { User } from "../app/auth/entities/user.entity";
import { IDatabaseService } from "../core/interfaces/database.service.interface";
import { TYPES } from "../core/types";
import { ConfigService } from "../config";

export const createDatabase = async (database?: string) => {
  const configService = container.get<ConfigService>(TYPES.ConfigService);

  database = database || configService.db.postgres.database;

  const client = new Client({
    database: "postgres",
    user: configService.db.postgres.user,
    password: configService.db.postgres.password,
    host: configService.db.postgres.host,
    port: configService.db.postgres.port,
  });

  await client.connect();
  const result = await client.query(
    `SELECT 1 FROM pg_database WHERE datname='${database}'`
  );

  if (result.rowCount === 0) {
    await client.query(`CREATE DATABASE ${database}`);
  }

  await client.end();
};

export const seedDatabase = async () => {
  const databaseService = container.get<IDatabaseService>(
    TYPES.IDatabaseService
  );

  const userRepository = await databaseService.getRepository(User);

  await userRepository.upsert(
    {
      email: "account@nodestarterapp.com",
      password: "account@123",
    },
    ["email"]
  );
};

if (require.main === module) {
  (async () => {
    await createDatabase();
    await seedDatabase();
  })();
}
