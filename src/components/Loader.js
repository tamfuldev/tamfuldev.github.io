import React from 'react';

const Loader = ({ delay = 300 }) => {
    const [loadingProgress, setLoadingProgress] = React.useState(false);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setLoadingProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 10;
            });
        }, delay);
        return () => clearInterval(interval);
    }, [delay]);

    return (
        <div id="loader" className={loadingProgress >= 100 ? 'hidden' : ''}>
            <div className="loader-logo">
                <span className="loader-text">Tam Saitama</span>
                <span className="loader-dot">.</span>
            </div>
            <div className="loader-bar">
                <div className="progress-fill"></div>
            </div>
            <div className="loader-status" data-en="OPEN SESAME..." data-vi="VỪNG ƠI, MỞ RA...">OPEN SESAME...</div>
        </div>
    );
}

export default Loader;