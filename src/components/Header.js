import React from 'react';
import ThemeToggle from './ThemeToggle';
import LanguageButton from './LanguageButton';

const Header = ({ tab, setActiveTab }) => {
    const [isMobile, setMobile] = React.useState(false);
    const toggleMobilePhone = () => setMobile(!isMobile);

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
        setMobile(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="sidebar">
            <header className="site-header">
                <div className="content">
                    <div className='logo' onClick={() => handleTabClick('home')}>Tam Saitama<span className='dot'>.</span></div>

                    <div className="header-controls">
                        <nav className={`nav ${isMobile ? 'mobile-menu-open' : ''}`}>
                            <div className={`nav-link ${tab === 'about' ? 'active' : ''}`} data-en="About" data-vi="Thông tin" onClick={() => handleTabClick('about')}>About</div>
                            <div className={`nav-link ${tab === 'blog' ? 'active' : ''}`} data-en="Blog" data-vi="Bài viết" onClick={() => handleTabClick('blog')}>Blog</div>
                        </nav>
                        
                        <LanguageButton />
                        <ThemeToggle />
                    </div>

                    <div className={`menu-toggle ${isMobile ? 'open' : ''}`} onClick={toggleMobilePhone}>
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                    </div>
                </div>
            </header>
        </div>
    );
}
export default Header;