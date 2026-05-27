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

const normalizeSymbol = (value) => value.trim().replace(/\s+/g, "").toUpperCase();

const getBaseSymbol = (symbol) => symbol.replace(/[-_/]?(USDT|USD|USDC)$/i, "");

const formatMoney = (value, currency = "USD") => {
    if (!Number.isFinite(value)) {
        return "-";
    }

    return new Intl.NumberFormat("en-US", {
        currency,
        maximumFractionDigits: Math.abs(value) >= 1 ? 2 : 6,
        notation: Math.abs(value) >= 1_000_000_000 ? "compact" : "standard",
        style: "currency",
    }).format(value);
};

const formatPercent = (value) => {
    if (!Number.isFinite(value)) {
        return "-";
    }

    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
};

const average = (values) => {
    if (!values.length) {
        return 0;
    }

    return values.reduce((total, value) => total + value, 0) / values.length;
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

const getRecommendation = ({ change24h, rsi, trend }) => {
    if (trend.label === "Tang" && change24h > 0 && rsi < 70) {
        return {
            className: "is-bull",
            label: "MUA",
            reason: "Giá nằm trên MA7, momentum tốt và cổ tức 12 tháng đang hấp dẫn."
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
        throw new Error(data?.error || data?.message || fallbackMessage);
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
        currency: "USD",
        dataSource: "CoinGecko",
    };
};

const buildAnalysis = (market) => {
    const prices = market.sparkline_in_7d?.price?.filter(Number.isFinite) || [];
    const currentPrice = market.current_price;
    const ma7 = average(prices);
    const support = prices.length ? Math.min(...prices) : market.low_24h;
    const resistance = prices.length ? Math.max(...prices) : market.high_24h;
    const rsi = calculateRsi(prices);
    const trend = getTrend(currentPrice, ma7);
    const rsiSignal = getRsiSignal(rsi);
    const recommendation = getRecommendation({
        change24h: market.price_change_percentage_24h || 0,
        rsi,
        trend,
    });

    return {
        currency: market.currency || "USD",
        currentPrice,
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

const buildCopyText = (market, analysis) => [
    `${market.symbol?.toUpperCase()} - ${market.name}`,
    `Giá: ${formatMoney(analysis.currentPrice, analysis.currency)} | 24h/phiên: ${formatPercent(market.price_change_percentage_24h)} | 7d: ${formatPercent(market.price_change_percentage_7d_in_currency)}`,
    `Trend: ${analysis.trend.label} | RSI: ${analysis.rsi.toFixed(1)} (${analysis.rsiSignal.label})`,
    `Support: ${formatMoney(analysis.support, analysis.currency)} | Resistance: ${formatMoney(analysis.resistance, analysis.currency)}`,
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

    const handleAnalyze = async (event) => {
        event?.preventDefault();

        if (!normalizedSymbol) {
            setError(language === "vi" ? "Vui lòng nhập mã crypto cần phân tích." : "Please enter a crypto symbol.");
            return;
        }

        setAnalysis(null);
        setCopied(false);
        setError("");
        setLoading(true);

        try {
            const coinId = await resolveCoinId(getBaseSymbol(normalizedSymbol));
            const nextMarket = await fetchCoinMarket(coinId);
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
                            <span className="portfolio-market-badge is-crypto">CRYPTO</span>
                            <span>CoinGecko</span>
                        </div>

                        <label>
                            {language === "vi" ? "Mã crypto" : "Crypto symbol"}
                            <div className="portfolio-market-input">
                                <FiSearch />
                                <input
                                    value={symbol}
                                    onChange={(event) => setSymbol(event.target.value)}
                                    placeholder="BTC/USDT, ETH, SOL, BNB..."
                                />
                            </div>
                        </label>

                        <div className="portfolio-market-actions">
                            <button className="portfolio-market-submit" disabled={loading} type="submit">
                                <FiBarChart2 />
                                {loading ? "Fetching..." : (language === "vi" ? "Phân tích" : "Analysis")}
                            </button>
                            <button
                                className="portfolio-market-refresh"
                                disabled={loading || !normalizedSymbol}
                                onClick={handleAnalyze}
                                type="button"
                            >
                                <FiRefreshCw />
                                {language === "vi" ? "Làm mới" : "Refresh"}
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
                                        <span>24h</span>
                                        <strong>{formatPercent(priceChange24h)}</strong>
                                    </div>
                                    <div className={priceChange7d >= 0 ? "is-bull" : "is-bear"}>
                                        <span>7d</span>
                                        <strong>{formatPercent(priceChange7d)}</strong>
                                    </div>
                                </div>

                                <div className="portfolio-market-metrics">
                                    <div>
                                        <span>Volume 24h</span>
                                        <strong>{formatMoney(analysis.totalVolume, analysis.currency)}</strong>
                                    </div>
                                    <div>
                                        <span>Market Cap</span>
                                        <strong>{formatMoney(analysis.marketCap, analysis.currency)}</strong>
                                    </div>
                                    <div>
                                        <span>MA7</span>
                                        <strong>{formatMoney(analysis.ma7, analysis.currency)}</strong>
                                    </div>
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
