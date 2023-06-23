import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedUsers() {
  /*********  CREATE USERS  *********/
  try {
    const user1 = await prisma.user.create({
      data: {
        name: "John Doe",
        status: "ONLINE",
        auth: {
          create: {
            email: "jdoe@student.42.fr",
            accessToken: "86f0a7f5c714d5987a3e08dc12e0ef44288d67887a1a1cbb065ff7899e7d6a4a",
            twoFAactivated: false,
          },
        },
      },
    });

    const user2 = await prisma.user.create({
      data: {
        name: "Jane Smith",
        status: "OFFLINE",
        auth: {
          create: {
            isRegistered: true,
            email: "jsmith@student.42.fr",
            accessToken: "e1a3cd1671b2360bfc87b5f5f8ab77c715a3a8531e0e2f0eab65c6b1d6f22723",
            twoFAactivated: false,
          },
        },
      },
    });

    const user3 = await prisma.user.create({
      data: {
        name: "Peter Jackson",
        status: "OFFLINE",
        auth: {
          create: {
            isRegistered: true,
            email: "pejackson@student.42.fr",
            accessToken: "9e1f85f61f790e5d01ed6c940ff3b36c9a260e4c03df40e5f8a2d6990b33c663",
            twoFAactivated: true,
            twoFASecret: "827540",
          },
        },
      },
    });

    const user4 = await prisma.user.create({
      data: {
        name: "William Wilson",
        status: "OFFLINE",
        auth: {
          create: {
            isRegistered: true,
            email: "wwilson@student.42.fr",
            accessToken: "42f11fd4d411f41c1b41395158a090eb2a83a43dd5a7416f8996b5a7eaa5a85a",
            twoFAactivated: false,
          },
        },
      },
    });

    const user5 = await prisma.user.create({
      data: {
        name: "Olivia Davis",
        status: "ONLINE",
        auth: {
          create: {
            isRegistered: true,
            email: "odavis@student.42.fr",
            accessToken: "a9ff9e75544854d8f0cbdb5e6356b07ae826cfae8c192c47a06a6319c3f8ef6e",
            twoFAactivated: false,
          },
        },
      },
    });

    const users = await prisma.user.count();

    console.log("Users seeded:", users);
  } catch (error) {
    console.error("Error seeding users:", error);
  }
}

/******* CREATE FRIENDSHIPS ********/

async function seedFriendships() {
  try {
    const users = await prisma.user.findMany();

    const friendships = await prisma.friendship.createMany({
      data: [
        { userId: users[1].id, addedById: users[2].id },
        { userId: users[2].id, addedById: users[1].id },
        { userId: users[2].id, addedById: users[3].id },
        { userId: users[4].id, addedById: users[3].id },
      ],
    });

    console.log("Friendships seeded:", friendships);
  } catch (error) {
    console.error("Error seeding friendships:", error);
  }
}
/*********** CREATE GAMES ***********/

async function seedGames() {
  try {
    const users = await prisma.user.findMany();

    const games = await prisma.game.createMany({
      data: [
        {
          startedAt: new Date(),
          status: "FINISHED",
          playerOneId: users[1].id,
          playerOneScore: 0,
          playerTwoId: users[2].id,
          playerTwoScore: 5,
        },
        {
          startedAt: new Date(),
          status: "FINISHED",
          playerOneId: users[3].id,
          playerOneScore: 5,
          playerTwoId: users[4].id,
          playerTwoScore: 2,
        },
        {
          startedAt: new Date(),
          status: "WAITING",
          playerOneId: users[2].id,
          playerOneScore: 0,
          playerTwoScore: 0,
        },
        {
          startedAt: new Date(),
          status: "FINISHED",
          playerOneId: users[4].id,
          playerOneScore: 5,
          playerTwoScore: 4,
        },
      ],
    });
    console.log("Games seeded:", games);
  } catch (error) {
    console.error("Error seeding games:", error);
  }
}

async function seedChannels() {
  try {
    // Create channels
    const channels = await prisma.channel.createMany({
      data: [
        { name: "General", type: "PUBLIC" },
        { name: "Public Channel", type: "PUBLIC" },
        { name: "Private Channel", type: "PRIVATE", password: "123456" },
        { name: "Protected Channel", type: "PROTECTED", password: "789012" },
      ],
    });

    console.log("Channels seeded:", channels);
  } catch (error) {
    console.error("Error seeding channels:", error);
  }
}

async function seedChannelUsers() {
  try {
    // Get users
    const users = await prisma.user.findMany();

    // Get channels
    const channels = await prisma.channel.findMany();

    // Create channel users
    const channelUsers = await prisma.channelUser.createMany({
      data: [
        { userId: users[0].id, channelId: channels[0].id, role: "OWNER", isAuthorized: true },
        { userId: users[1].id, channelId: channels[0].id, role: "USER", isAuthorized: true },
        { userId: users[2].id, channelId: channels[1].id, role: "USER", isAuthorized: true },
        { userId: users[3].id, channelId: channels[2].id, role: "USER", isAuthorized: true },
        { userId: users[3].id, channelId: channels[3].id, role: "OWNER", isAuthorized: true },
      ],
    });

    console.log("Channel users seeded:", channelUsers);
  } catch (error) {
    console.error("Error seeding channel users:", error);
  }
}

async function seedChannelBans() {
  try {
    // Get users
    const users = await prisma.user.findMany();

    // Get channels
    const channels = await prisma.channel.findMany();

    // Create channel bans
    const channelBans = await prisma.channelBan.createMany({
      data: [
        { userId: users[1].id, channelId: channels[0].id, bannedUntil: new Date() },
        { userId: users[2].id, channelId: channels[1].id, bannedUntil: new Date() },
      ],
    });

    console.log("Channel bans seeded:", channelBans);
  } catch (error) {
    console.error("Error seeding channel bans:", error);
  }
}

async function seedMessages() {
  try {
    // Get users
    const users = await prisma.user.findMany();

    // Get channels
    const channels = await prisma.channel.findMany();

    // Create messages
    const messages = await prisma.message.createMany({
      data: [
        { content: "Hello!", senderId: users[0].id, channelId: channels[0].id },
        { content: "Welcome!", senderId: users[1].id, channelId: channels[0].id },
        { content: "Private message", senderId: users[2].id, channelId: channels[1].id },
        { content: "Another message", senderId: users[1].id, channelId: channels[2].id },
        { content: "Hello everybody !", senderId: users[3].id, channelId: channels[3].id },
      ],
    });

    console.log("Messages seeded:", messages);
  } catch (error) {
    console.error("Error seeding messages:", error);
  }
}

async function seedBlocked() {
  try {
    // Get users
    const users = await prisma.user.findMany();

    // Create blocked entries
    const blocked = await prisma.blocked.createMany({
      data: [
        { userId: users[0].id, blockedUserId: users[1].id },
        { userId: users[1].id, blockedUserId: users[2].id },
      ],
    });

    console.log("Blocked seeded:", blocked);
  } catch (error) {
    console.error("Error seeding blocked:", error);
  }
}

async function main() {
  await seedUsers();
  await seedFriendships();
  await seedGames();
  await seedChannels();
  await seedChannelUsers();
  await seedChannelBans();
  await seedMessages();
  await seedBlocked();
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
