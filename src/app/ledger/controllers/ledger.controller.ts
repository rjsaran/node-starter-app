import {
  BaseHttpController,
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  requestBody,
  requestParam,
} from "inversify-express-utils";

import { validateBody } from "../../../core/middleware/body-validator.middeware";
import { CreateLedgerDTO, UpdateLedgerDTO } from "../dto/ledger.dto";
import { LedgerService } from "../services/ledger.service";
import { inject } from "inversify";
import { TYPES } from "../../../core/types";

@controller("/ledger", TYPES.AuthMiddleware)
export class LedgerController extends BaseHttpController {
  constructor(
    @inject(TYPES.LedgerService)
    private readonly ledgerService: LedgerService
  ) {
    super();
  }

  @httpPost("", validateBody(CreateLedgerDTO))
  async create(@requestBody() dto: CreateLedgerDTO) {
    return this.ledgerService.create(dto);
  }

  @httpGet("/:ledger_id")
  async get(@requestParam("ledger_id") ledgerId: string) {
    return this.ledgerService.findOne(ledgerId);
  }

  @httpPut("/:ledger_id", validateBody(UpdateLedgerDTO))
  async update(
    @requestParam("ledger_id") ledgerId: string,
    @requestBody() dto: UpdateLedgerDTO
  ) {
    return this.ledgerService.update(ledgerId, dto);
  }

  @httpDelete("/:ledger_id")
  async delete(@requestParam("ledger_id") ledgerId: string) {
    const isDeleted = await this.ledgerService.delete(ledgerId);

    return {
      deleted: isDeleted,
    };
  }
}
