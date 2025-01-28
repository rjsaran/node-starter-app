import { AuthUser } from "../../../core/middleware/auth.middleware";
import { LoginDto } from "../dto/login.dto";
import { LoginResponseDto } from "../dto/login.response.dto";

export interface JwtConfig {
  secret: string;
  expiresIn: number;
}

export interface IAuthService {
  login(dto: LoginDto): Promise<LoginResponseDto>;
  verifyToken(token: string): AuthUser;
}
