import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  httpPut,
  queryParam,
  requestBody,
  requestParam,
} from "inversify-express-utils";

import { validateBody } from "../../../core/middleware/body-validator.middeware";
import { validateQuery } from "../../../core/middleware/query-validator.middleware";
import {
  CreateLedgerTransactionDTO,
  ListLedgerTransactionDTO,
  UpdateLedgerTransactionDTO,
} from "../dto/ledger-transaction.dto";
import { TYPES } from "../../../core/types";
import { inject } from "inversify";
import { LedgerTransactionService } from "../services/ledger-transaction.service";

@controller("/ledger/transaction", TYPES.AuthMiddleware)
export class LedgertransactionController extends BaseHttpController {
  constructor(
    @inject(TYPES.LedgerTransactionService)
    private readonly ledgerAccountService: LedgerTransactionService
  ) {
    super();
  }

  @httpGet("", validateQuery(ListLedgerTransactionDTO))
  async list(@queryParam() query: ListLedgerTransactionDTO) {
    // TODO: Add Pagination & Sorting
    const transactions = await this.ledgerAccountService.findAllByLedger(
      query.ledger_id
    );

    return {
      results: transactions,
    };
  }

  @httpPost("", validateBody(CreateLedgerTransactionDTO))
  async create(@requestBody() dto: CreateLedgerTransactionDTO) {
    return this.ledgerAccountService.create(dto);
  }

  @httpGet("/:transaction_id")
  async get(@requestParam("transaction_id") transactionId: string) {
    return this.ledgerAccountService.findOne(transactionId);
  }

  @httpPut("/:transaction_id", validateBody(UpdateLedgerTransactionDTO))
  async update(
    @requestBody() dto: UpdateLedgerTransactionDTO,
    @requestParam("transaction_id") transactionId: string
  ) {
    return this.ledgerAccountService.update(transactionId, dto);
  }
}
