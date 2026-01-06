import React from "react";
const NotFound = () => {
    React.useEffect(() => {
        const lang = localStorage.getItem("language") || "en";
        document.querySelectorAll('[data-en]').forEach(el => {
            const text = (lang === 'en') ? el.dataset.en : el.dataset.vi;
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            }
            else {
                el.textContent = text;
            }
        });
    }, []);

    return (
        <div id="notfound">
            <div className="notfound">
                <div className="notfound-404"></div>
                <h1>404</h1>
                <h2 data-en="Oh no! It seems you've encountered a page that doesn't exist." data-vi="Thông tin">Oh no! It seems you've encountered a page that doesn't exist. </h2>
                <p data-en="Let's get you back on track." data-vi="Xin lỗi nhưng trang bạn đang tìm kiếm không tồn tại">Let's get you back on track.</p>
                <a href="/" data-en="Go to Home Page" data-vi="Quay lại">Go to Home Page</a>
            </div>
        </div>
    );
}

export default NotFound;