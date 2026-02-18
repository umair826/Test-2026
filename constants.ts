
import { Token, Pool } from './types';

export const TOKENS: Token[] = [
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', priceInUSD: 2500 },
  { id: 'usdc', symbol: 'USDC', name: 'USD Coin', priceInUSD: 1 },
  { id: 'btc', symbol: 'WBTC', name: 'Wrapped Bitcoin', priceInUSD: 65000 },
  { id: 'sol', symbol: 'SOL', name: 'Solana', priceInUSD: 140 },
];

export const INITIAL_POOL: Pool = {
  tokenX: TOKENS[0], // ETH
  tokenY: TOKENS[1], // USDC
  reserveX: 1000,    // 1000 ETH
  reserveY: 2500000, // 2.5M USDC
  fee: 0.003,
};
