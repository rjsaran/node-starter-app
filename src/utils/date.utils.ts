export class DateUtils {
  public static difference(date1: Date, date2: Date): number {
    return date2.getTime() - date1.getTime();
  }

  public static differenceInDays(date1: Date, date2: Date): number {
    return Math.round(
      DateUtils.difference(date1, date2) / (1000 * 60 * 60 * 24)
    );
  }

  public static differenceInMonths(date1: Date, date2: Date): number {
    const year1 = date1.getFullYear();
    const month1 = date1.getMonth();
    const year2 = date2.getFullYear();
    const month2 = date2.getMonth();

    return (year2 - year1) * 12 + (month2 - month1);
  }
}
