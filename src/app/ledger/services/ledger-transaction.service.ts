import { inject, injectable } from "inversify";
import { QueryRunner, Repository } from "typeorm";

import { TYPES } from "../../../core/types";
import { IDatabaseService } from "../../../core/interfaces/database.service.interface";
import {
  NotFoundException,
  ValidationException,
} from "../../../core/exception";
import { LedgerTransaction } from "../repository/ledger-transaction.entity";
import {
  CreateLedgerTransactionDTO,
  UpdateLedgerTransactionDTO,
} from "../dto/ledger-transaction.dto";
import { LedgerEntryService } from "./ledger-entry.service";
import { CreateLedgerEntryDTO } from "../dto/ledger-entry.dto";
import { LedgerAccountService } from "./ledger-account.service";
import { LedgerService } from "./ledger.service";
import { LedgerAccountType } from "../repository/ledger-account.entity";

@injectable()
export class LedgerTransactionService {
  private repository: Repository<LedgerTransaction>;

  constructor(
    @inject(TYPES.DatabaseService)
    private readonly databaseService: IDatabaseService,
    @inject(TYPES.LedgerService)
    private readonly ledgerService: LedgerService,
    @inject(TYPES.LedgerAccountService)
    private readonly ledgerAccountService: LedgerAccountService,
    @inject(TYPES.LedgerEntryService)
    private readonly ledgerEntryService: LedgerEntryService
  ) {}

  private async getRepository(
    queryRunner?: QueryRunner
  ): Promise<Repository<LedgerTransaction>> {
    if (queryRunner)
      return queryRunner.manager.getRepository(LedgerTransaction);

    if (!this.repository) {
      this.repository = await this.databaseService.getRepository(
        LedgerTransaction
      );
    }

    return this.repository;
  }

  private async validate(data: CreateLedgerTransactionDTO) {
    let totalAssets = 0;
    let totalLiability = 0;
    let totalIncome = 0;
    let totalExpense = 0;

    const currencies = new Set();

    for (const line of data.lines) {
      currencies.add(line.currency);

      const ledgerAccount = await this.ledgerAccountService.findOneByMatch(
        line.account
      );

      if (ledgerAccount.type === LedgerAccountType.ASSET) {
        totalAssets += line.amount;
      } else if (ledgerAccount.type === LedgerAccountType.LIABILITY) {
        totalLiability += line.amount;
      } else if (ledgerAccount.type === LedgerAccountType.INCOME) {
        totalIncome += line.amount;
      } else if (ledgerAccount.type === LedgerAccountType.EXPENSE) {
        totalExpense += line.amount;
      }
    }

    // Zero sum validation
    // totalAssets + totalExpense === totalLiability + totalIncome
    // debitNormal === creditNormal
    if (totalAssets - totalLiability !== totalIncome - totalExpense) {
      throw new ValidationException(
        "(asset - liability) should be equal to (income - expense)"
      );
    }

    // Currency validation: Ensure all lines have the same currency
    if (currencies.size > 1) {
      throw new ValidationException(
        "All transaction lines must have the same currency"
      );
    }
  }

  async create(data: CreateLedgerTransactionDTO) {
    await this.validate(data);

    const connection = await this.databaseService.getConnection();

    // Start the transaction
    const queryRunner = connection.createQueryRunner();

    const repository = await this.getRepository(queryRunner);

    const ledgerTxn = await repository.findOne({
      where: { idempotence_key: data.idempotence_key },
    });

    if (ledgerTxn) return ledgerTxn;

    const ledger = await this.ledgerService.findOneByMatch(data.ledger);

    await queryRunner.startTransaction();

    try {
      const ledgerTxn = repository.create({
        ...data,
        ledger: ledger,
        params: data.lines,
      });

      // Save transaction to Database
      await repository.save(ledgerTxn);

      const ledgerEntries: CreateLedgerEntryDTO[] = data.lines.map((line) => {
        return {
          amount: line.amount,
          currency: line.currency,
          account: line.account,
          description: ledgerTxn.description,
          posted_at: ledgerTxn.posted_at,
          transaction: {
            id: ledgerTxn.id,
          },
          ledger: ledger,
        };
      });

      await this.ledgerEntryService.createMany(ledgerEntries, queryRunner);

      await queryRunner.commitTransaction();

      return ledgerTxn;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllByLedger(ledgerId: string) {
    const repository = await this.getRepository();

    const ledgerTxns = await repository.find({
      where: { ledger: { id: ledgerId } },
      relations: ["ledger", "lines"],
    });

    return ledgerTxns.map((ledgerTxn) => ledgerTxn.toJSON());
  }

  async findOne(id: string) {
    const repository = await this.getRepository();

    const ledgerTxn = await repository.findOne({
      where: { id },
      relations: ["ledger", "lines"],
    });

    if (!ledgerTxn) throw new NotFoundException();

    return ledgerTxn.toJSON();
  }

  async update(id: string, data: UpdateLedgerTransactionDTO) {
    const repository = await this.getRepository();

    await repository.update(id, data);

    return this.findOne(id);
  }
}
