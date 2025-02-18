import {
  BaseHttpController,
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  requestBody,
  requestParam,
  queryParam,
} from "inversify-express-utils";
import { inject } from "inversify";

import { validateBody } from "../../../core/middleware/body-validator.middeware";
import {
  CreateLedgerAccountDTO,
  ListLedgerAccountDTO,
  UpdateLedgerAccountDTO,
} from "../dto/ledger-account.dto";
import { TYPES } from "../../../core/types";
import { LedgerAccountService } from "../services/ledger-account.service";
import { validateQuery } from "../../../core/middleware/query-validator.middleware";

@controller("/ledger/account", TYPES.AuthMiddleware)
export class LedgerAccountController extends BaseHttpController {
  constructor(
    @inject(TYPES.LedgerAccountService)
    private readonly ledgerAccountService: LedgerAccountService
  ) {
    super();
  }

  @httpGet("", validateQuery(ListLedgerAccountDTO))
  async list(@queryParam() query: ListLedgerAccountDTO) {
    const accounts = await this.ledgerAccountService.findAllByLedger(
      query.ledger_id
    );

    return {
      results: accounts,
    };
  }

  @httpPost("", validateBody(CreateLedgerAccountDTO))
  async create(@requestBody() dto: CreateLedgerAccountDTO) {
    return this.ledgerAccountService.create(dto);
  }

  @httpGet("/:account_id")
  async get(@requestParam("account_id") accountId: string) {
    return this.ledgerAccountService.findOne(accountId);
  }

  @httpPut("/:account_id", validateBody(UpdateLedgerAccountDTO))
  async update(
    @requestParam("account_id") accountId: string,
    @requestBody() dto: UpdateLedgerAccountDTO
  ) {
    return this.ledgerAccountService.update(accountId, dto);
  }

  @httpDelete("/:account_id")
  async delete(@requestParam("account_id") accountId: string) {
    const isDeleted = await this.ledgerAccountService.delete(accountId);

    return {
      deleted: isDeleted,
    };
  }
}
