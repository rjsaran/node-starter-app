import { container } from "../../../core/ioc.config";

import { TYPES } from "../../../core/types";
import { IAuthService } from "../interfaces/auth.service.interface";

import { FakeAuthService } from "../../../tests/fake.service";
import { agent } from "../../../tests/supertest.util";
import { LoginDto } from "../dto/login.dto";

describe("Test: Auth Controller", () => {
  let userPayload: LoginDto = {
    email: "account@nodestarterapp.com",
    password: "account@123",
  };

  beforeEach(() => {
    userPayload = {
      email: "account@nodestarterapp.com",
      password: "account@123",
    };

    container.rebind<IAuthService>(TYPES.IAuthService).to(FakeAuthService);
  });

  describe("Sign In with a user", () => {
    it("Index", (done) => {
      agent.post("/api/auth/login").send(userPayload).expect(200, done);
    });

    it("Access token should be present", async () => {
      const response = await agent.post("/api/auth/login").send(userPayload);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("accessToken");
    });

    it("Should return 400: Invalid email", async () => {
      userPayload.email = "124";

      const response = await agent.post("/api/auth/login").send(userPayload);

      expect(response.body).toHaveProperty("statusCode");
      expect(response.body.statusCode).toBe(400);
    });

    it("Should return 400: Invalid password", async () => {
      userPayload.password = "";

      const response = await agent.post("/api/auth/login").send({
        email: userPayload.email,
        password: "",
      });

      expect(response.body).toHaveProperty("statusCode");
      expect(response.body.statusCode).toBe(400);
    });
  });
});
