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

    // 6. Auto-Scrolling Carousels (Super Smooth JS Easing)
    function initCarousel(trackId, dotsId) {
        const track = document.getElementById(trackId);
        const dotsContainer = document.getElementById(dotsId);
        if (!track || !dotsContainer) return;

        let cards = track.querySelectorAll('.journey-card, .partner-card');
        if (cards.length === 0) return;

        let currentIndex = 0;
        let isAnimating = false;

        // Easing function for luxurious, smooth sliding
        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        // Custom smooth scroll engine
        function smoothScrollTo(element, targetPosition, duration) {
            isAnimating = true;
            const startPosition = element.scrollLeft;
            const distance = targetPosition - startPosition;
            let startTime = null;

            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                
                element.scrollLeft = startPosition + (distance * easeInOutCubic(progress));

                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                } else {
                    isAnimating = false;
                }
            }
            requestAnimationFrame(animation);
        }

        function getCardWidth() {
            return cards[0].offsetWidth + parseInt(window.getComputedStyle(track).gap || 30);
        }

        function updateDots() {
            dotsContainer.innerHTML = '';
            const maxScrollLeft = track.scrollWidth - track.clientWidth;
            
            // Generate dots for each visible step
            const totalSteps = Math.ceil(maxScrollLeft / getCardWidth()) + 1;
            
            if (totalSteps <= 1) return; // Hide dots if everything fits

            for (let i = 0; i < totalSteps; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === currentIndex) dot.classList.add('active');
                
                dot.addEventListener('click', () => {
                    if (isAnimating) return;
                    
                    let targetScroll = i * getCardWidth();
                    // Don't scroll past the max
                    if (targetScroll > maxScrollLeft) targetScroll = maxScrollLeft;
                    
                    smoothScrollTo(track, targetScroll, 1000); // 1000ms duration
                });
                dotsContainer.appendChild(dot);
            }
        }

        setTimeout(updateDots, 150);
        window.addEventListener('resize', () => setTimeout(updateDots, 150));

        // Sync active dot on scroll (handles manual swiping too)
        track.addEventListener('scroll', () => {
            if (isAnimating) return; // Let the animation control the dots if it's running
            
            const dots = dotsContainer.querySelectorAll('.dot');
            if (dots.length === 0) return;
            
            let newIndex = Math.round(track.scrollLeft / getCardWidth());
            
            // Force last dot if at the very end
            if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 10) {
                newIndex = dots.length - 1;
            }

            if (newIndex >= dots.length) newIndex = dots.length - 1;
            if (newIndex < 0) newIndex = 0;

            if (newIndex !== currentIndex && dots[newIndex]) {
                if(dots[currentIndex]) dots[currentIndex].classList.remove('active');
                currentIndex = newIndex;
                dots[currentIndex].classList.add('active');
            }
        });

        let autoScrollInterval = setInterval(scrollToNext, 4500);

        function scrollToNext() {
            if (isAnimating) return;
            const dots = dotsContainer.querySelectorAll('.dot');
            if (dots.length <= 1) return;

            let nextIndex = currentIndex + 1;
            let targetScroll = nextIndex * getCardWidth();
            const maxScrollLeft = track.scrollWidth - track.clientWidth;

            // Loop back if we hit the end
            if (nextIndex >= dots.length || track.scrollLeft >= maxScrollLeft - 10) {
                nextIndex = 0;
                targetScroll = 0;
            }

            // Update dots explicitly during JS animation
            if(dots[currentIndex]) dots[currentIndex].classList.remove('active');
            currentIndex = nextIndex;
            if(dots[currentIndex]) dots[currentIndex].classList.add('active');

            // Smoothly slide to the target
            smoothScrollTo(track, targetScroll, 1000);
        }

        // Pause auto-scroll on interactions
        track.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
        track.addEventListener('mouseleave', () => {
            clearInterval(autoScrollInterval);
            autoScrollInterval = setInterval(scrollToNext, 4500);
        });
        track.addEventListener('touchstart', () => clearInterval(autoScrollInterval), {passive: true});
        track.addEventListener('touchend', () => {
            clearInterval(autoScrollInterval);
            autoScrollInterval = setInterval(scrollToNext, 4500);
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
