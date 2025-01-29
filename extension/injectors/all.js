console.log('injecting badge.js');

// alert(chrome.runtime.id)
let scriptElemBadges = document.createElement('script');
scriptElemBadges.dataset.exId = chrome.runtime.id;
scriptElemBadges.dataset.logoUrl = chrome.runtime.getURL('/img/LogoLiveScratch.svg');
scriptElemBadges.classList.add('livescratch-ext-2');
let srcThignBadges = chrome.runtime.getURL('/scripts/badge.js');

scriptElemBadges.src = srcThignBadges;
// document.body.append(scriptElem)

if (!!document.head) {
    document.head.appendChild(scriptElemBadges);
} else {
    document.documentElement.appendChild(scriptElemBadges);
}

let scriptElemModal = document.createElement('script');
scriptElemModal.dataset.exId = chrome.runtime.id;
scriptElemModal.dataset.logoUrl = chrome.runtime.getURL('/img/LogoLiveScratch.svg');
scriptElemModal.classList.add('livescratch-ext-2');
let srcThignModal = chrome.runtime.getURL('/UI_modal/index.js');

scriptElemModal.src = srcThignModal;
// document.body.append(scriptElem)

if (!!document.head) {
    document.head.appendChild(scriptElemModal);
} else {
    document.documentElement.appendChild(scriptElemModal);
}