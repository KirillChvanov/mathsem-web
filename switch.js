    // Add JavaScript to toggle theme
    function toggleTheme() {
    const body = document.body;
    const themeButton = document.querySelector('.theme-toggle-btn');
      
    // Toggle the dark-mode class
    body.classList.toggle('dark-mode');
      
    // Change the button text based on the theme
    if (body.classList.contains('dark-mode')) {
    themeButton.textContent = '🌞';  // Sun icon for light mode
    } else {
    themeButton.textContent = '🌙';  // Moon icon for dark mode
    }

    // Change img
        var img = document.getElementById("change-img");
        var img2 = document.getElementById("change-img2");
        // if (img.src.match("img/logo-mpu")) {
        //     img.src = "img/logo-mpu-dark.png";  // Đổi sang hình 2
        // } else {
        //     img.src = "img/logo-mpu.png";  // Đổi lại hình 1
        // }

        var currentImage = img.src.split("/").pop();  // Lấy tên tệp của hình ảnh hiện tại
        if (currentImage === "logo-mpu.png") {
            img.src = "img/logo-mpu-dark.png";  // Đổi sang hình 2
        } else {
            img.src = "img/logo-mpu.png";  // Đổi lại hình 1
        }

        var currentImage2 = img2.src.split("/").pop();  // Lấy tên tệp của hình ảnh hiện tại
        if (currentImage2 === "logo-mpu.png") {
            img2.src = "img/logo-mpu-dark.png";  // Đổi sang hình 2
        } else {
            img2.src = "img/logo-mpu.png";  // Đổi lại hình 1
        }
}