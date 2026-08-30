(function () {
  "use strict";

  const quantityContainers = document.querySelectorAll(".quantity-container");
  quantityContainers.forEach((container) => {
    const amount = container.querySelector(".quantity-amount");
    const increase = container.querySelector(".increase");
    const decrease = container.querySelector(".decrease");
    if (!amount) return;
    increase?.addEventListener("click", () => { amount.value = Math.max(0, Number(amount.value || 0) + 1); });
    decrease?.addEventListener("click", () => { amount.value = Math.max(0, Number(amount.value || 0) - 1); });
  });

  window.showForm = function (formId) {
    document.querySelectorAll(".auth-form").forEach((form) => form.classList.remove("active"));
    document.getElementById(formId)?.classList.add("active");
  };

  window.showAuthForm = window.showForm;

  window.togglePassword = function (inputId, button) {
    const input = document.getElementById(inputId); if (!input) return;
    input.type = input.type === "password" ? "text" : "password";
    const icon = button?.querySelector("i");
    if (icon) icon.classList.toggle("fa-eye-slash", input.type === "text");
    if (icon) icon.classList.toggle("fa-eye", input.type === "password");
  };

  const login = document.getElementById("loginFormElement");
  if (login) login.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("loginEmail")?.value.trim().toLowerCase();
    const password = document.getElementById("loginPassword")?.value || "";
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({email,password}) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Invalid email or password");
      localStorage.setItem("reflexUser", JSON.stringify(data.user));
      localStorage.setItem("reflexUserEmail", data.user.email);
      if (data.user.role === "customer") { localStorage.setItem("customerLoggedIn", "true"); window.location.href = "shop.html"; }
      else if (data.user.role === "retailer") { localStorage.setItem("reflexAuthenticated", "true"); window.location.href = "http://localhost:5173/"; }
      else if (data.user.role === "dispatcher") { localStorage.setItem("dispatcherToken", "true"); localStorage.setItem("dispatcherUser", JSON.stringify(data.user)); window.location.href = "dispatcher/index.html"; }
      else if (data.user.role === "rider") { localStorage.setItem("riderEmail", data.user.email); window.location.href = "rider/rider.html"; }
    } catch (error) { alert(error.message); }
  });

  const register = document.getElementById("registerFormElement");
  if (register) register.addEventListener("submit", (event) => { event.preventDefault(); alert("Demo accounts are already available for this prototype."); });
  const forgot = document.getElementById("forgotPasswordForm");
  if (forgot) forgot.addEventListener("submit", (event) => { event.preventDefault(); alert("Please contact the system administrator to reset a demo password."); });
})();
