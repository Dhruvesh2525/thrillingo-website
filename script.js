/* =========================================
   Thrillin.go | Interactions & Animations
========================================= */

// Preloader Logic
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('fade-out');
        document.body.classList.remove('no-scroll');
        // Trigger initial reveal
        revealOnScroll();
        // Start counter
        startCounters();
    }, 800);
});

// Disable scroll while preloading
document.body.classList.add('no-scroll');

// Cursor Glow Tracker (Ambient Aura)
const cursorGlow = document.querySelector('.cursor-glow');
let glowX = window.innerWidth / 2;
let glowY = window.innerHeight / 2;
let targetX = glowX;
let targetY = glowY;

if (window.innerWidth > 992 && cursorGlow) {
    cursorGlow.classList.add('active');
    
    window.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    const animateGlow = () => {
        glowX += (targetX - glowX) * 0.15;
        glowY += (targetY - glowY) * 0.15;
        
        cursorGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(animateGlow);
    };
    animateGlow();
}

// Magnetic Buttons
const magneticBtns = document.querySelectorAll('.magnetic-btn');

magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const position = btn.getBoundingClientRect();
        const x = e.clientX - position.left - position.width / 2;
        const y = e.clientY - position.top - position.height / 2;

        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
    });

    btn.addEventListener('mouseout', () => {
        btn.style.transform = 'translate(0px, 0px)';
    });
});

// Sticky Navbar Logic
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Parallax Hero Effect
const parallaxBg = document.querySelector('.parallax-bg');

window.addEventListener('scroll', () => {
    let scrollPos = window.scrollY;
    if(scrollPos < window.innerHeight) {
        parallaxBg.style.transform = `translateY(${scrollPos * 0.4}px)`;
    }
});

// Scroll Reveal Logic
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 100;

    revealElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);

// Counter Animation Logic
const counters = document.querySelectorAll('.counter');
let counterStarted = false;

const startCounters = () => {
    const statsSection = document.querySelector('.about-stats');
    if(!statsSection) return;
    
    const sectionTop = statsSection.getBoundingClientRect().top;
    
    if (sectionTop < window.innerHeight && !counterStarted) {
        counterStarted = true;
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / 50; // Speed

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 40);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }
}

window.addEventListener('scroll', startCounters);
