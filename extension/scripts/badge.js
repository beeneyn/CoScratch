

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
    // '.content a[href*="/users/"]', // in comment
    '.studio-project-username'
]

const logoUrl = document.querySelector('.blocklive-ext').dataset.logoUrl;
const exId = document.querySelector('.blocklive-ext').dataset.exId;

Array.from(document.querySelectorAll(selectors)).forEach(nameElem => {

    chrome.runtime.sendMessage(exId, { meta: "userExists", username:nameElem.innerText }, function (response) {
        if(!response) return;

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
})