import { prisma } from "./src/lib/prisma.ts";

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, username: true, password: true, status: true }
  });
  console.log("Users in DB:", JSON.stringify(users, null, 2));
  await prisma.$disconnect();
}
main().catch(console.error);
