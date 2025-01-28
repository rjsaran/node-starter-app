import { container } from "../../../core/ioc.config";
import { TYPES } from "../../../core/types";
import { NotFoundException } from "../../../core/exception";
import { IUserService } from "../interfaces/user.service.interface";

describe("Test: Auth Service", () => {
  let userService: IUserService;

  let userEmail: string = "account@nodestarterapp.com";

  beforeEach(() => {
    userEmail = "account@nodestarterapp.com";

    userService = container.get(TYPES.IUserService);
  });

  describe("Get user by email", () => {
    it("Throw error: Invalid email", async () => {
      await userService.getUserByEmail("").catch((error) => {
        expect(error).toBeInstanceOf(NotFoundException);
      });
    });

    it("Should return: Valid user", async () => {
      const user = await userService.getUserByEmail(userEmail);

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
    });
  });

  describe("Get user by id", () => {
    it("Throw error: Invalid id", async () => {
      const user = await userService.getUserByEmail(userEmail);

      await userService.getUserById(user.id).catch((error) => {
        expect(error).toBeInstanceOf(NotFoundException);
      });
    });
  });
});
