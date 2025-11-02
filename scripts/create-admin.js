import { PrismaClient } from "@prisma/client";
import { scryptSync, randomBytes } from "crypto";

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  try {
    const email = "admin@talia.it";
    const password = "Admin123!";

    // Check if admin user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`✓ User ${email} already exists`);
      if (existingUser.isAdmin) {
        console.log(`✓ User is admin`);
      } else {
        console.log(`⚠ User exists but is NOT admin. Updating...`);
        await prisma.user.update({
          where: { email },
          data: { isAdmin: true },
        });
        console.log(`✓ User updated to admin`);
      }
      return;
    }

    // Create admin user
    const hashedPassword = hashPassword(password);
    const adminUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: "Admin",
        lastName: "Talia",
        isAdmin: true,
      },
    });

    console.log("\n✓ Admin user created successfully!\n");
    console.log("═══════════════════════════════════════");
    console.log("Email:    " + email);
    console.log("Password: " + password);
    console.log("═══════════════════════════════════════\n");
  } catch (error) {
    console.error("✗ Error creating admin user:", error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();
