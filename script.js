document.addEventListener("DOMContentLoaded", () => {
    // 1. Intro Loader
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('slide-up');
        document.body.classList.remove('loading');
        
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) heroTitle.classList.add('animate-in');
        
        if (!window.location.hash) {
            window.scrollTo(0, 0);
        }
        
        initScrollReveals();
    }, 1500);

    // Cursor logic removed

    // 3. Navbar Scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if(window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 4. Mobile Menu
    const openMenuBtn = document.getElementById('open-menu');
    const closeMenuBtn = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (openMenuBtn && closeMenuBtn && mobileMenu) {
        openMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.classList.add('no-scroll');
        });
        
        closeMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
        
        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // 5. Scroll Reveals
    function initScrollReveals() {
        const revealElements = document.querySelectorAll('.reveal-up');
        const revealOnScroll = () => {
            const windowHeight = window.innerHeight;
            revealElements.forEach(el => {
                const revealTop = el.getBoundingClientRect().top;
                if(revealTop < windowHeight - 100) {
                    el.classList.add('active');
                }
            });
        };
        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll();
    }

    // 6. Horizontal Scroll Logic
    if (window.innerWidth > 992) {
        const wrapper = document.querySelector('.horizontal-scroll-wrapper');
        const stickyContainer = document.querySelector('.horizontal-sticky-container');
        const intlTrack = document.getElementById('intl-track');
        const domTrack = document.getElementById('dom-track');
        
        window.addEventListener('scroll', () => {
            if(!wrapper) return;
            const wrapperRect = wrapper.getBoundingClientRect();
            const wrapperTop = wrapperRect.top;
            const wrapperHeight = wrapperRect.height - window.innerHeight;
            
            // If scrolling within the wrapper
            if (wrapperTop <= 0 && wrapperTop >= -wrapperHeight) {
                // Calculate percentage (0 to 1)
                const progress = Math.abs(wrapperTop) / wrapperHeight;
                
                // Get width of active track minus viewport width to know how far to translate
                const activeTrack = document.querySelector('.active-track');
                const maxTranslate = activeTrack.scrollWidth - window.innerWidth + 40; // 40px padding instead of 100 since spacer removed
                
                const translateX = progress * maxTranslate;
                activeTrack.style.transform = `translateX(-${translateX}px)`;
            } else if (wrapperTop > 0) {
                intlTrack.style.transform = `translateX(0px)`;
                domTrack.style.transform = `translateX(0px)`;
            }
        });

        // Tabs logic for Horizontal
        const tabs = document.querySelectorAll('.minimal-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                if (tab.classList.contains('active')) return;
                
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const targetTrack = document.getElementById(tab.getAttribute('data-target'));
                const currentTrack = document.querySelector('.horizontal-track.active-track');
                
                if (currentTrack) {
                    currentTrack.style.opacity = '0';
                    setTimeout(() => {
                        currentTrack.classList.remove('active-track');
                        currentTrack.style.transform = 'translateX(0px)';
                        
                        targetTrack.classList.add('active-track');
                        // Force reflow
                        void targetTrack.offsetWidth;
                        targetTrack.style.opacity = '1';
                        
                        // Scroll page back to top of horizontal wrapper to restart journey
                        window.scrollTo({
                            top: wrapper.offsetTop,
                            behavior: 'smooth'
                        });
                    }, 400); // Wait for fade out
                }
            });
        });
    } else {
        // Mobile Tab logic (no horizontal scroll hijack, just standard overflow scroll)
        const tabs = document.querySelectorAll('.minimal-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                if (tab.classList.contains('active')) return;
                
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const targetTrack = document.getElementById(tab.getAttribute('data-target'));
                const currentTrack = document.querySelector('.horizontal-track.active-track');
                
                if (currentTrack) {
                    currentTrack.style.opacity = '0';
                    setTimeout(() => {
                        currentTrack.classList.remove('active-track');
                        targetTrack.classList.add('active-track');
                        // Force reflow
                        void targetTrack.offsetWidth;
                        targetTrack.style.opacity = '1';
                    }, 400);
                }
            });
        });
    }

    // 7. Stats Counter
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;
    
    window.addEventListener('scroll', () => {
        const statsSection = document.querySelector('.bento-small');
        if (statsSection && !hasCounted) {
            const rect = statsSection.getBoundingClientRect();
            if(rect.top < window.innerHeight) {
                hasCounted = true;
                counters.forEach(counter => {
                    const updateCount = () => {
                        const target = +counter.getAttribute('data-target');
                        const count = +counter.innerText;
                        const inc = target / 30; 
                        
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
    });
});
