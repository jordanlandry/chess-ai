// Estimated Elos for a given time control

// Format is { [key: timeLimitMs]: elo }
// TODO: Get more accurate values
export const estimatedElos = {
  500: 1000,
  1000: 1200,
  2000: 1400,
  3000: 1600,
  4000: 1800,
  10000: 2000,
} as { [key: number]: number };
