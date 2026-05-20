import React from "react";
import {
    FiActivity,
    FiBarChart2,
    FiCopy,
    FiRefreshCw,
    FiSearch,
    FiTrendingDown,
    FiTrendingUp,
} from "react-icons/fi";
import PageFooter from "./PageFooter";
import { pick } from "../../utils/localization";
import { aboutContent, cryptoContent } from "../../data/portfolioContent";

const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3";
const YAHOO_CHART_API_BASE = "https://query1.finance.yahoo.com/v8/finance/chart";
const VNSTOCK_PROXY_URL = (process.env.REACT_APP_VNSTOCK_PROXY_URL || "").trim();

const coinAliases = {
    ADA: "cardano",
    AVAX: "avalanche-2",
    BNB: "binancecoin",
    BTC: "bitcoin",
    DOGE: "dogecoin",
    DOT: "polkadot",
    ETH: "ethereum",
    LINK: "chainlink",
    LTC: "litecoin",
    MATIC: "matic-network",
    POL: "polygon-ecosystem-token",
    SOL: "solana",
    TON: "the-open-network",
    TRX: "tron",
    USDC: "usd-coin",
    USDT: "tether",
    XRP: "ripple",
};

const usStockSymbols = new Set(["AAPL", "AMZN", "GOOGL", "META", "MSFT", "NVDA", "TSLA"]);
const vietnamStockSymbols = new Set([
    "ACB", "BID", "BVH", "CTG", "DGC", "EIB", "FPT", "GAS", "GVR", "HDB", "HPG", "KDH",
    "LPB", "MBB", "MSN", "MWG", "NVL", "PLX", "POW", "REE", "SAB", "SHB", "SSI", "STB",
    "TCB", "TPB", "VCB", "VHM", "VIB", "VIC", "VJC", "VNM", "VPB", "VRE", "VND",
]);

const normalizeSymbol = (value) => value.trim().replace(/\s+/g, "").toUpperCase();

const getBaseSymbol = (symbol) => symbol.replace(/[-_/]?(USDT|USD|USDC)$/i, "").replace(/\.VN$/i, "");

const getAssetType = (symbol) => {
    const baseSymbol = getBaseSymbol(symbol);

    if (coinAliases[baseSymbol] || /[-_/]?(USDT|USDC|USD)$/i.test(symbol)) {
        return "CRYPTO";
    }

    if (symbol.endsWith(".VN") || vietnamStockSymbols.has(baseSymbol) || usStockSymbols.has(baseSymbol)) {
        return "STOCK";
    }

    return /^[A-Z]{3,5}$/.test(baseSymbol) ? "STOCK" : "CRYPTO";
};

const getYahooTicker = (symbol) => {
    const baseSymbol = getBaseSymbol(symbol);

    if (symbol.includes(".")) {
        return symbol;
    }

    return usStockSymbols.has(baseSymbol) ? baseSymbol : `${baseSymbol}.VN`;
};

const formatMoney = (value, currency = "USD") => {
    if (!Number.isFinite(value)) {
        return "-";
    }

    const isVnd = currency === "VND";

    return new Intl.NumberFormat(isVnd ? "vi-VN" : "en-US", {
        currency,
        maximumFractionDigits: isVnd ? 0 : (Math.abs(value) >= 1 ? 2 : 6),
        notation: Math.abs(value) >= 1_000_000_000 ? "compact" : "standard",
        style: "currency",
    }).format(value);
};

const formatNumber = (value) => {
    if (!Number.isFinite(value)) {
        return "-";
    }

    return new Intl.NumberFormat("vi-VN", {
        maximumFractionDigits: 2,
        notation: Math.abs(value) >= 1_000_000 ? "compact" : "standard",
    }).format(value);
};

const formatPercent = (value, withSign = true) => {
    if (!Number.isFinite(value)) {
        return "-";
    }

    const sign = withSign && value >= 0 ? "+" : "";

    return `${sign}${value.toFixed(2)}%`;
};

const formatDate = (value) => {
    if (!value) {
        return "-";
    }

    return new Date(value).toLocaleDateString("vi-VN");
};

const average = (values) => {
    if (!values.length) {
        return 0;
    }

    return values.reduce((total, value) => total + value, 0) / values.length;
};

const getPercentChange = (current, previous) => {
    if (!Number.isFinite(current) || !Number.isFinite(previous) || previous === 0) {
        return 0;
    }

    return ((current - previous) / previous) * 100;
};

const calculateRsi = (prices) => {
    if (!Array.isArray(prices) || prices.length < 2) {
        return 50;
    }

    let gains = 0;
    let losses = 0;

    for (let index = 1; index < prices.length; index += 1) {
        const change = prices[index] - prices[index - 1];

        if (change >= 0) {
            gains += change;
        } else {
            losses += Math.abs(change);
        }
    }

    const periods = prices.length - 1;
    const averageGain = gains / periods;
    const averageLoss = losses / periods;

    if (averageGain === 0 && averageLoss === 0) {
        return 50;
    }

    if (averageLoss === 0) {
        return 100;
    }

    const relativeStrength = averageGain / averageLoss;

    return 100 - 100 / (1 + relativeStrength);
};

const getRsiSignal = (rsi) => {
    if (rsi > 70) {
        return {
            className: "is-warning",
            label: "Overbought ⚠️",
        };
    }

    if (rsi < 30) {
        return {
            className: "is-bull",
            label: "Oversold 🟢",
        };
    }

    return {
        className: "is-neutral",
        label: "Neutral",
    };
};

const getTrend = (currentPrice, ma7) => {
    if (!currentPrice || !ma7) {
        return {
            className: "is-neutral",
            icon: <FiActivity />,
            label: "Sideway",
        };
    }

    const distance = ((currentPrice - ma7) / ma7) * 100;

    if (distance > 1) {
        return {
            className: "is-bull",
            icon: <FiTrendingUp />,
            label: "Tăng",
        };
    }

    if (distance < -1) {
        return {
            className: "is-bear",
            icon: <FiTrendingDown />,
            label: "Giảm",
        };
    }

    return {
        className: "is-neutral",
        icon: <FiActivity />,
        label: "Sideway",
    };
};

const getRecommendation = ({ assetKind, change24h, dividendYield, rsi, trend }) => {
    if (trend.label === "Tang" && change24h > 0 && rsi < 70) {
        return {
            className: "is-bull",
            label: "MUA",
            reason: assetKind === "STOCK" && dividendYield >= 4
                ? "Giá nằm trên MA7, momentum tốt và cổ tức 12 tháng đang hấp dẫn."
                : "Trend cao hơn MA7, RSI chưa quá nóng va momentum ngắn hạn vẫn tích cực.",
        };
    }

    if (trend.label === "Giam" && change24h < 0) {
        return {
            className: "is-bear",
            label: "BÁN",
            reason: "Giá nằm dưới MA7 và biến động 24h đang yếu, nên ưu tiên giảm rủi ro.",
        };
    }

    if (rsi > 70) {
        return {
            className: "is-warning",
            label: "CHỜ",
            reason: "RSI đang overbought, nên chờ pullback hoặc xác nhận breakout rõ hơn.",
        };
    }

    if (rsi < 30 && change24h >= 0) {
        return {
            className: "is-bull",
            label: "MUA",
            reason: "RSI oversold và giá bắt đầu hồi, phù hợp quan sát điểm vào thận trọng.",
        };
    }

    return {
        className: "is-neutral",
        label: "CHỜ",
        reason: "Tín hiệu chưa đủ đồng thuận giữa trend, RSI và thay đổi 24h.",
    };
};

const fetchJson = async (url, fallbackMessage) => {
    const response = await fetch(url);
    let data = null;

    try {
        data = await response.json();
    } catch (error) {
        throw new Error(fallbackMessage);
    }

    if (!response.ok) {
        const apiMessage = data?.error || data?.message || data?.chart?.error?.description || data?.finance?.error?.description;
        throw new Error(apiMessage || fallbackMessage);
    }

    return data;
};

const resolveCoinId = async (symbol) => {
    if (coinAliases[symbol]) {
        return coinAliases[symbol];
    }

    const data = await fetchJson(
        `${COINGECKO_API_BASE}/search?query=${encodeURIComponent(symbol)}`,
        "Không thể tìm coin trên CoinGecko.",
    );

    const exactMatch = data.coins?.find((coin) => coin.symbol?.toUpperCase() === symbol);
    const fallback = data.coins?.[0];

    if (!exactMatch && !fallback) {
        throw new Error("Không tìm thấy crypto này trên CoinGecko.");
    }

    return (exactMatch || fallback).id;
};

const fetchCoinMarket = async (coinId) => {
    const params = new URLSearchParams({
        ids: coinId,
        order: "market_cap_desc",
        page: "1",
        per_page: "1",
        price_change_percentage: "24h,7d",
        sparkline: "true",
        vs_currency: "usd",
    });
    const data = await fetchJson(
        `${COINGECKO_API_BASE}/coins/markets?${params.toString()}`,
        "Không thể lấy market data từ CoinGecko.",
    );

    if (!Array.isArray(data) || !data.length) {
        throw new Error("CoinGecko chưa có market data cho mã này.");
    }

    return {
        ...data[0],
        assetKind: "CRYPTO",
        currency: "USD",
        dataSource: "CoinGecko",
    };
};

const parseYahooBars = (result) => {
    const timestamps = result?.timestamp || [];
    const quote = result?.indicators?.quote?.[0] || {};

    return timestamps
        .map((timestamp, index) => ({
            close: Number(quote.close?.[index]),
            high: Number(quote.high?.[index]),
            low: Number(quote.low?.[index]),
            open: Number(quote.open?.[index]),
            timestamp,
            volume: Number(quote.volume?.[index]),
        }))
        .filter((bar) => Number.isFinite(bar.close))
        .sort((a, b) => a.timestamp - b.timestamp);
};

const parseDividendEvents = (events, currentPrice, currency = "VND") => {
    const dividendEvents = (events || [])
        .map((event) => ({
            amount: Number(event.amount ?? event.value ?? event.cash ?? event.cashDividend ?? event.cash_dividend),
            date: event.date || event.issueDate || event.issue_date || event.publicDate || event.public_date || "",
            title: event.title || event.eventTitle || event.event_title || "",
        }))
        .filter((event) => Number.isFinite(event.amount) && event.date)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    const latestEvent = dividendEvents[dividendEvents.length - 1] || null;
    const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
    const annualCash = dividendEvents
        .filter((event) => new Date(event.date).getTime() >= oneYearAgo)
        .reduce((total, event) => total + event.amount, 0);
    const annualYield = annualCash > 0 && currentPrice > 0 ? (annualCash / currentPrice) * 100 : null;

    return {
        annualCash,
        annualYield,
        currency,
        latestAmount: latestEvent?.amount || null,
        latestDate: latestEvent?.date || "",
        latestTitle: latestEvent?.title || "",
    };
};

const parseYahooDividends = (result, currentPrice) => {
    const dividendEvents = Object.values(result?.events?.dividends || {})
        .map((event) => ({
            amount: Number(event.amount),
            date: event.date ? new Date(event.date * 1000).toISOString() : "",
        }));

    return parseDividendEvents(dividendEvents, currentPrice, "VND");
};

const normalizeVnstockBars = (prices) => {
    const rawBars = (prices || [])
        .map((bar) => ({
            close: Number(bar.close ?? bar.Close ?? bar.price ?? bar.matchPrice),
            high: Number(bar.high ?? bar.High),
            low: Number(bar.low ?? bar.Low),
            open: Number(bar.open ?? bar.Open),
            timestamp: bar.timestamp ?? bar.time ?? bar.date ?? bar.tradingDate,
            volume: Number(bar.volume ?? bar.Volume ?? bar.volume_accumulated ?? bar.totalVolume),
        }))
        .filter((bar) => Number.isFinite(bar.close))
        .sort((a, b) => new Date(a.timestamp || 0) - new Date(b.timestamp || 0));

    const closes = rawBars.map((bar) => bar.close).filter(Number.isFinite);
    const medianClose = closes.length ? closes[Math.floor(closes.length / 2)] : 0;
    const scale = medianClose > 0 && medianClose < 1000 ? 1000 : 1;

    return rawBars.map((bar) => ({
        ...bar,
        close: bar.close * scale,
        high: Number.isFinite(bar.high) ? bar.high * scale : bar.close * scale,
        low: Number.isFinite(bar.low) ? bar.low * scale : bar.close * scale,
        open: Number.isFinite(bar.open) ? bar.open * scale : bar.close * scale,
    }));
};

const normalizeProxyStockMarket = (payload, symbol) => {
    const bars = normalizeVnstockBars(payload.prices || payload.history || payload.ohlcv || []);

    if (!bars.length) {
        throw new Error("VNStock proxy chưa trả về dữ liệu giá hợp lệ.");
    }

    const lastBar = bars[bars.length - 1];
    const previousBar = bars[bars.length - 2];
    const sevenSessionsAgo = bars.length > 7 ? bars[bars.length - 8] : bars[0];
    const closes = bars.map((bar) => bar.close).filter(Number.isFinite);
    const currentPrice = Number(payload.currentPrice ?? payload.current_price) || lastBar.close;
    const dividend = payload.dividend || parseDividendEvents(payload.dividends || payload.events, currentPrice, "VND");
    const annualYield = Number(dividend.annualYield ?? dividend.annual_yield ?? payload.dividendYield ?? payload.dividend_yield);

    return {
        assetKind: "STOCK",
        currency: payload.currency || "VND",
        current_price: currentPrice,
        dataSource: payload.dataSource || payload.source || "VNStock API",
        dividend: {
            annualCash: Number(dividend.annualCash ?? dividend.annual_cash) || null,
            annualYield: Number.isFinite(annualYield) ? annualYield : null,
            latestAmount: Number(dividend.latestAmount ?? dividend.latest_amount) || null,
            latestDate: dividend.latestDate || dividend.latest_date || "",
            latestTitle: dividend.latestTitle || dividend.latest_title || "",
        },
        exchange: payload.exchange || payload.market || "-",
        high_24h: Number(payload.high_24h) || lastBar.high,
        last_updated: payload.lastUpdated || payload.last_updated || new Date(lastBar.timestamp || Date.now()).toISOString(),
        level_prices: closes.slice(-7),
        low_24h: Number(payload.low_24h) || lastBar.low,
        ma_prices: closes.slice(-7),
        market_cap: Number(payload.marketCap ?? payload.market_cap) || null,
        name: payload.name || payload.shortName || payload.organName || getBaseSymbol(symbol),
        price_change_percentage_24h: getPercentChange(currentPrice, previousBar?.close),
        price_change_percentage_7d_in_currency: getPercentChange(currentPrice, sevenSessionsAgo?.close),
        rsi_prices: closes.slice(-14),
        sparkline_in_7d: {
            price: closes.slice(-30),
        },
        symbol: payload.symbol || getBaseSymbol(symbol),
        total_volume: Number(payload.totalVolume ?? payload.total_volume) || lastBar.volume,
    };
};

const buildProxyUrl = (baseUrl, symbol) => {
    const url = new URL(baseUrl, window.location.origin);
    url.searchParams.set("symbol", getBaseSymbol(symbol));

    return url.toString();
};

const fetchVnstockProxyMarket = async (symbol) => {
    const data = await fetchJson(
        buildProxyUrl(VNSTOCK_PROXY_URL, symbol),
        "Không thể lấy dữ liệu từ VNStock proxy.",
    );

    return normalizeProxyStockMarket(data, symbol);
};

const fetchYahooStockMarket = async (symbol) => {
    const yahooTicker = getYahooTicker(symbol);
    const params = new URLSearchParams({
        events: "div,splits",
        interval: "1d",
        range: "1y",
    });
    const data = await fetchJson(
        `${YAHOO_CHART_API_BASE}/${encodeURIComponent(yahooTicker)}?${params.toString()}`,
        "Không thể lấy dữ liệu chứng khoáng từ Yahoo Finance.",
    );
    const error = data?.chart?.error;

    if (error) {
        throw new Error(error.description || "Không thể lấy dữ liệu chứng khoáng.");
    }

    const result = data?.chart?.result?.[0];
    const meta = result?.meta || {};
    const bars = parseYahooBars(result);

    if (!bars.length) {
        throw new Error("Không thể lấy dữ liệu giá cho mã chứng khoáng này.");
    }

    const lastBar = bars[bars.length - 1];
    const previousBar = bars[bars.length - 2];
    const sevenSessionsAgo = bars.length > 7 ? bars[bars.length - 8] : bars[0];
    const currentPrice = Number(meta.regularMarketPrice) || lastBar.close;
    const dividend = parseYahooDividends(result, currentPrice);
    const closes = bars.map((bar) => bar.close).filter(Number.isFinite);

    return {
        assetKind: "STOCK",
        currency: meta.currency || "VND",
        current_price: currentPrice,
        dataSource: yahooTicker.endsWith(".VN") ? "Yahoo Finance Chart (.VN fallback)" : "Yahoo Finance Chart",
        dividend,
        exchange: meta.fullExchangeName || meta.exchangeName || "-",
        high_24h: Number(meta.regularMarketDayHigh) || lastBar.high,
        last_updated: meta.regularMarketTime ? new Date(meta.regularMarketTime * 1000).toISOString() : new Date(lastBar.timestamp * 1000).toISOString(),
        level_prices: closes.slice(-7),
        low_24h: Number(meta.regularMarketDayLow) || lastBar.low,
        ma_prices: closes.slice(-7),
        market_cap: null,
        name: meta.longName || meta.shortName || yahooTicker,
        price_change_percentage_24h: getPercentChange(currentPrice, previousBar?.close),
        price_change_percentage_7d_in_currency: getPercentChange(currentPrice, sevenSessionsAgo?.close),
        rsi_prices: closes.slice(-14),
        sparkline_in_7d: {
            price: closes.slice(-30),
        },
        symbol: getBaseSymbol(symbol),
        total_volume: Number(meta.regularMarketVolume) || lastBar.volume,
    };
};

const fetchStockMarket = async (symbol) => {
    if (VNSTOCK_PROXY_URL) {
        try {
            return await fetchVnstockProxyMarket(symbol);
        } catch (error) {
            const fallbackMarket = await fetchYahooStockMarket(symbol);

            return {
                ...fallbackMarket,
                dataSource: `${fallbackMarket.dataSource}; VNStock proxy lỗi: ${error.message}`,
            };
        }
    }

    return fetchYahooStockMarket(symbol);
};

const buildAnalysis = (market) => {
    const prices = market.sparkline_in_7d?.price?.filter(Number.isFinite) || [];
    const maPrices = market.ma_prices?.filter(Number.isFinite) || prices;
    const rsiPrices = market.rsi_prices?.filter(Number.isFinite) || prices;
    const levelPrices = market.level_prices?.filter(Number.isFinite) || prices;
    const currentPrice = market.current_price;
    const ma7 = average(maPrices);
    const support = levelPrices.length ? Math.min(...levelPrices) : market.low_24h;
    const resistance = levelPrices.length ? Math.max(...levelPrices) : market.high_24h;
    const rsi = calculateRsi(rsiPrices);
    const trend = getTrend(currentPrice, ma7);
    const rsiSignal = getRsiSignal(rsi);
    const dividendYield = market.dividend?.annualYield ?? null;
    const recommendation = getRecommendation({
        assetKind: market.assetKind,
        change24h: market.price_change_percentage_24h || 0,
        dividendYield: dividendYield || 0,
        rsi,
        trend,
    });

    return {
        assetKind: market.assetKind,
        currency: market.currency || "USD",
        currentPrice,
        dividend: market.dividend || null,
        dividendYield,
        marketCap: market.market_cap,
        ma7,
        prices,
        recommendation,
        resistance,
        rsi,
        rsiSignal,
        support,
        totalVolume: market.total_volume,
        trend,
        updatedAt: market.last_updated,
    };
};

const buildDividendText = (analysis) => {
    if (analysis.assetKind !== "STOCK") {
        return "";
    }

    if (!analysis.dividend?.annualCash) {
        return "Cổ tức: Chưa có dữ liệu cổ tức tiền mặc 12 tháng từ API.";
    }

    return `Cổ tức 12T: ${formatMoney(analysis.dividend.annualCash, analysis.currency)} | Yield: ${formatPercent(analysis.dividendYield, false)}`;
};

const buildCopyText = (market, analysis) => [
    `${market.symbol?.toUpperCase()} - ${market.name}`,
    `Giá: ${formatMoney(analysis.currentPrice, analysis.currency)} | 24h/phiên: ${formatPercent(market.price_change_percentage_24h)} | 7d: ${formatPercent(market.price_change_percentage_7d_in_currency)}`,
    `Trend: ${analysis.trend.label} | RSI: ${analysis.rsi.toFixed(1)} (${analysis.rsiSignal.label})`,
    `Support: ${formatMoney(analysis.support, analysis.currency)} | Resistance: ${formatMoney(analysis.resistance, analysis.currency)}`,
    buildDividendText(analysis),
    `Khuyến nghị: ${analysis.recommendation.label} - ${analysis.recommendation.reason}`,
    "Chỉ mang tính tham khảo, không phải lời khuyên đầu tư.",
].filter(Boolean).join("\n");

const MarketAnalysisWidget = ({ defaultSymbol = "BTC", language = "en" }) => {
    const [analysis, setAnalysis] = React.useState(null);
    const [copied, setCopied] = React.useState(false);
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [market, setMarket] = React.useState(null);
    const [symbol, setSymbol] = React.useState(defaultSymbol);

    const normalizedSymbol = normalizeSymbol(symbol);
    const assetType = normalizedSymbol ? getAssetType(normalizedSymbol) : "CRYPTO";
    const isVietnamStock = assetType === "STOCK" && getYahooTicker(normalizedSymbol).endsWith(".VN");
    const sourceLabel = assetType === "STOCK"
        ? (VNSTOCK_PROXY_URL ? "VNStock API" : (isVietnamStock ? "Yahoo .VN" : "Yahoo"))
        : "CoinGecko";

    const handleAnalyze = async (event) => {
        event?.preventDefault();

        if (!normalizedSymbol) {
            setError("Vui lòng nhập mã coin cần phân tích.");
            return;
        }

        setAnalysis(null);
        setCopied(false);
        setError("");
        setLoading(true);

        try {
            const nextMarket = assetType === "STOCK"
                ? await fetchStockMarket(normalizedSymbol)
                : await fetchCoinMarket(await resolveCoinId(getBaseSymbol(normalizedSymbol)));
            const nextAnalysis = buildAnalysis(nextMarket);

            setMarket(nextMarket);
            setAnalysis(nextAnalysis);
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        if (!market || !analysis) {
            return;
        }

        await navigator.clipboard.writeText(buildCopyText(market, analysis));
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
    };

    const isStockResult = market?.assetKind === "STOCK";
    const priceChange24h = market?.price_change_percentage_24h;
    const priceChange7d = market?.price_change_percentage_7d_in_currency;

    return (
        <div className="portfolio-page">
            <section className="portfolio-market-wrap">
                <div className="portfolio-market-hero">
                    <div>
                        <h1>Market Analysis</h1>
                        <p>
                            {
                                language === "vi" ?
                                    "Nhập mã crypto để lấy data thật từ CoinGecko và tự tính trend, RSI, support/resistance cùng khuyến nghị ngắn gọn"
                                    : "Enter a crypto symbol to fetch real data from CoinGecko and automatically calculate trend, RSI, support/resistance, and a brief recommendation."
                            }
                        </p>
                    </div>
                </div>

                <div className="portfolio-market-grid">
                    <form className="portfolio-market-card" onSubmit={handleAnalyze}>
                        <div className="portfolio-market-card-head">
                            <span className={`portfolio-market-badge is-${assetType.toLowerCase()}`}>
                                {assetType}
                            </span>
                            <span>{sourceLabel}</span>
                        </div>

                        <label>
                            {language === "vi" ? "Mã coin/cổ phiếu" : "Coin/stock symbol"}
                            <div className="portfolio-market-input">
                                <FiSearch />
                                <input
                                    value={symbol}
                                    onChange={(event) => setSymbol(event.target.value)}
                                    placeholder="BTC/USDT, ETH, VNM, FPT, HPG..."
                                />
                            </div>
                        </label>

                        <div className="portfolio-market-actions">
                            <button className="portfolio-market-submit" disabled={loading} type="submit">
                                <FiBarChart2 />
                                {loading ? "Đang fetch..." : (language === "vi" ? "Phân tích" : "Analysis")}
                            </button>
                            <button
                                className="portfolio-market-refresh"
                                disabled={loading || !normalizedSymbol}
                                onClick={handleAnalyze}
                                type="button"
                            >
                                <FiRefreshCw />
                                { language === "en" ? "Refresh" : "Làm mới"}
                            </button>
                        </div>

                        <p className="portfolio-market-note">
                            {
                                language === "vi" ?
                                    "Chỉ support crypto trước. Cổ phiếu như AAPL/VNM sẽ được nhận diện là STOCK nhưng chưa phân tích bằng CoinGecko." :
                                    "Only crypto is supported for now. Stocks like AAPL/VNM will be recognized as STOCK but will not yet be analyzed via CoinGecko."
                            }
                        </p>
                    </form>

                    <article className="portfolio-market-result-card">
                        <div className="portfolio-market-result-head">
                            <div>
                                <span>{market ? market.symbol?.toUpperCase() : normalizedSymbol || "SYMBOL"}</span>
                                <h2>{market ? market.name : (language === "vi" ? "Kết quả phân tích" : "Analysis result")}</h2>
                            </div>
                            <button
                                type="button"
                                className="portfolio-market-copy"
                                onClick={handleCopy}
                                disabled={!analysis}
                                title="Copy analysis"
                            >
                                <FiCopy />
                                {copied ? "Copied" : "Copy"}
                            </button>
                        </div>

                        {loading && (
                            <div className="portfolio-market-skeleton" aria-label="Loading market data">
                                <span />
                                <span />
                                <span />
                                <span />
                                <span />
                            </div>
                        )}

                        {!loading && error && (
                            <div className="portfolio-market-error">{error}</div>
                        )}

                        {!loading && !error && analysis && market && (
                            <div className="portfolio-market-analysis">
                                <div className="portfolio-market-price-row">
                                    <div>
                                        <span>Price</span>
                                        <strong>{formatMoney(analysis.currentPrice, analysis.currency)}</strong>
                                    </div>
                                    <div className={priceChange24h >= 0 ? "is-bull" : "is-bear"}>
                                        <span>{isStockResult ? "Last session" : "24h"}</span>
                                        <strong>{formatPercent(priceChange24h)}</strong>
                                    </div>
                                    <div className={priceChange7d >= 0 ? "is-bull" : "is-bear"}>
                                        <span>7d</span>
                                        <strong>{formatPercent(priceChange7d)}</strong>
                                    </div>
                                </div>

                                <div className="portfolio-market-metrics">
                                    <div>
                                        <span>{isStockResult ? "Volume" : "Volume 24h"}</span>
                                        <strong>{isStockResult ? formatNumber(analysis.totalVolume) : formatMoney(analysis.totalVolume, analysis.currency)}</strong>
                                    </div>
                                    <div>
                                        <span>{isStockResult ? "Exchange" : "Market Cap"}</span>
                                        <strong>{isStockResult ? market.exchange : formatMoney(analysis.marketCap, analysis.currency)}</strong>
                                    </div>
                                    <div>
                                        <span>MA7</span>
                                        <strong>{formatMoney(analysis.ma7, analysis.currency)}</strong>
                                    </div>
                                    {isStockResult && (
                                        <div>
                                            <span>Dividend yield</span>
                                            <strong>{analysis.dividendYield ? formatPercent(analysis.dividendYield, false) : "-"}</strong>
                                        </div>
                                    )}
                                </div>

                                <div className="portfolio-market-signal-grid">
                                    <div className={`portfolio-market-signal ${analysis.trend.className}`}>
                                        {analysis.trend.icon}
                                        <span>{language === "vi" ? "Xu huong" : "Trend"}</span>
                                        <strong>{analysis.trend.label}</strong>
                                    </div>
                                    <div className={`portfolio-market-signal ${analysis.rsiSignal.className}`}>
                                        <FiActivity />
                                        <span>RSI</span>
                                        <strong>{analysis.rsi.toFixed(1)} - {analysis.rsiSignal.label}</strong>
                                    </div>
                                </div>

                                <div className="portfolio-market-levels">
                                    <div>
                                        <span>Support 7d</span>
                                        <strong>{formatMoney(analysis.support, analysis.currency)}</strong>
                                    </div>
                                    <div>
                                        <span>Resistance 7d</span>
                                        <strong>{formatMoney(analysis.resistance, analysis.currency)}</strong>
                                    </div>
                                </div>

                                {isStockResult && (
                                    <div className="portfolio-market-dividend-card">
                                        <span>Co tuc tien mat</span>
                                        <strong>
                                            {analysis.dividend?.annualCash
                                                ? `${formatMoney(analysis.dividend.annualCash, analysis.currency)} / 12T`
                                                : "Chưa có dữ liệu 12T"}
                                        </strong>
                                        <p>
                                            Gan nhat: {analysis.dividend?.latestAmount
                                                ? `${formatMoney(analysis.dividend.latestAmount, analysis.currency)} ngay ${formatDate(analysis.dividend.latestDate)}`
                                                : "Chưa có dividend event từ API."}
                                        </p>
                                    </div>
                                )}

                                <div className={`portfolio-market-recommendation ${analysis.recommendation.className}`}>
                                    <span>{ language === "vi" ? "Khuyến nghị" : "Recommendation" }</span>
                                    <strong>{analysis.recommendation.label}</strong>
                                    <p>{analysis.recommendation.reason}</p>
                                </div>

                                <p className="portfolio-market-note">
                                    { language === "vi" ? "Cập nhật" : "Updated" }: {analysis.updatedAt ? new Date(analysis.updatedAt).toLocaleString("vi-VN") : "-"} - {market.dataSource}
                                </p>
                            </div>
                        )}

                        {!loading && !error && !analysis && (
                            <div className="portfolio-market-placeholder">
                                <FiBarChart2 />
                                <p>{language === "vi" ? "Nhập mã crypto và bấm phân tích để xem card kết quả tại đây." : "Enter a crypto symbol and click analyze to view the result card here."}</p>
                            </div>
                        )}
                    </article>
                </div>
            </section>

            <PageFooter>
                <span>{pick(aboutContent.name, language)}</span> - {pick(cryptoContent.footer, language)}
            </PageFooter>
        </div>
    );
};

export default MarketAnalysisWidget;
