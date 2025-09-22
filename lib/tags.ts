export type SeedTag = {
  id: string;
  type: string;
  label: string;
  aliases: string[];
};

export const seedTags: SeedTag[] = [
  { id: 'game.lol', type: 'game', label: 'League of Legends', aliases: ['lol', 'league', '英雄联盟'] },
  { id: 'role.support', type: 'role', label: 'Support', aliases: ['support', 'sup'] },
  { id: 'mode.ranked', type: 'mode', label: 'Ranked Grind', aliases: ['ranked', '排位'] },
  { id: 'lang.en', type: 'language', label: 'English', aliases: ['english', 'en'] },
  { id: 'lang.zh', type: 'language', label: '中文', aliases: ['zh', 'chinese', '汉语'] },
  { id: 'service.coach', type: 'service', label: 'Coaching', aliases: ['coach', 'coaching'] }
];

const aliasMap = seedTags.reduce<Record<string, SeedTag>>((acc, tag) => {
  acc[tag.id.toLowerCase()] = tag;
  tag.aliases.forEach((alias) => {
    acc[alias.toLowerCase()] = tag;
  });
  return acc;
}, {});

export const normalizeTagInput = (value: string): string | null => {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return null;
  const match = aliasMap[trimmed];
  return match ? match.id : trimmed;
};

export const normalizeTagList = (values: string[]): string[] => {
  const unique = new Set<string>();
  values.forEach((value) => {
    const normalized = normalizeTagInput(value);
    if (normalized) {
      unique.add(normalized);
    }
  });
  return Array.from(unique.values());
};
