(function () {
  const CART_KEY = "reflexCart";
  const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  const saveCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));

  function showAdded(event) {
    const old = document.querySelector(".cart-cursor-message");
    if (old) old.remove();
    const message = document.createElement("div");
    message.className = "cart-cursor-message";
    message.textContent = "Item added to the cart";
    document.body.appendChild(message);
    const x = event.clientX + 12;
    const y = event.clientY + 14;
    message.style.left = `${Math.min(x, window.innerWidth - 190)}px`;
    message.style.top = `${Math.min(y, window.innerHeight - 45)}px`;
    requestAnimationFrame(() => message.classList.add("show"));
    setTimeout(() => message.remove(), 1600);
  }

  function showReturnedAdded() {
    if (!new URLSearchParams(window.location.search).has("added")) return;
    const message = document.createElement("div");
    message.className = "cart-return-message";
    message.textContent = "Item added to the cart";
    document.body.appendChild(message);
    setTimeout(() => message.classList.add("show"), 30);
    setTimeout(() => message.remove(), 1800);
    history.replaceState({}, "", window.location.pathname);
  }

  function add(product) {
    const cart = getCart();
    const found = cart.find((item) => item.productId === product.productId);
    if (found) found.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    saveCart(cart);
  }

  function productFromButton(button) {
    return {
      productId: button.dataset.productId,
      name: button.dataset.name,
      price: Number(button.dataset.price),
      image: button.dataset.image || "",
    };
  }

  window.ReflexCart = { getCart, saveCart, add };

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-add-to-cart]");
    if (!button) return;
    event.preventDefault();
    const product = productFromButton(button);

    if (localStorage.getItem("customerLoggedIn") !== "true") {
      localStorage.setItem("pendingCartItem", JSON.stringify(product));
      window.location.href = "/login";
      return;
    }

    add(product);
    showAdded(event);
  });

  document.addEventListener("DOMContentLoaded", showReturnedAdded);
})();
