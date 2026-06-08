// Categorias iniciais
const initialCategories = [
    "Mangás", "HQs", "Livros", "Pokémon TCG", "Yu-Gi-Oh! TCG", 
    "Magic: The Gathering", "Action Figures", "Funko Pop", 
    "Videogames", "Colecionáveis", "Acessórios", "Promoções"
];

// Estado da aplicação
let products = JSON.parse(localStorage.getItem('geekStore_products')) || [];
let currentCategory = 'todos';

// Elementos DOM
const productGrid = document.getElementById('productGrid');
const categoryList = document.getElementById('categoryList');
const searchInput = document.getElementById('searchInput');
const productForm = document.getElementById('productForm');
const adminModal = document.getElementById('adminModal');

// Inicialização
function init() {
    renderCategories();
    renderProducts();
    populateCategorySelect();
    renderAdminTable();
}

// Renderizar botões de categoria
function renderCategories() {
    initialCategories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'cat-btn';
        btn.textContent = cat;
        btn.onclick = () => filterCategory(cat, btn);
        categoryList.appendChild(btn);
    });
}

// Popular Select do Formulário
function populateCategorySelect() {
    const select = document.getElementById('pCategory');
    initialCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        select.appendChild(option);
    });
}

// Filtrar por Categoria
function filterCategory(category, btn) {
    currentCategory = category;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');
    else document.querySelector('[data-category="todos"]').classList.add('active');
    renderProducts();
}

// Renderizar Grid de Produtos
function renderProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    
    const filtered = products.filter(p => {
        const matchesCategory = currentCategory === 'todos' || p.category === currentCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    productGrid.innerHTML = filtered.map(p => `
        <div class="product-card">
            <img src="${p.image}" class="product-img" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300?text=Sem+Imagem'">
            <div class="product-info">
                <h3>${p.name}</h3>
                <div class="product-price">R$ ${parseFloat(p.price).toFixed(2).replace('.', ',')}</div>
                <div class="product-desc">${p.description || ''}</div>
            </div>
        </div>
    `).join('');

    document.getElementById('noResults').className = filtered.length ? 'hidden' : 'no-results-msg';
}

// Busca em tempo real
searchInput.oninput = renderProducts;

// --- FUNÇÕES ADMIN ---

document.getElementById('openAdmin').onclick = () => adminModal.style.display = 'block';
document.querySelector('.close').onclick = () => adminModal.style.display = 'none';

productForm.onsubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById('productId').value;
    
    const productData = {
        id: id || Date.now(),
        name: document.getElementById('pName').value,
        price: document.getElementById('pPrice').value,
        category: document.getElementById('pCategory').value,
        image: document.getElementById('pImage').value,
        description: document.getElementById('pDesc').value
    };

    if(id) {
        products = products.map(p => p.id == id ? productData : p);
    } else {
        products.push(productData);
    }

    saveAndRefresh();
    productForm.reset();
    document.getElementById('productId').value = '';
    document.getElementById('saveBtn').textContent = 'Salvar Produto';
};

function deleteProduct(id) {
    if(confirm('Deseja excluir este produto?')) {
        products = products.filter(p => p.id != id);
        saveAndRefresh();
    }
}

function editProduct(id) {
    const p = products.find(p => p.id == id);
    document.getElementById('productId').value = p.id;
    document.getElementById('pName').value = p.name;
    document.getElementById('pPrice').value = p.price;
    document.getElementById('pCategory').value = p.category;
    document.getElementById('pImage').value = p.image;
    document.getElementById('pDesc').value = p.description;
    document.getElementById('saveBtn').textContent = 'Atualizar Produto';
}

function renderAdminTable() {
    const tbody = document.getElementById('adminProductList');
    tbody.innerHTML = products.map(p => `
        <tr>
            <td>${p.name}</td>
            <td>R$ ${p.price}</td>
            <td>
                <button class="btn-edit" onclick="editProduct(${p.id})">✏️</button>
                <button class="btn-delete" onclick="deleteProduct(${p.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function saveAndRefresh() {
    localStorage.setItem('geekStore_products', JSON.stringify(products));
    renderProducts();
    renderAdminTable();
}

// Iniciar app
init();