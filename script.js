const WHATSAPP_NUMBER = "5555991850704"; // COLOQUE SEU NUMERO AQUI
const officialProducts = [];
const initialCategories = ["Mangás", "HQs", "Livros", "Pokémon TCG", "TCGs Colecionáveis", "Action Figures", "Funko Pop", "Videogames", "Eletrônicos", "Colecionáveis", "Acessórios"];

let products = JSON.parse(localStorage.getItem('geekStore_products')) || officialProducts;
let currentCategory = 'todos';

function init() {
    renderCategories();
    renderProducts();
    setupAdmin();
    setupImageUpload();
}

// SÓ MOSTRA O BOTÃO SE DIGITAR admgeek
function setupAdmin() {
    const adminBtn = document.getElementById('openAdmin');
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', (e) => {
        if(e.target.value === 'admgeek26') {
            adminBtn.style.display = 'block';
            alert('Modo Admin Ativado!');
        }
    });

    adminBtn.onclick = () => document.getElementById('adminModal').style.display = 'block';
    document.querySelector('.close').onclick = () => document.getElementById('adminModal').style.display = 'none';
}

// TRANSFORMA FOTO DO PC EM TEXTO (Base64)
function setupImageUpload() {
    document.getElementById('pImageFile').addEventListener('change', function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('pImage').value = event.target.result;
        };
        if(file) reader.readAsDataURL(file);
    });
}

function renderCategories() {
    const list = document.getElementById('categoryList');
    list.innerHTML = `<button class="cat-btn active" onclick="filterCat('todos', this)">Todos</button>`;
    initialCategories.forEach(cat => {
        list.innerHTML += `<button class="cat-btn" onclick="filterCat('${cat}', this)">${cat}</button>`;
    });
    
    const select = document.getElementById('pCategory');
    initialCategories.forEach(cat => {
        select.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
}

function filterCat(cat, btn) {
    currentCategory = cat;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts();
}

function renderProducts() {
    const grid = document.getElementById('productGrid');
    const term = document.getElementById('searchInput').value.toLowerCase();
    
    const filtered = products.filter(p => {
        return (currentCategory === 'todos' || p.category === currentCategory) && 
               (p.name.toLowerCase().includes(term));
    });

    grid.innerHTML = filtered.map(p => `
        <div class="product-card">
            <img src="${p.image}" class="product-img" onerror="this.src='https://via.placeholder.com/300'">
            <div class="product-info">
                <h3>${p.name}</h3>
                <div class="product-price">R$ ${parseFloat(p.price).toFixed(2).replace('.', ',')}</div>
                <a href="https://wa.me/${WHATSAPP_NUMBER}?text=Interesse: ${p.name}" target="_blank" class="btn-buy-zap">WhatsApp</a>
            </div>
        </div>
    `).join('');
}

document.getElementById('productForm').onsubmit = (e) => {
    e.preventDefault();
    const newProd = {
        id: Date.now(),
        name: document.getElementById('pName').value,
        price: document.getElementById('pPrice').value,
        category: document.getElementById('pCategory').value,
        image: document.getElementById('pImage').value
    };
    products.push(newProd);
    localStorage.setItem('geekStore_products', JSON.stringify(products));
    renderProducts();
    document.getElementById('adminModal').style.display = 'none';
    alert('Produto salvo!');
};

init();
