import {
  BaseHttpController,
  controller,
  httpGet,
  queryParam,
  requestParam,
} from "inversify-express-utils";
import { inject } from "inversify";

import { TYPES } from "../../../core/types";
import { LedgerEntryService } from "../services/ledger-entry.service";
import { ListLedgerEntryDTO } from "../dto/ledger-entry.dto";
import { validateQuery } from "../../../core/middleware/query-validator.middleware";

@controller("/ledger/entry", TYPES.AuthMiddleware)
export class LedgerEntryController extends BaseHttpController {
  constructor(
    @inject(TYPES.LedgerEntryService)
    private readonly ledgerEntryService: LedgerEntryService
  ) {
    super();
  }

  @httpGet("", validateQuery(ListLedgerEntryDTO))
  async list(@queryParam() query: ListLedgerEntryDTO) {
    // TODO: Add Pagination & Sorting
    const entries = await this.ledgerEntryService.findAllByAccount(
      query.account_id
    );

    return {
      results: entries,
    };
  }

  @httpGet("/:entry_id")
  async get(@requestParam("entry_id") entryId: string) {
    return this.ledgerEntryService.findOne(entryId);
  }
}
