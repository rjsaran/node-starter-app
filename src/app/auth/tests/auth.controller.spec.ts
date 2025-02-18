import { agent } from "../../../tests/supertest.util";
import { GenerateTokenDTO } from "../auth.dto";
import { ZERO_UUID } from "../../../core/constants";

describe("Test: Auth Controller", () => {
  let userPayload: GenerateTokenDTO = {
    client_id: ZERO_UUID,
    client_secret: ZERO_UUID,
  };

  beforeEach(() => {
    userPayload = {
      client_id: ZERO_UUID,
      client_secret: ZERO_UUID,
    };
  });

  describe("Generate token with id and secret", () => {
    it("Index", (done) => {
      agent.post("/api/auth/token").send(userPayload).expect(200, done);
    });

    it("Access token should be present", async () => {
      const response = await agent.post("/api/auth/token").send(userPayload);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("access_token");
    });

    it("Should return 400: Invalid client_secret", async () => {
      userPayload.client_secret = "";
      const response = await agent.post("/api/auth/token").send(userPayload);
      expect(response.body).toHaveProperty("statusCode");
      expect(response.body.statusCode).toBe(400);
    });

    it("Should return 401: Invalid client_id", async () => {
      userPayload.client_id = "00000000-0000-0000-0000-000000000001";
      const response = await agent.post("/api/auth/token").send(userPayload);

      expect(response.body).toHaveProperty("statusCode");
      expect(response.body.statusCode).toBe(401);
    });
  });
});
