interface LerpParameters {
  value1: number;
  value2: number;
  t: number;
}

export const lerp = ({ value1, value2, t }: LerpParameters): number => {
  return (1 - t) * value1 + t * value2;
};
