import { LoginDto } from "../dto/login.dto";
import { container } from "../../../core/ioc.config";
import { TYPES } from "../../../core/types";
import { IAuthService } from "../interfaces/auth.service.interface";
import {
  NotFoundException,
  UnauthorizedException,
} from "../../../core/exception";

describe("Test: Auth Service", () => {
  let authService: IAuthService;

  let userPayload: LoginDto = {
    email: "account@nodestarterapp.com",
    password: "account@123",
  };

  beforeEach(() => {
    userPayload = {
      email: "account@nodestarterapp.com",
      password: "account@123",
    };

    authService = container.get(TYPES.IAuthService);
  });

  describe("Login", () => {
    it("Throw error: Invalid email", async () => {
      userPayload.email = "account1@nodestarterapp.com";

      await authService.login(userPayload).catch((error) => {
        expect(error).toBeInstanceOf(NotFoundException);
      });
    });

    it("Throw error: Invalid password", async () => {
      userPayload.password = "account@124";

      await authService.login(userPayload).catch((error) => {
        expect(error).toBeInstanceOf(UnauthorizedException);
      });
    });

    it("Should return access token", async () => {
      const response = await authService.login(userPayload);

      expect(response).toBeDefined();
      expect(response.accessToken).toBeDefined();
    });
  });

  describe("Verify token", () => {
    it("Throw error: Invalid token", () => {
      expect(() => authService.verifyToken("")).toThrow(UnauthorizedException);
    });

    it("Should return valid user", async () => {
      const response = await authService.login(userPayload);

      const verifyTokenResponse = await authService.verifyToken(
        response.accessToken
      );

      expect(verifyTokenResponse).toBeDefined();
      expect(verifyTokenResponse.id).toBeDefined();
    });
  });
});
