import { DataSource, EntityTarget, ObjectLiteral, Repository } from "typeorm";

export interface IDatabaseService {
  getConnection(): Promise<DataSource>;
  getRepository<T extends ObjectLiteral>(
    entity: EntityTarget<T>
  ): Promise<Repository<T>>;
  closeConnection(): Promise<void>;
}
