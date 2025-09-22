import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { normalizeTagList } from '@/lib/tags';

const schema = z.object({
  name: z.string().optional(),
  timezone: z.string().optional(),
  languages: z.array(z.string()).optional(),
  games: z.array(z.string()).optional(),
  hourlyRate: z.number().int().optional(),
  availability: z.string().length(168).optional(),
  tags: z.array(z.string()).optional()
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      userTags: true
    }
  });

  return NextResponse.json(user);
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const tags = parsed.data.tags ? normalizeTagList(parsed.data.tags) : undefined;

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      timezone: parsed.data.timezone,
      languages: parsed.data.languages,
      games: parsed.data.games,
      hourlyRate: parsed.data.hourlyRate,
      availability: parsed.data.availability,
      userTags: tags
        ? {
            deleteMany: {},
            create: tags.map((tagId) => ({
              tag: {
                connectOrCreate: {
                  where: { id: tagId },
                  create: { id: tagId, label: tagId, type: 'custom', aliases: [] }
                }
              }
            }))
          }
        : undefined
    },
    include: { userTags: true }
  });

  return NextResponse.json(user);
}
