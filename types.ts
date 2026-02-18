
export interface Token {
  id: string;
  symbol: string;
  name: string;
  priceInUSD: number;
}

export interface Pool {
  tokenX: Token;
  tokenY: Token;
  reserveX: number;
  reserveY: number;
  fee: number; // e.g., 0.003 for 0.3%
}

export interface SwapResult {
  inputAmount: number;
  outputAmount: number;
  priceImpact: number;
  executionPrice: number;
  feePaid: number;
}

export interface LiquidityStats {
  tvl: number;
  priceX: number;
  priceY: number;
  impermanentLoss: number;
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}
