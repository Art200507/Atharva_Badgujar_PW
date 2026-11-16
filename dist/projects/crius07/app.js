// App.js - Main JavaScript for Crius Website

class CriusWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.animateCounters();
        this.handleNavigation();
        this.setupIntersectionObserver();
        this.hideLoadingScreen();
    }

    setupEventListeners() {
        // Navigation
        document.querySelector('.hamburger').addEventListener('click', this.toggleMobileMenu);
        
        // Smooth scrolling for nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href').substring(1);
                this.scrollToSection(target);
            });
        });

        // Modal controls
        window.addEventListener('click', (e) => {
            const apiModal = document.getElementById('apiGuideModal');
            const videoModal = document.getElementById('demoVideoModal');
            
            if (e.target === apiModal) {
                this.closeModal();
            }
            if (e.target === videoModal) {
                this.closeDemoModal();
            }
        });

        // Step card interactions
        document.querySelectorAll('.step-card').forEach(card => {
            card.addEventListener('click', () => this.activateStep(card));
        });

        // Time selector in dashboard
        document.querySelectorAll('.time-selector button').forEach(btn => {
            btn.addEventListener('click', () => this.updateTimeframe(btn));
        });
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
        }, 2500);
    }

    toggleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = section.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    handleNavigation() {
        const navbar = document.querySelector('.navbar');
        let lastScrollTop = 0;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove scrolled class
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Update active nav link
            this.updateActiveNavLink();

            lastScrollTop = scrollTop;
        });
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    animateCounters() {
        const counters = [
            { element: document.getElementById('userCount'), target: 1234, suffix: '' },
            { element: document.getElementById('queryCount'), target: 50678, suffix: '' }
        ];

        counters.forEach(counter => {
            if (counter.element) {
                this.animateCounter(counter.element, 0, counter.target, 2000, counter.suffix);
            }
        });
    }

    animateCounter(element, start, end, duration, suffix = '') {
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            const current = Math.floor(start + (end - start) * this.easeOutQuart(progress));
            element.textContent = this.formatNumber(current) + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }

    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    formatNumber(num) {
        return num.toLocaleString();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, options);

        // Observe feature cards
        document.querySelectorAll('.feature-card').forEach(card => {
            observer.observe(card);
        });

        // Observe step cards
        document.querySelectorAll('.step-card').forEach(card => {
            observer.observe(card);
        });
    }

    activateStep(clickedCard) {
        document.querySelectorAll('.step-card').forEach(card => {
            card.classList.remove('active');
        });
        clickedCard.classList.add('active');

        // Add pulse animation
        clickedCard.style.animation = 'pulse 0.6s ease';
        setTimeout(() => {
            clickedCard.style.animation = '';
        }, 600);
    }

    updateTimeframe(clickedBtn) {
        document.querySelectorAll('.time-selector button').forEach(btn => {
            btn.classList.remove('active');
        });
        clickedBtn.classList.add('active');

        // Animate stats update
        this.updateDashboardStats(clickedBtn.textContent.toLowerCase());
    }

    updateDashboardStats(timeframe) {
        const stats = {
            today: { conversations: 127, cost: 2.45, images: 23 },
            week: { conversations: 892, cost: 16.78, images: 156 },
            month: { conversations: 3567, cost: 67.23, images: 645 }
        };

        const data = stats[timeframe] || stats.today;

        // Animate the numbers
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers[0].textContent = data.conversations;
        statNumbers[1].textContent = `$${data.cost}`;
        statNumbers[2].textContent = data.images;

        // Add update animation
        statNumbers.forEach(stat => {
            stat.style.animation = 'scaleUp 0.5s ease';
            setTimeout(() => {
                stat.style.animation = '';
            }, 500);
        });
    }

    // Modal functions
    showAPIGuide() {
        const modal = document.getElementById('apiGuideModal');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Load the detailed API guide content
        this.loadAPIGuideContent();
    }

    closeModal() {
        const modal = document.getElementById('apiGuideModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    async loadAPIGuideContent() {
        const modalBody = document.querySelector('.modal-body');
        
        // Simulate loading and then show the guide
        setTimeout(() => {
            modalBody.innerHTML = this.getAPIGuideHTML();
        }, 1000);
    }

    getAPIGuideHTML() {
        return `
            <div class="api-guide">
                <div class="guide-step">
                    <div class="step-header">
                        <div class="step-icon">
                            <i class="fab fa-google"></i>
                        </div>
                        <h3>Step 1: Create Google Cloud Account</h3>
                    </div>
                    <div class="step-content">
                        <p>If you don't already have one, create a Google Cloud account:</p>
                        <ol>
                            <li>Visit <a href="https://cloud.google.com/" target="_blank" class="guide-link">Google Cloud Console</a></li>
                            <li>Click "Get started for free"</li>
                            <li>Sign in with your Google account</li>
                            <li>Complete the setup process</li>
                        </ol>
                        <div class="guide-tip">
                            <i class="fas fa-lightbulb"></i>
                            <span>Google Cloud offers $300 in free credits for new users!</span>
                        </div>
                    </div>
                </div>

                <div class="guide-step">
                    <div class="step-header">
                        <div class="step-icon">
                            <i class="fas fa-project-diagram"></i>
                        </div>
                        <h3>Step 2: Create a New Project</h3>
                    </div>
                    <div class="step-content">
                        <p>Create a project to organize your API usage:</p>
                        <ol>
                            <li>In the Google Cloud Console, click the project dropdown at the top</li>
                            <li>Click "New Project"</li>
                            <li>Enter a project name (e.g., "Crius-AI")</li>
                            <li>Click "Create"</li>
                            <li>Wait for the project to be created and select it</li>
                        </ol>
                        <div class="guide-image-placeholder">
                            <i class="fas fa-image"></i>
                            <span>Project creation screenshot would go here</span>
                        </div>
                    </div>
                </div>

                <div class="guide-step">
                    <div class="step-header">
                        <div class="step-icon">
                            <i class="fas fa-cog"></i>
                        </div>
                        <h3>Step 3: Enable Gemini API</h3>
                    </div>
                    <div class="step-content">
                        <p>Enable the Gemini API for your project:</p>
                        <ol>
                            <li>Go to the <a href="https://console.cloud.google.com/apis/library" target="_blank" class="guide-link">API Library</a></li>
                            <li>Search for "Gemini API" or "Generative AI"</li>
                            <li>Click on "Gemini API"</li>
                            <li>Click "Enable"</li>
                            <li>Wait for the API to be enabled</li>
                        </ol>
                        <div class="guide-warning">
                            <i class="fas fa-exclamation-triangle"></i>
                            <span>Make sure billing is enabled on your project to use the API</span>
                        </div>
                    </div>
                </div>

                <div class="guide-step">
                    <div class="step-header">
                        <div class="step-icon">
                            <i class="fas fa-key"></i>
                        </div>
                        <h3>Step 4: Create API Key</h3>
                    </div>
                    <div class="step-content">
                        <p>Generate your API key:</p>
                        <ol>
                            <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" class="guide-link">Google AI Studio</a></li>
                            <li>Click "Create API Key"</li>
                            <li>Select your Google Cloud project</li>
                            <li>Click "Create API Key"</li>
                            <li>Copy the generated API key (starts with "AIza")</li>
                        </ol>
                        <div class="api-key-example">
                            <code>AIzaSyD1234567890abcdefghijklmnopqrstuvwxyz</code>
                            <i class="fas fa-copy copy-btn" onclick="copyToClipboard('AIzaSyD1234567890abcdefghijklmnopqrstuvwxyz')"></i>
                        </div>
                        <div class="guide-security">
                            <i class="fas fa-shield-alt"></i>
                            <span>Keep your API key secure and never share it publicly</span>
                        </div>
                    </div>
                </div>

                <div class="guide-step">
                    <div class="step-header">
                        <div class="step-icon">
                            <i class="fas fa-check"></i>
                        </div>
                        <h3>Step 5: You're Ready!</h3>
                    </div>
                    <div class="step-content">
                        <p>Now you can use your API key with Crius:</p>
                        <div class="final-steps">
                            <div class="final-step">
                                <i class="fas fa-download"></i>
                                <span>Install the Crius extension</span>
                            </div>
                            <div class="final-step">
                                <i class="fas fa-paste"></i>
                                <span>Paste your API key in the extension</span>
                            </div>
                            <div class="final-step">
                                <i class="fas fa-comments"></i>
                                <span>Start chatting with any webpage!</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="guide-footer">
                    <div class="cost-info">
                        <h4><i class="fas fa-dollar-sign"></i> Estimated Costs</h4>
                        <p>Gemini Flash is very affordable:</p>
                        <ul>
                            <li>Input: ~$0.075 per 1M tokens</li>
                            <li>Output: ~$0.30 per 1M tokens</li>
                            <li>Typical conversation: $0.001-$0.01</li>
                        </ul>
                        <div class="cost-tip">
                            <i class="fas fa-info-circle"></i>
                            <span>Our dashboard will help you track your usage and estimated costs</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Demo function
    showDemo() {
        console.log('showDemo called');
        const modal = document.getElementById('demoVideoModal');
        const video = document.getElementById('demoVideo');
        
        console.log('modal:', modal);
        console.log('video:', video);
        
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            if (video) {
                video.currentTime = 0;
            }
        } else {
            console.error('Modal not found!');
        }
    }

    closeDemoModal() {
        const modal = document.getElementById('demoVideoModal');
        const video = document.getElementById('demoVideo');
        
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
            
            if (video) {
                video.pause();
            }
        }
    }

    // Extension installation
    installExtension() {
        // This would redirect to Chrome Web Store when extension is published
        alert('Extension installation would redirect to Chrome Web Store! 🚀');
    }
}

// Global functions for onclick handlers
function scrollToSection(sectionId) {
    window.criusApp.scrollToSection(sectionId);
}

function showAPIGuide() {
    window.criusApp.showAPIGuide();
}

function closeModal() {
    window.criusApp.closeModal();
}

function showDemo() {
    window.criusApp.showDemo();
}

function closeDemoModal() {
    window.criusApp.closeDemoModal();
}

function downloadExtension() {
    window.open('https://github.com/Art200507/Crius07', '_blank', 'noopener,noreferrer');
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show a brief success message
        const copyBtn = event.target;
        const originalIcon = copyBtn.className;
        copyBtn.className = 'fas fa-check copy-btn success';
        setTimeout(() => {
            copyBtn.className = originalIcon;
        }, 2000);
    });
}

// Add additional CSS animations
const additionalStyles = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }

    @keyframes scaleUp {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }

    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .navbar.scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 2px 20px rgba(0,0,0,0.1);
    }

    .nav-link.active {
        color: #667eea;
    }

    .nav-link.active::after {
        width: 100%;
    }

    /* API Guide Styles */
    .api-guide {
        max-width: 100%;
    }

    .guide-step {
        margin-bottom: 40px;
        border: 1px solid #e0e0e0;
        border-radius: 15px;
        overflow: hidden;
    }

    .step-header {
        background: #f8faff;
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 15px;
        border-bottom: 1px solid #e0e0e0;
    }

    .step-icon {
        width: 50px;
        height: 50px;
        background: #667eea;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.2rem;
    }

    .step-header h3 {
        font-size: 1.2rem;
        font-weight: 600;
        color: #333;
        margin: 0;
    }

    .step-content {
        padding: 30px;
    }

    .step-content ol {
        margin: 15px 0;
        padding-left: 20px;
    }

    .step-content li {
        margin-bottom: 8px;
        line-height: 1.6;
    }

    .guide-link {
        color: #667eea;
        text-decoration: none;
        font-weight: 500;
    }

    .guide-link:hover {
        text-decoration: underline;
    }

    .guide-tip, .guide-warning, .guide-security, .cost-tip {
        background: #f0f8ff;
        border-left: 4px solid #667eea;
        padding: 15px;
        margin: 20px 0;
        border-radius: 0 8px 8px 0;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .guide-warning {
        background: #fff8f0;
        border-left-color: #ff8c00;
    }

    .guide-security {
        background: #f0fff8;
        border-left-color: #28a745;
    }

    .guide-image-placeholder {
        background: #f5f5f5;
        border: 2px dashed #ccc;
        padding: 40px;
        text-align: center;
        border-radius: 8px;
        margin: 20px 0;
        color: #666;
    }

    .api-key-example {
        background: #f8f8f8;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 15px;
        margin: 20px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-family: monospace;
    }

    .copy-btn {
        cursor: pointer;
        color: #667eea;
        transition: color 0.3s ease;
    }

    .copy-btn:hover {
        color: #5a67d8;
    }

    .copy-btn.success {
        color: #28a745;
    }

    .final-steps {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin: 20px 0;
    }

    .final-step {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        background: #f8faff;
        border-radius: 8px;
        border-left: 4px solid #667eea;
    }

    .guide-footer {
        background: #f8faff;
        padding: 30px;
        border-radius: 15px;
        margin-top: 30px;
    }

    .cost-info h4 {
        color: #333;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .cost-info ul {
        margin: 15px 0;
        padding-left: 20px;
    }

    .cost-info li {
        margin-bottom: 5px;
    }

    /* Mobile responsive for modal */
    @media (max-width: 768px) {
        .modal-content {
            width: 95%;
            margin: 2% auto;
            max-height: 95vh;
        }
        
        .step-header {
            flex-direction: column;
            text-align: center;
            gap: 10px;
        }
        
        .final-steps {
            gap: 10px;
        }
        
        .final-step {
            flex-direction: column;
            text-align: center;
            gap: 8px;
        }
    }
`;

// Add the additional styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.criusApp = new CriusWebsite();
});