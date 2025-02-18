import { inject, injectable } from "inversify";
import { Repository } from "typeorm";

import { TYPES } from "../../../core/types";
import { IDatabaseService } from "../../../core/interfaces/database.service.interface";
import { Ledger } from "../repository/ledger.entity";
import { CreateLedgerDTO, UpdateLedgerDTO } from "../dto/ledger.dto";
import { NotFoundException } from "../../../core/exception";

@injectable()
export class LedgerService {
  private repository: Repository<Ledger>;

  constructor(
    @inject(TYPES.DatabaseService)
    private readonly databaseService: IDatabaseService
  ) {}

  private async getRepository(): Promise<Repository<Ledger>> {
    if (!this.repository) {
      this.repository = await this.databaseService.getRepository(Ledger);
    }

    return this.repository;
  }

  async create(data: CreateLedgerDTO) {
    const repository = await this.getRepository();

    const ledger = await repository.findOne({
      where: { idempotence_key: data.idempotence_key },
    });

    if (ledger) return ledger;

    const account = repository.create(data);

    return repository.save(account);
  }

  async findOne(id: string) {
    const repository = await this.getRepository();

    const ledger = await repository.findOne({ where: { id } });

    if (!ledger) throw new NotFoundException();

    return ledger;
  }

  async findOneByMatch(match: { id?: string; ikey?: string }) {
    if (match.id) {
      return this.findOne(match.id);
    }

    const repository = await this.getRepository();

    const ledger = await repository.findOne({
      where: { idempotence_key: match.ikey },
    });

    if (!ledger) throw new NotFoundException();

    return ledger;
  }

  async update(id: string, data: UpdateLedgerDTO) {
    const repository = await this.getRepository();

    await repository.update(id, data);

    return this.findOne(id);
  }

  async delete(id: string) {
    const repository = await this.getRepository();

    const response = await repository.delete(id);

    return response.affected && response.affected > 0 ? true : false;
  }
}
