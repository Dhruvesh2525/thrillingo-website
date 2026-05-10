document.addEventListener("DOMContentLoaded", () => {
    // 1. Intro Loader
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('slide-up');
        document.body.classList.remove('loading');
        initScrollReveals();
    }, 1500);

    // 2. Custom Cursor & Magnetic Elements
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const magneticElements = document.querySelectorAll('.magnetic');
    const magneticTextElements = document.querySelectorAll('.magnetic-text');
    const hoverImgElements = document.querySelectorAll('.hover-img');

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    // Only run cursor logic on non-touch devices
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Dot follows instantly
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        });

        const animateCursor = () => {
            // Outline follows with lerp (easing)
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
            
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Magnetic Pull Logic
        const applyMagnetic = (elements, strength) => {
            elements.forEach(el => {
                el.addEventListener('mousemove', (e) => {
                    const rect = el.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    
                    const distX = e.clientX - centerX;
                    const distY = e.clientY - centerY;
                    
                    el.style.transform = `translate(${distX * strength}px, ${distY * strength}px)`;
                });
                
                el.addEventListener('mouseleave', () => {
                    el.style.transform = `translate(0px, 0px)`;
                });
            });
        };
        
        applyMagnetic(magneticElements, 0.4);
        applyMagnetic(magneticTextElements, 0.2);

        // Hover expand logic
        document.querySelectorAll('[data-cursor]').forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-expand');
                cursorOutline.setAttribute('data-text', el.getAttribute('data-cursor'));
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-expand');
                cursorOutline.setAttribute('data-text', '');
            });
        });
    }

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
                const maxTranslate = activeTrack.scrollWidth - window.innerWidth + 100; // 100px padding
                
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
                tabs.forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.horizontal-track').forEach(tr => {
                    tr.classList.remove('active-track');
                    tr.style.transform = 'translateX(0px)'; // Reset position on swap
                });
                
                tab.classList.add('active');
                document.getElementById(tab.getAttribute('data-target')).classList.add('active-track');
                
                // Scroll page back to top of horizontal wrapper to restart journey
                window.scrollTo({
                    top: wrapper.offsetTop,
                    behavior: 'smooth'
                });
            });
        });
    } else {
        // Mobile Tab logic (no horizontal scroll hijack, just standard overflow scroll)
        const tabs = document.querySelectorAll('.minimal-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.horizontal-track').forEach(tr => tr.classList.remove('active-track'));
                
                tab.classList.add('active');
                document.getElementById(tab.getAttribute('data-target')).classList.add('active-track');
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
