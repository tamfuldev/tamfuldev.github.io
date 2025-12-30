(function () {
    'use strict';

    const loader = document.getElementById('loader');
    const langToggle = document.getElementById('langToggle');
    const langLabel = langToggle.querySelector('.lang-label');
    const themeToggle = document.getElementById('themeToggle');
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');

    let currentLang = 'en';
    let particles = [];

    // Loading
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            animateSkills();
        }, 2000);
    });

    // Language Toggle
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'vi' : 'en';
        langLabel.textContent = currentLang.toUpperCase();
        updateLanguage();
    });

    function updateLanguage() {
        document.querySelectorAll('[data-en]').forEach(el => {
            const text = currentLang === 'en' ? el.dataset.en : el.dataset.vi;
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else {
                el.textContent = text;
            }
        });
    }

    // Theme Toggle
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        
        const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        localStorage.setItem('theme', theme);
    });


    // Canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            const isLight = document.body.classList.contains('light-theme');
            ctx.fillStyle = isLight ? `rgba(0,0,0,${this.opacity})` : `rgba(255,255,255,${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // function initParticles() {
    //     particles = [];
    //     const count = Math.min(80, Math.floor(canvas.width / 15));
    //     for (let i = 0; i < count; i++) {
    //         particles.push(new Particle());
    //     }
    // }

    function connectParticles() {
        const isLight = document.body.classList.contains('light-theme');
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    const opacity = (1 - dist / 120) * 0.2;
                    ctx.strokeStyle = isLight ? `rgba(0,0,0,${opacity})` : `rgba(255,255,255,${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
    }

    // initParticles();
    animate();

    // Skill Animation
    function animateSkills() {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const fill = entry.target;
                    const level = fill.dataset.level;
                    fill.style.width = level + '%';
                    observer.unobserve(fill);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.skill-fill').forEach(fill => observer.observe(fill));
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Year
    // document.getElementById('year').textContent = new Date().getFullYear();

    // console.log('%c🔒 Mr. White Portfolio', 'font-size: 20px; font-weight: bold; color: #fff; background: #000; padding: 10px;');
    // console.log('%cPrecision. Stealth. Results.', 'font-size: 14px; color: #888;');

})();