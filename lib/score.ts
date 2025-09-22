import { prisma } from './prisma';
import { overlapRatio } from './timebits';

const W_TAG = 0.5;
const W_TIME = 0.2;
const W_PRICE = 0.2;
const W_PERF = 0.1;

export const jaccard = (a: string[], b: string[]): number => {
  const setA = new Set(a);
  const setB = new Set(b);
  if (setA.size === 0 && setB.size === 0) return 0;
  let intersection = 0;
  setA.forEach((value) => {
    if (setB.has(value)) intersection += 1;
  });
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
};

export const priceFit = (rate: number | null | undefined, min: number, max: number): number => {
  if (!rate) return 0.5;
  if (rate >= min && rate <= max) return 1;
  const diff = rate < min ? min - rate : rate - max;
  const range = max - min || min;
  const penalty = Math.min(diff / (range || 1), 1);
  return Math.max(0, 1 - penalty);
};

export const normalizedRating = (avg: number | null | undefined, count: number | null | undefined): number => {
  if (!avg || !count) return 0.3;
  const capped = Math.min(avg, 5);
  return (capped / 5) * Math.min(count / 10, 1);
};

export const matchCandidates = async (taskId: string) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      taskTags: true,
      owner: true
    }
  });
  if (!task) return [];

  const taskTagIds = task.taskTags.map((tag) => tag.tagId);

  const users = await prisma.user.findMany({
    where: { id: { not: task.ownerId } },
    include: {
      userTags: true
    }
  });

  const scores = users.map((user) => {
    const userTagIds = user.userTags.map((tag) => tag.tagId);
    const tagScore = jaccard(userTagIds, taskTagIds);
    const timeScore = overlapRatio(user.availability || null, task.scheduleBits || null);
    const priceScore = priceFit(user.hourlyRate ?? null, task.budgetMin, task.budgetMax);
    const perfScore = normalizedRating(user.ratingAvg ?? null, user.ratingCount ?? null);
    const score = tagScore * W_TAG + timeScore * W_TIME + priceScore * W_PRICE + perfScore * W_PERF;
    return {
      user,
      score
    };
  });

  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map(({ user, score }) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      ratingAvg: user.ratingAvg,
      ratingCount: user.ratingCount,
      hourlyRate: user.hourlyRate,
      score
    }));
};
