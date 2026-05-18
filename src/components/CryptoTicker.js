import React from 'react';
import { fetchBinanceTickers, formatCryptoPrice, getTradeUrl } from '../utils/cryptoMarket';

const CryptoTicker = () => {
    const [coins, setCoins] = React.useState([]);

    const fetchCryptoData = async () => {
        try {
            setCoins(await fetchBinanceTickers());
        } catch (error) {
            console.error("Call error API data:", error);
        }
    };

    React.useEffect(() => {
        fetchCryptoData();
        const interval = setInterval(fetchCryptoData, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="ticker-wrapper">
            <div className="ticker-container">
                {[...coins, ...coins, ...coins].map((coin, index) => (
                    <a
                        href={getTradeUrl(coin.symbol)}
                        key={`${coin.apiSymbol}-${index}`}
                        className="ticker-item"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <span className="pair">{coin.pair}</span>
                        <span className={`change ${coin.change >= 0 ? 'up' : 'down'}`}>
                            {coin.change >= 0 ? '+' : ''}{coin.change.toFixed(2)}%
                        </span>
                        <span className="price">{formatCryptoPrice(coin.price)}</span>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default CryptoTicker;
