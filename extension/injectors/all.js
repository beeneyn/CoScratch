console.log("injecting badge.js");

// alert(chrome.runtime.id)
let scriptElem = document.createElement("script");
scriptElem.dataset.exId = chrome.runtime.id
scriptElem.dataset.logoUrl = chrome.runtime.getURL("/img/fancylogo.svg");
scriptElem.classList.add("blocklive-ext")
let srcThign = chrome.runtime.getURL("/scripts/badge.js");

scriptElem.src = srcThign;
// document.body.append(scriptElem)

if (!!document.head) {
  document.head.appendChild(scriptElem);
} else {
  document.documentElement.appendChild(scriptElem);
}
