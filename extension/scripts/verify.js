function askVerify() {
  chrome.runtime.sendMessage({ meta: 'verify?' }, async (response) => {
    let ok = await commentTempCode(response.code, response.project)
    chrome.runtime.sendMessage({ meta: 'commented', ok })
  })
}
askVerify()

async function setCloudVar(value, AUTH_PROJECTID) {
  const user = await chrome.runtime.sendMessage({ meta: 'getUsername' });

  const connection = new WebSocket("wss://clouddata.scratch.mit.edu");
  connection.onerror = function (error) {
    console.error('WebSocket error:', error);
    connection.close();
    return false;
  };
  connection.onopen = async () => {
    connection.send(
      JSON.stringify({ method: "handshake", project_id: AUTH_PROJECTID, user }) + "\n");
    await new Promise((r) => setTimeout(r, 100));
    connection.send(
      JSON.stringify({
        value: value.toString(),
        name: "☁ verify",
        method: "set",
        project_id: AUTH_PROJECTID,
        user,
      }) + "\n"
    );
    connection.close();
    return true;
  };
}

async function commentTempCode(code, projectInfo) {
  let response = await setCloudVar(code, projectInfo);
  return response;
}


// observe login

const targetNode = document.querySelector(".registrationLink")?.parentNode?.parentNode;

if (targetNode) { // only add the listener on the logged out page
  // Options for the observer (which mutations to observe)
  const config = { attributes: true, childList: true, subtree: true };

  // Callback function to execute when mutations are observed
  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.addedNodes?.[0]?.classList.contains('account-nav')) {
        console.log('bl login detected')
        askVerify()
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
}