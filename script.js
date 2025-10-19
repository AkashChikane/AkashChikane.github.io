// GitHub username
const GITHUB_USERNAME = 'AkashChikane';

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Typing animation effect
function typeWriter() {
    const texts = ['Software Engineer', 'Full Stack Developer', 'Problem Solver', 'Code Enthusiast'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseTime = 2000;
    
    const typingElement = document.querySelector('.typing-text');
    
    function type() {
        const currentText = texts[textIndex];
        
        if (!isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(type, pauseTime);
                return;
            }
        } else {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
            }
        }
        
        setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
    }
    
    type();
}

// Intersection Observer for animations
function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
}

// Function to fetch GitHub repositories
async function fetchGitHubPages() {
    const loadingElement = document.getElementById('loading');
    const projectsGrid = document.getElementById('projects-grid');
    const errorMessage = document.getElementById('error-message');

    try {
        // Fetch all repositories
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }

        const repos = await response.json();
        
        // Filter repositories that have GitHub Pages enabled and exclude the main portfolio site
        const pagesRepos = repos.filter(repo => 
            repo.has_pages && 
            !repo.private && 
            repo.name !== `${GITHUB_USERNAME}.github.io`
        );
        
        // Hide loading spinner
        loadingElement.style.display = 'none';

        if (pagesRepos.length === 0) {
            errorMessage.style.display = 'block';
            errorMessage.textContent = '🚀 No GitHub Pages found yet. Start creating some awesome projects!';
            return;
        }

        // Create project cards with staggered animation
        pagesRepos.forEach((repo, index) => {
            const card = createProjectCard(repo);
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            projectsGrid.appendChild(card);
            
            // Staggered animation
            setTimeout(() => {
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });

    } catch (error) {
        console.error('Error fetching GitHub Pages:', error);
        loadingElement.style.display = 'none';
        errorMessage.style.display = 'block';
        errorMessage.textContent = '⚠️ Failed to load projects. Please try again later.';
    }
}

// Function to create a project card
function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';

    // Determine the GitHub Pages URL
    let pagesUrl;
    if (repo.name === `${GITHUB_USERNAME}.github.io`) {
        pagesUrl = `https://${GITHUB_USERNAME.toLowerCase()}.github.io`;
    } else {
        pagesUrl = `https://${GITHUB_USERNAME.toLowerCase()}.github.io/${repo.name}`;
    }

    // Get icon based on repository name or topics
    const icon = getProjectIcon(repo);

    // Get description or default text
    const description = repo.description || 'A GitHub Pages project showcasing innovation and creativity';

    // Create card HTML
    card.innerHTML = `
        <div class="project-icon">${icon}</div>
        <h3>${repo.name}</h3>
        <p>${description}</p>
        <a href="${pagesUrl}" target="_blank" class="project-link">
            Visit Site →
        </a>
        <div class="project-meta">
            ${repo.language ? `<span class="meta-tag">${repo.language}</span>` : ''}
            ${repo.stargazers_count > 0 ? `<span class="meta-tag">⭐ ${repo.stargazers_count}</span>` : ''}
            ${repo.forks_count > 0 ? `<span class="meta-tag">🔀 ${repo.forks_count}</span>` : ''}
        </div>
    `;

    return card;
}

// Function to get icon for project
function getProjectIcon(repo) {
    const name = repo.name.toLowerCase();
    const topics = repo.topics || [];
    
    // Check for common project types
    if (name.includes('portfolio') || name.includes('profile')) return '👤';
    if (name.includes('blog')) return '📝';
    if (name.includes('game')) return '🎮';
    if (name.includes('music')) return '🎵';
    if (name.includes('food') || name.includes('recipe') || name.includes('thali') || name.includes('nutri')) return '🍽️';
    if (name.includes('water') || name.includes('tracker')) return '💧';
    if (name.includes('notes')) return '📓';
    if (name.includes('todo') || name.includes('task')) return '✅';
    if (name.includes('weather')) return '🌤️';
    if (name.includes('calculator')) return '🧮';
    if (name.includes('chart') || name.includes('graph')) return '📊';
    if (name.includes('map')) return '🗺️';
    if (name.includes('photo') || name.includes('gallery')) return '📸';
    if (name.includes('timer') || name.includes('clock')) return '⏰';
    if (name.includes('chat')) return '💬';
    if (name.includes('doc')) return '📄';
    if (name.includes('api')) return '🔌';
    if (name.includes('bot')) return '🤖';
    if (name.includes('shop') || name.includes('store') || name.includes('ecommerce')) return '🛒';
    
    // Check topics
    if (topics.includes('react')) return '⚛️';
    if (topics.includes('vue')) return '💚';
    if (topics.includes('angular')) return '🅰️';
    if (topics.includes('javascript')) return '📜';
    if (topics.includes('python')) return '🐍';
    
    // Check language
    if (repo.language) {
        const lang = repo.language.toLowerCase();
        if (lang.includes('javascript')) return '📜';
        if (lang.includes('python')) return '🐍';
        if (lang.includes('java')) return '☕';
        if (lang.includes('go')) return '🐹';
        if (lang.includes('rust')) return '🦀';
        if (lang.includes('c++') || lang.includes('cpp')) return '⚙️';
    }
    
    // Default icon
    return '🚀';
}

// Parallax effect for avatar
function parallaxEffect() {
    const avatar = document.querySelector('.avatar-wrapper');
    if (!avatar) return;
    
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX - window.innerWidth / 2) / 50;
        const y = (e.clientY - window.innerHeight / 2) / 50;
        avatar.style.transform = `translate(${x}px, ${y}px)`;
    });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Start typing animation
    typeWriter();
    
    // Initialize parallax
    parallaxEffect();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Observe elements for animations
    observeElements();
    
    // Fetch GitHub Pages
    fetchGitHubPages();
    
    // Add scroll indicator hide on scroll
    let lastScroll = 0;
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (scrollIndicator) {
            if (currentScroll > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        }
        
        lastScroll = currentScroll;
    });
});
