import { aboutContent, cryptoContent } from "../../data/portfolioContent";
import { pick } from "../../utils/localization";
import PageFooter from "./PageFooter";

const getTradeUrl = (symbol) => `https://www.binance.com/vi/trade/${symbol}_USDT?type=spot`;

const formatPrice = (price) => {
    if (price >= 1) {
        return price.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }

    return price.toFixed(4);
};

const CryptoChange = ({ change }) => (
    <span className={`portfolio-crypto-change${change >= 0 ? " is-up" : " is-down"}`}>
        {change >= 0 ? "+" : ""}
        {change.toFixed(2)}%
    </span>
);

const PortfolioCrypto = ({ coins, language }) => {
    const tickerItems = [...coins, ...coins];

    return (
        <div className="portfolio-page">
            <section className="portfolio-crypto-wrap">
                <div className="portfolio-crypto-header">
                    <h1>{pick(cryptoContent.title, language)}</h1>
                    <p>{pick(cryptoContent.description, language)}</p>
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
                                <span className="portfolio-ticker-pair">{coin.symbol}/USDT</span>
                                <span className="portfolio-ticker-value">${formatPrice(coin.price)}</span>
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
                                    {coin.symbol}/USDT
                                </a>
                                <CryptoChange change={coin.change} />
                            </div>
                            <div className="portfolio-crypto-name">{coin.name}</div>
                            <div className="portfolio-crypto-price">${formatPrice(coin.price)}</div>
                        </article>
                    ))}
                </div>

                <div className="portfolio-disclaimer">
                    {pick(cryptoContent.disclaimer, language)}
                </div>
            </section>

            <PageFooter>
                <span>{aboutContent.name}</span> - {pick(cryptoContent.footer, language)}
            </PageFooter>
        </div>
    );
};

export default PortfolioCrypto;
