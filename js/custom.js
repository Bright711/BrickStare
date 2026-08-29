(function() {
	'use strict';

	var tinyslider = function() {
		var el = document.querySelectorAll('.testimonial-slider');

		if (el.length > 0) {
			var slider = tns({
				container: '.testimonial-slider',
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
				autoplayButtonOutput: false
			});
		}
	};
	tinyslider();

	


	var sitePlusMinus = function() {

		var value,
    		quantity = document.getElementsByClassName('quantity-container');

		function createBindings(quantityContainer) {
	      var quantityAmount = quantityContainer.getElementsByClassName('quantity-amount')[0];
	      var increase = quantityContainer.getElementsByClassName('increase')[0];
	      var decrease = quantityContainer.getElementsByClassName('decrease')[0];
	      increase.addEventListener('click', function (e) { increaseValue(e, quantityAmount); });
	      decrease.addEventListener('click', function (e) { decreaseValue(e, quantityAmount); });
	    }

	    function init() {
	        for (var i = 0; i < quantity.length; i++ ) {
						createBindings(quantity[i]);
	        }
	    };

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


})()

function showForm(formId) {

    const forms = document.querySelectorAll(".auth-form");

    forms.forEach(function (form) {
        form.classList.remove("active");
    });

    const selectedForm = document.getElementById(formId);

    if (selectedForm) {
        selectedForm.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function togglePassword(inputId, button) {

    const input = document.getElementById(inputId);

    if (!input) return;

    if (input.type === "password") {

        input.type = "text";
        button.textContent = "Hide";

    } else {

        input.type = "password";
        button.textContent = "Show";

    }
}
//Login

document.getElementById("login").addEventListener("submit", function (event) {

    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    console.log("Login:", {
        email: email,
        password: password
    });

});

//Reg

document.getElementById("register").addEventListener("submit", function (event) {

    event.preventDefault();

    const password =
        document.getElementById("registerPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {

        alert("Passwords do not match.");

        return;
    }

    console.log("Registration submitted");

 

});

//Forget Password

document
    .getElementById("forgotPassword")
    .addEventListener("submit", function (event) {

        event.preventDefault();

        const email =
            document.getElementById("forgotEmail").value;

        console.log("Password reset requested:", email);

        alert(
            "If an account exists with this email, a password reset link will be sent."
        );

    });


 function showAuthForm(
        formId,
      ) {
        const forms = document.querySelectorAll(".auth-form");
        forms.forEach(function (form) {
          form.classList.remove("active");
        });
        const selectedForm = document.getElementById(formId);
        if (selectedForm) {
          selectedForm.classList.add("active");
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
       function togglePassword(inputId, button) {
        const input = document.getElementById(inputId);
        const icon = button.querySelector("i");
        if (input.type === "password") {
          input.type = "text";
          icon.classList.remove("fa-eye");
          icon.classList.add("fa-eye-slash");
          button.setAttribute("aria-label", "Hide password");
        } else {
          input.type = "password";
          icon.classList.remove("fa-eye-slash");
          icon.classList.add("fa-eye");
          button.setAttribute("aria-label", "Show password");
        }
      }
    document
        .getElementById("loginFormElement")
        .addEventListener("submit", function (event) {
          event.preventDefault();
          const email = document.getElementById("loginEmail").value.trim();
          const password = document.getElementById("loginPassword").value;
          if (!email || !password) {
            alert("Please enter your email and password.");
            return;
          }
           console.log(
            "Login submitted:",
            { email: email, password: password },
          );
        });
    document
        .getElementById("registerFormElement")
        .addEventListener("submit", function (event) {
          event.preventDefault();
          const password = document.getElementById("registerPassword").value;
          const confirmPassword =
            document.getElementById("confirmPassword").value;
          const terms = document.getElementById("terms").checked;
          if (password !== confirmPassword) {
            alert("The passwords do not match.");
            return;
          }
          if (!terms) {
            alert("Please agree to the Terms & Conditions and Privacy Policy.");
            return;
          }
          console.log(
            "Registration submitted",
          );
        });
    document
        .getElementById("forgotPasswordForm")
        .addEventListener("submit", function (event) {
          event.preventDefault();
          const email = document.getElementById("forgotEmail").value.trim();
          if (!email) {
            alert("Please enter your email address.");
            return;
          }
          alert(
            "If an account exists with this email, a password reset link will be sent.",
          );
        });

