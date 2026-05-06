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
    { day: 6, time: '18:00', client: 'Wagner Moura', professional: 'Ana', service: 'Massagem Relaxante' },
    { day: 2, time: '09:00', client: 'Fernanda Costa', professional: 'João', service: 'Corte Feminino Completo' },
    { day: 3, time: '14:00', client: 'Pedro Alvares', professional: 'Carlos', service: 'Corte Masculino' },
    { day: 5, time: '11:00', client: 'Isabela Maia', professional: 'Ana', service: 'Limpeza de Pele' }
];

const novosAgendamentos = JSON.parse(localStorage.getItem('novosAgendamentos') || '[]');
novosAgendamentos.forEach(novo => {
    const jaExiste = scheduleData.some(a => a.client === novo.client && a.day === novo.day && a.time === novo.time);
    if (!jaExiste) scheduleData.push(novo);
});

const daysOfWeek = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const startHour = 8;
const endHour = 20;

const agendaGrid = document.getElementById('agenda-grid');
const filterSelect = document.getElementById('professional-filter');

function isMobile() {
    return window.innerWidth <= 900;
}

function renderDesktopGrid(data) {
    agendaGrid.innerHTML = '';
    
    // Top-left blank cell with Headers
    const emptyCorner = document.createElement('div');
    emptyCorner.className = 'grid-header';
    emptyCorner.innerText = 'Horário';
    agendaGrid.appendChild(emptyCorner);

    // Day headers
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'grid-header';
        dayHeader.innerText = day;
        agendaGrid.appendChild(dayHeader);
    });

    // Time rows and cells mapping
    for (let hour = startHour; hour <= endHour; hour++) {
        const timeString = `${hour.toString().padStart(2, '0')}:00`;
        
        // Time Label (Left Column)
        const timeLabel = document.createElement('div');
        timeLabel.className = 'grid-cell time-label';
        timeLabel.innerText = timeString;
        agendaGrid.appendChild(timeLabel);

        // Day cells for current hour (Mon to Sat => day1 to day6)
        for (let dayIndex = 0; dayIndex < 6; dayIndex++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';

            // Find appointments for this day and this hour
            const appointments = data.filter(apt => apt.day === (dayIndex + 1) && apt.time === timeString);
            
            appointments.forEach(apt => {
                const aptCard = document.createElement('div');
                aptCard.className = `appointment-card Appointment-${apt.professional}`;
                aptCard.innerHTML = `
                    <strong>${apt.professional}</strong>
                    <span class="time-slot">${apt.time}</span>
                    <span class="client-name">👤 ${apt.client}</span>
                    <span class="service-name">✂️ ${apt.service}</span>
                `;
                cell.appendChild(aptCard);
            });

            agendaGrid.appendChild(cell);
        }
    }
}

function renderMobileList(data) {
    agendaGrid.innerHTML = '';

    daysOfWeek.forEach((dayLabel, index) => {
        const dayNum = index + 1;
        const dayAppointments = data.filter(apt => apt.day === dayNum);
        
        if (dayAppointments.length > 0) {
            const daySection = document.createElement('div');
            daySection.className = 'day-mobile-section';
            daySection.innerText = dayLabel;
            agendaGrid.appendChild(daySection);

            // Sort by time within the day
            dayAppointments.sort((a, b) => a.time.localeCompare(b.time));

            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            
            dayAppointments.forEach(apt => {
                const aptCard = document.createElement('div');
                aptCard.className = `appointment-card Appointment-${apt.professional}`;
                aptCard.innerHTML = `
                    <strong>${apt.professional}</strong>
                    <span class="time-slot">${apt.time}</span>
                    <span class="client-name" style="margin-top:5px;">👤 ${apt.client}</span>
                    <span class="service-name">✂️ ${apt.service}</span>
                `;
                cell.appendChild(aptCard);
            });
            agendaGrid.appendChild(cell);
        }
    });

    if (agendaGrid.innerHTML === '') {
        agendaGrid.innerHTML = '<div style="text-align:center; padding: 20px; color: #fff;">Nenhum agendamento encontrado.</div>';
    }
}

function updateAgenda() {
    const selectedProfessional = filterSelect.value;
    
    let filteredData = scheduleData;
    if (selectedProfessional !== 'todos') {
        filteredData = scheduleData.filter(apt => apt.professional === selectedProfessional);
    }

    if (isMobile()) {
        renderMobileList(filteredData);
    } else {
        renderDesktopGrid(filteredData);
    }

    updateStats(filteredData);
}

function updateStats(data) {
    document.getElementById('total-badge').innerText = data.length;
    document.getElementById('stat-total').innerText = data.length;

    const diaHoje = new Date().getDay();
    const agendamentosHoje = data.filter(apt => apt.day === diaHoje).length;
    document.getElementById('stat-hoje').innerText = agendamentosHoje;

    const contagemProf = {};
    data.forEach(apt => {
        contagemProf[apt.professional] = (contagemProf[apt.professional] || 0) + 1;
    });
    let maxCount = 0;
    let profMaisAtivo = '-';
    for (const [prof, count] of Object.entries(contagemProf)) {
        if (count > maxCount) {
            maxCount = count;
            profMaisAtivo = prof;
        }
    }
    document.getElementById('stat-prof').innerText = profMaisAtivo;

    let proximoLivre = '-';
    if (diaHoje >= 1 && diaHoje <= 6) {
        for (let hour = startHour; hour <= endHour; hour++) {
            const timeString = `${hour.toString().padStart(2, '0')}:00`;
            const temAgendamento = data.some(apt => apt.day === diaHoje && apt.time === timeString);
            if (!temAgendamento) {
                proximoLivre = timeString;
                break;
            }
        }
    }
    document.getElementById('stat-livre').innerText = proximoLivre;
}

// Event Listeners
filterSelect.addEventListener('change', updateAgenda);

// Listen to window resizes to adapt layout
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateAgenda, 100);
});

// Initial Render
updateAgenda();
