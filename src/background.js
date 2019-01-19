/*global chrome*/

// Listener:
//    remove pl_tabid in local storage if the current playlist tab is closed

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  chrome.storage.local.get(['pl_tabid'], function (result) {
    if(result.pl_tabid == tabId) {
      chrome.storage.local.remove(['pl_tabid', 'pl_windowid', 'pl_index']);
    }
  })
})