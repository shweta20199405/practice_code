// Mock Product Dataset Database
const PRODUCTS_DATA = [
    { id: 1, brand: 'Roadster', name: 'Men Cotton Pure T-shirt', price: 499, originalPrice: 999, discount: 50, category: 'Tshirt', image: 'https://placeholder.com' },
    { id: 2, brand: 'HRX by Hrithik Roshan', name: 'Men Pace Running Shoes', price: 1499, originalPrice: 2999, discount: 50, category: 'Shoes', image: 'https://placeholder.com' },
    { id: 3, brand: 'Nike', name: 'Court Vision Sneakers', price: 4995, originalPrice: 5995, discount: 16, category: 'Shoes', image: 'https://placeholder.com' },
    { id: 4, brand: 'Roadster', name: 'Men Slim Fit Jeans', price: 999, originalPrice: 1999, discount: 50, category: 'Jeans', image: 'https://placeholder.com' },
    { id: 5, brand: 'HRX by Hrithik Roshan', name: 'Active Wear T-shirt', price: 699, originalPrice: 1199, discount: 41, category: 'Tshirt', image: 'https://placeholder.com' }
];

// Instantiating App State
let bagItems = JSON.parse(localStorage.getItem('myntraBag')) || [];

// DOM References
const productGrid = document.getElementById('productGrid');
const bagCountElement = document.getElementById('bagCount');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const categoryFilters = document.querySelectorAll('.category-filter');
const brandFilters = document.querySelectorAll('.brand-filter');

// 1. Initialise App
function init() {
    renderProducts(PRODUCTS_DATA);
    updateBagCount();
    setupEventListeners();
}

// 2. Render Loop with Template Literals
function renderProducts(products) {
    productGrid.innerHTML = '';
    if(products.length === 0) {
        productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 40px; color:#7e818c;">No products matched your criteria.</p>`;
        return;
    }
    
    products.forEach(product => {
        const cardHtml = `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-img">
                <div class="product-info">
                    <div class="brand">${product.brand}</div>
                    <div class="name">${product.name}</div>
                    <div class="price-box">
                        <span>Rs. ${product.price}</span>
                        <span class="original-price">Rs. ${product.originalPrice}</span>
                        <span class="discount">(${product.discount}% OFF)</span>
                    </div>
                    <button class="add-to-bag-btn" onclick="addToBag(${product.id})">Add to Bag</button>
                </div>
            </div>
        `;
        productGrid.insertAdjacentHTML('beforeend', cardHtml);
    });
}

// 3. Functional Bag Pipelines
window.addToBag = function(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (product) {
        bagItems.push(product);
        localStorage.setItem('myntraBag', JSON.stringify(bagItems));
        updateBagCount();
    }
}

function updateBagCount() {
    bagCountElement.innerText = bagItems.length;
}

// 4. Multi-Filter & Search Pipeline
function filterAndSortProducts() {
    let filtered = [...PRODUCTS_DATA];

    // Search Box Processing
    const query = searchInput.value.toLowerCase().trim();
    if (query) {
        filtered = filtered.filter(p => 
            p.brand.toLowerCase().includes(query) || 
            p.name.toLowerCase().includes(query) || 
            p.category.toLowerCase().includes(query)
        );
    }

    // Category Box Filter Array Processing
    const selectedCategories = Array.from(categoryFilters).filter(i => i.checked).map(i => i.value);
    if (selectedCategories.length > 0) {
        filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    // Brand Box Filter Array Processing
    const selectedBrands = Array.from(brandFilters).filter(i => i.checked).map(i => i.value);
    if (selectedBrands.length > 0) {
        filtered = filtered.filter(p => selectedBrands.some(brand => p.brand.includes(brand)));
    }

    // Sorting Engine Pipeline
    const sortBy = sortSelect.value;
    if (sortBy === 'low-high') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'high-low') {
        filtered.sort((a, b) => b.price - a.price);
    }

    renderProducts(filtered);
}

// 5. Global Runtime DOM Binding Listeners
function setupEventListeners() {
    searchInput.addEventListener('input', filterAndSortProducts);
    sortSelect.addEventListener('change', filterAndSortProducts);
    categoryFilters.forEach(cb => cb.addEventListener('change', filterAndSortProducts));
    brandFilters.forEach(cb => cb.addEventListener('change', filterAndSortProducts));
}

// Fire Lifecycle Up 
document.addEventListener('DOMContentLoaded', init);
