// CONFIGURAÇÕES
const WHATSAPP_NUMBER = "5555991850704"; // <--- COLOQUE SEU NUMERO AQUI
const IMGBB_API_KEY = "3ba2252edeb63a50d54f3fe65e42fef4"; // <--- SUA CHAVE API APLICADA

const officialProducts = []; 
const initialCategories = ["Mangás", "HQs", "Livros", "Pokémon TCG", "Card Games", "Snacks", "Action Figures", "Funko Pop", "Videogames", "Eletrônicos", "Colecionáveis", "Acessórios"];

let products = JSON.parse(localStorage.getItem('multiversoGeek_products')) || officialProducts;
let currentCategory = 'todos';

function init() {
    renderCategories();
    renderProducts();
    setupAdminLogic();
    setupImageUpload();
}

// LOGICA DA SENHA admgeek
function setupAdminLogic() {
    const adminBtn = document.getElementById('openAdmin');
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', (e) => {
        if(e.target.value === 'admgeek') {
            adminBtn.style.setProperty('display', 'block', 'important');
            alert('Modo Administrador Ativado!');
        }
    });

    adminBtn.onclick = () => document.getElementById('adminModal').style.display = 'block';
    document.querySelector('.close-btn').onclick = () => document.getElementById('adminModal').style.display = 'none';
}

// UPLOAD AUTOMÁTICO PARA O IMGBB
function setupImageUpload() {
    const fileInput = document.getElementById('pImageFile');
    const hiddenUrlInput = document.getElementById('pImage');

    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        alert("Carregando imagem na nuvem... Aguarde um instante.");

        const formData = new FormData();
        formData.append("image", file);

        fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                hiddenUrlInput.value = data.data.url;
                alert("Foto carregada com sucesso! Você já pode salvar o produto.");
            } else {
                alert("Erro ao subir imagem. Verifique a chave API.");
            }
        })
        .catch(() => alert("Erro de conexão."));
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
    const filtered = products.filter(p => (currentCategory === 'todos' || p.category === currentCategory) && p.name.toLowerCase().includes(term));

    grid.innerHTML = filtered.map(p => `
        <div class="product-card">
            <img src="${p.image}" class="product-img" onerror="this.src='https://via.placeholder.com/300?text=Sem+Imagem'">
            <div class="product-info">
                <h3>${p.name}</h3>
                <div class="product-price">R$ ${parseFloat(p.price).toFixed(2).replace('.', ',')}</div>
                <a href="https://wa.me/${WHATSAPP_NUMBER}?text=Tenho interesse no: ${p.name}" target="_blank" class="btn-buy-zap">WhatsApp</a>
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
    localStorage.setItem('multiversoGeek_products', JSON.stringify(products));
    renderProducts();
    document.getElementById('productForm').reset();
    document.getElementById('adminModal').style.display = 'none';
    alert('Salvo!');
};

init();
