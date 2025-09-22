import { PrismaClient } from '@prisma/client';

import { seedTags } from '../lib/tags';
import { encodeAvailability } from '../lib/timebits';

const prisma = new PrismaClient();

async function main() {
  await prisma.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: { name: 'USER' }
  });
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN' }
  });

  for (const tag of seedTags) {
    await prisma.tag.upsert({
      where: { id: tag.id },
      update: { label: tag.label, aliases: tag.aliases, type: tag.type },
      create: { id: tag.id, label: tag.label, aliases: tag.aliases, type: tag.type }
    });
  }

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'GameQuest Admin',
      languages: ['en'],
      games: ['League of Legends'],
      roles: { connect: { id: adminRole.id } }
    }
  });

  await prisma.user.update({
    where: { id: admin.id },
    data: { roles: { connect: { name: 'USER' } } }
  });

  const usersData = [
    {
      email: 'ashe@example.com',
      name: 'Ashe Marksman',
      languages: ['en'],
      games: ['League of Legends'],
      hourlyRate: 2500,
      availability: encodeAvailability([18, 19, 20, 21, 22, 23, 24, 25]),
      tags: ['game.lol', 'role.support', 'lang.en']
    },
    {
      email: 'lee@example.com',
      name: 'Lee Jungle',
      languages: ['en', 'zh'],
      games: ['League of Legends'],
      hourlyRate: 3000,
      availability: encodeAvailability([30, 31, 32, 60, 61, 62]),
      tags: ['game.lol', 'mode.ranked', 'lang.zh']
    },
    {
      email: 'sona@example.com',
      name: 'Sona Support',
      languages: ['en'],
      games: ['League of Legends'],
      hourlyRate: 2000,
      availability: encodeAvailability([80, 81, 82, 83]),
      tags: ['game.lol', 'role.support', 'service.coach']
    },
    {
      email: 'xin@example.com',
      name: 'Xin Zhao',
      languages: ['zh'],
      games: ['League of Legends'],
      hourlyRate: 1800,
      availability: encodeAvailability([100, 101, 102, 103]),
      tags: ['game.lol', 'mode.ranked', 'lang.zh']
    },
    {
      email: 'lux@example.com',
      name: 'Lux Coach',
      languages: ['en'],
      games: ['League of Legends', 'Valorant'],
      hourlyRate: 3500,
      availability: encodeAvailability([120, 121, 122, 140, 141]),
      tags: ['service.coach', 'game.lol', 'lang.en']
    }
  ];

  const users = [];
  for (const data of usersData) {
    const user = await prisma.user.upsert({
      where: { email: data.email },
      update: {},
      create: {
        email: data.email,
        name: data.name,
        languages: data.languages,
        games: data.games,
        hourlyRate: data.hourlyRate,
        availability: data.availability,
        roles: { connect: { name: 'USER' } },
        userTags: {
          create: data.tags.map((tagId) => ({ tag: { connect: { id: tagId } } }))
        }
      }
    });
    users.push(user);
  }

  const [owner] = users;

  await prisma.message.deleteMany();
  await prisma.order.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.task.deleteMany();

  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        ownerId: owner.id,
        game: 'League of Legends',
        title: 'Climb to Platinum',
        description: 'Need duo partner to reach Platinum before season ends.',
        budgetMin: 5000,
        budgetMax: 8000,
        languageReq: ['en'],
        scheduleBits: encodeAvailability([18, 19, 20, 21]),
        taskTags: {
          create: ['game.lol', 'mode.ranked', 'lang.en'].map((tagId) => ({ tagId }))
        }
      }
    }),
    prisma.task.create({
      data: {
        ownerId: owner.id,
        game: 'League of Legends',
        title: 'Support coaching session',
        description: 'One hour review of support gameplay with VOD analysis.',
        budgetMin: 3000,
        budgetMax: 5000,
        languageReq: ['en'],
        scheduleBits: encodeAvailability([80, 81, 82]),
        taskTags: {
          create: ['game.lol', 'service.coach', 'role.support'].map((tagId) => ({ tagId }))
        }
      }
    }),
    prisma.task.create({
      data: {
        ownerId: owner.id,
        game: 'League of Legends',
        title: 'Mandarin duo sessions',
        description: 'Looking for Mandarin-speaking partner for ranked grind.',
        budgetMin: 4000,
        budgetMax: 7000,
        languageReq: ['zh'],
        scheduleBits: encodeAvailability([100, 101, 102]),
        taskTags: {
          create: ['game.lol', 'mode.ranked', 'lang.zh'].map((tagId) => ({ tagId }))
        }
      }
    })
  ]);

  console.log(`Seeded ${tasks.length} tasks, ${users.length + 1} users including admin.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
