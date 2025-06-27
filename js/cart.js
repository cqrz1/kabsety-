let cart = [];

function addToCart(itemName, itemPrice) {
  const existingItem = cart.find((item) => item.name === itemName);
  if (existingItem) {
    existingItem.qty++;
  } else {
    cart.push({ name: itemName, price: itemPrice, qty: 1 });
  }
  updateCart();
}

function updateCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");
  const floatingBtn = document.getElementById("floating-cart-btn");
  const cartCount = document.getElementById("cart-count");

  cartItemsContainer.innerHTML = "";

  let total = 0;
  let itemCount = 0;

  cart.forEach((item) => {
    total += item.price * item.qty;
    itemCount += item.qty;

    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <span class="item-name">${item.name}</span>
      <div class="qty-controls">
          <button onclick="changeQty('${item.name}', -1)" class="qty-btn minus"><i class="fa-solid fa-minus"></i></button>
          <span class="qty">${item.qty}</span>
          <button onclick="changeQty('${item.name}', 1)" class="qty-btn plus"><i class="fa-solid fa-plus"></i></button>
          <button onclick="removeItem('${item.name}')" class="remove-btn"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;
    cartItemsContainer.appendChild(itemDiv);
  });

  cartTotalElement.textContent = `الإجمالي: ${total} جنيه`;

  // إظهار أو إخفاء الزر العائم حسب عدد العناصر
  if (window.location.href.includes("order.html")) {
    floatingBtn.style.display = "none";
    return;
  }

  if (itemCount > 0) {
    floatingBtn.style.display = "flex";
    cartCount.textContent = itemCount;
  } else {
    floatingBtn.style.display = "none";
  }

  // حفظ السلة في التخزين المحلي
  localStorage.setItem("cart", JSON.stringify(cart));
}

function changeQty(itemName, change) {
  const item = cart.find((i) => i.name === itemName);
  if (!item) return;
  item.qty += change;
  if (item.qty <= 0) {
    cart = cart.filter((i) => i.name !== itemName);
  }
  updateCart();
}

function removeItem(itemName) {
  cart = cart.filter((i) => i.name !== itemName);
  updateCart();
}

function scrollToCart() {
  const cartSection = document.getElementById("cart-container");
  if (cartSection) {
    cartSection.scrollIntoView({ behavior: "smooth" });
  }
}

function submitOrder() {
  const cartItems = cart;
  const now = new Date();
  const hour = now.getHours();
  const messageContainer = document.getElementById("order-message");
  if (!messageContainer) return;

  messageContainer.style.display = "none";
  messageContainer.textContent = "";

  // if (hour < 9 || hour >= 21) {
  //   messageContainer.textContent =
  //     "🚫 الطلبات متاحة من 9 صباحًا حتى 9 مساءً فقط";
  //   messageContainer.style.display = "block";
  //   messageContainer.className = "order-error";
  //   return;
  // }

  if (cartItems.length === 0) {
    messageContainer.textContent = "🛒 السلة فاضية. من فضلك أضف طلباتك أولًا.";
    messageContainer.style.display = "block";
    messageContainer.className = "order-error";
    return;
  }

  let orderText = "";
  let total = 0;

  cartItems.forEach((item) => {
    orderText += `• ${item.name} × ${item.qty} – ${
      item.price * item.qty
    } جنيه\n`;
    total += item.price * item.qty;
  });

  orderText += `\nالإجمالي: ${total} جنيه`;
  localStorage.setItem("orderNotes", orderText);
  window.location.href = "order.html";
}

window.onload = function () {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCart();
  }
};
