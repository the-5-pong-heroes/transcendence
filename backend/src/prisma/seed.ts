import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.createMany({
    data: [
      {
        name: "John Doe",
        avatar: "https://example.com/avatar1.jpg",
        status: "ONLINE",
        last_login: new Date(),
      },
      {
        name: "Jane Smith",
        avatar: "https://example.com/avatar2.jpg",
        status: "OFFLINE",
        last_login: new Date(),
      },
    ],
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
