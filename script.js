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

// =========================================
// AMBIENT SOUND ENGINE (Web Audio API)
// Generates a lo-fi atmospheric drone -
// no external audio file required!
// =========================================
(function () {
    let audioCtx = null;
    let masterGain = null;
    let isPlaying = false;
    let nodes = [];

    function buildAmbientSound(ctx) {
        const master = ctx.createGain();
        master.gain.setValueAtTime(0, ctx.currentTime);
        master.connect(ctx.destination);

        // --- Soft bass drone (sine wave) ---
        const drone1 = ctx.createOscillator();
        drone1.type = 'sine';
        drone1.frequency.value = 55; // A1 note
        const drone1Gain = ctx.createGain();
        drone1Gain.gain.value = 0.08;
        drone1.connect(drone1Gain);
        drone1Gain.connect(master);
        drone1.start();

        // --- Slightly detuned second drone for warmth ---
        const drone2 = ctx.createOscillator();
        drone2.type = 'sine';
        drone2.frequency.value = 55.6; // very slightly detuned
        const drone2Gain = ctx.createGain();
        drone2Gain.gain.value = 0.06;
        drone2.connect(drone2Gain);
        drone2Gain.connect(master);
        drone2.start();

        // --- High harmonic shimmer ---
        const shimmer = ctx.createOscillator();
        shimmer.type = 'sine';
        shimmer.frequency.value = 220; // A3
        const shimmerGain = ctx.createGain();
        shimmerGain.gain.value = 0.025;
        // LFO to make shimmer breathe
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.2;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.015;
        lfo.connect(lfoGain);
        lfoGain.connect(shimmerGain.gain);
        lfo.start();
        shimmer.connect(shimmerGain);
        shimmerGain.connect(master);
        shimmer.start();

        // --- Filtered white noise (rain/wind texture) ---
        const bufferSize = ctx.sampleRate * 4; // 4 seconds of noise
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        noiseSource.loop = true;

        // Low-pass filter to make it a soft hiss, not harsh
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 400;
        noiseFilter.Q.value = 0.5;

        const noiseGain = ctx.createGain();
        noiseGain.gain.value = 0.04;

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(master);
        noiseSource.start();

        nodes = [drone1, drone2, shimmer, lfo, noiseSource];
        return master;
    }

    function startAmbient() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            masterGain = buildAmbientSound(audioCtx);
        }
        if (audioCtx.state === 'suspended') audioCtx.resume();
        masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
        masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
        masterGain.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 2); // 2s fade in
        isPlaying = true;
    }

    function stopAmbient() {
        if (!masterGain) return;
        masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
        masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 2); // 2s fade out
        setTimeout(() => { if (!isPlaying && audioCtx) audioCtx.suspend(); }, 2100);
        isPlaying = false;
    }

    window.__ambientToggle = function () {
        if (!isPlaying) {
            startAmbient();
            return true; // now on
        } else {
            stopAmbient();
            return false; // now off
        }
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    // Ambient Sound Toggle Button
    const soundToggleBtn = document.getElementById('sound-toggle');
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => {
            const nowOn = window.__ambientToggle();
            const icon = soundToggleBtn.querySelector('i');
            if (nowOn) {
                soundToggleBtn.classList.add('sound-on');
                icon.classList.replace('fa-volume-mute', 'fa-music');
            } else {
                soundToggleBtn.classList.remove('sound-on');
                icon.classList.replace('fa-music', 'fa-volume-mute');
            }
        });
    }


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

    // =========================================
    // INTERACTIVE HACKER TERMINAL
    // =========================================
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');

    const terminalCommands = {
        help: () => `Available commands:<br>
&nbsp;&nbsp;<span style="color:#00d2ff;">whoami</span>     - Who am I<br>
&nbsp;&nbsp;<span style="color:#00d2ff;">skills</span>     - My tech stack<br>
&nbsp;&nbsp;<span style="color:#00d2ff;">projects</span>   - My projects<br>
&nbsp;&nbsp;<span style="color:#00d2ff;">contact</span>    - Get in touch<br>
&nbsp;&nbsp;<span style="color:#00d2ff;">hobbies</span>    - What I love<br>
&nbsp;&nbsp;<span style="color:#00d2ff;">clear</span>      - Clear terminal<br>
&nbsp;&nbsp;<span style="color:#00d2ff;">github</span>     - My GitHub profile<br>
&nbsp;&nbsp;<span style="color:#00d2ff;">joke</span>       - A developer joke`,
        whoami: () => `Dev Kumar Jadaun — B.Tech CSE Student at GLA University, Mathura.<br>Java Developer | Full Stack Web Dev | AI Enthusiast | DSA Learner.`,
        skills: () => `Languages: <span style="color:#00d2ff;">Java, JavaScript, C, Python, HTML, CSS</span><br>Frameworks: <span style="color:#00d2ff;">React.js, Vite, Tailwind CSS, MEAN Stack</span><br>Core: <span style="color:#00d2ff;">Data Structures & Algorithms, OOP, Git</span>`,
        projects: () => `1. <span style="color:#00d2ff;">Weather Dashboard</span> — github.com/devjadaun/weather-dashboard<br>2. <span style="color:#00d2ff;">Smart Task Manager</span> — github.com/devjadaun/smart-task-manager`,
        contact: () => `Email: <span style="color:#00d2ff;">devthakur6920@gmail.com</span><br>GitHub: <span style="color:#00d2ff;">github.com/devjadaun</span><br>LinkedIn: <span style="color:#00d2ff;">linkedin.com/in/dev-kumar-jadaun-479172396</span>`,
        hobbies: () => `🎮 Competitive Programming<br>🤖 Exploring AI Tools<br>📝 Tech Blogging<br>🕹️ E-sports`,
        github: () => { window.open('https://github.com/devjadaun', '_blank'); return `Opening GitHub profile...`; },
        joke: () => {
            const jokes = [
                `Why do programmers prefer dark mode?<br>Because light attracts bugs! 🐛`,
                `A SQL query walks into a bar, walks up to two tables and asks...<br>"Can I join you?" 😄`,
                `Why do Java developers wear glasses?<br>Because they don't C#! 🤓`,
            ];
            return jokes[Math.floor(Math.random() * jokes.length)];
        },
        clear: () => { terminalOutput.innerHTML = ''; return null; },
    };

    if (terminalInput && terminalOutput) {
        // Click anywhere on terminal to focus input
        const terminalWindow = terminalInput.closest('.terminal-window');
        if (terminalWindow) {
            terminalWindow.addEventListener('click', () => terminalInput.focus());
        }

        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = terminalInput.value.trim().toLowerCase();
                terminalInput.value = '';

                // Show the command the user typed
                const cmdLine = document.createElement('div');
                cmdLine.className = 'term-line';
                cmdLine.innerHTML = `<span style="color:#00ff88;">dev_jadaun@portfolio</span>:<span style="color:#00d2ff;">~</span>$ ${cmd}`;
                terminalOutput.appendChild(cmdLine);

                if (cmd === '') return;

                if (terminalCommands[cmd]) {
                    const result = terminalCommands[cmd]();
                    if (result !== null) {
                        const resultLine = document.createElement('div');
                        resultLine.className = 'term-result';
                        resultLine.innerHTML = result;
                        terminalOutput.appendChild(resultLine);
                    }
                } else {
                    const errLine = document.createElement('div');
                    errLine.className = 'term-error';
                    errLine.textContent = `Command not found: '${cmd}'. Type 'help' for available commands.`;
                    terminalOutput.appendChild(errLine);
                }

                // Auto scroll to bottom
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }
        });
    }

    // =========================================
    // LIVE GITHUB STATS
    // =========================================
    async function fetchGitHubStats() {
        try {
            const userRes = await fetch('https://api.github.com/users/devjadaun');
            if (!userRes.ok) throw new Error('GitHub API limit reached');
            const userData = await userRes.json();

            // Animate count-up for repos, followers, following
            countUp('gh-repos-val', userData.public_repos);
            countUp('gh-followers-val', userData.followers);
            countUp('gh-following-val', userData.following);

            // Fetch all repos to sum up total stars
            const reposRes = await fetch('https://api.github.com/users/devjadaun/repos?per_page=100');
            if (!reposRes.ok) throw new Error('Repos API failed');
            const reposData = await reposRes.json();
            const totalStars = reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0);
            countUp('gh-stars-val', totalStars);

        } catch (err) {
            // Show dash if API fails (e.g., rate limited)
            ['gh-repos-val', 'gh-followers-val', 'gh-following-val', 'gh-stars-val'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = '–';
            });
        }
    }

    function countUp(elementId, target) {
        const el = document.getElementById(elementId);
        if (!el) return;
        const duration = 1500;
        const start = performance.now();
        const step = (timestamp) => {
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    // Trigger when GitHub section is in view
    const ghSection = document.getElementById('github-stats');
    if (ghSection) {
        const ghObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                fetchGitHubStats();
                ghObserver.disconnect();
            }
        }, { threshold: 0.2 });
        ghObserver.observe(ghSection);
    }

    // =========================================
    // ROCKET EASTER EGG 🚀
    // =========================================
    const rocketBtn = document.getElementById('rocket-easter-egg');
    const rocketCanvas = document.getElementById('rocket-canvas');

    if (rocketBtn && rocketCanvas) {
        const ctx = rocketCanvas.getContext('2d');
        let particles = [];
        let rocketAnim = null;
        let rocketY = 0;
        let rocketX = 0;
        let launched = false;

        function resizeCanvas() {
            rocketCanvas.width = window.innerWidth;
            rocketCanvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        function createParticle(x, y) {
            particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 3 + 1,
                size: Math.random() * 6 + 2,
                alpha: 1,
                color: `hsl(${Math.random() * 60 + 10}, 100%, 60%)`,
            });
        }

        function drawRocket(x, y) {
            ctx.save();
            ctx.font = '40px serif';
            ctx.textAlign = 'center';
            ctx.fillText('🚀', x, y);
            ctx.restore();
        }

        function animateRocket() {
            ctx.clearRect(0, 0, rocketCanvas.width, rocketCanvas.height);

            // Draw particles (exhaust trail)
            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= 0.025;
                if (p.alpha <= 0) { particles.splice(i, 1); return; }
                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            // Move rocket upward
            rocketY -= 8;
            for (let i = 0; i < 5; i++) createParticle(rocketX, rocketY + 30);
            drawRocket(rocketX, rocketY);

            // Explode at the top with fireworks
            if (rocketY < -60) {
                for (let i = 0; i < 60; i++) {
                    particles.push({
                        x: rocketX,
                        y: 60,
                        vx: (Math.random() - 0.5) * 12,
                        vy: (Math.random() - 0.5) * 12,
                        size: Math.random() * 5 + 2,
                        alpha: 1,
                        color: `hsl(${Math.random() * 360}, 100%, 65%)`,
                    });
                }
                cancelAnimationFrame(rocketAnim);
                // Finish drawing remaining particles
                function finishParticles() {
                    ctx.clearRect(0, 0, rocketCanvas.width, rocketCanvas.height);
                    let alive = false;
                    particles.forEach((p, i) => {
                        p.x += p.vx;
                        p.y += p.vy;
                        p.vy += 0.15; // gravity
                        p.alpha -= 0.018;
                        if (p.alpha <= 0) { particles.splice(i, 1); return; }
                        alive = true;
                        ctx.save();
                        ctx.globalAlpha = p.alpha;
                        ctx.fillStyle = p.color;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.restore();
                    });
                    if (alive) requestAnimationFrame(finishParticles);
                    else launched = false; // allow re-launch
                }
                requestAnimationFrame(finishParticles);
                return;
            }

            rocketAnim = requestAnimationFrame(animateRocket);
        }

        rocketBtn.addEventListener('click', () => {
            if (launched) return;
            launched = true;
            particles = [];
            rocketX = rocketBtn.getBoundingClientRect().left + 20;
            rocketY = window.innerHeight - 80;
            animateRocket();
        });
    }

});
