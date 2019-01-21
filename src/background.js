/*global chrome*/

// called upon new_index message
function handleNewIndex(message, sender) {
  let fetch_vars = ['pl_tabid', 'pl_playlist', 'pl_musmode'];
  chrome.storage.local.get(fetch_vars, (result) => {
    let new_url = result.pl_playlist[message.new_index].url;
    if(result.pl_tabid != null) { 
      let active_tab = sender.tab!=null && sender.tab.id==result.pl_tabid;
      if((active_tab && result.pl_musmode) || sender.tab == null) {
        chrome.tabs.update(result.pl_tabid, {url:new_url}, () => {
          chrome.storage.local.set({pl_index:message.new_index});
        })
      }
    }
    else { 
      if(result.pl_musmode) {
        chrome.windows.create({url:new_url, type:"popup"}, (ic_window) => {
          chrome.storage.local.set({pl_tabid:ic_window.tabs[0].id,
                                    pl_windowid:ic_window.id,
                                    pl_index:message.new_index,});
        });     
      }
      else {
        chrome.tabs.create({url:new_url}, (tab) => {
          chrome.storage.local.set({pl_tabid:tab.id, pl_index:message.new_index});
        })
      }
    }
  })
}

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
      chrome.storage.local.remove(['pl_tabid', 'pl_index']);
    }
  })
})