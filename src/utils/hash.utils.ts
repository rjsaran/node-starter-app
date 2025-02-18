import { createHash } from "crypto";

export class HashUtils {
  static createSha256(input: string): string {
    return createHash("sha256").update(input).digest("hex");
  }
}
