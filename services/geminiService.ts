
import { GoogleGenAI } from "@google/genai";
import { Pool, LiquidityStats } from "../types";

export const getStrategyAdvice = async (pool: Pool, stats: LiquidityStats, userQuery?: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    As a senior DeFi quant researcher, analyze the following AMM pool:
    Pool: ${pool.tokenX.symbol}/${pool.tokenY.symbol}
    Reserves: ${pool.reserveX} ${pool.tokenX.symbol} / ${pool.reserveY} ${pool.tokenY.symbol}
    Current Price of ${pool.tokenX.symbol}: ${stats.priceX} ${pool.tokenY.symbol}
    Total Value Locked: $${stats.tvl.toLocaleString()}
    
    ${userQuery ? `User specifically asked: "${userQuery}"` : "Provide a general risk assessment and liquidity provision strategy."}
    
    Focus on:
    1. Impermanent Loss risks.
    2. Capital efficiency.
    3. Rebalancing advice if the price moves 10%.
    
    Keep the response professional, concise, and technical. Use Markdown formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to fetch AI insights at this time. Please check your connection or try again later.";
  }
};
