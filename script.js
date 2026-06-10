const WHATSAPP_NUMBER = "5555991850704"; 
const IMGBB_API_KEY = "3ba2252edeb63a50d54f3fe65e42fef4"; 

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

// LÓGICA DO ADMINISTRADOR E SENHA
function setupAdminLogic() {
    const adminBtn = document.getElementById('openAdmin');
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', (e) => {
        if(e.target.value === 'admgeek') {
            adminBtn.style.setProperty('display', 'block', 'important');
            alert('Modo Administrador Ativado!');
        }
    });

    adminBtn.onclick = () => {
        document.getElementById('adminModal').style.display = 'block';
        renderAdminTable(); 
    };
    
    // Fechar Modal Admin
    document.querySelector('.close-btn').onclick = () => {
        document.getElementById('adminModal').style.display = 'none';
    };
}

// SALVAR NOVO PRODUTO (COM DESCRIÇÃO)
document.getElementById('productForm').onsubmit = (e) => {
    e.preventDefault();
    
    const newProd = {
        id: Date.now(),
        name: document.getElementById('pName').value,
        price: document.getElementById('pPrice').value,
        category: document.getElementById('pCategory').value,
        image: document.getElementById('pImage').value,
        description: document.getElementById('pDesc').value // PEGA A DESCRIÇÃO
    };

    products.push(newProd);
    localStorage.setItem('multiversoGeek_products', JSON.stringify(products));
    
    renderProducts();
    renderAdminTable();
    
    // Limpar campos e fechar
    document.getElementById('productForm').reset();
    document.getElementById('pDesc').value = ''; 
    document.getElementById('adminModal').style.display = 'none';
    alert('Produto salvo com sucesso!');
};

// TABELA DE GERENCIAMENTO (APAGAR)
function renderAdminTable() {
    const list = document.getElementById('adminProductList');
    if (!list) return;

    if (products.length === 0) {
        list.innerHTML = '<p style="color:gray; font-size:0.8rem">Nenhum produto cadastrado.</p>';
        return;
    }

    list.innerHTML = products.map(p => `
        <div style="display:flex; justify-content:space-between; align-items:center; background:#1e293b; padding:10px; margin-bottom:8px; border-radius:8px;">
            <div style="display:flex; align-items:center; gap:10px">
                <img src="${p.image}" style="width:30px; height:30px; object-fit:cover; border-radius:4px">
                <span style="color:white; font-size:0.8rem; font-weight:bold">${p.name}</span>
            </div>
            <button onclick="deleteProduct(${p.id})" style="background:#ff4757; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; font-size:0.7rem; font-weight:bold">APAGAR</button>
        </div>
    `).join('');
}

function deleteProduct(id) {
    if (confirm('Deseja realmente apagar este produto?')) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('multiversoGeek_products', JSON.stringify(products));
        renderProducts();
        renderAdminTable();
    }
}

// UPLOAD DE IMAGEM
function setupImageUpload() {
    const fileInput = document.getElementById('pImageFile');
    const hiddenUrlInput = document.getElementById('pImage');
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        alert("Enviando foto...");
        const formData = new FormData();
        formData.append("image", file);
        fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                hiddenUrlInput.value = data.data.url;
                alert("Foto carregada!");
            }
        });
    });
}

// CATEGORIAS
function renderCategories() {
    const list = document.getElementById('categoryList');
    const select = document.getElementById('pCategory');
    list.innerHTML = `<button class="cat-btn active" onclick="filterCat('todos', this)">Todos</button>`;
    initialCategories.forEach(cat => {
        list.innerHTML += `<button class="cat-btn" onclick="filterCat('${cat}', this)">${cat}</button>`;
        if(select) select.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
}

function filterCat(cat, btn) {
    currentCategory = cat;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');
    renderProducts();
}

// EXIBIR PRODUTOS NA VITRINE
function renderProducts() {
    const grid = document.getElementById('productGrid');
    const term = document.getElementById('searchInput').value.toLowerCase();
    
    const filtered = products.filter(p => (currentCategory === 'todos' || p.category === currentCategory) && p.name.toLowerCase().includes(term));

    grid.innerHTML = filtered.map(p => `
        <div class="product-card" onclick="verDetalhes(${p.id})" style="cursor:pointer">
            <img src="${p.image}" class="product-img" onerror="this.src='https://via.placeholder.com/300?text=Sem+Imagem'">
            <div class="product-info">
                <small style="color:var(--text-main); opacity:0.7">${p.category}</small>
                <h3>${p.name}</h3>
                <div class="product-price">R$ ${parseFloat(p.price).toFixed(2).replace('.', ',')}</div>
                <div style="margin-top:10px; color:var(--primary); font-weight:bold; font-size:0.8rem">Ver mais detalhes...</div>
            </div>
        </div>
    `).join('');
}

// VER DETALHES DO PRODUTO (MODAL DO CLIENTE)
function verDetalhes(id) {
    const p = products.find(prod => prod.id == id);
    if (!p) return;

    document.getElementById('viewImage').src = p.image;
    document.getElementById('viewName').innerText = p.name;
    document.getElementById('viewPrice').innerText = `R$ ${parseFloat(p.price).toFixed(2).replace('.', ',')}`;
    
    // Mostra a descrição ou aviso se estiver vazio
    document.getElementById('viewDesc').innerText = p.description || "Sem descrição disponível.";

    // Link do WhatsApp
    const msg = encodeURIComponent(`Olá! Gostaria de mais informações sobre o produto: ${p.name}`);
    document.getElementById('viewZap').href = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;

    document.getElementById('viewModal').style.display = 'block';
}

// BOTÃO DE EXPORTAR (GERAR CÓDIGO)
const exportBtn = document.createElement('button');
exportBtn.textContent = "📦 Gerar Código para Clientes";
exportBtn.style = "background:#059669; color:white; padding:12px; width:100%; border:none; border-radius:5px; cursor:pointer; font-weight:bold; margin-top:15px;";
exportBtn.onclick = () => {
    const code = JSON.stringify(products, null, 4);
    const textArea = document.createElement('textarea');
    textArea.value = code;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('CÓDIGO COPIADO! Cole no officialProducts do GitHub.');
};
document.querySelector('.modal-content').appendChild(exportBtn);

// FECHAR MODAIS
document.querySelector('.close-view').onclick = () => {
    document.getElementById('viewModal').style.display = 'none';
};

window.onclick = (event) => {
    if (event.target == document.getElementById('viewModal')) {
        document.getElementById('viewModal').style.display = 'none';
    }
    if (event.target == document.getElementById('adminModal')) {
        document.getElementById('adminModal').style.display = 'none';
    }
};

init();
