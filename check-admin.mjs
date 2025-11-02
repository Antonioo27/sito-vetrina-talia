import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

async function main() {
  const db = new PrismaClient();

  try {
    const users = await db.user.findMany({
      select: { id: true, email: true, isAdmin: true, password: true }
    });

    console.log("=== USERS IN DATABASE ===");
    users.forEach(user => {
      console.log(`Email: ${user.email}`);
      console.log(`Admin: ${user.isAdmin}`);
      console.log(`Has password hash: ${!!user.password}`);
      if (user.password) {
        console.log(`Password hash (first 50 chars): ${user.password.substring(0, 50)}...`);
      }
      console.log("---");
    });

    // Test password verification
    const admin = users.find(u => u.email === "admin@talia.it");

    if (admin && admin.password) {
      console.log("\n=== PASSWORD VERIFICATION TEST ===");
      console.log(`Admin user found: ${admin.email}`);

      // Try to verify the test password
      const testPassword = "Admin123!";
      const [saltHex, hashHex] = admin.password.split(":");

      if (saltHex && hashHex) {
        // Convert salt from hex string to buffer
        const salt = Buffer.from(saltHex, "hex");

        // Hash the test password with the same salt
        const testHash = crypto.scryptSync(testPassword, salt, 64);
        const keyBuffer = Buffer.from(hashHex, "hex");

        // Compare using timing-safe comparison
        let passwordMatch = false;
        try {
          passwordMatch = crypto.timingSafeEqual(testHash, keyBuffer);
        } catch {
          passwordMatch = false;
        }

        console.log(`Test password "Admin123!" matches: ${passwordMatch}`);

        if (!passwordMatch) {
          console.log("\n⚠️  Password doesn't match!");
          console.log(`Test hash (first 20 bytes hex): ${testHash.toString("hex").substring(0, 40)}...`);
          console.log(`Stored hash (first 20 bytes): ${hashHex.substring(0, 40)}...`);
        }
      } else {
        console.log(`Invalid password format: ${admin.password}`);
      }
    } else {
      console.log("\n⚠️  No admin user found with email admin@talia.it");
      console.log("Available users:", users.map(u => u.email));
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await db.$disconnect();
  }
}

main();
