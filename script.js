document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       THEME TOGGLE (LIGHT / DARK MODE)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', initialTheme);
    updateThemeIcon(initialTheme);
    
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fa-solid fa-sun';
        } else {
            themeIcon.className = 'fa-solid fa-moon';
        }
    }

    /* ==========================================================================
       HEADER SCROLL STATE
       ========================================================================== */
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       MOBILE DRAWER MENU
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerClose = document.getElementById('mobile-drawer-close');
    const drawerLinks = document.querySelectorAll('.drawer-link');
    
    mobileToggle.addEventListener('click', () => {
        mobileDrawer.classList.add('open');
    });
    
    drawerClose.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
    });
    
    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileDrawer.classList.remove('open');
        });
    });

    /* ==========================================================================
       HERO SCROLL BUTTON
       ========================================================================== */
    const scrollBtn = document.getElementById('hero-scroll-btn');
    scrollBtn.addEventListener('click', () => {
        const aboutSection = document.getElementById('about');
        aboutSection.scrollIntoView({ behavior: 'smooth' });
    });

    /* ==========================================================================
       ACTIVE LINK ON SCROLL
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function highlightNavigation() {
        const scrollPosition = window.scrollY + 120; // offset for floating header
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
                
                // Edge case: if logos-intro or visuels-intro is active, highlight main gallery section
                if (sectionId === 'logos-intro') {
                    setActiveLink('#logos-section');
                } else if (sectionId === 'visuels-intro') {
                    setActiveLink('#visuels-section');
                }
            }
        });
    }
    
    function setActiveLink(href) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === href) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavigation);
    highlightNavigation();

    /* ==========================================================================
       POSTERS LIGHTBOX GALLERY
       ========================================================================== */
    const posterItems = document.querySelectorAll('.poster-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    let currentPosterIndex = 0;
    const postersData = [];
    
    // Collect data from HTML attributes
    posterItems.forEach((item, index) => {
        postersData.push({
            src: item.getAttribute('data-src'),
            title: item.getAttribute('data-title'),
            desc: item.getAttribute('data-desc')
        });
        
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });
    
    function openLightbox(index) {
        currentPosterIndex = index;
        updateLightboxContent();
        lightbox.classList.add('lightboxActive');
        document.body.style.overflow = 'hidden'; // prevent page scrolling
    }
    
    function closeLightbox() {
        lightbox.classList.remove('lightboxActive');
        document.body.style.overflow = ''; // restore scrolling
    }
    
    function updateLightboxContent() {
        const data = postersData[currentPosterIndex];
        lightboxImg.src = data.src;
        lightboxImg.alt = data.title;
        lightboxTitle.textContent = data.title;
        lightboxDesc.textContent = data.desc;
    }
    
    function navigatePrev() {
        currentPosterIndex = (currentPosterIndex - 1 + postersData.length) % postersData.length;
        updateLightboxContent();
    }
    
    function navigateNext() {
        currentPosterIndex = (currentPosterIndex + 1) % postersData.length;
        updateLightboxContent();
    }
    
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', navigatePrev);
    lightboxNext.addEventListener('click', navigateNext);
    
    // Close lightbox on clicking outside the content area
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content') || e.target.classList.contains('lightbox-img-wrapper')) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('lightboxActive')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                navigatePrev();
            } else if (e.key === 'ArrowRight') {
                navigateNext();
            }
        }
    });

    /* ==========================================================================
       CONTACT FORM SUBMIT (FORMSPREE)
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('contact-submit');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show loading state
        submitBtn.disabled = true;
        const originalBtnContent = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Envoi en cours... <i class="fa-solid fa-spinner fa-spin"></i>';
        
        fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;
            
            if (response.ok) {
                // Show success message
                formFeedback.textContent = 'Merci ! Votre message a été envoyé avec succès. Je vous répondrai dans les plus brefs délais.';
                formFeedback.className = 'form-feedback success';
                
                // Reset form
                contactForm.reset();
            } else {
                formFeedback.textContent = "Une erreur s'est produite. Merci de réessayer ou de m'écrire directement par email.";
                formFeedback.className = 'form-feedback error';
            }
            
            // Hide feedback after 6 seconds
            setTimeout(() => {
                formFeedback.className = 'form-feedback hidden';
            }, 6000);
        })
        .catch(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;
            
            formFeedback.textContent = "Une erreur s'est produite. Merci de réessayer ou de m'écrire directement par email.";
            formFeedback.className = 'form-feedback error';
            
            setTimeout(() => {
                formFeedback.className = 'form-feedback hidden';
            }, 6000);
        });
    });

    /* ==========================================================================
       SCROLL ANIMATIONS (INTERSECTION OBSERVER)
       ========================================================================== */
    const animatedElements = document.querySelectorAll(
        '.about-left, .about-right, .logo-item, .branding-display, .poster-item, .contact-form'
    );
    
    // CSS rules for scroll entrance animations (inserted dynamically to keep files clean)
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = `
        .reveal-hidden {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .reveal-visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(styleSheet);
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element reaches view
    });
    
    animatedElements.forEach(element => {
        element.classList.add('reveal-hidden');
        revealObserver.observe(element);
    });
});
