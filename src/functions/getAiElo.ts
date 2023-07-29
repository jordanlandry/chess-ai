import { estimatedElos } from "../constants/estimatedElos";

export default function getAiElo(timeLimit: number | string) {
  if (typeof timeLimit === "string") timeLimit = parseFloat(timeLimit);

  const keys = Object.keys(estimatedElos).map(Number);
  const minKey = Math.min(...keys);
  const maxKey = Math.max(...keys);

  // If the time limit is exactly one of the keys, return the elo
  if (estimatedElos[timeLimit]) return estimatedElos[timeLimit];

  // If the time limit is less than the minimum, or greater than the maximum, return the minimum or maximum elo
  if (timeLimit < minKey) return estimatedElos[minKey];
  if (timeLimit > maxKey) return estimatedElos[maxKey];

  // Find the inner keys
  let lowerKey = minKey;
  let upperKey = maxKey;

  for (const key of keys) {
    if (key <= timeLimit && key > lowerKey) lowerKey = key;
    if (key >= timeLimit && key < upperKey) upperKey = key;
  }

  // Calculate the elo per ms based on the inner keys
  const eloDifference = estimatedElos[upperKey] - estimatedElos[lowerKey];
  const msDifference = upperKey - lowerKey;
  const eloPerMs = eloDifference / msDifference;

  // Calculate the elo based on the inner keys
  const timeDifference = timeLimit - lowerKey;
  const elo = estimatedElos[lowerKey] + eloPerMs * timeDifference;

  return Math.round(elo);
}
