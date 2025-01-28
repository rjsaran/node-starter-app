import { inject, injectable } from "inversify";

import {
  DataSource,
  DataSourceOptions,
  EntityTarget,
  ObjectLiteral,
  Repository,
} from "typeorm";

import { LoggerService } from "../core/services/logger.service";
import { InternalServerException } from "../core/exception";
import { IDatabaseService } from "../core/interfaces/database.service.interface";
import { ConfigService } from "../config";
import { TYPES } from "../core/types";

@injectable()
export class TestDatabaseService implements IDatabaseService {
  private static dataSource: DataSource;

  constructor(
    @inject(TYPES.ConfigService)
    private readonly config: ConfigService,
    @inject(TYPES.LoggerService)
    private readonly logger: LoggerService
  ) {}

  public async getConnection(): Promise<DataSource> {
    if (TestDatabaseService.dataSource?.isInitialized) {
      return TestDatabaseService.dataSource;
    }

    try {
      const datasourceConfig: DataSourceOptions = {
        type: "postgres",
        database: "testdb",
        host: this.config.db.postgres.host,
        port: this.config.db.postgres.port,
        username: this.config.db.postgres.user,
        password: this.config.db.postgres.password,
        entities: [__dirname + "../../**/*.entity.{ts,js}"],
        dropSchema: true,
        synchronize: true,
      };

      TestDatabaseService.dataSource = await new DataSource(
        datasourceConfig
      ).initialize();

      return TestDatabaseService.dataSource;
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
}
