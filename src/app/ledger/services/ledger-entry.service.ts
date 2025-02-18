import { inject, injectable } from "inversify";
import { Between, QueryRunner, Repository } from "typeorm";

import { TYPES } from "../../../core/types";
import { IDatabaseService } from "../../../core/interfaces/database.service.interface";
import { NotFoundException } from "../../../core/exception";
import { LedgerEntry } from "../repository/ledger-entry.entity";
import { CreateLedgerEntryDTO } from "../dto/ledger-entry.dto";
import { LedgerAccountService } from "./ledger-account.service";

@injectable()
export class LedgerEntryService {
  private repository: Repository<LedgerEntry>;

  constructor(
    @inject(TYPES.DatabaseService)
    private readonly databaseService: IDatabaseService,
    @inject(TYPES.LedgerAccountService)
    private readonly ledgerAccountService: LedgerAccountService
  ) {}

  private async getRepository(
    queryRunner?: QueryRunner
  ): Promise<Repository<LedgerEntry>> {
    if (queryRunner) return queryRunner.manager.getRepository(LedgerEntry);

    if (!this.repository) {
      this.repository = await this.databaseService.getRepository(LedgerEntry);
    }

    return this.repository;
  }

  async findAllByAccount(accountId: string) {
    const repository = await this.getRepository();

    const ledgerEntries = await repository.find({
      where: { account: { id: accountId } },
    });

    return ledgerEntries.map((ledgerEntry) => ledgerEntry.toJSON());
  }

  async findAllByLedgerAndDate(ledgerId: string, date: Date) {
    const repository = await this.getRepository();

    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const ledgerEntries = await repository.find({
      where: {
        ledger: { id: ledgerId },
        posted_at: Between(startOfDay, endOfDay),
      },
      relations: ["account"],
    });

    return ledgerEntries.map((ledgerEntry) => ledgerEntry.toJSON());
  }

  async findOne(id: string) {
    const repository = await this.getRepository();

    const ledgerEntry = await repository.findOne({ where: { id } });

    if (!ledgerEntry) throw new NotFoundException();

    return ledgerEntry.toJSON();
  }

  async create(entry: CreateLedgerEntryDTO, queryRunner?: QueryRunner) {
    const repository = await this.getRepository(queryRunner);

    const ledgerAccount = await this.ledgerAccountService.findOneByMatch(
      entry.account
    );

    const accountId = ledgerAccount.id;

    // Get new version and tag with ledger entry
    const newVersion = await this.ledgerAccountService.updateVersion(
      accountId,
      queryRunner
    );

    const ledgerEntry = repository.create({
      ...entry,
      account: {
        id: accountId,
      },
      account_version: newVersion,
    });

    await repository.save(ledgerEntry);

    // Update account balance
    await this.ledgerAccountService.updateBalance(
      accountId,
      entry.amount,
      entry.currency,
      queryRunner
    );

    return ledgerEntry;
  }

  async createMany(entries: CreateLedgerEntryDTO[], queryRunner?: QueryRunner) {
    const results: LedgerEntry[] = [];

    for (const entry of entries) {
      const result = await this.create(entry, queryRunner);
      results.push(result);
    }

    return results;
  }
}
