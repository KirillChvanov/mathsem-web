// Shared navigation functionality
document.addEventListener("DOMContentLoaded", () => {
    updateNavigation();
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
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
