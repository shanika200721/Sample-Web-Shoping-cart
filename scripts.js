

const apiUrl = 'https://dummyjson.com/products';

let products = [];
let currentProducts = [];
let cartItems = [];


function fetchProducts() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      products = data.products;
      currentProducts = [...products]; 
      displayProducts();
      displayFilters();
    })
    .catch((error) => console.error('Error fetching products:', error));
}


function displayProducts() {
  const productsDiv = document.querySelector('.products');
  productsDiv.innerHTML = '';

  currentProducts.forEach((product) => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');
    productDiv.innerHTML = `
      <img src="${product.images[0]}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p class="desc">${product.description}</p>
      <p class="price">Price: $${product.price.toFixed(2)}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productsDiv.appendChild(productDiv);
  });
}


function displayFilters() {
  const filtersDiv = document.querySelector('.filters');
  const categoryFilterSelect = document.getElementById('categoryFilter');
  const brandFilterSelect = document.getElementById('brandFilter');

  const uniqueCategories = getUniqueCategories();
  const uniqueBrands = getUniqueBrands();

  categoryFilterSelect.innerHTML = `
    <option value="">All</option>
    ${uniqueCategories
      .map((category) => `<option value="${category}">${category}</option>`)
      .join('')}
  `;

  brandFilterSelect.innerHTML = `
    <option value="">All</option>
    ${uniqueBrands
      .map((brand) => `<option value="${brand}">${brand}</option>`)
      .join('')}
  `;
}


function getUniqueCategories() {
  return [...new Set(products.map((product) => product.category))];
}


function getUniqueBrands() {
  return [...new Set(products.map((product) => product.brand))];
}



function applyFilters() {
  const priceFilterSelect = document.getElementById('priceFilter');
  const categoryFilterSelect = document.getElementById('categoryFilter');
  const brandFilterSelect = document.getElementById('brandFilter');

  const priceFilter = priceFilterSelect.value;
  const categoryFilter = categoryFilterSelect.value;
  const brandFilter = brandFilterSelect.value;

  let filteredProducts = products;

  if (priceFilter === 'low') {
    filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
  } else if (priceFilter === 'high') {
    filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
  }

  if (categoryFilter) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === categoryFilter
    );
  }

  if (brandFilter) {
    filteredProducts = filteredProducts.filter(
      (product) => product.brand === brandFilter
    );
  }

  currentProducts = filteredProducts;
  displayProducts();
}


function clearFilters() {
  document.getElementById('priceFilter').value = '';
  document.getElementById('categoryFilter').value = '';
  document.getElementById('brandFilter').value = '';
  applyFilters(); 
}


function addToCart(productId) {
  const product = currentProducts.find((p) => p.id === productId);
  if (product) {
    cartItems.push(product);
    updateCart();
    updateTotalCost();
  }
}


function removeFromCart(productId) {
  cartItems = cartItems.filter((item) => item.id !== productId);
  updateCart();
  updateTotalCost();
}


function updateCart() {
  const cartItemsDiv = document.querySelector('.cart-items');
  cartItemsDiv.innerHTML = '';

  cartItems.forEach((item) => {
    const cartItemDiv = document.createElement('div');
    cartItemDiv.classList.add('cart-item');
    cartItemDiv.innerHTML = `
      <img src="${item.images[0]}" alt="${item.title}">
      <p>${item.title}</p>
      <p>$${item.price.toFixed(2)}</p>
      <button onclick="removeFromCart(${item.id})">Remove</button>
    `;
    cartItemsDiv.appendChild(cartItemDiv);
  });
}



function updateTotalCost() {
  const totalCostSpan = document.getElementById('totalCost');
  const totalCost = cartItems.reduce((total, item) => total + item.price, 0);
  totalCostSpan.innerText = totalCost.toFixed(2);
}


function searchProducts() {
  const searchInput = document.getElementById('searchInput');
  const searchTerm = searchInput.value.toLowerCase();

  if (searchTerm.trim() === '') {
    currentProducts = [...products];
  } else {
    currentProducts = products.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
  }

  
  displayProducts();
}
fetchProducts();
