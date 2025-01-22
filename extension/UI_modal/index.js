class livescratchModal {
    constructor(content) {
        this.content = content;

        let nunitoLink = document.createElement('link');
        nunitoLink.rel="stylesheet";
        nunitoLink.href="https://fonts.googleapis.com/css2?family=Nunito:wght@200..1000&display=swap";
        document.head.appendChild(nunitoLink);

        this.popup();
    }

    popup() {
        let modalOverlay = document.createElement("span");
        modalOverlay.id = 'ls-modal-container';

        const logoUrl = document.querySelector('.livescratch-ext-2').dataset.logoUrl;

        modalOverlay.innerHTML = `
        <div id="ls-modal">
            <div id="ls-modal-header">
                <img id="ls-modal-header-logo" src="${logoUrl}"/>
                <span>LiveScratch</span>
            </div>
            <div id="ls-modal-content">
                ${this.content}
            </div>
        </div>
        `

        modalOverlay.onclick = (event) => {
            const modal = modalOverlay.querySelector("#ls-modal");

            if (event.target === modal || modal.contains(event.target)) {
                return;
            }

            this.close();
        }

        document.body.appendChild(modalOverlay);

        modalOverlay.offsetHeight; 

        modalOverlay.style.opacity = '1';
    }

    close() {
        const modalOverlay = document.querySelector("#ls-modal-container");
        if (modalOverlay) {
            modalOverlay.style.opacity = '0'; // Fade out
            modalOverlay.addEventListener('transitionend', () => {
                modalOverlay.remove(); // Remove after transition ends
            });
        }
    }
}
//new livescratchModal("hi");