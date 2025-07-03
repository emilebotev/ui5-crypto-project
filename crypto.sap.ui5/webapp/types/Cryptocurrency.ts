export interface CryptoCurrency {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    fully_diluted_valuation: number | null; // Can be null
    total_volume: number;
    high_24h: number;
    low_24h: number;
    price_change_24h: number;
    price_change_percentage_24h: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number | null; // Can be null
    ath: number; // All-Time High
    ath_change_percentage: number;
    ath_date: string; // ISO date string
    atl: number; // All-Time Low
    atl_change_percentage: number;
    atl_date: string; // ISO date string
    roi: Roi | null; // Can be null
    last_updated: string; // ISO date string
}

export interface Roi {
    times: number;
    currency: string;
    percentage: number;
}