// Dados iniciais (simulando um banco de dados / localStorage)
let servicosData = [
    {
        id: 1,
        nome: "Corte Feminino Completo",
        categoria: "Cabelos",
        descricao: "Lavagem, corte e secagem.",
        preco: "R$ 80,00",
        duracao: "1h 00m",
        profissionais: "Ana, Julia",
        status: "Ativo"
    },
    {
        id: 2,
        nome: "Corte Masculino",
        categoria: "Cabelos",
        descricao: "Corte social ou degradê.",
        preco: "R$ 40,00",
        duracao: "40m",
        profissionais: "Carlos, Rafael",
        status: "Ativo"
    },
    {
        id: 3,
        nome: "Luzes/Balaiagem",
        categoria: "Cabelos",
        descricao: "Técnica de iluminação dos fios.",
        preco: "R$ 250,00",
        duracao: "3h 00m",
        profissionais: "Ana",
        status: "Ativo"
    },
    {
        id: 4,
        nome: "Manicure Tradicional",
        categoria: "Unhas",
        descricao: "Cutilagem e esmaltação.",
        preco: "R$ 35,00",
        duracao: "50m",
        profissionais: "Mariana",
        status: "Ativo"
    },
    {
        id: 5,
        nome: "Pedicure",
        categoria: "Unhas",
        descricao: "Cutilagem e esmaltação dos pés.",
        preco: "R$ 40,00",
        duracao: "1h 00m",
        profissionais: "Mariana",
        status: "Ativo"
    },
    {
        id: 6,
        nome: "Limpeza de Pele",
        categoria: "Estética",
        descricao: "Extração de cravos e hidratação profunda.",
        preco: "R$ 120,00",
        duracao: "1h 30m",
        profissionais: "Luiza",
        status: "Ativo"
    },
    {
        id: 7,
        nome: "Massagem Relaxante",
        categoria: "Estética",
        descricao: "Massagem corporal para alívio de tensão.",
        preco: "R$ 100,00",
        duracao: "1h 00m",
        profissionais: "Luiza",
        status: "Ativo"
    },
    {
        id: 8,
        nome: "Design de Sobrancelhas",
        categoria: "Outros",
        descricao: "Modelagem de sobrancelhas com pinça/linha.",
        preco: "R$ 45,00",
        duracao: "30m",
        profissionais: "Luiza, Ana",
        status: "Ativo"
    }
];

let kitsData = [
    {
        id: 101,
        nome: "Kit Verão Total",
        descricao: "Limpeza de pele + Massagem Relaxante + Manicure",
        preco: "R$ 220,00",
        condicoes: "Válido de Terça a Quinta"
    },
    {
        id: 102,
        nome: "Dia de Rainha",
        descricao: "Corte Feminino + Luzes + Pedicure e Manicure",
        preco: "R$ 380,00",
        condicoes: "Agendamento com 48h de antecedência"
    }
];

// Elementos do DOM
const tbodyServicos = document.getElementById('lista-servicos-body');
const gridKits = document.getElementById('lista-kits-grid');
const formServico = document.getElementById('form-servico');
const formKit = document.getElementById('form-kit');
const inputBusca = document.getElementById('busca-servicos');

// Função para retornar a classe do badge baseada na categoria
function getCategoriaBadgeClass(categoria) {
    switch (categoria) {
        case 'Cabelos': return 'badge-cabelos';
        case 'Estética': return 'badge-estetica';
        case 'Unhas': return 'badge-unhas';
        default: return 'badge-outros';
    }
}

// Renderizar Serviços
function renderServicos(filtro = '') {
    tbodyServicos.innerHTML = '';
    
    const termo = filtro.toLowerCase();
    const servicosFiltrados = servicosData.filter(servico => 
        servico.nome.toLowerCase().includes(termo) || 
        servico.categoria.toLowerCase().includes(termo)
    );

    servicosFiltrados.forEach(servico => {
        const badgeCategoria = getCategoriaBadgeClass(servico.categoria);
        const statusClass = servico.status === 'Ativo' ? 'status-ativo' : 'status-inativo';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td data-label="Nome">${servico.nome}</td>
            <td data-label="Categoria"><span class="badge ${badgeCategoria}">${servico.categoria}</span></td>
            <td data-label="Preço">${servico.preco}</td>
            <td data-label="Duração">${servico.duracao}</td>
            <td data-label="Status"><span class="badge-status ${statusClass}">${servico.status}</span></td>
            <td data-label="Ações">
                <button class="btn btn-action btn-edit" onclick="editarServico(${servico.id})">Editar</button>
                <button class="btn btn-action btn-delete" onclick="excluirServico(${servico.id})">Excluir</button>
            </td>
        `;
        tbodyServicos.appendChild(tr);
    });
}

// Renderizar Kits
function renderKits() {
    gridKits.innerHTML = '';
    
    kitsData.forEach(kit => {
        const div = document.createElement('div');
        div.className = 'promo-card';
        div.innerHTML = `
            <h3>${kit.nome}</h3>
            <p class="desc">${kit.descricao}</p>
            <div class="price">${kit.preco}</div>
            ${kit.condicoes ? `<div class="conditions">Condições: ${kit.condicoes}</div>` : ''}
            <div class="promo-actions">
                <button class="btn btn-secondary" onclick="editarKit(${kit.id})">Editar</button>
                <button class="btn btn-delete" onclick="excluirKit(${kit.id})">Excluir</button>
            </div>
        `;
        gridKits.appendChild(div);
    });
}

// ---- Funções CRUD Serviços ----

function limparFormularioServico() {
    formServico.reset();
    document.getElementById('servico-id').value = '';
    document.getElementById('btn-salvar-servico').textContent = 'Salvar Serviço';
}

formServico.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const id = document.getElementById('servico-id').value;
    const nome = document.getElementById('servico-nome').value;
    const categoria = document.getElementById('servico-categoria').value;
    const descricao = document.getElementById('servico-descricao').value;
    const preco = document.getElementById('servico-preco').value;
    const duracao = document.getElementById('servico-duracao').value;
    const profissionais = document.getElementById('servico-profissionais').value;
    const status = document.getElementById('servico-status').value;

    if (id) {
        // Atualizar
        const index = servicosData.findIndex(s => s.id == id);
        if (index !== -1) {
            servicosData[index] = {
                id: parseInt(id), nome, categoria, descricao, preco, duracao, profissionais, status
            };
            alert("Serviço atualizado com sucesso!");
        }
    } else {
        // Criar
        const novoServico = {
            id: Date.now(),
            nome, categoria, descricao, preco, duracao, profissionais, status
        };
        servicosData.push(novoServico);
        alert("Serviço cadastrado com sucesso!");
    }

    limparFormularioServico();
    renderServicos(inputBusca.value);
});

window.editarServico = function(id) {
    const servico = servicosData.find(s => s.id === id);
    if (servico) {
        document.getElementById('servico-id').value = servico.id;
        document.getElementById('servico-nome').value = servico.nome;
        document.getElementById('servico-categoria').value = servico.categoria;
        document.getElementById('servico-descricao').value = servico.descricao;
        document.getElementById('servico-preco').value = servico.preco;
        document.getElementById('servico-duracao').value = servico.duracao;
        document.getElementById('servico-profissionais').value = servico.profissionais;
        document.getElementById('servico-status').value = servico.status;
        
        document.getElementById('btn-salvar-servico').textContent = 'Atualizar Serviço';
        
        // Scroll suave até o formulário
        document.getElementById('section-cadastro-servico').scrollIntoView({ behavior: 'smooth' });
    }
};

window.excluirServico = function(id) {
    if (confirm("Tem certeza que deseja excluir este serviço?")) {
        servicosData = servicosData.filter(s => s.id !== id);
        renderServicos(inputBusca.value);
    }
};

// Busca em tempo real
inputBusca.addEventListener('input', (e) => {
    renderServicos(e.target.value);
});


// ---- Funções CRUD Kits ----

function limparFormularioKit() {
    formKit.reset();
    document.getElementById('kit-id').value = '';
    document.getElementById('btn-salvar-kit').textContent = 'Salvar Kit';
}

formKit.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const id = document.getElementById('kit-id').value;
    const nome = document.getElementById('kit-nome').value;
    const descricao = document.getElementById('kit-descricao').value;
    const preco = document.getElementById('kit-preco').value;
    const condicoes = document.getElementById('kit-condicoes').value;

    if (id) {
        // Atualizar
        const index = kitsData.findIndex(k => k.id == id);
        if (index !== -1) {
            kitsData[index] = { id: parseInt(id), nome, descricao, preco, condicoes };
            alert("Kit atualizado com sucesso!");
        }
    } else {
        // Criar
        const novoKit = { id: Date.now(), nome, descricao, preco, condicoes };
        kitsData.push(novoKit);
        alert("Kit cadastrado com sucesso!");
    }

    limparFormularioKit();
    renderKits();
});

window.editarKit = function(id) {
    const kit = kitsData.find(k => k.id === id);
    if (kit) {
        document.getElementById('kit-id').value = kit.id;
        document.getElementById('kit-nome').value = kit.nome;
        document.getElementById('kit-descricao').value = kit.descricao;
        document.getElementById('kit-preco').value = kit.preco;
        document.getElementById('kit-condicoes').value = kit.condicoes || '';
        
        document.getElementById('btn-salvar-kit').textContent = 'Atualizar Kit';
        
        document.getElementById('section-cadastro-kit').scrollIntoView({ behavior: 'smooth' });
    }
};

window.excluirKit = function(id) {
    if (confirm("Tem certeza que deseja excluir este kit?")) {
        kitsData = kitsData.filter(k => k.id !== id);
        renderKits();
    }
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderServicos();
    renderKits();
});
