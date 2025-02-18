import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpGet,
  queryParam,
} from "inversify-express-utils";

import { TYPES } from "../../../core/types";
import { LedgerReportService } from "../services/ledger-report.service";
import { GenerateEODReportDTO } from "../dto/ledger-report.dto";
import { validateQuery } from "../../../core/middleware/query-validator.middleware";

@controller("/ledger/report", TYPES.AuthMiddleware)
export class LedgerReportController extends BaseHttpController {
  constructor(
    @inject(TYPES.LedgerReportService)
    private readonly ledgerReportService: LedgerReportService
  ) {
    super();
  }

  @httpGet("", validateQuery(GenerateEODReportDTO))
  async generate(@queryParam() dto: GenerateEODReportDTO) {
    return this.ledgerReportService.generateReportByDay(
      dto.ledger_id,
      dto.date
    );
  }
}
