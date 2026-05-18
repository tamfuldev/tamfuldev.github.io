import React from "react";
import { aboutContent, cryptoContent } from "../../data/portfolioContent";
import { fetchBinanceTickers, formatCryptoPrice, getTradeUrl } from "../../utils/cryptoMarket";
import { pick } from "../../utils/localization";
import PageFooter from "./PageFooter";

const CryptoChange = ({ change }) => (
    <span className={`portfolio-crypto-change${change >= 0 ? " is-up" : " is-down"}`}>
        {change >= 0 ? "+" : ""}
        {change.toFixed(2)}%
    </span>
);

const PortfolioCrypto = ({ fallbackCoins, language }) => {
    const [coins, setCoins] = React.useState(fallbackCoins);
    const [error, setError] = React.useState("");
    const [lastUpdated, setLastUpdated] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        let mounted = true;

        const refreshMarket = async () => {
            try {
                const liveCoins = await fetchBinanceTickers();

                if (!mounted) {
                    return;
                }

                setCoins(liveCoins);
                setError("");
                setLastUpdated(new Date());
            } catch (marketError) {
                if (mounted) {
                    setError(marketError.message);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        refreshMarket();
        const interval = window.setInterval(refreshMarket, 60000);

        return () => {
            mounted = false;
            window.clearInterval(interval);
        };
    }, []);

    const tickerItems = [...coins, ...coins];
    const liveStatus =
        language === "vi"
            ? "Dữ liệu live từ Binance"
            : "Live Binance market";
    const loadingStatus =
        language === "vi"
            ? "Đang tải giá live..."
            : "Loading live prices...";
    const updatedStatus =
        language === "vi"
            ? `Cập nhật lúc ${lastUpdated?.toLocaleTimeString("vi-VN")}`
            : `Updated ${lastUpdated?.toLocaleTimeString("en-US")}`;
    const fallbackStatus =
        language === "vi"
            ? "Không lấy được data API live, đang hiển thị data fallback."
            : "Live API unavailable, showing fallback data.";

    return (
        <div className="portfolio-page">
            <section className="portfolio-crypto-wrap">
                <div className="portfolio-crypto-header">
                    <h1>{pick(cryptoContent.title, language)}</h1>
                    <p>{pick(cryptoContent.description, language)}</p>
                </div>

                <div className={`portfolio-crypto-live-status${error ? " is-error" : ""}`}>
                    <span className="portfolio-live-dot"></span>
                    {error ? fallbackStatus : loading ? loadingStatus : lastUpdated ? updatedStatus : liveStatus}
                </div>

                <div className="portfolio-ticker-wrap">
                    <div className="portfolio-ticker-inner">
                        {tickerItems.map((coin, index) => (
                            <a
                                key={`${coin.symbol}-${index}`}
                                className="portfolio-ticker-item"
                                href={getTradeUrl(coin.symbol)}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <span className="portfolio-ticker-pair">{coin.pair || `${coin.symbol}/USDT`}</span>
                                <span className="portfolio-ticker-value">${formatCryptoPrice(coin.price)}</span>
                                <CryptoChange change={coin.change} />
                            </a>
                        ))}
                    </div>
                </div>

                <div className="portfolio-crypto-grid">
                    {coins.map((coin) => (
                        <article key={coin.symbol} className="portfolio-crypto-card">
                            <div className="portfolio-crypto-card-top">
                                <a
                                    className="portfolio-crypto-symbol"
                                    href={getTradeUrl(coin.symbol)}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {coin.pair || `${coin.symbol}/USDT`}
                                </a>
                                <CryptoChange change={coin.change} />
                            </div>
                            <div className="portfolio-crypto-name">{coin.name}</div>
                            <div className="portfolio-crypto-price">${formatCryptoPrice(coin.price)}</div>
                        </article>
                    ))}
                </div>

                <div className="portfolio-disclaimer">
                    {pick(cryptoContent.disclaimer, language)}
                </div>
            </section>

            <PageFooter>
                <span>{pick(aboutContent.name, language)}</span> - {pick(cryptoContent.footer, language)}
            </PageFooter>
        </div>
    );
};

export default PortfolioCrypto;
