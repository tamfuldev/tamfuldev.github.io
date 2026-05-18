export const cryptoSymbols = [
    "BTCUSDT",
    "ETHUSDT",
    "BNBUSDT",
    "SOLUSDT",
    "PAXGUSDT",
    "ADAUSDT",
    "AVAXUSDT",
    "DOGEUSDT",
    "LINKUSDT",
    "SUIUSDT",
    "NEARUSDT",
    "LTCUSDT",
    "SHIBUSDT",
    "PEPEUSDT",
    "BCHUSDT",
    "UNIUSDT",
];

const cryptoNames = {
    ADA: "Cardano",
    AVAX: "Avalanche",
    BCH: "Bitcoin Cash",
    BNB: "BNB",
    BTC: "Bitcoin",
    DOGE: "Dogecoin",
    ETH: "Ethereum",
    LINK: "Chainlink",
    LTC: "Litecoin",
    NEAR: "Near Protocol",
    PAXG: "PAX Gold",
    PEPE: "Pepe",
    SHIB: "Shiba Inu",
    SOL: "Solana",
    SUI: "Sui",
    UNI: "Uniswap",
};

export const getTradeUrl = (symbol) => {
    const baseSymbol = String(symbol || "")
        .replace("/USDT", "")
        .replace("USDT", "")
        .trim()
        .toUpperCase();

    return `https://www.binance.com/vi/trade/${baseSymbol}_USDT?type=spot`;
};

export const formatCryptoPrice = (price) => {
    const numericPrice = Number(price) || 0;

    if (numericPrice >= 1) {
        return numericPrice.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }

    return numericPrice.toFixed(6);
};

export const fetchBinanceTickers = async (symbols = cryptoSymbols) => {
    const query = encodeURIComponent(JSON.stringify(symbols));
    const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=${query}`);

    if (!response.ok) {
        throw new Error(`Binance API error: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
        throw new Error("Unexpected Binance API response");
    }

    return data.map((item) => {
        const apiSymbol = item.symbol;
        const symbol = apiSymbol.replace(/USDT$/i, "");

        return {
            apiSymbol,
            change: Number(item.priceChangePercent) || 0,
            name: cryptoNames[symbol] || symbol,
            pair: `${symbol}/USDT`,
            price: Number(item.lastPrice) || 0,
            symbol,
            volume: Number(item.quoteVolume) || 0,
        };
    });
};
