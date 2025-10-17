console.log('mystuff inject started');

// get exId
const exId = document.querySelector('.livescratch-ext').dataset.exId;

////////// INJECT UTILS //////////

let queryList = [];
function mutationCallback() {
    let toDelete = [];
    queryList.forEach(query => {
        let elem = document.querySelector(query.query);
        if (elem && !elem.blSeen) {
            if (query.once) { toDelete.push(query); }
            else { elem.blSeen = true; }
            query.callback(elem);
        }
    });
    toDelete.forEach(query => { queryList.splice(queryList.indexOf(query), 1); });
}
let observer = new MutationObserver(mutationCallback);
observer.observe(document.documentElement, { subtree: true, childList: true });
function getObj(query) {
    let obj = document.querySelector(query);
    if (obj) { return new Promise(res => { res(obj); }); }
    return new Promise(res => {
        queryList.push({ query, callback: res, once: true });
    });
}
function listenForObj(query, callback) {
    let obj = document.querySelector(query);
    if (obj) { obj.blSeen = true; callback(obj); }
    queryList.push({ query, callback, once: false });
}




// BLM!!!!
function getBlMyStuff() {
    return new Promise((promRes) => {
        chrome.runtime.sendMessage(exId, { meta: 'myStuff' }, promRes);
    });
}

function leaveId(id, div) {
    console.log(id, blProjectDivs);
    if (id in blProjectDivs) {
        document.querySelector('#main-content > div.media-list > ul').insertBefore(blProjectDivs[id], div);
    }
    div.remove();
}

function sendLeave(scratchId, blId) {
    blMySTuff.splice(blMySTuff.findIndex(item => (item.scratchId == scratchId)), 1);
    if (blId) {
        chrome.runtime.sendMessage(exId, { meta: 'leaveLSId', blId });
    } else {
        chrome.runtime.sendMessage(exId, { meta: 'leaveScratchId', scratchId });
    }
}

function sanitize(string) {
    string = String(string);
    // if(!(_.isString(string))) {return ''}
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&#x27;',
        '/': '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return string.replace(reg, (match) => (map[match]));
}

function getbox(blId, title, scratchId, lastModified, lastModBy, projectExists, online) {
    scratchId = sanitize(scratchId);
    title = sanitize(title);
    blId = sanitize(blId);
    lastModBy = sanitize(lastModBy);

    let gunkId = Math.random().toString(36).substring(2);
    generateActiveUsersPanel(online).then(panel => document.getElementById(gunkId).innerHTML = panel);

    return `
    <div class="media-item-content not-shared">
      <div class="media-thumb">
        <a href="/projects/${scratchId}/">
          <img src="//cdn2.scratch.mit.edu/get_image/project/${scratchId}_100x80.png">
        </a>
      </div>
      <div class="media-info">
        <span class="media-info-item title"><a style="color:rgb(88, 193, 152)" href="/projects/${scratchId}/">${title}</a></span>
        <span class="media-info-item date shortDateFormat">
        
          Last modified: ${timeSince(new Date(lastModified))} ago by ${lastModBy}
          
        </span>
      <div class="seeInsideContainer">

      <a href="/projects/${scratchId}/#editor" data-control="edit" class="media-control-edit small button grey">
             
      <span>See inside</span>
      <div class="activeContainer" id=${gunkId}></div>

      </a>

        </div>

      </div>
      <div class="media-action">
              <div><a class="media-trash" style="color:rgb(88, 193, 152)" onclick="leaveId(${scratchId},this.parentElement.parentElement.parentElement.parentElement);sendLeave(${scratchId},${blId})">${projectExists ? 'Unlink' : 'Leave'}</a></div>
      </div>
    </div>`;
}


async function generateActiveUsersPanel(active) {
    if (active.length > 0) {
        active.forEach(username => getUserInfo(username).then(info => document.querySelectorAll(`.${username}`).forEach(elem => elem.style.backgroundImage = `url(${info.pic})`)));
        return `
      <div class="activeContainer">

        ${active.map(username =>
        `<div class="onlineBubble ${username}" style="background-color: white; --bubbleUsername:'${username}'"></div>`,
    )
        .join('\n')}
     
          
       

        
            
      </div>
    `;

    } else {
        return '';
    }
}

let pageCss = `

  .onlineBubble{
    height:26px;
    width:26px;
    outline:solid 3px rgb(88, 193, 152);
    border-radius:10px;
    background-size:100% auto;
    text-shadow:none;

    margin-right:8px;

  }
    .onlineBubble::after{
      background:black;
      width:100px;
      height:30px;
      padding-top:0;
      padding-bottom:0;
      translate: -25% 0;
    }

.onlineBubble:hover::after {
    opacity: 100%;
}

.onlineBubble::after {
    content: var(--bubbleUsername);
    background: rgb(88, 193, 152);
    color: white;
    padding: 0 6px;
    border-radius: 5px;
    transform: translate(0px, -23px);
    display: inline-block;
    width: fit-content;
    height: fit-content;
    opacity: 0%;
    transition: 0.2s opacity;

}


  .seeInsideContainer, .activeContainer{
    display:flex;
    flex-flow:row;
    align-items:flex-end;
    // gap:8px;
  }

   .activeContainer{
   align-items:center;
   }

   .tailText{
    color:grey
   }


  .media-control-edit{
  display:flex !important;
  flex-flow:row;
  align-items:center;
  flex-grow:0;
width:fit-content;

  }

  .media-info-item.date.shortDateFormat{
      width:200%;
  }
`;


function injectStyle() {
    const style = document.createElement('style');
    style.textContent = pageCss;
    document.head.append(style);
}
injectStyle();


// https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 0) { return 'zero seconds'; }

    var interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + ' years';
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + ' months';
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + ' days';
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + ' hours';
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + ' minutes';
    }
    return Math.floor(seconds) + ' seconds';
}

function getId(listItem) {
    return listItem.children[0].children[0].children[0].getAttribute('href').split('/')[2];
}


let oldAttrs = {};
async function convertToLivescratch(listItem, projectObj) {
    let atts = {};
    atts.color = listItem.children[0].children[1].children[0].children[0].style.color;
    listItem.children[0].children[1].children[0].children[0].style.color = 'rgb(88, 193, 152)';
    listItem.children[0].children[2].children[0].children[0].style.color = 'rgb(88, 193, 152)';

    atts.buttonText = listItem.children[0].children[2].children[0].children[0].innerText;
    listItem.children[0].children[2].children[0].children[0].innerText = 'Unlink';
    listItem.children[0].children[2].children[0].children[0].onclick = (e) => {cleanseOfLivescratchness(projectObj.scratchId, listItem); sendLeave(projectObj.scratchId, projectObj.blId); e.stopPropagation();  };
    atts.title = listItem.children[0].children[1].children[0].children[0].innerText;
    listItem.children[0].children[1].children[0].children[0].innerText = projectObj.title;

    atts.modified = listItem.children[0].children[1].children[1].innerText;
    listItem.children[0].children[1].children[1].innerText = `Last modified: ${timeSince(new Date(projectObj.lastTime))} ago by ${projectObj.lastUser}`;

    oldAttrs[projectObj.scratchId] = atts;

    let seeInside = listItem.querySelector('a span');
    let activeUsersPanel = await generateActiveUsersPanel(projectObj.online);
    seeInside.insertAdjacentHTML('afterend', activeUsersPanel);


}
function cleanseOfLivescratchness(scratchId, listItem) {
    let atts = oldAttrs[scratchId];
    if (!atts) { return; }
    listItem.children[0].children[1].children[0].children[0].style.color = atts.color;
    listItem.children[0].children[2].children[0].children[0].style.color = atts.color;
    listItem.children[0].children[2].children[0].children[0].innerText = atts.buttonText;
    // listItem.children[0].children[2].children[0].children[0].onclick = ()=>{alert('yi')}
    listItem.children[0].children[1].children[0].children[0].innerText = atts.title;
    listItem.children[0].children[1].children[1].innerText = atts.modified;
}

function addProject(projectObj, projectExists) {
    let newBox = document.createElement('li');
    newBox.innerHTML = getbox(projectObj.blId, projectObj.title, projectObj.scratchId, projectObj.lastTime, projectObj.lastUser, projectExists, projectObj.online);
    document.querySelector('ul.media-list').insertBefore(newBox, document.querySelector('ul.media-list').firstChild);
}

usersCache = {};

async function getUserInfo(username) {
    if (!username) { return; }
    if (username?.toLowerCase() in usersCache && usersCache[username?.toLowerCase()]?.pk) { return usersCache[username?.toLowerCase()]; }

    let res;
    try {
        res = await (await fetch('https://scratch.mit.edu/site-api/users/all/' + username?.toLowerCase())).json();
    } catch (e) {
        return null;
    }
    if (!res) {
        return null;
    }

    let user = res.user;
    user = getWithPic(user);
    usersCache[user.username.toLowerCase()] = user;
    return user;
}
function getWithPic(user) {
    user.pic = `https://uploads.scratch.mit.edu/get_image/user/${user.pk}_60x60.png`;
    return user;
}


////////// RUN ON START! ///////////

let blMySTuff;
let blMyStuffMap = {};
let blProjectDivs = {};
let projectLoadFailed = false;
async function onTabLoad() {
    blMySTuff = await getBlMyStuff();
    if (blMySTuff?.noauth) { projectLoadFailed = true; return false; }
    listenForObj('ul.media-list', (list) => {
        if (!document.querySelector('#tabs > li.first.active')) { return; } // return if "all projects" not selected
        blMyStuffMap = {};
        blMySTuff.forEach(projObj => { blMyStuffMap[projObj.scratchId] = projObj; });
        let toDelete = [];
        for (let child of list.children) {
            let scratchId = getId(child);
            let livescratchProject = blMyStuffMap[scratchId];
            if (livescratchProject) {
                if (Date.now() - livescratchProject.lastTime < 1000 * 60 * 60 * 2) { // if project was edited less than 2 hours ago
                    toDelete.push(child);
                    blProjectDivs[scratchId] = child;
                } else {
                    convertToLivescratch(child, livescratchProject);
                    delete blMyStuffMap[scratchId];
                }
            }
        }
        toDelete.forEach(elem => { elem.remove(); });
        let leftOver = Object.values(blMyStuffMap);
        leftOver.sort((a, b) => { b.lastTime - a.lastTime; });
        for (let projObj of leftOver) {
            console.log(projObj.scratchId);
            addProject(projObj, projObj.scratchId in blProjectDivs);
        }
    });
}


chrome.runtime.sendMessage(exId, { meta: 'getUsernamePlus' }, async (userData) => {
    if (!userData.currentBlToken) {

        let newVerified = false;
        addStartVerificationCallback(() => {
            document.querySelector('#verifying')?.remove();
            document.querySelector('#unverified')?.remove();
            document.querySelector('.box-head').insertAdjacentHTML('afterend', '<div class="blBanner" id="verifying" style="background:#ea47ff; color:white;"><img height=15 src="https://upload.wikimedia.org/wikipedia/commons/a/ad/YouTube_loading_symbol_3_%28transparent%29.gif"/> CoScratch is verifying your account ...<div>');
        });
        addEndVerificationCallback(async (success, message) => {
            document.querySelector('#verifying')?.remove();
            document.querySelector('#unverified')?.remove();
            if (success) {
                newVerified = true;
                removeHideLivescratchButton();
                document.querySelector('.box-head').insertAdjacentHTML('afterend', '<div class="blBanner" id="blSuccess" style="background:#77da77; color:white;"> ✅ You\'re verified! <div>');
                if (projectLoadFailed) { onTabLoad(); }
                removeHideLivescratchButton();
                setTimeout(() => { document.querySelector('#blSuccess').remove(); }, 1000 * 2);
            } else {
                let error = await chrome.runtime.sendMessage(exId,{meta:'getVerifyError'});
                if(error=='no cloud') {
                    document.querySelector('.box-head').insertAdjacentHTML('afterend', '<div class="blBanner" id="unverified" style="background:red; color:white;"><span id="bigx" style="display:none; padding:3px; border-radius:50%; background:lightpink; color:maroon; cursor:pointer;" onclick="document.querySelector(\'#unverified\').remove()">&nbspx&nbsp</span>⚠️ CoScratch could not verify your account because the cloud data \'set\' action failed. Scratch\'s cloud data servers might be down, causing this issue. Click \'hide verify\' below to silence this message.');
                } else {
                    document.querySelector('.box-head').insertAdjacentHTML('afterend', '<div class="blBanner" id="unverified" style="background:red; color:white;"><span id="bigx" style="display:none; padding:3px; border-radius:50%; background:lightpink; color:maroon; cursor:pointer;" onclick="document.querySelector(\'#unverified\').remove()">&nbspx&nbsp</span>⚠️ CoScratch could not verify your account. Reload the tab in a few seconds. If this issue continues, contact @Waakul<span style="text-decoration:underline; cursor:pointer; color:blue;" onclick="chrome.runtime.sendMessage(exId,{meta:\'getVerifyError\'},err=>prompt(\'This error occured during client verification. Comment it on @Waakul\',err))">See Error Msg</span>');
                }
        
            }
        });




        chrome.runtime.sendMessage(exId, { meta: 'verifying' }, (verifying) => {
            console.log('vf',verifying);
            console.log('verifying',verifying);
            if (verifying=='nocon'){
                // defaultAddHideLivescratchButton()
                let apiURL = '';
                chrome.runtime.sendMessage(exId, {meta: 'getAPI-URL'}, (response) => {
                    apiURL = response.apiURL;
                });
                document.querySelector('.box-head').insertAdjacentHTML('afterend', `<div class="blBanner" id="unverified" style="background:red; color:white;">⚠️ Cant connect to CoScratch servers at ${apiURL} <a href="https://status.uptime-monitor.io/6499c89d4bfb79bb5f20ac4d" target="_blank">Check Uptime</a> or <a onclick="(()=>{chrome.runtime.sendMessage(exId,{meta:'dontShowVerifyError',val:false}); addHideLivescratchButton(false);})()">Dont show this message again</a><div>`);
            }
            else if (verifying) {
                document.querySelector('#verifying')?.remove();
                document.querySelector('.box-head').insertAdjacentHTML('afterend', '<div class="blBanner" id="verifying" style="background:#ea47ff; color:white;"><img height=15 src="https://upload.wikimedia.org/wikipedia/commons/a/ad/YouTube_loading_symbol_3_%28transparent%29.gif"/> CoScratch is verifying your account ...<div>');
            } else {
                if (newVerified) { return; }
                document.querySelector('.box-head').insertAdjacentHTML('afterend', '<div class="blBanner" id="unverified" style="background:red; color:white;">⚠️ CoScratch could not verify your account. Reload the tab in a few seconds. If this issue continues, contact @Waakul<div>');
            }
        });


    }
});


function addStartVerificationCallback(cb) {
    chrome.runtime.sendMessage(exId, { meta: 'startVerifyCallback' }, cb);
}
function addEndVerificationCallback(cb) {
    chrome.runtime.sendMessage(exId, { meta: 'endVerifyCallback' }, cb);
}

onTabLoad();


var BLVon = false;
function addHideLivescratchButton(on) {
    window.BLVon = on;
    let innerds = on ? 'Hide Verify ^' : 'Show Verify';
    document.getElementById('hideBLButton')?.remove();
    document.querySelector('#main-content > div.action-bar.scroll > div > div').insertAdjacentHTML('afterend', `
    <span class="hideButton" id="hideBLButton" style="text-decoration:underline; cursor:pointer;
  color:lightblue" onclick="(()=>{chrome.runtime.sendMessage(exId,{meta:'dontShowVerifyError',val:${!on}}); toggleHideLivescratch()})();">${innerds}</span>`);

    document.getElementById('blBannerCSS')?.remove();
    document.head.insertAdjacentHTML('afterbegin', on ? '<style id="blBannerCSS">.blBanner{display:default}</style>' : '<style id="blBannerCSS">.blBanner{display:none}</style>');

}
function toggleHideLivescratch() {
    addHideLivescratchButton(!BLVon);
}
let actuallyShown = false;
function defaultAddHideLivescratchButton(hideButton) {
    if(!hideButton) {actuallyShown = true;}
    chrome.runtime.sendMessage(exId, { meta: 'getShowVerifyError' }, answer => {addHideLivescratchButton(answer);
        if (hideButton && !actuallyShown) { removeHideLivescratchButton(); }
    });

}
function removeHideLivescratchButton() {
    document.getElementById('hideBLButton')?.remove();
}

defaultAddHideLivescratchButton(true); // just to add styles
