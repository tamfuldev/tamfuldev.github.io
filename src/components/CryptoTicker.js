import React from 'react';
import axios from 'axios';


const CryptoTicker = () => {
    const [coins, setCoins] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    const fetchCryptoData = async () => {
        try {
            const symbols = [
                "BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "PAXGUSDT", 
                "ADAUSDT", "AVAXUSDT", "DOGEUSDT",
                "LINKUSDT", "SUIUSDT", "NEARUSDT", "LTCUSDT", "SHIBUSDT", // "DOTUSDT", "TRXUSDT",
                "PEPEUSDT", "BCHUSDT","UNIUSDT",
            ];
            
            const url = `https://api.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(symbols)}`;
            const response = await fetch(url);
            const data = await response.json();

            const formattedData = data.map(item => ({
                symbol: item.symbol,
                pair: item.symbol.replace('USDT', '/USDT'),
                price: parseFloat(item.lastPrice) < 1 ? parseFloat(item.lastPrice).toFixed(6) : parseFloat(item.lastPrice).toLocaleString(),
                change: parseFloat(item.priceChangePercent).toFixed(2) + '%',
                up: parseFloat(item.priceChangePercent) > 0
            }));

            setCoins(formattedData);
            setLoading(false);
        } catch (error) {
            console.error("Call error API data:", error);
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchCryptoData();
        const interval = setInterval(fetchCryptoData, 1000000);
        return () => clearInterval(interval);
    }, [coins]);

    return (
        <div className="ticker-wrapper">
            <div className="ticker-container">
                {[...coins, ...coins, ...coins].map((coin, index) => (
                    <a href={`https://www.binance.com/vi/trade/${coin.symbol}`} key={index} className="ticker-item" target="_blank">
                        <span className="pair">{coin.pair}</span>
                        <span className={`change ${coin.up ? 'up' : 'down'}`}>
                            {coin.change}
                        </span>
                        <span className="price">{coin.price}</span>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default CryptoTicker;