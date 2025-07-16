const fontWeights = {
  Thin: 100,
  Light: 300,
  Regular: 400,
  Medium: 500,
  SemiBold: 600,
  Bold: 700,
  ExtraBold: 800,
} as const;

export type FontWeights = typeof fontWeights;
export default fontWeights;
