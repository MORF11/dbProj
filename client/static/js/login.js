"use strict";

const form = document.querySelector("#login-form");
const error = document.querySelector("#auth-error");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = form.elements.email.value.trim().toLowerCase();
    const password = form.elements.password.value;

    if (email !== "admin@vashpromouter.ru" || password !== "admin123") {
        error.textContent = "Проверьте почту и пароль.";
        return;
    }

    try {
        localStorage.setItem("vash-promouter-session-v1", JSON.stringify({
            email: email,
            role: "admin"
        }));
        location.replace("admin.html");
    } catch {
        error.textContent = "Разрешите сохранение данных в браузере для входа.";
    }
});
