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
});
