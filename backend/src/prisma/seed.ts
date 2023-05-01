import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createUsers() {
  await prisma.user.createMany({
    data: [
      {
        id: "bb7d87d5-dba5-4461-b462-e577a210e827",
        name: "John Doe",
        avatar: "https://example.com/avatar1.jpg",
        status: "ONLINE",
      },
      {
        id: "4e0e94c6-f526-4346-b2f5-b51c7ea9ba5c",
        name: "Jane Smith",
        avatar: "https://example.com/avatar2.jpg",
        status: "OFFLINE",
      },
    ],
  });
}

async function createGames() {
  await prisma.game.createMany({
    data: [
      {
        playerOneId: "bb7d87d5-dba5-4461-b462-e577a210e827",
        playerOneScore: 10,
        playerTwoId: "4e0e94c6-f526-4346-b2f5-b51c7ea9ba5c",
        playerTwoScore: 5,

        socketId: "socketId",
      },
      {
        playerOneId: "bb7d87d5-dba5-4461-b462-e577a210e827",
        playerOneScore: 0,
        playerTwoId: "4e0e94c6-f526-4346-b2f5-b51c7ea9ba5c",
        playerTwoScore: 5,

        socketId: "socketId",
      },
      {
        playerOneId: "4e0e94c6-f526-4346-b2f5-b51c7ea9ba5c",
        playerOneScore: 2,
        playerTwoId: "bb7d87d5-dba5-4461-b462-e577a210e827",
        playerTwoScore: 4,

        socketId: "socketId",
      },
    ],
  });
}

async function main() {
  createUsers().then(async () => {
    await createGames();
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
