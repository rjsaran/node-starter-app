import { inject, injectable } from "inversify";
import { QueryRunner, Repository } from "typeorm";

import {
  CreateLedgerAccountDTO,
  UpdateLedgerAccountDTO,
} from "../dto/ledger-account.dto";
import { CurrencyCode, TYPES } from "../../../core/types";
import { IDatabaseService } from "../../../core/interfaces/database.service.interface";
import { LedgerAccount } from "../repository/ledger-account.entity";
import { NotFoundException } from "../../../core/exception";
import { LedgerService } from "./ledger.service";
import { AmountUtils } from "../../../utils/amount.utils";

@injectable()
export class LedgerAccountService {
  private repository: Repository<LedgerAccount>;

  constructor(
    @inject(TYPES.DatabaseService)
    private readonly databaseService: IDatabaseService,
    @inject(TYPES.LedgerService)
    private readonly ledgerService: LedgerService
  ) {}

  private async getRepository(
    queryRunner?: QueryRunner
  ): Promise<Repository<LedgerAccount>> {
    if (queryRunner) return queryRunner.manager.getRepository(LedgerAccount);

    if (!this.repository) {
      this.repository = await this.databaseService.getRepository(LedgerAccount);
    }

    return this.repository;
  }

  async create(data: CreateLedgerAccountDTO) {
    const repository = await this.getRepository();

    // Check if ledger account already exist
    const ledgerAccount = await repository.findOne({
      where: { idempotence_key: data.idempotence_key },
    });

    if (ledgerAccount) return ledgerAccount.toJSON();

    const ledger = await this.ledgerService.findOneByMatch(data.ledger);

    const account = repository.create({
      ...data,
      ledger: ledger,
    });

    await repository.save(account);

    return this.findOne(account.id);
  }

  async findAllByLedger(ledgerId: string) {
    const repository = await this.getRepository();

    const ledgerAccounts = await repository.find({
      where: { ledger: { id: ledgerId } },
    });

    return ledgerAccounts.map((ledgerAccount) => ledgerAccount.toJSON());
  }

  async findOne(id: string) {
    const repository = await this.getRepository();

    const ledgerAccount = await repository.findOne({
      relations: ["ledger"],
      where: { id },
    });

    if (!ledgerAccount) throw new NotFoundException();

    return ledgerAccount.toJSON();
  }

  async findOneByMatch(match: {
    id?: string;
    ikey?: string;
  }): Promise<LedgerAccount> {
    if (match.id) {
      return this.findOne(match.id);
    }

    const repository = await this.getRepository();

    const ledgerAccount = await repository.findOne({
      relations: ["ledger"],
      where: { idempotence_key: match.ikey },
    });

    if (!ledgerAccount) throw new NotFoundException();

    return ledgerAccount;
  }

  async update(id: string, data: UpdateLedgerAccountDTO) {
    const repository = await this.getRepository();

    await repository.update(id, data);

    return this.findOne(id);
  }

  async updateVersion(id: string, queryRunner?: QueryRunner): Promise<number> {
    const repository = await this.getRepository(queryRunner);

    const updatedRecord = await repository
      .createQueryBuilder()
      .update(LedgerAccount)
      .set({ version: () => "version + 1" })
      .where("id = :id", { id })
      .returning(["version"])
      .execute();

    return updatedRecord.raw[0].version;
  }

  async updateBalance(
    id: string,
    amount: number,
    currency: CurrencyCode,
    queryRunner?: QueryRunner
  ): Promise<number> {
    const repository = await this.getRepository(queryRunner);

    const amountInSmallestUnit = AmountUtils.toSmallestUnit(amount, currency);

    const updatedRecord = await repository
      .createQueryBuilder()
      .update(LedgerAccount)
      .set({ balance: () => `balance + (:amount)` })
      .where("id = :id", { id, amount: amountInSmallestUnit })
      .returning(["balance"])
      .execute();

    return updatedRecord.raw[0].balance;
  }

  async delete(id: string) {
    const repository = await this.getRepository();

    const response = await repository.delete(id);

    return response.affected && response.affected > 0 ? true : false;
  }
}
