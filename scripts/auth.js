document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await handleFormSubmit(e);
  });

  // Check if user is already logged in
  if (SessionManager.isLoggedIn()) {
    const user = SessionManager.getUser();
    showWelcomeMessage(user);
  }
});

async function handleFormSubmit(e) {
  const form = e.target;
  const formType = getFormType();
  
  try {
    if (formType === 'login') {
      await handleLogin(form);
    } else if (formType === 'register') {
      await handleRegistration(form);
    } else if (formType === 'forgot') {
      handleForgotPassword(form);
    }
  } catch (error) {
    showError(error.message);
  }
}

function getFormType() {
  const form = document.getElementById("login-form") || document.getElementById("forgot-password-form");
  if (form.id === "forgot-password-form") return 'forgot';
  
  const emailInput = form.querySelector('input[type="email"]');
  return emailInput ? 'register' : 'login';
}

async function handleLogin(form) {
  const login = form.querySelector('#login').value;
  const password = form.querySelector('#password').value;
  
  if (!login || !password) {
    throw new Error('Пожалуйста, заполните все поля');
  }

  // Since backend doesn't have authentication endpoint, 
  // we'll simulate login by creating a session
  // In real app, you'd validate credentials with backend
  
  showLoading(true);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo, create a mock user session
  const mockUser = {
    id: Date.now(), // Generate random ID
    username: login,
    email: login.includes('@') ? login : `${login}@example.com`
  };
  
  SessionManager.setUser(mockUser);
  showSuccess('Вход выполнен успешно!');
  
  // Redirect to account page after short delay
  setTimeout(() => {
    window.location.href = 'account.html';
  }, 1500);
}

async function handleRegistration(form) {
  const email = form.querySelector('#email').value;
  const login = form.querySelector('#login').value;
  const password = form.querySelector('#password').value;
  
  if (!email || !login || !password) {
    throw new Error('Пожалуйста, заполните все поля');
  }

  if (!isValidEmail(email)) {
    throw new Error('Пожалуйста, введите корректный email');
  }

  if (password.length < 6) {
    throw new Error('Пароль должен содержать минимум 6 символов');
  }

  showLoading(true);

  try {
    const userData = {
      username: login,
      email: email,
      password: password
    };

    const newUser = await UserAPI.register(userData);
    
    // Set user session
    SessionManager.setUser({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email
    });

    showSuccess('Регистрация прошла успешно!');
    
    // Redirect to account page
    setTimeout(() => {
      window.location.href = 'account.html';
    }, 1500);

  } catch (error) {
    if (error.message.includes('Duplicate entry')) {
      throw new Error('Пользователь с таким email уже существует');
    }
    throw error;
  } finally {
    showLoading(false);
  }
}

function handleForgotPassword(form) {
  const login = form.querySelector('#login').value;
  
  if (!login) {
    showError('Пожалуйста, введите email или логин');
    return;
  }

  // Simulate sending recovery email
  showSuccess('Код восстановления отправлен на ваш email');
  
  // Return to login form
  setTimeout(() => {
    const formHeader = document.querySelector('.form-header');
    drawLoginForm(formHeader);
  }, 2000);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showLoading(show) {
  const submitBtn = document.querySelector('.btn-submit');
  if (show) {
    submitBtn.textContent = 'Загрузка...';
    submitBtn.disabled = true;
  } else {
    submitBtn.disabled = false;
    // Reset button text based on form type
    const formType = getFormType();
    if (formType === 'login') {
      submitBtn.textContent = 'ВОЙТИ';
    } else if (formType === 'register') {
      submitBtn.textContent = 'ЗАРЕГИСТРИРОВАТЬСЯ';
    }
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
  const existingMsg = document.querySelector('.auth-message');
  if (existingMsg) {
    existingMsg.remove();
  }

  const messageDiv = document.createElement('div');
  messageDiv.className = `auth-message ${type}`;
  messageDiv.textContent = message;
  
  const formWrapper = document.querySelector('.form-wrapper');
  formWrapper.insertBefore(messageDiv, formWrapper.firstChild);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.remove();
    }
  }, 5000);
}

function showWelcomeMessage(user) {
  const formWrapper = document.querySelector('.form-wrapper');
  formWrapper.innerHTML = `
    <h2 class="form-name">ДОБРО ПОЖАЛОВАТЬ, ${user.username.toUpperCase()}!</h2>
    <div class="welcome-content">
      <p>Вы уже авторизованы в системе.</p>
      <div class="welcome-actions">
        <a href="account.html" class="btn-submit">МОЙ АККАУНТ</a>
        <button onclick="logout()" class="btn-submit secondary">ВЫЙТИ</button>
      </div>
    </div>
  `;
}

function logout() {
  SessionManager.clearUser();
  showSuccess('Вы успешно вышли из системы');
  setTimeout(() => {
    location.reload();
  }, 1500);
}


function drawLoginForm(formHeader) {
  const formWrapper = document.querySelector('.form-wrapper');
  const loginHeaderLink = formHeader.querySelector('#login-header-link');
  const registerHeaderLink = formHeader.querySelector('#register-header-link');
  if (!loginHeaderLink.classList.contains('active')) {
    loginHeaderLink.classList.add('active');
  }
  if (registerHeaderLink.classList.contains('active')) {
    registerHeaderLink.classList.remove('active');
  }

  formWrapper.children[0].textContent = "ВВЕДИТЕ ВАШИ УЧЕТНЫЕ ДАННЫЕ";
  if (formWrapper.children[1]) {
    formWrapper.children[1].remove();
  }

  const form = document.createElement("form");
  form.id = "login-form";
  form.classList.add("main-form");
  form.innerHTML = `
    <div class="form-inputs">
      <input class="input" placeholder="ЛОГИН" type="text" id="login" name="login" required>
      <input class="input" placeholder="ПАРОЛЬ" type="password" id="password" name="password" required>
    </div>
    <a href="#" class="forgot-password">Забыли пароль?</a>
    <button type="submit" class="btn-submit">ВОЙТИ</button>
  `;
  formWrapper.appendChild(form);

  // Add event listener to the new form
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await handleFormSubmit(e);
  });

  const forgotPasswordLink = form.querySelector('.forgot-password');
  forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    drawForgotPasswordForm(formHeader);
  });
}

function drawRegisterForm(formHeader) {
  const formWrapper = document.querySelector('.form-wrapper');
  const registerHeaderLink = formHeader.querySelector('#register-header-link');
  const loginHeaderLink = formHeader.querySelector('#login-header-link');
  if (!registerHeaderLink.classList.contains('active')) {
    registerHeaderLink.classList.add('active');
  }
  if (loginHeaderLink.classList.contains('active')) {
    loginHeaderLink.classList.remove('active');
  }

  formWrapper.children[0].textContent = "РЕГИСТРАЦИЯ НА ПЛАТФОРМЕ MATHSEM";
  if (formWrapper.children[1]) {
    formWrapper.children[1].remove();
  }

  const form = document.createElement("form");
  form.id = "login-form";
  form.classList.add("main-form");
  form.innerHTML = `
    <div class="form-inputs">
    <input class="input" placeholder="ПОЧТА" type="email" id="email" name="email" required>
      <input class="input" placeholder="ЛОГИН" type="text" id="login" name="login" required>
      <input class="input" placeholder="ПАРОЛЬ" type="password" id="password" name="password" required>
    </div>
    <button type="submit" class="btn-submit" style="margin-top:20px">ЗАРЕГИСТРИРОВАТЬСЯ</button>
  `;
  formWrapper.appendChild(form);

  // Add event listener to the new form
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await handleFormSubmit(e);
  });
}

function drawForgotPasswordForm(formHeader) {
  const formWrapper = document.querySelector('.form-wrapper');
  const loginHeaderLink = formHeader.querySelector('#login-header-link');
  const registerHeaderLink = formHeader.querySelector('#register-header-link');
  
  // Remove active class from both header links
  if (loginHeaderLink.classList.contains('active')) {
    loginHeaderLink.classList.remove('active');
  }
  if (registerHeaderLink.classList.contains('active')) {
    registerHeaderLink.classList.remove('active');
  }

  formWrapper.children[0].textContent = "ВОССТАНОВЛЕНИЕ ПАРОЛЯ";
  if (formWrapper.children[1]) {
    formWrapper.children[1].remove();
  }

  const form = document.createElement("form");
  form.id = "forgot-password-form";
  form.classList.add("main-form");
  form.innerHTML = `
    <div class="form-inputs">
      <input class="input" placeholder="ПОЧТА/ЛОГИН" type="text" id="login" name="login" required>
    </div>
    <button type="submit" style="margin-top:20px" class="btn-submit">ПРИСЛАТЬ КОД</button>
  `;
  formWrapper.appendChild(form);

  // Add event listener to the new form
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await handleFormSubmit(e);
  });
}

function formRebuilding() {
  const formHeader = document.querySelector('.form-header')
  const formWrapper = document.querySelector('.form-wrapper')
  
  // Add click handler for forgot password link in the initial form
  const initialForgotPasswordLink = formWrapper.querySelector('.forgot-password');
  if (initialForgotPasswordLink) {
    initialForgotPasswordLink.addEventListener('click', (e) => {
      e.preventDefault();
      drawForgotPasswordForm(formHeader);
    });
  }

  formHeader.addEventListener('click', (e) => {
    e.preventDefault();
    const targetObj = e.target;
    if (targetObj.classList.contains('form-header-link')) {
      if (targetObj.id === 'login-header-link' && !targetObj.classList.contains('active')) {
        drawLoginForm(formHeader);
      }
      if (targetObj.id === 'register-header-link' && !targetObj.classList.contains('active')) {
        drawRegisterForm(formHeader);
      }
    }
    if (targetObj.classList.contains('forgot-password')) {
      drawForgotPasswordForm(formHeader);
    }
  });
}


formRebuilding();