import * as argon from 'argon2';

export async function hashPassword(password: string) {
  return await argon.hash(password);
}

export async function verifyPassword(hash: string, password: string) {
  return await argon.verify(hash, password);
}
