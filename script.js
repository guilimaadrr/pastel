// Capitalize the first letter of each word in a string
function capitalizeFirstLetter(text) {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Open modal function with smooth animation
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "flex";
  modal.style.opacity = "0"; // Start with 0 opacity
  setTimeout(() => {
    modal.style.opacity = "1"; // Fade in
  }, 50);

  // Prevent page scroll when modal is open
  document.body.style.overflow = "hidden";
}

// Close modal function with smooth animation
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.opacity = "0"; // Fade out
  setTimeout(() => {
    modal.style.display = "none";
    clearForm(modalId); // Clear checkboxes and name field

    // Allow page scroll when modal is closed
    document.body.style.overflow = "auto";
  }, 300); // Delay matches the fade-out transition
}

// Submit ingredients function with name validation and price
function submitIngredients(
  saborName,
  complementoName,
  molhoName,
  nomeId,
  price
) {
  const sabores = document.getElementsByName(saborName);
  const complementos = document.getElementsByName(complementoName);
  const molhos = document.getElementsByName(molhoName);
  const nome = document.getElementById(nomeId).value;

  // Check if the name field is empty
  if (!nome.trim()) {
    alert("Por favor, insira o seu nome.");
    return; // Exit the function if name is not provided
  }

  // Get selected options
  const selectedSabores = Array.from(sabores)
    .filter((item) => item.checked)
    .map((item) => capitalizeFirstLetter(item.value.toLowerCase()));
  const selectedComplementos = Array.from(complementos)
    .filter((item) => item.checked)
    .map((item) => capitalizeFirstLetter(item.value.toLowerCase()));
  const selectedMolhos = Array.from(molhos)
    .filter((item) => item.checked)
    .map((item) => capitalizeFirstLetter(item.value.toLowerCase()));

  // Add to cart with price
  addToCart(
    capitalizeFirstLetter(nome.toLowerCase()),
    selectedSabores,
    selectedComplementos,
    selectedMolhos,
    price
  );

  // Exibe a mensagem "pedido enviado ao carrinho"
  alert("Pedido enviado ao carrinho.");

  // Close modal after submission
  closeModal(`modal${nomeId.charAt(nomeId.length - 1)}`);
}

// Limit selection function
function limitSelection(name, max) {
  const checkboxes = document.getElementsByName(name);
  const checkedCount = Array.from(checkboxes).filter(
    (checkbox) => checkbox.checked
  ).length;

  if (checkedCount > max) {
    alert(`Você pode selecionar no máximo ${max} opções.`);
    event.target.checked = false;
  }
}

// Add item to cart function with smooth addition animation and price
function addToCart(
  nome,
  sabores,
  complementos,
  molhos,
  price,
  isBeverage = false
) {
  const cartItems = document.getElementById("cartItems");

  // Create cart item element
  const cartItem = document.createElement("div");
  cartItem.className = isBeverage
    ? "cart-item cart-item-beverage"
    : "cart-item";
  const itemId = Date.now();

  cartItem.id = `item-${itemId}`;
  cartItem.innerHTML = `
    <h3>${capitalizeFirstLetter(nome)}</h3>
    ${sabores.length > 0 ? `<p>SABORES: ${sabores.join(", ")}</p>` : ""}
    ${
      complementos.length > 0
        ? `<p>COMPLEMENTOS: ${complementos.join(", ")}</p>`
        : ""
    }
    ${molhos.length > 0 ? `<p>MOLHOS: ${molhos.join(", ")}</p>` : ""}
    <p>PREÇO: R$${price.toFixed(2)}</p>
    <button onclick="removeFromCart(${itemId})" class="remove-button">REMOVER</button>
  `;

  // Set price data attribute
  cartItem.setAttribute("data-price", price);

  // Append to cart
  cartItems.appendChild(cartItem);

  // Scroll to bottom when item is added
  cartItems.scrollTop = cartItems.scrollHeight;

  // Update cart total
  updateCartTotal();
}

// Remove item from cart with smooth removal animation
function removeFromCart(itemId) {
  const cartItem = document.getElementById(`item-${itemId}`);
  if (cartItem) {
    cartItem.style.opacity = "0"; // Fade out before removal
    setTimeout(() => {
      cartItem.remove();
      updateCartTotal(); // Update cart total after removal
    }, 300); // Delay matches the fade-out transition
  }
}

// Open cart function
function openCart() {
  openModal("cartModal");
}

// Clear checkboxes and name function
function clearForm(modalId) {
  const modal = document.getElementById(modalId);
  const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => (checkbox.checked = false));

  const textInputs = modal.querySelectorAll('input[type="text"]');
  textInputs.forEach((input) => (input.value = ""));
}

// Clear cart function
function clearCart() {
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = ""; // Remove all cart items
  updateCartTotal(); // Update cart total after clearing
}

// Update cart total function
function updateCartTotal() {
  const cartItems = document.querySelectorAll("#cartItems .cart-item");
  let total = 0;

  cartItems.forEach((item) => {
    // Assuming each item has a price attribute
    const price = parseFloat(item.getAttribute("data-price")) || 0;
    total += price;
  });

  document.getElementById("cartTotal").innerText = `TOTAL: R$${total.toFixed(
    2
  )}`;
}

// Submit beverages function with price calculation and no name field
function submitBeverages(beverageName) {
  const bebidas = document.getElementsByName(beverageName);

  // Get selected beverages
  const selectedBeverages = Array.from(bebidas)
    .filter((item) => item.checked)
    .map((item) => ({
      name: capitalizeFirstLetter(item.value.toLowerCase()),
      price: parseFloat(item.getAttribute("data-price")),
    }));

  // Check if no beverage is selected
  if (selectedBeverages.length === 0) {
    alert("Por favor, selecione pelo menos uma bebida.");
    return; // Exit the function if no beverage is selected
  }

  // Add each selected beverage to cart
  selectedBeverages.forEach((beverage) => {
    addToCart(beverage.name, [], [], [], beverage.price, true);
  });

  // Exibe a mensagem "pedido enviado ao carrinho"
  alert("Pedido enviado ao carrinho.");

  // Close modal after submission
  closeModal("modal4");
}

// Send order function with WhatsApp integration
function sendOrder() {
  const cartItems = document.querySelectorAll("#cartItems .cart-item");

  if (cartItems.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  let totalItems = cartItems.length; // Count the total number of items

  let message = "Olá 🤗, Segue pedido:\n\n";
  message += `📦 TOTAL DE ITENS: ${totalItems}\n\n`; // Add total items to message
  message += "⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘\n\n";

  // Process all cart items (including pastéis and beverages)
  cartItems.forEach((item) => {
    const name = item.querySelector("h3").innerText.toUpperCase(); // Nome em maiúsculas
    const priceElement = item.querySelector("p:last-of-type");
    const price = priceElement.innerText.replace("PREÇO: R$", "");

    const sabores = item.querySelector("p:nth-of-type(1)")?.innerText || "";
    const complementos =
      item.querySelector("p:nth-of-type(2)")?.innerText || "";
    const molhos = item.querySelector("p:nth-of-type(3)")?.innerText || "";

    if (item.classList.contains("cart-item-beverage")) {
      // If item is a beverage
      message += `🥤BEBIDA: ${name}\n💵PREÇO: R$${parseFloat(price).toFixed(
        2
      )}\n\n⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘\n\n`;
    } else {
      // If item is a pastel
      let itemDetails = `🟢NOME: ${name}`;
      if (sabores) itemDetails += `\n\n📌${sabores}`;
      if (complementos) itemDetails += `\n\n📌${complementos}`;
      if (molhos) itemDetails += `\n\n📌${molhos}`;
      itemDetails += `\n\n💵PREÇO: R$${parseFloat(price).toFixed(2)}`;
      message += `${itemDetails}\n\n⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘\n\n`;
    }
  });

  message += "⚠️ Confirme se está tudo correto ⚠️\n\n";
  message += "💳O pedido será feito após a confirmação do pagamento💳\n\n";

  // Include the total price in the message
  const total = document
    .getElementById("cartTotal")
    .innerText.replace("TOTAL: R$", "");
  message += `💰TOTAL: R$${parseFloat(total).toFixed(2)}\n\n`;

  message += "🥰 Cantinho Do Pastel Agradece! 🥰\n";

  const phoneNumber = "5581989361736"; // Your WhatsApp number
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  window.open(url, "_blank");

  // Exibe a mensagem "pedido enviado ao carrinho"
  alert("Pedido enviado ao carrinho.");

  clearCart();
}
