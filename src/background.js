/*global chrome*/

// Listener:
//    handle messages from either React components or content.js listeners

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if(message.bookmarks_index != null) {
    chrome.storage.local.get(['pl_tabid', 'pl_playlist', 'pl_mode'], function(result) {
      // update current tab if it exists AND message comes either from playlist tab or popup.js
      if(result.pl_tabid != null) {
        if((sender.tab != null && sender.tab.id == result.pl_tabid) || sender.tab == null) {
          chrome.tabs.update(result.pl_tabid, {url:result.pl_playlist[message.bookmarks_index].url}, function() {
            chrome.storage.local.set({pl_index:message.bookmarks_index});
          })
        }
      }
      // create new tab if there isn't currently one
      else {
        chrome.windows.create({url:result.pl_playlist[message.bookmarks_index].url, type:"popup"}, function(ic_window) {
          chrome.storage.local.set({pl_tabid:ic_window.tabs[0].id,
                                    pl_windowid:ic_window.id,
                                    pl_index:message.bookmarks_index,}, function () { 
          });
        });     
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