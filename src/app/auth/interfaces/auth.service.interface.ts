export interface IAuthService {
  generateToken(clientId: string, clientSecret: string): Promise<string>;
  validateToken(token: string): boolean;
}
