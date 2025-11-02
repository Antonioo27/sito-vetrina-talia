import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

/**
 * Hash a password using scrypt
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verify a password against a hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  const [salt, key] = hash.split(":");
  if (!salt || !key) return false;

  const hashedBuffer = scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(key, "hex");

  try {
    return timingSafeEqual(hashedBuffer, keyBuffer);
  } catch {
    return false;
  }
}
