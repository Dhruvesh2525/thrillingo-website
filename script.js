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

    // 6. Auto-Scrolling Carousels (Page-based)
    function initCarousel(trackId, dotsId) {
        const track = document.getElementById(trackId);
        const dotsContainer = document.getElementById(dotsId);
        if (!track || !dotsContainer) return;

        let currentIndex = 0;

        function updateDots() {
            dotsContainer.innerHTML = '';
            // Calculate how many 'pages' exist based on scrollable width vs visible width
            const pages = Math.ceil(track.scrollWidth / track.clientWidth);
            
            if (pages <= 1) return; // No dots needed if everything fits

            for (let i = 0; i < pages; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === currentIndex) dot.classList.add('active');
                
                dot.addEventListener('click', () => {
                    track.scrollTo({
                        left: i * track.clientWidth,
                        behavior: 'smooth'
                    });
                });
                dotsContainer.appendChild(dot);
            }
        }

        // Initialize dots slightly delayed to ensure styles/images have loaded
        setTimeout(updateDots, 100);
        window.addEventListener('resize', () => setTimeout(updateDots, 100));

        // Update active dot on scroll
        track.addEventListener('scroll', () => {
            const dots = dotsContainer.querySelectorAll('.dot');
            if (dots.length === 0) return;
            
            // Calculate which 'page' we are currently viewing
            let newIndex = Math.round(track.scrollLeft / track.clientWidth);
            
            if (newIndex >= dots.length) newIndex = dots.length - 1;
            if (newIndex < 0) newIndex = 0;

            if (newIndex !== currentIndex && dots[newIndex]) {
                if(dots[currentIndex]) dots[currentIndex].classList.remove('active');
                currentIndex = newIndex;
                dots[currentIndex].classList.add('active');
            }
        });

        // Auto-scroll interval
        let autoScrollInterval = setInterval(scrollToNext, 4000);

        function scrollToNext() {
            const dots = dotsContainer.querySelectorAll('.dot');
            if (dots.length <= 1) return;

            let nextIndex = currentIndex + 1;
            
            // Check if we've reached the end
            if (nextIndex >= dots.length || track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
                nextIndex = 0; // Loop back
            }

            track.scrollTo({
                left: nextIndex * track.clientWidth,
                behavior: 'smooth'
            });
        }

        // Pause on hover
        track.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
        track.addEventListener('mouseleave', () => {
            autoScrollInterval = setInterval(scrollToNext, 4000);
        });
        
        // Pause on touch
        track.addEventListener('touchstart', () => clearInterval(autoScrollInterval), {passive: true});
        track.addEventListener('touchend', () => {
            autoScrollInterval = setInterval(scrollToNext, 4000);
        }, {passive: true});
    }

    initCarousel('dom-track', 'dom-dots');
    initCarousel('intl-track', 'intl-dots');
    initCarousel('partners-track', 'partners-dots');

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
