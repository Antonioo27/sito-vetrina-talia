import { db } from "~/server/db";
import { hashPassword } from "~/server/auth/password";

async function createAdmin() {
  try {
    const email = "admin@talia.it";
    const password = "Admin123!";

    // Check if admin user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`User ${email} already exists`);
      return;
    }

    // Create admin user
    const hashedPassword = hashPassword(password);
    const adminUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: "Admin",
        lastName: "Talia",
        isAdmin: true,
      },
    });

    console.log("Admin user created successfully!");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("User ID:", adminUser.id);
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    process.exit(0);
  }
}

createAdmin();
