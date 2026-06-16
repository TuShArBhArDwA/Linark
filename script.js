/* ==========================================
   LINAARK ARCHITECTS - Interactive JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initThemeToggle();
    initCustomCursor();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initCounterAnimation();
    initScrollReveal();
    initProjectFilter();
    initContactForm();
    initParallaxEffects();
});

/* ==========================================
   THEME TOGGLE
   ========================================== */

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        html.setAttribute('data-theme', 'light');
    }

    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        // Add transition class for smooth theme switch
        html.classList.add('theme-transitioning');

        // Apply new theme
        if (newTheme === 'light') {
            html.setAttribute('data-theme', 'light');
        } else {
            html.removeAttribute('data-theme');
        }

        // Save preference
        localStorage.setItem('theme', newTheme);

        // Remove transition class after animation
        setTimeout(() => {
            html.classList.remove('theme-transitioning');
        }, 400);

        // Add click animation to button
        themeToggle.style.transform = 'scale(0.9) rotate(180deg)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 300);
    });
}

/* ==========================================
   CUSTOM CURSOR
   ========================================== */

function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    let isHoveringMagnetic = false;
    let magneticTarget = null;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor animation
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        if (isHoveringMagnetic && magneticTarget) {
            const rect = magneticTarget.getBoundingClientRect();
            // Snap to target center
            const targetX = rect.left + rect.width / 2;
            const targetY = rect.top + rect.height / 2;

            followerX += (targetX - followerX) * 0.2;
            followerY += (targetY - followerY) * 0.2;

            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';
            // Snap wrapper box size
            follower.style.width = (rect.width + 12) + 'px';
            follower.style.height = (rect.height + 12) + 'px';
            follower.style.borderRadius = getComputedStyle(magneticTarget).borderRadius;
            follower.style.transform = 'translate(-50%, -50%)';
        } else {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;

            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';
            follower.style.width = '';
            follower.style.height = '';
            follower.style.borderRadius = '';
            follower.style.transform = '';
        }

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects
    const hoverElements = document.querySelectorAll('.project-card, .service-card, .team-card, .filter-btn');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.classList.add('hover');
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
        });
    });

    // Magnetic Snapping elements
    const magneticElements = document.querySelectorAll('.nav-link, button, .cta-btn, .team-phone');
    magneticElements.forEach(el => {
        el.addEventListener('mouseenter', (e) => {
            isHoveringMagnetic = true;
            magneticTarget = e.currentTarget;
            follower.classList.add('snapped');
            cursor.style.opacity = '0';
        });

        el.addEventListener('mouseleave', () => {
            isHoveringMagnetic = false;
            magneticTarget = null;
            follower.classList.remove('snapped');
            cursor.style.opacity = '1';
        });
    });
}

/* ==========================================
   NAVBAR
   ========================================== */

function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active section highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

/* ==========================================
   MOBILE MENU
   ========================================== */

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* ==========================================
   SMOOTH SCROLL
   ========================================== */

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ==========================================
   COUNTER ANIMATION
   ========================================== */

function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;

    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });
    }

    // Trigger when hero section is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        observer.observe(heroStats);
    }
}

/* ==========================================
   SCROLL REVEAL ANIMATIONS
   ========================================== */

function initScrollReveal() {
    // Reveal elements on scroll
    const revealElements = document.querySelectorAll('.section-header, .about-content, .contact-wrapper');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal', 'active');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // Staggered card animations
    const cards = document.querySelectorAll('.service-card, .project-card, .team-card');

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    cards.forEach(card => cardObserver.observe(card));
}

/* ==========================================
   PROJECT FILTER
   ========================================== */

function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const emptyState = document.querySelector('.projects-empty-state');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            let matchCount = 0;

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    matchCount++;
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });

            // Handle empty state visibility
            if (emptyState) {
                if (matchCount === 0) {
                    emptyState.style.display = 'flex';
                    setTimeout(() => {
                        emptyState.classList.add('show');
                    }, 10);
                } else {
                    emptyState.classList.remove('show');
                    setTimeout(() => {
                        emptyState.style.display = 'none';
                    }, 300);
                }
            }
        });
    });
}

/* ==========================================
   CONTACT FORM
   ========================================== */

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea');
    const successScreen = document.querySelector('.contact-success-screen');

    // Create Toast Container
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icon = type === 'success' 
            ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
            : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
            
        toast.innerHTML = `
            ${icon}
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Remove toast after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Perform custom validation
        let isValid = true;
        let nameVal = '';
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                input.classList.add('invalid');
                isValid = false;
                
                // Remove invalid class on input
                input.addEventListener('input', () => {
                    input.classList.remove('invalid');
                }, { once: true });
            } else {
                input.classList.remove('invalid');
            }
            if (input.name === 'name') {
                nameVal = input.value.trim();
            }
        });

        if (!isValid) {
            showToast("Please fill out all the required fields.", "error");
            return;
        }

        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;

        // Animate button
        submitBtn.innerHTML = `
            <span>Sending...</span>
            <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="0">
                    <animate attributeName="stroke-dashoffset" values="0;120" dur="1s" repeatCount="indefinite"/>
                </circle>
            </svg>
        `;
        submitBtn.disabled = true;

        // Real form submission to Web3Forms
        const formData = new FormData(form);
        formData.append("access_key", "323fe07c-6255-40eb-a00f-3d3cb03b4dd1");

        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            const res = await response.json();
            if (response.status === 200) {
                // Success state transition
                form.style.transition = 'opacity 0.4s ease';
                form.style.opacity = '0';
                
                setTimeout(() => {
                    form.style.display = 'none';
                    if (successScreen) {
                        // Personalize success message
                        const successText = successScreen.querySelector('p');
                        if (successText && nameVal) {
                            successText.textContent = `Thank you for reaching out, ${nameVal}! We will get in touch with you shortly.`;
                        }
                        successScreen.style.display = 'flex';
                    }
                    showToast("Message sent successfully!", "success");
                }, 400);
            } else {
                // Server error state
                console.error(res);
                showToast("Something went wrong. Please try again.", "error");
                resetSubmitButton();
            }
        })
        .catch(error => {
            // Network error state
            console.error(error);
            showToast("Failed to send message. Please check your connection.", "error");
            resetSubmitButton();
        });

        function resetSubmitButton() {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // Handle send again button click
    const sendAgainBtn = document.querySelector('.btn-send-again');
    if (sendAgainBtn && successScreen) {
        sendAgainBtn.addEventListener('click', () => {
            successScreen.style.transition = 'opacity 0.4s ease';
            successScreen.style.opacity = '0';
            
            setTimeout(() => {
                successScreen.style.display = 'none';
                successScreen.style.opacity = ''; // reset opacity style
                
                // Reset form fields
                form.reset();
                inputs.forEach(input => input.classList.remove('has-value', 'invalid'));
                
                // Restore submit button to normal
                const submitBtn = form.querySelector('.btn-submit');
                submitBtn.innerHTML = `
                    <span>Send Message</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                `;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                
                // Show form again
                form.style.display = 'flex';
                form.style.opacity = '0';
                setTimeout(() => {
                    form.style.opacity = '1';
                }, 50);
            }, 400);
        });
    }

    // Floating label animation for inputs
    inputs.forEach(input => {
        // Run on load to capture preset/autofilled values
        if (input.value) {
            input.classList.add('has-value');
        }
        input.addEventListener('blur', () => {
            if (input.value) {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        });
    });
}

/* ==========================================
   PARALLAX EFFECTS
   ========================================== */

function initParallaxEffects() {
    const shapes = document.querySelectorAll('.shape');
    const ctaShapes = document.querySelectorAll('.cta-shape');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        shapes.forEach((shape, i) => {
            const speed = (i + 1) * 0.1;
            shape.style.transform = `translateY(${scrollY * speed}px)`;
        });

        ctaShapes.forEach((shape, i) => {
            const speed = (i + 1) * 0.05;
            shape.style.transform = `translateY(${-scrollY * speed}px)`;
        });
    });
}

/* ==========================================
   MAGNETIC BUTTON EFFECT
   ========================================== */

const magneticButtons = document.querySelectorAll('.btn-primary, .btn-secondary');

magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

/* ==========================================
   TEXT SCRAMBLE EFFECT
   ========================================== */

class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];

        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }

        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;

        for (let i = 0; i < this.queue.length; i++) {
            let { from, to, start, end, char } = this.queue[i];

            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="scramble">${char}</span>`;
            } else {
                output += from;
            }
        }

        this.el.innerHTML = output;

        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Apply scramble effect to hero title on preloader completion
function triggerHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const lines = heroTitle.querySelectorAll('.line');
        lines.forEach((line, i) => {
            const originalText = line.innerText;
            const scrambler = new TextScramble(line);
            setTimeout(() => {
                scrambler.setText(originalText);
            }, i * 200);
        });
    }
}

/* ==========================================
   TYPING EFFECT FOR TAGLINE
   ========================================== */

function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

/* ==========================================
   INITIALIZE VISIBLE CARDS
   ========================================== */

// Make initially visible cards show immediately
window.addEventListener('load', () => {
    setTimeout(() => {
        const visibleCards = document.querySelectorAll('.service-card, .project-card, .team-card');
        visibleCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                card.classList.add('visible');
            }
        });
    }, 100);
});

/* ==========================================
   PRELOADER (Optional)
   ========================================== */

window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            document.body.classList.add('loaded');
            // Trigger Hero animations
            triggerHeroAnimations();
        }, 2200); // Wait for line animation
    } else {
        document.body.classList.add('loaded');
        triggerHeroAnimations();
    }
});

/* ==========================================
   TILT EFFECT FOR CARDS
   ========================================== */

const tiltCards = document.querySelectorAll('.project-card, .service-card');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

console.log('🏛️ Linaark Architects - Website Loaded Successfully');
