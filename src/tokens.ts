export interface TokenInfo {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoUrl?: string;
}

export const TOKENS: TokenInfo[] = [
  { symbol: "USDT", name: "Tether USD", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6 },
  { symbol: "USDC", name: "USD Coin", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", decimals: 6 },
  { symbol: "DAI", name: "Dai Stablecoin", address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", decimals: 18 },
  { symbol: "WETH", name: "Wrapped Ether", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", decimals: 18 },
  { symbol: "WBTC", name: "Wrapped BTC", address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", decimals: 8 },
  { symbol: "LINK", name: "Chainlink", address: "0x514910771AF9Ca656af840dff83E8264EcF986CA", decimals: 18 },
  { symbol: "UNI", name: "Uniswap", address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", decimals: 18 },
  { symbol: "AAVE", name: "Aave", address: "0x7Fc869C30B8161f647750802261204640428452e", decimals: 18 },
  { symbol: "MATIC", name: "Polygon", address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0", decimals: 18 },
  { symbol: "SHIB", name: "Shiba Inu", address: "0x95aD61b0a150d79219dcf64E1E6Cc01f0B64C4cE", decimals: 18 },
  { symbol: "PEPE", name: "Pepe", address: "0x6982508145454Ce325dDbE47a25d4ec3d2311933", decimals: 18 },
  { symbol: "DOGE", name: "Dogecoin", address: "0x4200000000000000000000000000000000000042", decimals: 18 }, // Placeholder for mainnet if needed
  { symbol: "BONK", name: "Bonk", address: "0x0000000000000000000000000000000000000000", decimals: 18 }, // Placeholder
  { symbol: "MAGA", name: "MAGA", address: "0x576e2BeD8F7b46D34016198911CdF988fFf9ad37", decimals: 18 },
  { symbol: "TRUMP", name: "MAGA TRUMP", address: "0x38e6A6836e33E75A6E890787BC3619586940Ba7E", decimals: 18 }
];
