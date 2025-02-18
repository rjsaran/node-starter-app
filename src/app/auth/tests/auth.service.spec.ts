import { container } from "../../../core/ioc.config";
import { TYPES } from "../../../core/types";
import { IAuthService } from "../interfaces/auth.service.interface";
import { UnauthorizedException } from "../../../core/exception";
import { ZERO_UUID } from "../../../core/constants";

describe("Test: Auth Service", () => {
  let authService: IAuthService;

  const clientPayload = {
    id: ZERO_UUID,
    secret: ZERO_UUID,
  };

  beforeEach(() => {
    authService = container.get(TYPES.IAuthService);
  });

  describe("Login", () => {
    it("Throw error: Invalid client Id", async () => {
      await authService
        .generateToken(
          "00000000-0000-0000-0000-000000000001",
          clientPayload.secret
        )
        .catch((error) => {
          expect(error).toBeInstanceOf(UnauthorizedException);
        });
    });

    it("Throw error: Invalid password", async () => {
      await authService
        .generateToken(clientPayload.id, "Wrong")
        .catch((error) => {
          expect(error).toBeInstanceOf(UnauthorizedException);
        });
    });

    it("Should return access token", async () => {
      const accessToken = await authService.generateToken(
        clientPayload.id,
        clientPayload.secret
      );

      expect(accessToken).toBeDefined();
    });
  });

  describe("Verify token", () => {
    it("Show return false", () => {
      const isVerified = authService.validateToken("Invalid TOKEN");

      expect(isVerified).toBeDefined();
      expect(isVerified).toBe(false);
    });

    it("Should return true", async () => {
      const accessToken = await authService.generateToken(
        clientPayload.id,
        clientPayload.secret
      );

      const isVerified = await authService.validateToken(accessToken);

      expect(isVerified).toBeDefined();
      expect(isVerified).toBe(true);
    });
  });
});
