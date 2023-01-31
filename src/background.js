/*global chrome*/

// open a new window/tab at ind of a playlist with url=url
function newPlaylistInstance(musmode, ind, url) {
  chrome.tabs.create({url:url}, (tab) => {
    chrome.storage.local.set({pl_tabid:tab.id, pl_index:ind});
  });
}

// called upon new_index message
function handleNewIndex(message, sender) {
  let fetch_vars = ['pl_tabid', 'pl_playlist', 'pl_musmode'];
  chrome.storage.local.get(fetch_vars, (result) => {
    let new_url = result.pl_playlist[message.new_index].url;
    if(result.pl_tabid != null) { 
      let active_tab = sender.tab!=null && sender.tab.id==result.pl_tabid;
      if((active_tab && result.pl_musmode)) {
        chrome.tabs.update(result.pl_tabid, {url:new_url}, () => {
          chrome.storage.local.set({pl_index:message.new_index});
        });
      }
      else if(sender.tab == null) {
        chrome.tabs.get(result.pl_tabid, () => {
          if(!chrome.runtime.lastError) {
            chrome.tabs.update(result.pl_tabid, {url:new_url}, () => {
              chrome.storage.local.set({pl_index:message.new_index});
            });           
          }
          else {
            newPlaylistInstance(result.pl_musmode, message.new_index, new_url);
          }
        });
      }
    }
    else { 
      newPlaylistInstance(result.pl_musmode, message.new_index, new_url);
    }
  })
}

// listen for completed tab to begin executing content script
chrome.tabs.onUpdated.addListener((tabId,changeInfo,tab) => {
  chrome.storage.local.get(["pl_tabid"], (result) => {
    if(result.pl_tabid === tabId && changeInfo.status=="complete") {
      console.log("background: complete tab load");
      chrome.tabs.sendMessage(tabId, {update:"complete"});
    }
  })
})

// listen for index changes from content.js or components
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.new_index != null) {
    handleNewIndex(message,sender);
  }
});

// listen for tab closing
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  chrome.storage.local.get(['pl_tabid'], (result) => {
    if(result.pl_tabid == tabId) {
      chrome.storage.local.remove(['pl_tabid', 'pl_index', 'pl_windowid']);
    }
  })
});

// listen for new install/reset
chrome.runtime.onInstalled.addListener((details) => {
  chrome.storage.local.remove(['pl_tabid', 'pl_index', 'pl_windowid', 'pl_playlist', 'pl_musmode', 'pl_view'])
});