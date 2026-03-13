// CompuNet Computer Center - Main JavaScript

// Navigation System
class NavigationSystem {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navLinks = document.querySelector('.nav-links');
        this.init();
    }

    init() {
        if (this.hamburger && this.navLinks) {
            this.hamburger.addEventListener('click', () => this.toggleMenu());
            this.highlightActivePage();
            this.enableSmoothScroll();
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.navbar')) {
                    this.navLinks.classList.remove('active');
                }
            });
        }
    }

    enableSmoothScroll() {
        // Add smooth scroll behavior for internal anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                // Only handle internal anchor links (not just "#")
                if (href && href !== '#' && href.startsWith('#')) {
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        e.preventDefault();
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // Close mobile menu if open
                        if (this.navLinks) {
                            this.navLinks.classList.remove('active');
                        }
                    }
                }
            });
        });
    }

    toggleMenu() {
        this.navLinks.classList.toggle('active');
    }

    highlightActivePage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const links = document.querySelectorAll('.nav-links a');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
}

// Initialize Navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NavigationSystem();
});

// Copy UPI ID Function
function copyUPI() {
    const upiId = 'gayatrijoshiroshi@okaxis';
    
    // Use the Clipboard API
    navigator.clipboard.writeText(upiId).then(() => {
        // Show success alert
        alert('UPI ID copied to clipboard!');
    }).catch(err => {
        // Fallback for older browsers
        console.error('Failed to copy UPI ID:', err);
        alert('Failed to copy UPI ID. Please copy manually: ' + upiId);
    });
}

// Scroll to Top Button
class ScrollToTop {
    constructor() {
        this.button = document.getElementById('scrollToTop');
        this.init();
    }

    init() {
        if (this.button) {
            // Show/hide button based on scroll position
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    this.button.classList.add('visible');
                } else {
                    this.button.classList.remove('visible');
                }
            });

            // Scroll to top on click
            this.button.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
}

// Initialize Scroll to Top when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ScrollToTop();
});
