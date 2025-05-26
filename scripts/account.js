// Account management script
document.addEventListener("DOMContentLoaded", () => {
    // Check if user is logged in
    if (!SessionManager.isLoggedIn()) {
        // Redirect to auth page if not logged in
        window.location.href = 'auth.html';
        return;
    }

    const user = SessionManager.getUser();
    loadUserData(user);

    // Add form submission handler
    const accountForm = document.getElementById('account-form');
    accountForm.addEventListener('submit', handleAccountUpdate);

    // Update navigation to show user is logged in
    updateNavigation(user);
});

function loadUserData(user) {
    // Populate form fields with current user data
    document.getElementById('email').value = user.email || '';
    document.getElementById('login').value = user.username || '';
    
    // Don't populate password field for security
    document.getElementById('password').placeholder = 'Введите новый пароль (оставьте пустым для сохранения текущего)';
    document.getElementById('password').required = false;
}

async function handleAccountUpdate(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    
    if (!email || !login) {
        showError('Пожалуйста, заполните обязательные поля (email и логин)');
        return;
    }

    if (!isValidEmail(email)) {
        showError('Пожалуйста, введите корректный email');
        return;
    }

    showLoading(true);

    try {
        const currentUser = SessionManager.getUser();
        const updateData = {
            username: login,
            email: email
        };

        // Only include password if it was changed
        if (password && password.trim() !== '') {
            if (password.length < 6) {
                throw new Error('Пароль должен содержать минимум 6 символов');
            }
            updateData.password = password;
        }

        // For demo purposes, since we don't have UPDATE endpoint,
        // we'll update the local session
        const updatedUser = {
            ...currentUser,
            username: updateData.username,
            email: updateData.email
        };

        SessionManager.setUser(updatedUser);
        
        showSuccess('Данные аккаунта успешно обновлены!');
        
        // Clear password field
        document.getElementById('password').value = '';
        
        // Update navigation
        updateNavigation(updatedUser);

    } catch (error) {
        showError(error.message);
    } finally {
        showLoading(false);
    }
}

function updateNavigation(user) {
    // Update the auth link in navigation to show username
    const navRight = document.querySelector('.nav-right');
    const authLink = navRight.querySelector('li:first-child a');
    
    if (authLink) {
        authLink.textContent = user.username;
        authLink.href = 'account.html';
        
        // Add logout option
        if (!navRight.querySelector('.logout-link')) {
            const logoutLi = document.createElement('li');
            logoutLi.innerHTML = '<a href="#" class="logout-link">Выйти</a>';
            navRight.insertBefore(logoutLi, navRight.lastElementChild);
            
            logoutLi.querySelector('.logout-link').addEventListener('click', (e) => {
                e.preventDefault();
                handleLogout();
            });
        }
    }
}

function handleLogout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        SessionManager.clearUser();
        showSuccess('Вы успешно вышли из системы');
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1500);
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showLoading(show) {
    const submitBtn = document.querySelector('.btn-submit');
    if (show) {
        submitBtn.textContent = 'Сохранение...';
        submitBtn.disabled = true;
    } else {
        submitBtn.textContent = 'СОХРАНИТЬ';
        submitBtn.disabled = false;
    }
}

function showError(message) {
    showMessage(message, 'error');
}

function showSuccess(message) {
    showMessage(message, 'success');
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMsg = document.querySelector('.account-message');
    if (existingMsg) {
        existingMsg.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `account-message ${type}`;
    messageDiv.textContent = message;
    
    const accountSection = document.querySelector('.first-section');
    accountSection.insertBefore(messageDiv, accountSection.firstChild);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}
