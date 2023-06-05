interface LerpParameters {
  value1: number;
  value2: number;
  t: number;
}

export const lerp = ({ value1, value2, t }: LerpParameters): number => {
  return (1 - t) * value1 + t * value2;
};

export const clamp = (min: number, value: number, max: number): number => {
  return Math.max(min, Math.min(value, max));
};
