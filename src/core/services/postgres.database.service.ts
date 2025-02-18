import { inject, injectable } from "inversify";

import {
  DataSource,
  DataSourceOptions,
  EntityTarget,
  ObjectLiteral,
  Repository,
} from "typeorm";

import { IDatabaseService } from "../interfaces/database.service.interface";

import { ConfigService } from "../../config";
import { LoggerService } from "./logger.service";
import { InternalServerException } from "../exception";
import { TYPES } from "../types";

@injectable()
export class PostgresDatabaseService implements IDatabaseService {
  private dataSource: DataSource | null = null;

  constructor(
    @inject(TYPES.ConfigService)
    private readonly config: ConfigService,
    @inject(TYPES.LoggerService)
    private readonly logger: LoggerService
  ) {}

  public async getConnection(): Promise<DataSource> {
    if (this.dataSource?.isInitialized) {
      return this.dataSource;
    }

    const dataSourceOptions: DataSourceOptions = {
      type: "postgres",
      host: this.config.db.postgres.host,
      port: this.config.db.postgres.port,
      username: this.config.db.postgres.user,
      password: this.config.db.postgres.password,
      database: this.config.db.postgres.database,
      entities: [__dirname + "../../../**/*.entity.{ts,js}"],
      synchronize: true,
    };

    try {
      this.dataSource = await new DataSource(dataSourceOptions).initialize();

      return this.dataSource;
    } catch (err) {
      this.logger.error("Cannot establish database connection");
      this.logger.error(err);

      throw new InternalServerException();
    }
  }

  public async getRepository<T extends ObjectLiteral>(
    entity: EntityTarget<T>
  ): Promise<Repository<T>> {
    const dataSource = await this.getConnection();

    return await dataSource.getRepository(entity);
  }

  public async closeConnection(): Promise<void> {
    if (this.dataSource && this.dataSource.isInitialized) {
      await this.dataSource.destroy();

      this.logger.info("PostgreSQL connection closed.");
    }
  }
}
