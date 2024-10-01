import jwt, { type JwtPayload } from 'jsonwebtoken';

export function getExpirationDateFromToken(token: string) {
  const decodedToken = jwt.decode(token) as JwtPayload;

  if (decodedToken && decodedToken.exp) {
    return new Date(decodedToken.exp * 1000); // Convert seconds to milliseconds
  }

  // Default expiration in one hour if the token or expiration information is not available
  return new Date(Date.now() + 60 * 60 * 1000);
}
