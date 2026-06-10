// CONFIGURAÇÕES
const WHATSAPP_NUMBER = "5555991850704"; // <--- COLOQUE SEU NUMERO AQUI
const IMGBB_API_KEY = "3ba2252edeb63a50d54f3fe65e42fef4"; // <--- SUA CHAVE API APLICADA

const officialProducts = [
    {
        "id": 1781051402537,
        "name": "goku feio",
        "price": "2.99",
        "category": "Action Figures",
        "image": "https://i.ibb.co/0V1sFVvr/1vnrl8vc05z21.jpg"
    },
    {
        "id": 1781051450166,
        "name": "oko",
        "price": "47.99",
        "category": "Mangás",
        "image": "https://i.ibb.co/qLf9TdW0/4b75f7a56dac5b9b69f67c089dfa1593.jpg"
    }
]; 
const initialCategories = ["Mangás", "HQs", "Livros", "Pokémon TCG", "Card Games", "Snacks", "Action Figures", "Funko Pop", "Videogames", "Eletrônicos", "Colecionáveis", "Acessórios"];

let products = JSON.parse(localStorage.getItem('multiversoGeek_products')) || officialProducts;
let currentCategory = 'todos';

function init() {
    renderCategories();
    renderProducts();
    setupAdminLogic();
    setupImageUpload();
    createExportButton(); // <-- Adicionamos essa linha aqui
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

// ESSA FUNÇÃO CRIA O BOTÃO VERDE DENTRO DA ENGRENAGEM
function createExportButton() {
    const modalContent = document.querySelector('.modal-content');
    
    const exportBtn = document.createElement('button');
    exportBtn.textContent = "📦 Gerar Código para Clientes";
    exportBtn.className = "btn-save-main"; // Usa a mesma cor vermelha do seu CSS
    exportBtn.style.marginTop = "20px";
    exportBtn.style.background = "#059669"; // Cor Verde para destacar
    
    exportBtn.onclick = () => {
        const code = JSON.stringify(products, null, 4);
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('CÓDIGO COPIADO!\n\nAgora você deve ir no GitHub, abrir o script.js e colar esse código dentro de: const officialProducts = [ ... ];');
    };
    
    modalContent.appendChild(exportBtn);
}
