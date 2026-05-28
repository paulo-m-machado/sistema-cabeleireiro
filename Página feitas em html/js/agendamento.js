const scheduleData = [
    { day: 1, time: '08:00', client: 'Beatriz Silva', professional: 'João', service: 'Corte Feminino' },
    { day: 1, time: '10:00', client: 'Roberto Carlos', professional: 'Carlos', service: 'Corte Masculino' },
    { day: 1, time: '14:00', client: 'Camila Santos', professional: 'Maria', service: 'Manicure e Pedicure' },
    { day: 2, time: '08:00', client: 'Juliana Paes', professional: 'Ana', service: 'Estética Facial' },
    { day: 2, time: '11:00', client: 'Lucas Moura', professional: 'João', service: 'Barba e Cabelo' },
    { day: 3, time: '16:00', client: 'Mariana Ximenes', professional: 'Maria', service: 'Maquiagem e Penteado' },
    { day: 4, time: '09:00', client: 'Fernanda Lima', professional: 'Ana', service: 'Limpeza de Pele' },
    { day: 4, time: '13:00', client: 'Rodrigo Hilbert', professional: 'Carlos', service: 'Corte Masculino' },
    { day: 5, time: '08:00', client: 'Paolla Oliveira', professional: 'Maria', service: 'Manicure' },
    { day: 5, time: '15:00', client: 'Alice Braga', professional: 'João', service: 'Luzes' },
    { day: 6, time: '10:00', client: 'Gisele Bündchen', professional: 'Maria', service: 'Manicure' },
    { day: 6, time: '18:00', client: 'Wagner Moura', professional: 'Ana', service: 'Massagem Relaxante' }
];

const servicesData = [
    { id: 1, title: 'Corte Feminino Completo', category: 'Cabelos', description: 'Lavagem, corte e finalização.', price: 'R$ 80,00', duration: '1h 30m', professionals: ['João', 'Maria'] },
    { id: 2, title: 'Corte Masculino', category: 'Cabelos', description: 'Corte com máquina ou tesoura, acabamento perfeito.', price: 'R$ 45,00', duration: '45m', professionals: ['João', 'Carlos'] },
    { id: 3, title: 'Luzes / Balaiagem', category: 'Cabelos', description: 'Técnicas de iluminação sob medida.', price: 'A partir de R$ 350,00', duration: '3h a 4h', professionals: ['João'] },
    { id: 4, title: 'Manicure Tradicional', category: 'Unhas', description: 'Cutilagem, hidratação e esmaltação.', price: 'R$ 35,00', duration: '45m', professionals: ['Maria', 'Ana'] },
    { id: 5, title: 'Pedicure', category: 'Unhas', description: 'Cutilagem, hidratação, esfoliação e esmaltação.', price: 'R$ 45,00', duration: '50m', professionals: ['Maria', 'Ana'] },
    { id: 6, title: 'Limpeza de Pele', category: 'Estética', description: 'Assepsia, esfoliação, extração e máscara.', price: 'R$ 120,00', duration: '1h 20m', professionals: ['Ana'] },
    { id: 7, title: 'Massagem Relaxante', category: 'Estética', description: 'Massagem corporal completa com óleos essenciais.', price: 'R$ 150,00', duration: '1h', professionals: ['Ana'] },
    { id: 8, title: 'Design de Sobrancelhas', category: 'Outros', description: 'Alinhamento e design com pinça/linha.', price: 'R$ 55,00', duration: '40m', professionals: ['Maria'] }
];

const horariosFixos = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

const novosAgendamentos = JSON.parse(localStorage.getItem('novosAgendamentos') || '[]');
novosAgendamentos.forEach(novo => {
    const jaExiste = scheduleData.some(a => a.client === novo.client && a.day === novo.day && a.time === novo.time);
    if (!jaExiste) scheduleData.push(novo);
});

let agendamentoAtual = {
    etapa: 1,
    servicoId: null,
    profissional: null,
    data: null,
    diaSemana: null,
    horario: null,
    cliente: {}
};

function irParaEtapa(n) {
    document.querySelectorAll('.etapa').forEach(e => e.style.display = 'none');
    
    if (n <= 4) {
        document.getElementById(`etapa-${n}`).style.display = 'block';
        document.querySelectorAll('.step').forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index + 1 < n) step.classList.add('completed');
            if (index + 1 === n) step.classList.add('active');
        });
    } else {
        document.getElementById('etapa-sucesso').style.display = 'block';
    }
    agendamentoAtual.etapa = n;
}

function getDiaSemana(dateString) {
    const dataObj = new Date(dateString + 'T00:00:00');
    const dia = dataObj.getDay();
    return dia;
}

function formatarData(dateString) {
    const dataObj = new Date(dateString + 'T00:00:00');
    const opcoes = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' };
    let formatada = dataObj.toLocaleDateString('pt-BR', opcoes);
    return formatada.charAt(0).toUpperCase() + formatada.slice(1);
}

function renderServicos(filtro) {
    const grid = document.getElementById('servicos-grid');
    grid.innerHTML = '';
    
    const filtrados = filtro === 'Todos' ? servicesData : servicesData.filter(s => s.category === filtro);
    
    filtrados.forEach(servico => {
        const div = document.createElement('div');
        div.className = `service-card ${agendamentoAtual.servicoId === servico.id ? 'selected' : (agendamentoAtual.servicoId ? 'not-selected' : '')}`;
        div.innerHTML = `
            <span class="card-icon-check">✓</span>
            <h3>${servico.title}</h3>
            <p>${servico.description}</p>
            <div class="service-badges">
                <span class="badge-price">${servico.price}</span>
                <span class="badge-time">⏱ ${servico.duration}</span>
            </div>
        `;
        div.onclick = () => selecionarServico(servico.id);
        grid.appendChild(div);
    });
}

function selecionarServico(id) {
    agendamentoAtual.servicoId = id;
    agendamentoAtual.profissional = null;
    agendamentoAtual.horario = null;
    agendamentoAtual.data = null;
    
    renderServicos(document.querySelector('.filter-btn.active').dataset.filter);
    document.getElementById('btn-proximo-1').disabled = false;
}

function renderProfissionais() {
    const grid = document.getElementById('profissionais-grid');
    grid.innerHTML = '';
    
    const servico = servicesData.find(s => s.id === agendamentoAtual.servicoId);
    if (!servico) return;

    servico.professionals.forEach(prof => {
        const div = document.createElement('div');
        div.className = `professional-card ${agendamentoAtual.profissional === prof ? 'selected' : (agendamentoAtual.profissional ? 'not-selected' : '')}`;
        
        let especialidade = "Especialista";
        if (prof === "João" || prof === "Carlos") especialidade = "Hair Stylist";
        if (prof === "Maria") especialidade = "Manicure e Designer";
        if (prof === "Ana") especialidade = "Esteticista";
        
        div.innerHTML = `
            <span class="card-icon-check">✓</span>
            <div class="avatar avatar-${prof}">${prof.charAt(0)}</div>
            <h3>${prof}</h3>
            <p>${especialidade}</p>
            <span class="badge-available">Disponível</span>
        `;
        div.onclick = () => selecionarProfissional(prof);
        grid.appendChild(div);
    });
}

function selecionarProfissional(nome) {
    agendamentoAtual.profissional = nome;
    agendamentoAtual.horario = null;
    
    renderProfissionais();
    document.getElementById('btn-proximo-2').disabled = false;
}

function renderHorarios() {
    const grid = document.getElementById('horarios-grid');
    grid.innerHTML = '';
    document.getElementById('btn-proximo-3').disabled = true;

    if (!agendamentoAtual.data) {
        grid.innerHTML = '<p class="placeholder-text">Selecione uma data primeiro.</p>';
        return;
    }

    horariosFixos.forEach(hora => {
        const ocupado = scheduleData.some(apt => 
            apt.professional === agendamentoAtual.profissional && 
            apt.day === agendamentoAtual.diaSemana && 
            apt.time === hora
        );

        const div = document.createElement('div');
        div.className = `chip-horario ${ocupado ? 'ocupado' : ''} ${agendamentoAtual.horario === hora ? 'selecionado' : ''}`;
        div.innerText = ocupado ? `${hora} - Ocupado` : hora;
        
        if (!ocupado) {
            div.onclick = () => selecionarHorario(hora);
        }
        grid.appendChild(div);
    });
}

function selecionarHorario(hora) {
    agendamentoAtual.horario = hora;
    renderHorarios();
    document.getElementById('btn-proximo-3').disabled = false;
}

function renderConfirmacao() {
    const servico = servicesData.find(s => s.id === agendamentoAtual.servicoId);
    
    document.getElementById('resumo-servico').innerText = servico.title;
    document.getElementById('resumo-profissional').innerText = agendamentoAtual.profissional;
    document.getElementById('resumo-data').innerText = formatarData(agendamentoAtual.data);
    document.getElementById('resumo-horario').innerText = agendamentoAtual.horario;
    document.getElementById('resumo-preco').innerText = servico.price;
    document.getElementById('resumo-duracao').innerText = servico.duration;
}

function aplicarMascaraTelefone(input) {
    let valor = input.value.replace(/\D/g, '');
    if (valor.length > 11) valor = valor.slice(0, 11);
    
    if (valor.length > 2) {
        valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
    }
    if (valor.length > 10) {
        valor = `${valor.slice(0, 10)}-${valor.slice(10)}`;
    }
    input.value = valor;
}

function confirmarAgendamento() {
    const nome = document.getElementById('cliente-nome').value.trim();
    const telefone = document.getElementById('cliente-telefone').value.trim();
    
    if (!nome || !telefone) {
        alert("Preencha os campos obrigatórios (Nome e Telefone).");
        return;
    }

    const servico = servicesData.find(s => s.id === agendamentoAtual.servicoId);

    const novoAgendamento = {
        day: agendamentoAtual.diaSemana,
        time: agendamentoAtual.horario,
        client: nome,
        professional: agendamentoAtual.profissional,
        service: servico.title,
        dataExata: agendamentoAtual.data
    };
    
    scheduleData.push(novoAgendamento);
    
    const paraSalvar = JSON.parse(localStorage.getItem('novosAgendamentos') || '[]');
    paraSalvar.push(novoAgendamento);
    localStorage.setItem('novosAgendamentos', JSON.stringify(paraSalvar));

    document.getElementById('mensagem-sucesso').innerText = 
        `Seu agendamento de ${servico.title} com ${agendamentoAtual.profissional} foi registrado para ${formatarData(agendamentoAtual.data)} às ${agendamentoAtual.horario}.`;
    
    irParaEtapa(5);
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderServicos(e.target.dataset.filter);
        });
    });
    renderServicos('Todos');

    document.getElementById('btn-proximo-1').addEventListener('click', () => {
        renderProfissionais();
        irParaEtapa(2);
    });
    
    document.getElementById('btn-proximo-2').addEventListener('click', () => {
        const hoje = new Date().toISOString().split('T')[0];
        document.getElementById('data-agendamento').min = hoje;
        irParaEtapa(3);
    });
    
    document.getElementById('btn-proximo-3').addEventListener('click', () => {
        renderConfirmacao();
        irParaEtapa(4);
    });
    
    document.querySelectorAll('.btn-voltar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            irParaEtapa(parseInt(e.target.dataset.target));
        });
    });

    document.getElementById('data-agendamento').addEventListener('change', (e) => {
        const val = e.target.value;
        if (!val) return;
        
        const dia = getDiaSemana(val);
        if (dia === 0) {
            alert("Não abrimos aos domingos. Selecione outra data.");
            e.target.value = '';
            agendamentoAtual.data = null;
            agendamentoAtual.diaSemana = null;
            agendamentoAtual.horario = null;
            renderHorarios();
            return;
        }

        agendamentoAtual.data = val;
        agendamentoAtual.diaSemana = dia;
        agendamentoAtual.horario = null;
        renderHorarios();
    });

    document.getElementById('cliente-telefone').addEventListener('input', (e) => aplicarMascaraTelefone(e.target));

    document.getElementById('btn-confirmar').addEventListener('click', confirmarAgendamento);
});
