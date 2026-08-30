// ========================================
// REFLEX RETAILER PORTAL
// Frontend JavaScript
// ========================================

console.log("Reflex Retailer Portal loaded successfully.");


// ========================================
// NEW DELIVERY BUTTON
// ========================================

const newDeliveryButton = document.querySelector(".primary-button");

if (newDeliveryButton) {

    newDeliveryButton.addEventListener("click", function () {

        alert("New Delivery form will be available in the next step.");

    });

}


// ========================================
// NAVIGATION
// ========================================

const navigationItems = document.querySelectorAll(".nav-item");

navigationItems.forEach(function (item) {

    item.addEventListener("click", function (event) {

        event.preventDefault();

        navigationItems.forEach(function (nav) {
            nav.classList.remove("active");
        });

        item.classList.add("active");

    });

});


// ========================================
// DELIVERY VIEW BUTTONS
// ========================================

const viewButtons = document.querySelectorAll(".details-button");

viewButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        alert("Delivery details will be available in a later step.");

    });

});