import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const db = new PrismaClient();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  try {
    // Delete existing admin
    await db.user.deleteMany({
      where: { email: "admin@talia.it" }
    });

    // Create admin with manually hashed password
    const hashedPassword = hashPassword("Admin123!");

    console.log("Creating admin with password hash:", hashedPassword.substring(0, 50) + "...");

    const admin = await db.user.create({
      data: {
        id: "admin-1",
        email: "admin@talia.it",
        firstName: "Admin",
        lastName: "Talia",
        password: hashedPassword,
        isAdmin: true,
        emailVerified: new Date(),
      }
    });

    console.log("✅ Admin created successfully!");
    console.log("Email:", admin.email);
    console.log("Admin:", admin.isAdmin);
    console.log("ID:", admin.id);
    console.log("\n🔑 Login with: admin@talia.it / Admin123!");

    // Verify it works
    const [salt, hash] = hashedPassword.split(":");
    const testHash = crypto.scryptSync("Admin123!", salt, 64);
    const keyBuffer = Buffer.from(hash, "hex");
    const matches = crypto.timingSafeEqual(testHash, keyBuffer);
    console.log("Password verification test:", matches ? "✅ PASSED" : "❌ FAILED");

  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await db.$disconnect();
  }
}

main();
