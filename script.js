// =========================================================
// 1. CONFIGURAÇÕES DA LOJA
// =========================================================

// COLOQUE SEU NÚMERO AQUI (Exemplo: 55 + DDD + Número)
const WHATSAPP_NUMBER = "555599185-0704"; 

// LISTA DE PRODUTOS OFICIAIS (Cole aqui o código exportado quando for publicar)
const officialProducts = [];

// Lista de Categorias Atualizada
const initialCategories = [
    "Mangás", "HQs", "Livros", "Pokémon TCG", "Card Games", "Snacks",
    "Action Figures", "Funko Pop", "Videogames", "Eletrônicos", 
    "Colecionáveis", "Acessórios"
];

// =========================================================
// 2. LÓGICA DO SISTEMA
// =========================================================

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

// SEGURANÇA: A senha agora é "admgeek"
function setupAdminSecurity() {
    const adminBtn = document.getElementById('openAdmin');
    adminBtn.style.display = 'none'; 
    
    searchInput.addEventListener('input', (e) => {
        if(e.target.value === 'admgeek') { // NOVA SENHA
            adminBtn.style.display = 'block';
            alert('Modo Administrador Ativado! Use o botão de engrenagem para gerenciar.');
        }
    });
}

function renderCategories() {
    // Mantém o botão "Todos" e adiciona as outras
    categoryList.innerHTML = '<button class="cat-btn active" onclick="filterCategory(\'todos\', this)">Todos</button>';
    
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
    select.innerHTML = ''; // Limpa antes de carregar
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

    if (filtered.length === 0) {
        productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 50px;">Nenhum produto encontrado nesta categoria.</p>';
        return;
    }

    productGrid.innerHTML = filtered.map(p => {
        // Criar o link do WhatsApp para cada produto
        const mensagem = encodeURIComponent(`Olá! Tenho interesse no produto: ${p.name}`);
        const zapLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensagem}`;

        return `
        <div class="product-card">
            <img src="${p.image}" class="product-img" onerror="this.src='https://via.placeholder.com/300?text=Sem+Imagem'">
            <div class="product-info">
                <small style="color: var(--primary)">${p.category}</small>
                <h3>${p.name}</h3>
                <div class="product-price">R$ ${parseFloat(p.price).toFixed(2).replace('.', ',')}</div>
                <p class="product-desc">${p.description || ''}</p>
                
                <!-- BOTÃO DO WHATSAPP -->
                <a href="${zapLink}" target="_blank" class="btn-buy-zap">
                   📱 Comprar no WhatsApp
                </a>
            </div>
        </div>
    `}).join('');
}

// GERENCIAMENTO
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
    alert('Produto salvo com sucesso!');
};

// BOTÃO DE EXPORTAR
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
    alert('Código copiado! Abra seu script.js e cole na "const officialProducts = [ ... ]"');
};
document.querySelector('.modal-content').appendChild(exportBtn);

function deleteProduct(id) {
    if(confirm('Tem certeza que deseja excluir este produto?')) {
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
    alert('Edite os campos no formulário acima.');
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
