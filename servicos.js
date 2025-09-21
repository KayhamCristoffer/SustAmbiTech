
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.grid-item[data-modal-target]');
    const modalOverlay = document.getElementById('serviceModalOverlay');
    const modalCloseButton = document.getElementById('modalCloseButton');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    // Conteúdo detalhado para cada modal
    const modalContentData = {
        
    };

    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const modalTargetId = card.getAttribute('data-modal-target');
            const content = modalContentData[modalTargetId];

            if (content) {
                modalTitle.textContent = content.title;
                modalBody.innerHTML = content.body;
                modalOverlay.classList.add('active');
            }
        });
    });

    modalCloseButton.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });


    document.addEventListener("DOMContentLoaded", () => {
        const accordions = document.querySelectorAll(".accordion");

        accordions.forEach(acc => {
            const header = acc.querySelector(".accordion-header");
            header.addEventListener("click", () => {
                // Se quiser permitir múltiplos abertos, basta remover o loop abaixo
                accordions.forEach(a => {
                    if (a !== acc) a.classList.remove("active");
                });

                acc.classList.toggle("active");
            });
        });
    });

});
