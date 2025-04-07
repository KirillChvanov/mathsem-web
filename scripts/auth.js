document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const loginValue = document.getElementById("login").value;
    const passwordValue = document.getElementById("password").value;
    
    console.log("Логин:", loginValue);
    console.log("Пароль:", passwordValue);

    // Optionally, you could show an alert or redirect the user:
    // alert("Форма отправлена!");
    // window.location.href = "somepage.html";
  });
});


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