// =========================================
// THREE.JS 3D UNIVERSE BACKGROUND
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('bg-canvas');
    if (canvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.position.setZ(30);
        
        // 1. Central Wireframe Planet (Icosahedron)
        const geometry = new THREE.IcosahedronGeometry(10, 1);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x00d2ff, 
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        const planet = new THREE.Mesh(geometry, material);
        scene.add(planet);

        // 2. Floating Particles / Stars
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 700;
        const posArray = new Float32Array(particlesCount * 3);
        
        for(let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 100;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.15,
            color: 0x8c9eb5,
            transparent: true,
            opacity: 0.8
        });
        
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Interaction Variables
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - windowHalfX);
            mouseY = (event.clientY - windowHalfY);
        });

        // Animation Loop
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            // Rotate Planet
            planet.rotation.y += 0.002;
            planet.rotation.x += 0.001;
            
            // Rotate Particles slowly
            particlesMesh.rotation.y = -elapsedTime * 0.02;

            // Ease towards mouse position
            targetX = mouseX * 0.001;
            targetY = mouseY * 0.001;
            
            planet.rotation.y += 0.05 * (targetX - planet.rotation.y);
            planet.rotation.x += 0.05 * (targetY - planet.rotation.x);
            
            // Subtle camera movement based on scroll
            camera.position.y = -(window.scrollY * 0.005);

            renderer.render(scene, camera);
        }
        
        animate();

        // Handle Resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // Theme changes: automatically update colors via MutationObserver
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
                    material.color.setHex(isLight ? 0x0369a1 : 0x00d2ff);
                    material.opacity = isLight ? 0.25 : 0.15;
                    particlesMaterial.color.setHex(isLight ? 0x4b5563 : 0x8c9eb5);
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true });
        
        // Initial Theme check
        if (document.documentElement.getAttribute('data-theme') === 'light') {
            material.color.setHex(0x0369a1);
            material.opacity = 0.25;
            particlesMaterial.color.setHex(0x4b5563);
        }
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

    // --- Skills Radar Chart (Chart.js) ---
    // --- 3D Skill Cubes ---
    const cubesContainer = document.getElementById('skill-cubes-container');
    if (cubesContainer && typeof THREE !== 'undefined') {
        const width = cubesContainer.clientWidth;
        const height = cubesContainer.clientHeight;
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        camera.position.z = 8;
        
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        cubesContainer.appendChild(renderer.domElement);
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10, 20, 10);
        scene.add(dirLight);
        
        const skills = [
            { name: "Java", color: "#e23636", pos: [-3, 1, 0] },
            { name: "React", color: "#00d2ff", pos: [0, 2, 0] },
            { name: "Python", color: "#ffb347", pos: [3, 1, 0] },
            { name: "Node.js", color: "#27c93f", pos: [-1.5, -1.5, 0] },
            { name: "DSA", color: "#b336ff", pos: [1.5, -1.5, 0] }
        ];
        
        const cubes = [];
        
        skills.forEach((skill, index) => {
            // Create canvas texture for text
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            const ctx = canvas.getContext('2d');
            
            // Background
            ctx.fillStyle = skill.color;
            ctx.fillRect(0, 0, 256, 256);
            
            // Border
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 10;
            ctx.strokeRect(5, 5, 246, 246);
            
            // Text
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 50px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(skill.name, 128, 128);
            
            const texture = new THREE.CanvasTexture(canvas);
            
            const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
            const material = new THREE.MeshStandardMaterial({ 
                map: texture,
                roughness: 0.2,
                metalness: 0.1
            });
            
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(...skill.pos);
            
            // Initial random rotation
            cube.rotation.x = Math.random() * Math.PI;
            cube.rotation.y = Math.random() * Math.PI;
            
            scene.add(cube);
            cubes.push({ mesh: cube, speed: (Math.random() * 0.02) + 0.01 });
        });
        
        // Raycaster for hover interaction
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        cubesContainer.addEventListener('mousemove', (e) => {
            const rect = cubesContainer.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;
        });
        
        let hoveredCube = null;
        
        function animateCubes() {
            requestAnimationFrame(animateCubes);
            
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(cubes.map(c => c.mesh));
            
            if (intersects.length > 0) {
                if (hoveredCube !== intersects[0].object) {
                    // Reset old hovered
                    if (hoveredCube) hoveredCube.scale.set(1, 1, 1);
                    hoveredCube = intersects[0].object;
                    hoveredCube.scale.set(1.2, 1.2, 1.2);
                    cubesContainer.style.cursor = 'pointer';
                }
            } else {
                if (hoveredCube) {
                    hoveredCube.scale.set(1, 1, 1);
                    hoveredCube = null;
                    cubesContainer.style.cursor = 'default';
                }
            }
            
            cubes.forEach(c => {
                c.mesh.rotation.x += c.speed;
                c.mesh.rotation.y += c.speed;
            });
            
            renderer.render(scene, camera);
        }
        
        animateCubes();
        
        window.addEventListener('resize', () => {
            const newWidth = cubesContainer.clientWidth;
            const newHeight = cubesContainer.clientHeight;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        });
    }
});
