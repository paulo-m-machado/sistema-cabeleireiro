// gerente.js
document.addEventListener("DOMContentLoaded", () => {
    // Inicialização de componentes do dashboard do gerente
    console.log("Dashboard do Gerente carregado.");
    
    // Animação das barras de progresso (opcional, já feito via CSS transition, mas podemos reforçar)
    const bars = document.querySelectorAll('.bar-fill');
    bars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
});
