import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import { hashPassword } from "../src/utils/password";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.DEMO_ADMIN_EMAIL;
  const password = process.env.DEMO_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("DEMO_ADMIN_EMAIL and DEMO_ADMIN_PASSWORD are required for seeding");
  }

  const hashedPassword = await hashPassword(password);
  await prisma.user.upsert({
    where: { email },
    update: { name: "CityCare Admin", password: hashedPassword, role: Role.ADMIN, isActive: true, deletedAt: null },
    create: { name: "CityCare Admin", email, password: hashedPassword, role: Role.ADMIN },
  });

  console.log(`Demo admin ready: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
