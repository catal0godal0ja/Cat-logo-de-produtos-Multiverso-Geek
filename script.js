// CONFIGURAÇÕES
const WHATSAPP_NUMBER = "5555991850704"; // COLOQUE SEU NUMERO AQUI
const officialProducts = []; // Para publicar definitivo, cole o código exportado aqui

const initialCategories = [
    "Mangás", "HQs", "Livros", "Pokémon TCG", "TCGs Colecionáveis", 
    "Action Figures", "Funko Pop", "Videogames", "Eletrônicos", 
    "Colecionáveis", "Acessórios"
];

// ONDE SALVA OS DADOS (Nome atualizado para MultiversoGeek)
let products = JSON.parse(localStorage.getItem('multiversoGeek_products')) || officialProducts;
let currentCategory = 'todos';

function init() {
    renderCategories();
    renderProducts();
    setupAdminLogic();
    setupImageReader();
}

function setupAdminLogic() {
    const adminBtn = document.getElementById('openAdmin');
    const searchInput = document.getElementById('searchInput');
    const modal = document.getElementById('adminModal');

    // Escuta o que você digita na barra de pesquisa
    searchInput.addEventListener('input', (e) => {
        if(e.target.value === 'admgeek') {
            // Este comando "força" a engrenagem a aparecer
            adminBtn.style.setProperty('display', 'block', 'important');
            alert('Acesso Administrador Liberado!');
        }
    });

    adminBtn.onclick = () => {
        modal.style.display = 'block';
        if(typeof renderAdminTable === "function") renderAdminTable();
    };
}

function closeModal() {
    document.getElementById('adminModal').style.display = 'none';
}

// LER IMAGEM DO COMPUTADOR
function setupImageReader() {
    document.getElementById('pImageFile').addEventListener('change', function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('pImage').value = event.target.result;
            alert('Imagem carregada com sucesso!');
        };
        if(file) reader.readAsDataURL(file);
    });
}

function renderCategories() {
    const list = document.getElementById('categoryList');
    const select = document.getElementById('pCategory');
    
    list.innerHTML = `<button class="cat-btn active" onclick="filterCat('todos', this)">Todos</button>`;
    
    initialCategories.forEach(cat => {
        list.innerHTML += `<button class="cat-btn" onclick="filterCat('${cat}', this)">${cat}</button>`;
        select.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
}

function filterCat(cat, btn) {
    currentCategory = cat;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');
    renderProducts();
}

function renderProducts() {
    const grid = document.getElementById('productGrid');
    const term = document.getElementById('searchInput').value.toLowerCase();
    
    const filtered = products.filter(p => {
        const matchCat = currentCategory === 'todos' || p.category === currentCategory;
        const matchSearch = p.name.toLowerCase().includes(term);
        return matchCat && matchSearch;
    });

    grid.innerHTML = filtered.map(p => {
        const msg = encodeURIComponent(`Olá! Tenho interesse no: ${p.name}`);
        return `
        <div class="product-card">
            <img src="${p.image}" class="product-img" onerror="this.src='https://via.placeholder.com/300?text=Sem+Imagem'">
            <div class="product-info">
                <small style="color:var(--text-main)">${p.category}</small>
                <h3>${p.name}</h3>
                <div class="product-price">R$ ${parseFloat(p.price).toFixed(2).replace('.', ',')}</div>
                <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${msg}" target="_blank" class="btn-buy-zap">
                   📱 WhatsApp
                </a>
            </div>
        </div>
    `}).join('');
}

// SALVAR E ATUALIZAR
document.getElementById('productForm').onsubmit = (e) => {
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
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    alert('Produto salvo com sucesso!');
};

function saveAndRefresh() {
    localStorage.setItem('multiversoGeek_products', JSON.stringify(products));
    renderProducts();
    renderAdminTable();
}

function deleteProduct(id) {
    if(confirm('Excluir este produto?')) {
        products = products.filter(p => p.id != id);
        saveAndRefresh();
    }
}

function renderAdminTable() {
    const list = document.getElementById('adminProductList');
    list.innerHTML = products.map(p => `
        <div style="display:flex; justify-content:space-between; background:#1e293b; padding:10px; margin-bottom:5px; border-radius:5px; font-size:0.8rem">
            <span>${p.name}</span>
            <button onclick="deleteProduct(${p.id})" style="background:red; color:white; border:none; padding:2px 5px; cursor:pointer">Apagar</button>
        </div>
    `).join('');
}

init();
