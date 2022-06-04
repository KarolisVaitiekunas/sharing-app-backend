import jwt from 'jsonwebtoken';
import config from 'config';

export function signJwt(
  object: Record<string, unknown>,
  keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
  options?: jwt.SignOptions | undefined,
) {
  const signingKey = Buffer.from(config.get<string>(keyName), 'base64').toString('ascii');
  //RS256 means we are going to use public and private keys (?) 1:26:00
  return jwt.sign(object, signingKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
}

export function verifyJwt<T>(token: string, keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey'): T | null {
  const publicKey = Buffer.from(config.get<string>(keyName), 'base64').toString('ascii');

  try {
    //if can't verify will go to catch
    const decoded = jwt.verify(token, publicKey) as T;
    return decoded;
  } catch (e) {
    return null;
  }
}
