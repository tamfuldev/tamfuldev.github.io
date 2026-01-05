import React from 'react';
import ThemeToggle from './ThemeToggle';
import LanguageButton from './LanguageButton';

const Header = () => {
    return (
        <header className="main-header">
            <div className='content'>
                <div className='logo'>Tam Saitama<span className='dot'>.</span></div>

                <nav className="nav">
                    <a href="#about" data-en="About" data-vi="Thông tin">About</a>
                    <a href="#projects" data-en="Projects" data-vi="Dự án">Projects</a>
                    <a href="#contact" data-en="Contact" data-vi="Liên hệ">Contact</a>
                    <a href="/blog" data-en="Blog" data-vi="Blog">Blog</a>
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