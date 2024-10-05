

// document.querySelectorAll('a[href*=/users/]').forEach(a=>{
//     let image = document.createElement('img');
//     image.src = create
//     a.after()
// })


let selectors = [
    '.header-text>h2',
    'a.username[href*="/users/"]',
    '.title>a[href*="/users/"]',
    '.thumbnail-creator>a[href*="/users/"]',
    '#favorites .owner>a[href*="/users/"]',
    '.name>a[href*="/users/"]',
    '.activity-ul a[href*="/users/"]',
    // '.content a[href*="/users/"]', // in comment
    '.studio-project-username'
]

const logoUrl = document.querySelector('.blocklive-ext').dataset.logoUrl;
const exId = document.querySelector('.blocklive-ext').dataset.exId;

async function displayBLUsers(element) {
    Array.from(element.querySelectorAll(selectors)).forEach(nameElem => {
        if (nameElem.seen) return;
        nameElem.seen = true;
        console.log(nameElem.innerText)

        chrome.runtime.sendMessage(exId, { meta: "hideBadges?", username: nameElem.innerText }, function (response) {
            if (!response.hideBadges) {

                chrome.runtime.sendMessage(exId, { meta: "userExists", username: nameElem.innerText }, function (response) {
                    if (!response) return;

                    let textSize = window.getComputedStyle(nameElem, null).getPropertyValue('font-size');
                    textSize = parseFloat(textSize.replace('px', ''))

                    let img = document.createElement('img');
                    img.src = logoUrl;
                    let height = Math.max(16, textSize * 1.2);
                    img.style.height = `${height}px`;
                    img.style.marginTop = -height / 2 + 'px'
                    img.style.marginBottom = -height / 2 + 'px'
                    img.style.width = 'fit-content'
                    img.style.border = 'none'
                    img.style.outline = 'none'
                    img.style.padding = 'none'
                    img.style.margin = 'none'
                    img.style.display = 'flex'
                    img.style.filter = 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))'
                    img.classList.add('blbadge')
                    // img.style.filter = 'drop-shadow(0 4px 2px rgba(0,0,0,0.5))'
                    img.setAttribute('title', 'This user uses blocklive')

                    console.log(nameElem)


                    let container = document.createElement('span');
                    nameElem.replaceWith(container)

                    container.appendChild(nameElem);
                    container.appendChild(img)
                    container.style.display = 'inline flex'
                    container.style.flexFlow = 'row nowrap'
                    container.style.gap = '3px'
                    container.style.alignItems = 'center'
                    container.style.justifyContent = 'center'
                    container.style.alignSelf = 'flex-start'
                    container.style.maxWidth = '100%'

                    nameElem.style.textOverflow = 'unset'

                    // let fullThing = container.parentElement;
                    // fullThing.style.display = 'flex';
                    // fullThing.style.gap = '3px';
                    // container.style.alignItems = 'center'

                    // nameElem.after(img)

                    // name.after(img)
                })
            }
        })
    })
}
displayBLUsers(document)







/// mutation obersver

// Select the node that will be observed for mutations
const targetNode = document.body;

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
// const callback = (mutationList, observer) => {
//   for (const mutation of mutationList) {
//     if (mutation.type === "childList") {
//       console.log("A child node has been added or removed.");
//     } else if (mutation.type === "attributes") {
//       console.log(`The ${mutation.attributeName} attribute was modified.`);
//     }
//   }
// };

// Create an observer instance linked to the callback function
const observer = new MutationObserver((a, b,) => { a.forEach(e => displayBLUsers(e.target)) });

// Start observing the target node for configured mutations
observer.observe(targetNode, config);
