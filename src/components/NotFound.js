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
                <h2 data-en="Oops! Page Not Be Found" data-vi="Thông tin">Ối! Không tìm thấy trang</h2>
                <p data-en="Sorry but the page you are looking for does not exist. "
                    data-vi="Xin lỗi nhưng trang bạn đang tìm kiếm không tồn tại">Sorry but the page you are looking for does not exist. </p>
                <a href="/" data-en="Back to homepage" data-vi="Quay lại trang chủ">Back to homepage</a>
            </div>
        </div>
    );
}

export default NotFound;