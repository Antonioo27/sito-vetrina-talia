import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/server/auth/password";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...\n");

  try {
    // Delete existing admin if exists
    const existingAdmin = await db.user.findUnique({
      where: { email: "admin@talia.it" },
    });

    if (existingAdmin) {
      console.log("🗑️  Removing existing admin user...");
      await db.user.delete({
        where: { id: existingAdmin.id },
      });
      console.log("✅ Existing admin removed\n");
    }

    // Create new admin
    console.log("👤 Creating admin user...");
    const hashedPassword = hashPassword("Admin123!");
    console.log("🔐 Password hashed successfully");

    const admin = await db.user.create({
      data: {
        id: "admin-1",
        email: "admin@talia.it",
        firstName: "Admin",
        lastName: "Talia",
        password: hashedPassword,
        isAdmin: true,
        emailVerified: new Date(),
      },
    });

    console.log("✅ Admin user created successfully!\n");
    console.log("📋 Admin Details:");
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name: ${admin.firstName} ${admin.lastName}`);
    console.log(`   Admin: ${admin.isAdmin}`);
    console.log(`   ID: ${admin.id}\n`);

    // Create or skip demo user
    console.log("👤 Checking demo user...");
    const existingDemoUser = await db.user.findUnique({
      where: { email: "demo@example.com" },
    });

    let demoUser;
    if (existingDemoUser) {
      console.log("ℹ️  Demo user already exists, skipping creation\n");
      demoUser = existingDemoUser;
    } else {
      console.log("Creating demo user...");
      const demoHashedPassword = hashPassword("Demo123!");

      demoUser = await db.user.create({
        data: {
          id: "user-1",
          email: "demo@example.com",
          firstName: "Demo",
          lastName: "User",
          password: demoHashedPassword,
          isAdmin: false,
          emailVerified: new Date(),
        },
      });

      console.log("✅ Demo user created successfully!\n");
    }

    console.log("📋 Demo User Details:");
    console.log(`   Email: ${demoUser.email}`);
    console.log(`   Name: ${demoUser.firstName} ${demoUser.lastName}`);
    console.log(`   Admin: ${demoUser.isAdmin}`);
    console.log(`   ID: ${demoUser.id}\n`);

    // Create demo products
    console.log("🛏️  Creating demo products...");

    const products = [
      {
        name: "Materasso Comfort Plus",
        description: "Materasso ergonomico in memory foam con supporto ortopedico",
        price: 899.99,
        imageUrl: "https://images.unsplash.com/photo-1631049307038-da0ec36d9ec1?w=500",
      },
      {
        name: "Materasso Premium Night",
        description: "Materasso lussuoso con strati di lattice naturale e cotone organico",
        price: 1299.99,
        imageUrl: "https://images.unsplash.com/photo-1578607318260-cb6a21b1bc8d?w=500",
      },
      {
        name: "Materasso Basic Classic",
        description: "Materasso affidabile con molle insacchettate e supporto medio",
        price: 599.99,
        imageUrl: "https://images.unsplash.com/photo-1629428073390-c5cbbfb6f7e1?w=500",
      },
    ];

    for (const product of products) {
      await db.product.create({
        data: {
          id: `product-${Date.now()}-${Math.random()}`,
          ...product,
        },
      });
    }

    console.log(`✅ Created ${products.length} demo products\n`);

    // Create default banner
    console.log("🖼️  Creating default banner...");

    const existingBanner = await db.banner.findFirst({
      where: { active: true },
    });

    if (existingBanner) {
      console.log("Banner attivo già presente, skipping banner creation");
    } else {
      await db.banner.create({
        data: {
          imageUrl: "https://images.unsplash.com/photo-1633614122556-11b3c4b1289d?w=1200&h=400&fit=crop",
          altText: "Talia Materassi - Materassi di Qualità Premium",
          active: true,
        },
      });
      console.log("✅ Default banner created successfully!\n");
    }

    console.log("🎉 Database seeding completed successfully!\n");
    console.log("🔑 Login Credentials:");
    console.log("   Admin: admin@talia.it / Admin123!");
    console.log("   Demo:  demo@example.com / Demo123!\n");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

main();
