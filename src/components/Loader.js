import React from 'react';

const Loader = () => {
    const [loadingProgress, setLoadingProgress] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setLoadingProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 10;
            });
        }, 300);
        return () => clearInterval(interval);
    }, []);

    return (
        <div id="loader" className={loadingProgress >= 100 ? 'hidden' : ''}>
            <div className="loader-logo">
                <span className="loader-text">Tam Saitama</span>
                <span className="loader-dot">.</span>
            </div>
            <div className="loader-bar">
                <div className="loader-progress"></div>
            </div>
            <div className="loader-status" data-en="INITIALIZING SECURITY SYSTEMS..." data-vi="Khởi tạo hệ thống bảo mật...">INITIALIZING SECURITY SYSTEMS...</div>
        </div>
    );
}

export default Loader;