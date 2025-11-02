const { PrismaClient } = require("@prisma/client");

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
      console.log("---");
    });

    // Test password verification
    const crypto = require("crypto");
    const admin = users.find(u => u.email === "admin@talia.it");

    if (admin && admin.password) {
      console.log("\n=== PASSWORD VERIFICATION TEST ===");
      console.log(`Admin user found: ${admin.email}`);
      console.log(`Password hash: ${admin.password.substring(0, 50)}...`);

      // Try to verify the test password
      const testPassword = "Admin123!";
      const [salt, hash] = admin.password.split(":");
      if (salt && hash) {
        const testHash = crypto.scryptSync(testPassword, salt, 32).toString("hex");
        const passwordMatch = testHash === hash;
        console.log(`Test password match: ${passwordMatch}`);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await db.$disconnect();
  }
}

main();
