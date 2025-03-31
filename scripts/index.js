document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const loginValue = document.getElementById("login").value;
      const passwordValue = document.getElementById("password").value;
      
      // For demo, just log the values. 
      // In real usage, you'd handle authentication or form submission here.
      console.log("Логин:", loginValue);
      console.log("Пароль:", passwordValue);
  
      // Optionally, you could show an alert or redirect the user:
      // alert("Форма отправлена!");
      // window.location.href = "somepage.html";
    });
  });
  