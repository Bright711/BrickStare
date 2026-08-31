(function () {
  "use strict";

  var tinyslider = function () {
    var el = document.querySelectorAll(".testimonial-slider");

    if (el.length > 0) {
      var slider = tns({
        container: ".testimonial-slider",
        items: 1,
        axis: "horizontal",
        controlsContainer: "#testimonial-nav",
        swipeAngle: false,
        speed: 700,
        nav: true,
        controls: true,
        autoplay: true,
        autoplayHoverPause: true,
        autoplayTimeout: 3500,
        autoplayButtonOutput: false,
      });
    }
  };
  tinyslider();

  var sitePlusMinus = function () {
    var value,
      quantity = document.getElementsByClassName("quantity-container");

    function createBindings(quantityContainer) {
      var quantityAmount =
        quantityContainer.getElementsByClassName("quantity-amount")[0];
      var increase = quantityContainer.getElementsByClassName("increase")[0];
      var decrease = quantityContainer.getElementsByClassName("decrease")[0];
      increase.addEventListener("click", function (e) {
        increaseValue(e, quantityAmount);
      });
      decrease.addEventListener("click", function (e) {
        decreaseValue(e, quantityAmount);
      });
    }

    function init() {
      for (var i = 0; i < quantity.length; i++) {
        createBindings(quantity[i]);
      }
    }

    function increaseValue(event, quantityAmount) {
      value = parseInt(quantityAmount.value, 10);

      console.log(quantityAmount, quantityAmount.value);

      value = isNaN(value) ? 0 : value;
      value++;
      quantityAmount.value = value;
    }

    function decreaseValue(event, quantityAmount) {
      value = parseInt(quantityAmount.value, 10);

      value = isNaN(value) ? 0 : value;
      if (value > 0) value--;

      quantityAmount.value = value;
    }

    init();
  };
  sitePlusMinus();

  var navbarScroll = function () {
    var navbar = document.querySelector(".custom-navbar");

    if (!navbar) {
      return;
    }

    var scrollPosition = window.scrollY;

    if (scrollPosition > 50) {
      navbar.classList.add("navbar-scrolled");
    } else {
      navbar.classList.remove("navbar-scrolled");
    }
  };

  window.addEventListener("scroll", navbarScroll);

  navbarScroll();

  /* =========================================================
   BRICKSTARE AUTHENTICATION
   ========================================================= */

  /* =========================================================
   FORM ELEMENTS
   ========================================================= */

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const forgotForm = document.getElementById("forgotForm");

  const forms = {
    login: loginForm,
    register: registerForm,
    forgot: forgotForm,
  };

  /* =========================================================
   SWITCH BETWEEN LOGIN / REGISTER / FORGOT
   ========================================================= */

  function showAuthForm(formName) {
    Object.values(forms).forEach((form) => {
      if (form) {
        form.classList.remove("active");
      }
    });

    const selectedForm = forms[formName];

    if (selectedForm) {
      selectedForm.classList.add("active");
    }

    clearMessages();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* =========================================================
   SWITCH BUTTONS
   ========================================================= */

  document.querySelectorAll("[data-switch]").forEach((button) => {
    button.addEventListener("click", function () {
      const destination = this.getAttribute("data-switch");

      showAuthForm(destination);
    });
  });

  /* =========================================================
   PASSWORD SHOW / HIDE
   ========================================================= */

  document.querySelectorAll(".password-toggle").forEach((button) => {
    button.addEventListener("click", function () {
      const passwordId = this.getAttribute("data-password");

      const passwordInput = document.getElementById(passwordId);

      const icon = this.querySelector("i");

      if (!passwordInput) {
        return;
      }

      if (passwordInput.type === "password") {
        passwordInput.type = "text";

        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");

        this.setAttribute("aria-label", "Hide password");
      } else {
        passwordInput.type = "password";

        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");

        this.setAttribute("aria-label", "Show password");
      }
    });
  });

  /* =========================================================
   MESSAGE FUNCTIONS
   ========================================================= */

  function showMessage(elementId, message, type = "error") {
    const element = document.getElementById(elementId);

    if (!element) {
      return;
    }

    element.textContent = message;

    element.className = `auth-message show ${type}`;
  }

  function clearMessages() {
    document.querySelectorAll(".auth-message").forEach((element) => {
      element.textContent = "";

      element.className = "auth-message";
    });
  }

  /* =========================================================
   EMAIL VALIDATION
   ========================================================= */

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* =========================================================
   LOGIN
   ========================================================= */

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();

      const password = document.getElementById("loginPassword").value;

      if (!email) {
        showMessage("loginMessage", "Please enter your email address.");

        return;
      }

      if (!isValidEmail(email)) {
        showMessage("loginMessage", "Please enter a valid email address.");

        return;
      }

      if (!password) {
        showMessage("loginMessage", "Please enter your password.");

        return;
      }

      if (password.length < 6) {
        showMessage(
          "loginMessage",
          "Your password must contain at least 6 characters.",
        );

        return;
      }

      /*
       * TEMPORARY FRONTEND LOGIN
       *
       * This does NOT authenticate against a database.
       * It is only the frontend behaviour.
       *
       * Replace this section with a fetch()
       * request when your backend authentication
       * API is ready.
       */

      const submitButton = loginForm.querySelector(".auth-submit");

      submitButton.disabled = true;

      submitButton.innerHTML = "<span>Signing in...</span>";

      setTimeout(() => {
        /*
         * Temporary demonstration.
         *
         * Later your backend should return
         * the actual user role.
         */

        const role = localStorage.getItem("brickstare_role") || "customer";

        localStorage.setItem("brickstare_email", email);

        showMessage(
          "loginMessage",
          "Login successful. Redirecting...",
          "success",
        );

        setTimeout(() => {
          if (role === "rider") {
            window.location.href = "rider/rider.html";
          } else {
            window.location.href = "index.html";
          }
        }, 700);
      }, 800);
    });
  }

  /* =========================================================
   REGISTRATION
   ========================================================= */

  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById("registerName").value.trim();

      const email = document.getElementById("registerEmail").value.trim();

      const phone = document.getElementById("registerPhone").value.trim();

      const accountType = document.getElementById("accountType").value;

      const password = document.getElementById("registerPassword").value;

      const confirmPassword = document.getElementById("confirmPassword").value;

      const terms = document.getElementById("terms").checked;

      if (name.length < 2) {
        showMessage("registerMessage", "Please enter your full name.");

        return;
      }

      if (!isValidEmail(email)) {
        showMessage("registerMessage", "Please enter a valid email address.");

        return;
      }

      if (!phone) {
        showMessage("registerMessage", "Please enter your phone number.");

        return;
      }

      if (!accountType) {
        showMessage("registerMessage", "Please select an account type.");

        return;
      }

      if (password.length < 8) {
        showMessage(
          "registerMessage",
          "Password must contain at least 8 characters.",
        );

        return;
      }

      if (password !== confirmPassword) {
        showMessage("registerMessage", "Passwords do not match.");

        return;
      }

      if (!terms) {
        showMessage("registerMessage", "Please accept the Terms & Conditions.");

        return;
      }

      /*
       * TEMPORARY FRONTEND REGISTRATION
       *
       * This stores only basic demo information.
       *
       * NEVER store real passwords in localStorage.
       *
       * A production system must send the password
       * to a secure backend over HTTPS where it is
       * hashed and stored safely.
       */

      const submitButton = registerForm.querySelector(".auth-submit");

      submitButton.disabled = true;

      submitButton.innerHTML = "<span>Creating account...</span>";

      setTimeout(() => {
        /*
         * Store only non-sensitive demo data.
         */

        localStorage.setItem("brickstare_name", name);

        localStorage.setItem("brickstare_email", email);

        localStorage.setItem("brickstare_role", accountType);

        showMessage(
          "registerMessage",
          "Account created successfully. You can now sign in.",
          "success",
        );

        registerForm.reset();

        setTimeout(() => {
          showAuthForm("login");

          document.getElementById("loginEmail").value = email;
        }, 1200);
      }, 900);
    });
  }

  /* =========================================================
   FORGOT PASSWORD
   ========================================================= */

  if (forgotForm) {
    forgotForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.getElementById("forgotEmail").value.trim();

      if (!email) {
        showMessage("forgotMessage", "Please enter your email address.");

        return;
      }

      if (!isValidEmail(email)) {
        showMessage("forgotMessage", "Please enter a valid email address.");

        return;
      }

      const submitButton = forgotForm.querySelector(".auth-submit");

      submitButton.disabled = true;

      submitButton.innerHTML = "<span>Sending...</span>";

      /*
       * DEMO ONLY
       *
       * A real password reset must be handled
       * by your backend and email service.
       */

      setTimeout(() => {
        showMessage(
          "forgotMessage",
          "If an account exists with this email, a password reset link will be sent.",
          "success",
        );

        submitButton.disabled = false;

        submitButton.innerHTML = "<span>Send Reset Link</span>";
      }, 900);
    });
  }

  /* =========================================================
   REMEMBER ME
   ========================================================= */

  const rememberMe = document.getElementById("rememberMe");

  const loginEmail = document.getElementById("loginEmail");

  if (rememberMe && loginEmail) {
    const savedEmail = localStorage.getItem("brickstare_remember_email");

    if (savedEmail) {
      loginEmail.value = savedEmail;

      rememberMe.checked = true;
    }

    rememberMe.addEventListener("change", function () {
      if (this.checked) {
        localStorage.setItem(
          "brickstare_remember_email",
          loginEmail.value.trim(),
        );
      } else {
        localStorage.removeItem("brickstare_remember_email");
      }
    });

    loginEmail.addEventListener("input", function () {
      if (rememberMe.checked) {
        localStorage.setItem("brickstare_remember_email", this.value.trim());
      }
    });
  }

  /* =========================================================
   CURRENT YEAR
   ========================================================= */

  const authYear = document.getElementById("authYear");

  if (authYear) {
    authYear.textContent = new Date().getFullYear();
  }
})();
