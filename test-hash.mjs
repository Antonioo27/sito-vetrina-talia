import crypto from "crypto";

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, hash) {
  const [salt, key] = hash.split(":");
  if (!salt || !key) return false;

  const hashedBuffer = crypto.scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(key, "hex");

  try {
    return crypto.timingSafeEqual(hashedBuffer, keyBuffer);
  } catch {
    return false;
  }
}

// Test
const testPassword = "Admin123!";
const hashed = hashPassword(testPassword);

console.log("Original password:", testPassword);
console.log("Hashed:", hashed);
console.log("Verification result:", verifyPassword(testPassword, hashed));
console.log("Wrong password verification:", verifyPassword("WrongPassword", hashed));
