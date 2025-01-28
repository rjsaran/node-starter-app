export class AmountUtils {
  public static toSmallestUnit(amount: number, precision: number = 5): number {
    return amount * Math.pow(10, precision);
  }

  public static fromSmallestUnit(
    amountSu: number,
    precision: number = 5
  ): number {
    return amountSu / Math.pow(10, precision);
  }
}
