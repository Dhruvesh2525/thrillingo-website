document.addEventListener("DOMContentLoaded", () => {
    // Preloader
    const preloader = document.getElementById('preloader');
    document.body.classList.add('no-scroll');
    
    setTimeout(() => {
        preloader.classList.add('fade-out');
        document.body.classList.remove('no-scroll');
        
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => {
            const rect = el.getBoundingClientRect();
            if(rect.top < window.innerHeight) {
                el.classList.add('active');
            }
        });
    }, 1200);

    // Navbar Background Scroll Toggle
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if(window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const openMenuBtn = document.getElementById('open-menu');
    const closeMenuBtn = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    if (openMenuBtn && closeMenuBtn && mobileMenu) {
        openMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.classList.add('no-scroll');
        });
        
        const closeMenu = () => {
            mobileMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        };
        
        closeMenuBtn.addEventListener('click', closeMenu);
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // Tabbing Logic (International vs Domestic)
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active-tab'));
            
            // Activate clicked tab
            btn.classList.add('active');
            const target = btn.getAttribute('data-tab');
            document.getElementById(target).classList.add('active-tab');
        });
    });

    // FAQs Accordion Logic
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const faqItem = btn.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            
            // Is it already open?
            if (faqItem.classList.contains('active')) {
                faqItem.classList.remove('active');
                answer.style.maxHeight = null;
            } else {
                // Close any currently open faq-items
                document.querySelectorAll('.faq-item.active').forEach(openItem => {
                    openItem.classList.remove('active');
                    openItem.querySelector('.faq-answer').style.maxHeight = null;
                });
                
                // Open the clicked one
                faqItem.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // Scroll Reveal Logic
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 50;
        
        revealElements.forEach(el => {
            const revealTop = el.getBoundingClientRect().top;
            if(revealTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger instantly on load

    // Stats counter (Number counting animation)
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;
    
    const startCounting = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / 30; // speed of counting
                
                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 40);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };
    
    // Target the stats grid to know when to trigger counter
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        window.addEventListener('scroll', () => {
            const rect = statsSection.getBoundingClientRect();
            // Start counter when stats are in viewport
            if(rect.top < window.innerHeight && !hasCounted) {
                hasCounted = true;
                startCounting();
            }
        });
    }

    // Cursor Glow Aura tracker
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

    // Form submission mock
    const form = document.querySelector('.sleek-form');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop page reload
            const btn = form.querySelector('button');
            const ogText = btn.innerHTML;
            btn.innerHTML = `<i class='bx bx-check'></i> Inquiry Sent`;
            btn.style.background = '#10b981'; // Green success color
            
            // Revert after 3s
            setTimeout(() => {
                btn.innerHTML = ogText;
                btn.style.background = '';
                form.reset();
            }, 3000);
        });
    }

    // --- 3D Dynamic Tilt & Tracking Engine ---
    // Only enable on non-touch / desktop devices for performance
    if (window.matchMedia("(pointer: fine)").matches && window.innerWidth > 768) {
        
        // 1. Hero 3D Tracking
        const heroContent = document.querySelector('.hero-content');
        const heroSection = document.getElementById('hero');
        
        if (heroContent && heroSection) {
            heroSection.addEventListener('mousemove', (e) => {
                const rect = heroSection.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -5; // max 5 deg
                const rotateY = ((x - centerX) / centerX) * 5;  // max 5 deg
                
                heroContent.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            heroSection.addEventListener('mouseleave', () => {
                heroContent.style.transform = `rotateX(0deg) rotateY(0deg)`;
            });
        }

        // 2. 3D Card Tilt Engine
        const tiltCards = document.querySelectorAll('.dest-card, .service-card, .testimonial-card');
        
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // x position within the element.
                const y = e.clientY - rect.top;  // y position within the element.
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calculate rotation based on cursor position relative to center
                // The further from center, the greater the rotation
                const rotateX = ((y - centerY) / centerY) * -10; // max 10 deg tilt
                const rotateY = ((x - centerX) / centerX) * 10;
                
                card.classList.add('tilt-active');
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.classList.remove('tilt-active');
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                
                // Remove inline styles after transition to let CSS hover take over if needed
                setTimeout(() => {
                    if (!card.classList.contains('tilt-active')) {
                        card.style.transform = '';
                    }
                }, 400); 
            });
        });
    } else {
        // --- Mobile Scroll-Driven 3D Tilt Engine ---
        // For touch devices, use scroll position to tilt cards dynamically
        const tiltCards = document.querySelectorAll('.dest-card, .service-card, .testimonial-card');
        
        const tiltOnScroll = () => {
            const windowHeight = window.innerHeight;
            const centerY = windowHeight / 2;
            
            tiltCards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const cardCenterY = rect.top + (rect.height / 2);
                
                // If card is in viewport
                if (rect.bottom > 0 && rect.top < windowHeight) {
                    // Calculate distance from center of screen (-1 to 1)
                    let distanceFromCenter = (cardCenterY - centerY) / centerY;
                    
                    // Cap it to prevent extreme rotation if user scrolls very fast
                    if (distanceFromCenter > 1) distanceFromCenter = 1;
                    if (distanceFromCenter < -1) distanceFromCenter = -1;
                    
                    // Max tilt of 12 degrees
                    const rotateX = distanceFromCenter * 12; 
                    
                    // Add tilt-active to apply faster transitions
                    card.classList.add('tilt-active');
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) scale3d(0.98, 0.98, 0.98)`;
                }
            });
        };
        
        // Use requestAnimationFrame for smooth scrolling performance
        let isScrolling = false;
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    tiltOnScroll();
                    isScrolling = false;
                });
                isScrolling = true;
            }
        }, { passive: true });
        
        // Initial trigger
        setTimeout(tiltOnScroll, 500);
    }
});
