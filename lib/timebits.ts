export const HOURS_PER_WEEK = 168;

export const emptyAvailability = () => '0'.repeat(HOURS_PER_WEEK);

export const encodeAvailability = (hours: number[]): string => {
  const bits = Array(HOURS_PER_WEEK).fill('0');
  hours.forEach((hour) => {
    if (hour >= 0 && hour < HOURS_PER_WEEK) {
      bits[hour] = '1';
    }
  });
  return bits.join('');
};

export const decodeAvailability = (bits?: string | null): number[] => {
  if (!bits || bits.length !== HOURS_PER_WEEK) return [];
  const result: number[] = [];
  bits.split('').forEach((bit, idx) => {
    if (bit === '1') {
      result.push(idx);
    }
  });
  return result;
};

export const overlapRatio = (userBits?: string | null, taskBits?: string | null): number => {
  if (!userBits || !taskBits || userBits.length !== HOURS_PER_WEEK || taskBits.length !== HOURS_PER_WEEK) {
    return 0;
  }
  let intersection = 0;
  let union = 0;
  for (let i = 0; i < HOURS_PER_WEEK; i += 1) {
    const u = userBits[i] === '1';
    const t = taskBits[i] === '1';
    if (u || t) union += 1;
    if (u && t) intersection += 1;
  }
  if (union === 0) return 0;
  return intersection / union;
};
