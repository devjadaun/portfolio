// Preloader logic
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Add a slight delay for dramatic effect
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }, 1500);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    
    // Only enable custom cursor if not on touch device
    if (window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            // Add a slight delay to the outline for a smooth trailing effect
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: 'forwards' });
        });
        
        // Add hover effects for interactive elements
        const interactives = document.querySelectorAll('a, button, input, textarea, .project-card, .skill-tag');
        
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '60px';
                cursorOutline.style.height = '60px';
                cursorOutline.style.backgroundColor = 'rgba(179, 54, 255, 0.1)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '40px';
                cursorOutline.style.height = '40px';
                cursorOutline.style.backgroundColor = 'transparent';
            });
        });
    }

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // Scroll Reveal Animations using Intersection Observer
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, revealOptions);
    
    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Typing effect for the hero section
    const roles = ["Developer", "Designer", "Engineer"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingElement = document.querySelector('.typing-text');
    
    function typeEffect() {
        if (!typingElement) return;
        
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 100 : 150;
        
        // Pause at the end of word
        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000; // Wait 2 seconds
            isDeleting = true;
        } 
        // Move to next word
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500; // Pause before typing new word
        }
        
        setTimeout(typeEffect, typeSpeed);
    }
    
    // Start typing effect after a small delay
    setTimeout(typeEffect, 1000);
    
    // Form Submission
    const form = document.getElementById('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            const btn = form.querySelector('button');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            btn.style.opacity = '0.8';
            
            // Create mailto link
            const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            
            window.location.href = `mailto:devthakur6920@gmail.com?subject=${subject}&body=${body}`;
            
            setTimeout(() => {
                btn.innerHTML = 'Message Sent! <i class="fas fa-check"></i>';
                btn.style.background = 'linear-gradient(45deg, #00d2ff, #00ff88)';
                form.reset();
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.style.opacity = '1';
                }, 3000);
            }, 1000);
        });
    }

    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    });

    // 3D Tilt Effect for Cards
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.boxShadow = `
                ${-rotateY}px ${rotateX}px 20px rgba(0,0,0,0.2),
                inset 0 0 0 1px var(--glass-border)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
            card.style.boxShadow = `var(--glass-shadow)`;
            // slight delay before removing inline styles so transition plays
            setTimeout(() => {
                if(!card.matches(':hover')) {
                    card.style.transform = '';
                    card.style.boxShadow = '';
                }
            }, 100);
        });
    });

    // Parallax Effect for Background Spheres
    const spheres = document.querySelectorAll('.gradient-sphere');
    const heroSection = document.querySelector('.hero');
    
    if (heroSection && spheres.length > 0 && window.matchMedia('(pointer: fine)').matches) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            spheres.forEach((sphere, index) => {
                const speed = (index + 1) * 20;
                const moveX = (x * speed) - (speed/2);
                const moveY = (y * speed) - (speed/2);
                
                sphere.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });
        
        heroSection.addEventListener('mouseleave', () => {
            spheres.forEach(sphere => {
                sphere.style.transform = '';
            });
        });
    }

    // Thor Hammer Scroll Animation
    const thorHammer = document.getElementById('thor-hammer');
    if (thorHammer) {
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight));
            
            // Move from left (-200px) to right (window width + 200px)
            const moveX = scrollPercent * (window.innerWidth + 400);
            
            // Rotate 360 degrees multiple times based on scroll
            const rotate = scrollPercent * 360 * 5; 
            
            thorHammer.style.transform = `translateX(${moveX}px) rotate(${rotate}deg)`;
        });
    }
    // Interactive Spider-Man
    const spideyContainer = document.querySelector('.spidey-container');
    const webLine = document.querySelector('.web-line');
    const spidey = document.querySelector('.spidey');
    
    if (spideyContainer && webLine && spidey) {
        // Add pointer cursor to show it's clickable
        spideyContainer.style.cursor = 'pointer';
        
        let isInteracting = false;
        

        // Click interaction: pull up and drop down
        spideyContainer.addEventListener('click', () => {
            if (isInteracting) return;
            isInteracting = true;
            
            spideyContainer.style.animation = 'none';
            
            // Pull up quickly
            webLine.style.transition = 'height 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            webLine.style.height = '40px';
            
            // Flip the spidey!
            spidey.style.transition = 'transform 0.4s ease';
            spidey.style.transform = 'scaleY(-1) translateY(-20px)';
            
            setTimeout(() => {
                // Drop back down with bounce
                webLine.style.transition = 'height 1s cubic-bezier(0.36, 0, 0.66, -0.56)';
                webLine.style.height = '150px';
                
                // Unflip
                spidey.style.transform = 'scaleY(1) translateY(0)';
                
                setTimeout(() => {
                    webLine.style.transition = '';
                    spidey.style.transition = '';
                    isInteracting = false;
                    // Resume tracking mouse based on current position
                }, 1000);
            }, 400);
        });
    }

});
