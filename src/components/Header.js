import React from 'react';
import ThemeToggle from './ThemeToggle';
import LanguageButton from './LanguageButton';

const Header = ({ tab, setActiveTab }) => {

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <header className="main-header">
            <div className='content'>
                <div className='logo' onClick={() => handleTabClick('home')}>Tam Saitama<span className='dot'>.</span></div>

                <nav className="nav">
                    <div className={`nav-link ${tab === 'home' ? 'active' : ''}`} data-en="Home" data-vi="Trang chủ" onClick={() => handleTabClick('home')}>Home</div>
                    <div className={`nav-link ${tab === 'about' ? 'active' : ''}`} data-en="About" data-vi="Thông tin" onClick={() => handleTabClick('about')}>About</div>
                    <div className={`nav-link ${tab === 'report' ? 'active' : ''}`} data-en="Report" data-vi="Báo cáo" onClick={() => handleTabClick('report')}>Report</div>
                </nav>

                <div className="header-controls">
                    <LanguageButton />

                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
export default Header;