// =========================================================
// 1. LISTA DE PRODUTOS OFICIAIS (O que o cliente vê)
// Cole aqui o código gerado pelo botão "Gerar Código para Publicar"
// =========================================================
const officialProducts = [
    // Seus produtos aparecerão aqui depois que você exportar
];

// =========================================================
// CONFIGURAÇÕES E LÓGICA
// =========================================================

const initialCategories = [
    "Mangás", "HQs", "Livros", "Pokémon TCG", "Yu-Gi-Oh! TCG", 
    "Magic: The Gathering", "Action Figures", "Funko Pop", 
    "Videogames", "Colecionáveis", "Acessórios", "Promoções"
];

// Carrega os produtos: Prioriza o que está no LocalStorage (para você editar) 
// ou o que está na lista oficial (para o cliente ver)
let products = JSON.parse(localStorage.getItem('geekStore_products')) || officialProducts;
let currentCategory = 'todos';

const productGrid = document.getElementById('productGrid');
const categoryList = document.getElementById('categoryList');
const searchInput = document.getElementById('searchInput');
const productForm = document.getElementById('productForm');
const adminModal = document.getElementById('adminModal');

function init() {
    renderCategories();
    renderProducts();
    populateCategorySelect();
    renderAdminTable();
    setupAdminSecurity();
}

// Segurança: O botão Admin só aparece se você digitar "admin123" na busca
function setupAdminSecurity() {
    const adminBtn = document.getElementById('openAdmin');
    adminBtn.style.display = 'none'; // Esconde por padrão
    
    searchInput.addEventListener('input', (e) => {
        if(e.target.value === 'admin123') { // ESSA É A SUA SENHA
            adminBtn.style.display = 'block';
            alert('Modo Administrador Ativado!');
        }
    });
}

function renderCategories() {
    initialCategories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'cat-btn';
        btn.textContent = cat;
        btn.onclick = () => filterCategory(cat, btn);
        categoryList.appendChild(btn);
    });
}

function populateCategorySelect() {
    const select = document.getElementById('pCategory');
    initialCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        select.appendChild(option);
    });
}

function filterCategory(category, btn) {
    currentCategory = category;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');
    renderProducts();
}

function renderProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const filtered = products.filter(p => {
        const matchesCategory = currentCategory === 'todos' || p.category === currentCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    productGrid.innerHTML = filtered.map(p => `
        <div class="product-card">
            <img src="${p.image}" class="product-img" onerror="this.src='https://via.placeholder.com/300?text=Sem+Imagem'">
            <div class="product-info">
                <h3>${p.name}</h3>
                <div class="product-price">R$ ${parseFloat(p.price).toFixed(2).replace('.', ',')}</div>
                <p class="product-desc">${p.description || ''}</p>
            </div>
        </div>
    `).join('');
}

// FUNÇÕES DE GERENCIAMENTO
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

    if(id) products = products.map(p => p.id == id ? productData : p);
    else products.push(productData);

    saveAndRefresh();
    productForm.reset();
    document.getElementById('productId').value = '';
};

// NOVO: BOTÃO DE EXPORTAR PARA O GITHUB
const exportBtn = document.createElement('button');
exportBtn.textContent = "📦 Gerar Código para Publicar";
exportBtn.className = "btn-save";
exportBtn.style.marginTop = "20px";
exportBtn.style.background = "#059669";
exportBtn.onclick = () => {
    const code = JSON.stringify(products, null, 4);
    const textArea = document.createElement('textarea');
    textArea.value = code;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('Código copiado! Agora abra seu script.js e cole dentro de "const officialProducts = [ ... ]"');
};
document.querySelector('.modal-content').appendChild(exportBtn);

function deleteProduct(id) {
    if(confirm('Excluir?')) {
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
}

function renderAdminTable() {
    const tbody = document.getElementById('adminProductList');
    tbody.innerHTML = products.map(p => `
        <tr>
            <td>${p.name}</td>
            <td>R$ ${p.price}</td>
            <td>
                <button onclick="editProduct(${p.id})">✏️</button>
                <button onclick="deleteProduct(${p.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function saveAndRefresh() {
    localStorage.setItem('geekStore_products', JSON.stringify(products));
    renderProducts();
    renderAdminTable();
}

init();