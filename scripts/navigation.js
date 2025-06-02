// Shared navigation functionality
document.addEventListener("DOMContentLoaded", () => {
    updateNavigation();
    initializeMobileMenu();
});

function updateNavigation() {
    const navRight = document.querySelector('.nav-right');
    
    if (!navRight) return; // Exit if nav-right doesn't exist
    
    if (SessionManager.isLoggedIn()) {
        const user = SessionManager.getUser();
        navRight.innerHTML = `
            <li><a href="account.html">Аккаунт (${escapeHtml(user.username)})</a></li>
            <li><a href="#" id="logout-btn">Выйти</a></li>
            <li><a href="https://mospolytech.ru/"><img src="img/logo-mpu.png"></a></li>
        `;
        
        // Add logout functionality
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                SessionManager.clearUser();
                window.location.reload();
            });
        }
    } else {
        // Show default navigation for non-logged in users
        navRight.innerHTML = `
            <li><a href="auth.html">Войти</a></li>
            <li><a href="https://mospolytech.ru/"><img src="img/logo-mpu.png"></a></li>
        `;
    }
}

function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navbar = document.querySelector('.navbar');
    const navLeft = document.querySelector('.nav-left');
    const navRight = document.querySelector('.nav-right');
    
    if (!mobileMenuToggle) return;
    
    mobileMenuToggle.addEventListener('click', () => {
        // Toggle mobile menu
        const isOpen = mobileMenuToggle.classList.toggle('active');
        navbar.classList.toggle('mobile-open');
        
        // Update ARIA attributes for accessibility
        mobileMenuToggle.setAttribute('aria-expanded', isOpen);
        
        // Toggle navigation visibility
        if (navLeft) navLeft.classList.toggle('active');
        if (navRight) navRight.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navbar.classList.contains('mobile-open')) {
            document.body.classList.add('mobile-menu-open');
        } else {
            document.body.classList.remove('mobile-menu-open');
        }
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-left a, .nav-right a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navbar.classList.remove('mobile-open');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            if (navLeft) navLeft.classList.remove('active');
            if (navRight) navRight.classList.remove('active');
            document.body.classList.remove('mobile-menu-open');
        });
    });
    
    // Close mobile menu when window is resized to desktop size
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            mobileMenuToggle.classList.remove('active');
            navbar.classList.remove('mobile-open');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            if (navLeft) navLeft.classList.remove('active');
            if (navRight) navRight.classList.remove('active');
            document.body.classList.remove('mobile-menu-open');
        }
    });
    
    // Add keyboard support for mobile menu toggle
    mobileMenuToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            mobileMenuToggle.click();
        }
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
