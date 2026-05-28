// estoque.js - Estoque Inteligente Premium

document.addEventListener('DOMContentLoaded', () => {
    console.log("Estoque Inteligente inicializado com sucesso.");

    // Elementos do Modal
    const modalOverlay = document.getElementById('productModal');
    const btnAddProduct = document.querySelector('.add-product-btn');
    const btnCloseModal = document.getElementById('closeProductModal');
    const btnCancel = document.getElementById('cancelProductBtn');
    const productForm = document.getElementById('productForm');

    // Funções para abrir/fechar modal com animação suave
    const openModal = () => {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Evita scroll do body
    };

    const closeModal = () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restaura scroll
        if (productForm) {
            setTimeout(() => productForm.reset(), 300); // Reseta após a animação de saída
        }
    };

    // Event Listeners para botões principais
    if (btnAddProduct) {
        btnAddProduct.addEventListener('click', openModal);
    }

    if (btnCloseModal) {
        btnCloseModal.addEventListener('click', closeModal);
    }

    if (btnCancel) {
        btnCancel.addEventListener('click', closeModal);
    }

    // Fechar ao clicar fora do conteúdo do modal (no overlay com blur)
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // Submit do formulário de produto
    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log("Novo produto premium salvo!");
            
            // Simulação de Loading e Feedback visual
            const submitBtn = productForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = "Salvando...";
            submitBtn.style.opacity = "0.7";
            submitBtn.style.cursor = "wait";

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.opacity = "1";
                submitBtn.style.cursor = "pointer";
                closeModal();
                alert("Produto salvo com sucesso no Estoque Inteligente.");
            }, 800);
        });
    }
    
    // Simulação de botões de Ação na listagem Híbrida
    const editBtns = document.querySelectorAll('.edit-btn');
    editBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Reaproveita o modal para edição
            const modalTitle = document.querySelector('.modal-title');
            if(modalTitle) modalTitle.textContent = "Editar Produto";
            openModal();
            
            // Reseta título ao fechar
            setTimeout(() => {
                if(modalTitle) modalTitle.textContent = "Detalhes do Produto";
            }, 500);
        });
    });

    const deleteBtns = document.querySelectorAll('.delete-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const row = e.target.closest('.hybrid-item');
            if(confirm("Tem certeza que deseja remover este produto do estoque?")) {
                row.style.opacity = '0';
                row.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    row.remove();
                }, 300);
            }
        });
    });
});
