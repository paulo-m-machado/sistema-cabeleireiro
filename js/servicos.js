// Base de dados mockada
const promosData = [
    {
        title: 'Kit Verão Total',
        description: 'Corte + Hidratação Profunda + Escova',
        price: 'R$ 149,90',
        conditions: 'Válido de Terça a Quinta'
    },
    {
        title: 'Dia de Rainha',
        description: 'Limpeza de Pele + Massagem Relaxante + Manicure/Pedicure',
        price: 'R$ 199,90',
        conditions: 'Apenas Sábados (Agendamento Prévio)'
    }
];

const servicesData = [
    {
        id: 1,
        title: 'Corte Feminino Completo',
        category: 'Cabelos',
        description: 'Corte atualizado seguido de lavagem especial e escova modeladora de finalização.',
        price: 'R$ 80,00',
        duration: '1h 30m',
        professionals: ['João', 'Maria']
    },
    {
        id: 2,
        title: 'Corte Masculino',
        category: 'Cabelos',
        description: 'Corte social ou degradê, com marcação na navalha e finalização com pomada.',
        price: 'R$ 45,00',
        duration: '45m',
        professionals: ['João', 'Carlos']
    },
    {
        id: 3,
        title: 'Luzes / Balaiagem',
        category: 'Cabelos',
        description: 'Técnica de iluminação com máxima proteção dos fios. Tons de loiro ou morena iluminada.',
        price: 'A partir de R$ 350,00',
        duration: '3h a 4h',
        professionals: ['João']
    },
    {
        id: 4,
        title: 'Manicure Tradicional',
        category: 'Unhas',
        description: 'Cutilagem profunda, esmaltação tradicional e hidratação das mãos.',
        price: 'R$ 35,00',
        duration: '45m',
        professionals: ['Maria', 'Ana']
    },
    {
        id: 5,
        title: 'Pedicure',
        category: 'Unhas',
        description: 'Cuidado completo para os pés, remoção de asperezas leves, cutilagem e esmaltação.',
        price: 'R$ 45,00',
        duration: '50m',
        professionals: ['Maria', 'Ana']
    },
    {
        id: 6,
        title: 'Limpeza de Pele',
        category: 'Estética',
        description: 'Higienização profunda, extração de cravos e espinhas, alta frequência e máscara calmante.',
        price: 'R$ 120,00',
        duration: '1h 20m',
        professionals: ['Ana']
    },
    {
        id: 7,
        title: 'Massagem Relaxante',
        category: 'Estética',
        description: 'Técnicas manuais e óleos essenciais para alívio de tensões do dia a dia.',
        price: 'R$ 150,00',
        duration: '1h',
        professionals: ['Ana']
    },
    {
        id: 8,
        title: 'Design de Sobrancelhas',
        category: 'Outros',
        description: 'Mapeamento facial completo, limpeza, design refinado e aplicação de tintura ou henna (opcional).',
        price: 'R$ 55,00',
        duration: '40m',
        professionals: ['Maria']
    }
];

// Elementos da DOM
const promosGrid = document.getElementById('promos-grid');
const servicesGrid = document.getElementById('services-grid');
const filterBtns = document.querySelectorAll('.filter-btn');

function renderPromos() {
    promosGrid.innerHTML = '';
    promosData.forEach(promo => {
        const card = document.createElement('div');
        card.className = 'promo-card';
        card.innerHTML = `
            <div class="promo-title">✨ ${promo.title}</div>
            <div class="promo-desc">${promo.description}</div>
            <div class="promo-price">${promo.price}</div>
            <div class="promo-conditions">📅 ${promo.conditions}</div>
        `;
        promosGrid.appendChild(card);
    });
}

function renderServices(categoryFilter = 'todos') {
    servicesGrid.innerHTML = '';
    
    // Filtro pelas categorias
    const filteredServices = servicesData.filter(srv => {
        if (categoryFilter === 'todos') return true;
        return srv.category === categoryFilter;
    });

    // Caso não exista ou dê algum problema
    if (filteredServices.length === 0) {
        servicesGrid.innerHTML = '<p style="color: #ccc; grid-column: 1/-1; text-align: center;">Nenhum serviço encontrado para esta categoria no momento.</p>';
        return;
    }

    filteredServices.forEach(srv => {
        const card = document.createElement('div');
        card.className = 'service-card';
        
        const professionalsText = srv.professionals.join(', ');

        card.innerHTML = `
            <div class="service-title">${srv.title}</div>
            <div class="service-desc">${srv.description}</div>
            
            <div class="service-meta">
                <span class="price-badge">${srv.price}</span>
                <span class="time-badge">⏱ ${srv.duration}</span>
            </div>
            
            <div class="professionals-list">
                Realizado por: <span>${professionalsText}</span>
            </div>
            
            <button class="btn-agendar" onclick="window.location.href='/agenda/index.html'">Agendar</button>
        `;
        servicesGrid.appendChild(card);
    });
}

// Lógica de Filtros via Event Listener
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Remove 'active' do botão anterior
        filterBtns.forEach(b => b.classList.remove('active'));
        
        // Ativa o botão selecionado
        const clickedBtn = e.target;
        clickedBtn.classList.add('active');
        
        // Dispara a nova renderização baseada na seleção
        const category = clickedBtn.getAttribute('data-category');
        renderServices(category);
    });
});

// Inicialização (quando carregar o script, rendeniza promocional e todos serviços)
renderPromos();
renderServices('todos');
