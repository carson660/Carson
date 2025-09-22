import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { normalizeTagList } from '@/lib/tags';

const createTaskSchema = z.object({
  game: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  budgetMin: z.number().int().nonnegative(),
  budgetMax: z.number().int().nonnegative(),
  languageReq: z.array(z.string()).default([]),
  scheduleBits: z.string().optional(),
  tags: z.array(z.string()).default([])
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const game = searchParams.get('game');
  const language = searchParams.get('language');
  const minBudget = searchParams.get('minBudget');
  const maxBudget = searchParams.get('maxBudget');
  const tags = searchParams.get('tags');
  const minHours = Number(searchParams.get('minHours') || '0');
  const query = searchParams.get('q');

  const where: any = {};
  if (game) {
    where.game = { contains: game, mode: 'insensitive' };
  }
  if (query) {
    where.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } }
    ];
  }
  if (language) {
    where.languageReq = { has: language };
  }
  if (minBudget) {
    where.budgetMax = { gte: Number(minBudget) };
  }
  if (maxBudget) {
    where.budgetMin = { lte: Number(maxBudget) };
  }
  if (tags) {
    const tagList = tags.split(',').map((tag) => tag.trim()).filter(Boolean);
    if (tagList.length > 0) {
      where.taskTags = { some: { tagId: { in: tagList } } };
    }
  }

  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      owner: true,
      taskTags: true
    }
  });

  const filtered =
    Number.isNaN(minHours) || minHours <= 0
      ? tasks
      : tasks.filter((task) => {
          if (!task.scheduleBits) return false;
          const hours = task.scheduleBits.split('').filter((bit) => bit === '1').length;
          return hours >= minHours;
        });

  return NextResponse.json(filtered);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();
  const parsed = createTaskSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.budgetMin > parsed.data.budgetMax) {
    return NextResponse.json({ error: 'budgetMin cannot exceed budgetMax' }, { status: 400 });
  }

  const tags = normalizeTagList(parsed.data.tags);

  const task = await prisma.task.create({
    data: {
      ownerId: session.user.id,
      game: parsed.data.game,
      title: parsed.data.title,
      description: parsed.data.description,
      budgetMin: parsed.data.budgetMin,
      budgetMax: parsed.data.budgetMax,
      languageReq: parsed.data.languageReq,
      scheduleBits: parsed.data.scheduleBits,
      taskTags: {
        create: tags.map((tagId) => ({
          tag: {
            connectOrCreate: {
              where: { id: tagId },
              create: { id: tagId, label: tagId, type: 'custom', aliases: [] }
            }
          }
        }))
      }
    },
    include: {
      taskTags: true
    }
  });

  return NextResponse.json(task, { status: 201 });
}
