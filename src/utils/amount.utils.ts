import { CURRENCY_PRECISION } from "../core/constants";

type CurrencyCode = keyof typeof CURRENCY_PRECISION;

export class AmountUtils {
  private static getPrecision(currency: CurrencyCode | string) {
    const precision = CURRENCY_PRECISION[currency as CurrencyCode];
    if (precision === undefined) {
      throw new Error("Currency precision is not defined");
    }

    return precision;
  }

  public static toSmallestUnit(
    amount: number,
    currency: CurrencyCode | string
  ): number {
    return Math.round(
      amount * Math.pow(10, AmountUtils.getPrecision(currency))
    );
  }

  public static toOriginalUnit(
    amountSu: number,
    currency: CurrencyCode | string
  ): number {
    return amountSu / Math.pow(10, AmountUtils.getPrecision(currency));
  }
}
