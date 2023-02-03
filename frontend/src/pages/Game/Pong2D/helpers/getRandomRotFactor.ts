const MIN_ROT_FACTOR = -0.02;
const MAX_ROT_FACTOR = 0.02;

export const getRandomRotFactor = (): number => {
  return Math.random() * (MAX_ROT_FACTOR - MIN_ROT_FACTOR) + MIN_ROT_FACTOR;
};
