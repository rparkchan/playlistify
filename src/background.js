/*global chrome*/

// Listener:
//    handle messages from either React components or content.js listeners

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  // message handler for index updating
  if(message.new_index != null) {
    chrome.storage.local.get(['pl_tabid', 'pl_playlist', 'pl_musmode'], function(result) {
      if(result.pl_tabid != null) { // update current tab if message comes either from playlist tab or popup.js
        if((sender.tab != null && sender.tab.id == result.pl_tabid) || sender.tab == null) {
          chrome.tabs.update(result.pl_tabid, {url:result.pl_playlist[message.new_index].url}, function() {
            chrome.storage.local.set({pl_index:message.new_index});
          })
        }
      }
      else { // create new tab if there isn't currently one
        if(result.pl_musmode) { // new window in music mode
          chrome.windows.create({url:result.pl_playlist[message.new_index].url, type:"popup"}, function(ic_window) {
            chrome.storage.local.set({pl_tabid:ic_window.tabs[0].id,
                                      pl_windowid:ic_window.id,
                                      pl_index:message.new_index,});
          });     
        }
        else { // new tab otherwise
          chrome.tabs.create({url:result.pl_playlist[message.new_index].url}, function(tab) {
            chrome.storage.local.set({pl_tabid:tab.id, pl_index:message.new_index});
          })
        }
      }
    })
  }
});

// Listener:
//    reset pl_tabid in local storage if the current playlist tab is closed

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  chrome.storage.local.get(['pl_tabid'], function (result) {
    if(result.pl_tabid == tabId) {
      chrome.storage.local.remove(['pl_tabid', 'pl_index'], function () {
      })
    }
  })
})