let activeLesson = null;

function toggleLesson(lessonNumber) {
    const lessonCard = document.querySelector(`.lesson-card:nth-child(${lessonNumber})`);

    // If clicking the same lesson, close it
    if (activeLesson === lessonNumber) {
        lessonCard.classList.remove('active');
        activeLesson = null;
        return;
    }

    // Close any previously active lesson
    if (activeLesson) {
        const previousActive = document.querySelector(`.lesson-card:nth-child(${activeLesson})`);
        previousActive.classList.remove('active');
    }

    // Open the clicked lesson
    lessonCard.classList.add('active');
    activeLesson = lessonNumber;

    // Update progress for this lesson
    updateProgress(lessonNumber);

    // Scroll the lesson into view if needed (for mobile)
    if (window.innerWidth < 768) {
        lessonCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function updateProgress(lessonNumber) {
    const progressBar = document.getElementById(`progress-${lessonNumber}`);
    if (progressBar) {
        if (activeLesson === lessonNumber) {
            // Animate progress bar fill
            setTimeout(() => {
                progressBar.style.width = '100%';
            }, 100);
        } else {
            // Reset progress bar when closing
            progressBar.style.width = '0%';
        }
    }
}

// Create cyber animation nodes with connecting lines
function createCyberAnimation() {
    const container = document.getElementById('cyberAnimation');
    const nodeCount = 50;
    const nodes = [];

    for (let i = 0; i < nodeCount; i++) {
        const node = document.createElement('div');
        node.classList.add('cyber-node');

        // Random position
        const left = Math.random() * 100;
        const top = Math.random() * 100;

        // Random animation delay
        const delay = Math.random() * 3;

        // Random size
        const size = 2 + Math.random() * 4;

        node.style.left = `${left}%`;
        node.style.top = `${top}%`;
        node.style.animationDelay = `${delay}s`;
        node.style.width = `${size}px`;
        node.style.height = `${size}px`;

        container.appendChild(node);
        nodes.push({ element: node, x: left, y: top, vx: (Math.random() - 0.5) * 0.1, vy: (Math.random() - 0.5) * 0.1 });
    }

    // Create connecting lines
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const node1 = nodes[i];
            const node2 = nodes[j];
            const distance = Math.sqrt((node1.x - node2.x) ** 2 + (node1.y - node2.y) ** 2);

            if (distance < 15) { // Only connect nearby nodes
                const line = document.createElement('div');
                line.classList.add('cyber-line');
                line.style.left = `${Math.min(node1.x, node2.x)}%`;
                line.style.top = `${Math.min(node1.y, node2.y)}%`;
                line.style.width = `${Math.abs(node1.x - node2.x)}%`;
                line.style.height = `${Math.abs(node1.y - node2.y)}%`;
                line.style.transform = `rotate(${Math.atan2(node2.y - node1.y, node2.x - node1.x)}rad)`;
                container.appendChild(line);
            }
        }
    }

    // Animate nodes movement
    function animateNodes() {
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;

            // Bounce off edges
            if (node.x <= 0 || node.x >= 100) node.vx *= -1;
            if (node.y <= 0 || node.y >= 100) node.vy *= -1;

            node.element.style.left = `${node.x}%`;
            node.element.style.top = `${node.y}%`;
        });
        requestAnimationFrame(animateNodes);
    }
    animateNodes();
}

// Navigation smooth scrolling and active link highlighting
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    const sections = document.querySelectorAll('section[id]');

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Account for sticky nav
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Scroll spy for active link highlighting
    function highlightActiveLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Throttle scroll event for better performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                highlightActiveLink();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Set initial active link
    highlightActiveLink();

    // Ensure "Back to Home" link navigates to index-final.html
    const backToHomeLink = document.querySelector('.nav-menu a[href="index-final.html"]');
    if (backToHomeLink) {
        backToHomeLink.addEventListener('click', (e) => {
            window.location.href = 'index-final.html';
        });
    }
}

// Keyboard navigation for lesson cards
function initKeyboardNavigation() {
    const lessonCards = document.querySelectorAll('.lesson-card');

    lessonCards.forEach((card, index) => {
        card.setAttribute('tabindex', '0');

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleLesson(index + 1);
            }
        });
    });
}

// Add click event listeners to lesson cards to toggle content
function initLessonCardClicks() {
    const lessonCards = document.querySelectorAll('.lesson-card');
    lessonCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            toggleLesson(index + 1);
        });
    });
}

// Dark/Light mode toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    // Check for saved theme preference or default to dark mode
    const currentTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', currentTheme);

    if (currentTheme === 'light') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        if (newTheme === 'light') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });
}

// Entrance animations on scroll using IntersectionObserver
function initScrollAnimations() {
    const sections = document.querySelectorAll('.section, .page-title, .lessons-container');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', () => {
    createCyberAnimation();
    initNavigation();
    initKeyboardNavigation();
    initLessonCardClicks();
    initThemeToggle();
    initScrollAnimations();

    // Set initial progress for first lesson
    updateProgress(1);
});
