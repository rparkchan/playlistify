/*global chrome*/

// TEMPORARY: while debugging
console.log("BACKGROUND ACTIVATING.");
// chrome.storage.local.clear();

/******************************************************************************************************/

// Helper function:
//    run bm_list at bm_index in either valid, existing tab, OR new tab

function execValidTab(bm_list, bm_index) {
  chrome.storage.local.get(["pl_tabid"], function(tab_result) {
    if(tab_result.pl_tabid) {
      chrome.tabs.get(tab_result.pl_tabid, function() { // valid?
        if(!chrome.runtime.lastError) {
          chrome.tabs.update(tab_result.pl_tabid, {url:bm_list[bm_index].url}, function () {
            postLoadExec(tab_result.pl_tabid);
          });
        }
        else {
          newPlaylistTab(bm_list,bm_index);     
        }
      });
    }
    else {
      newPlaylistTab(bm_list,bm_index);
    }
  }); 
}

// Helper function:
//    create a new tab (optionally, new window) to begin playing bm_list at bm_index

// question: does maximizing a minimized window pull it (noticeably) to forefront? 
// if not, could use this to keep the tab minimized!

function newPlaylistTab(bm_list, bm_index) {
  chrome.tabs.create({url:bm_list[bm_index].url, active:true}, function (tab) {
    chrome.windows.create({tabId:tab.id}, function(window) {
      chrome.storage.local.set({pl_tabid:tab.id,pl_window:window.id}, function () { 
        postLoadExec(tab.id);
      });
    });
  });
}

// Helper function:
//    wait until DOM content loads in dest_tabid; execute content.js

function postLoadExec(dest_tabid) { 
  chrome.tabs.onUpdated.addListener(
    function execContent(tabId,changeInfo,tab) {
      if(changeInfo.status == "complete" && tabId == dest_tabid) {      
        chrome.tabs.executeScript(dest_tabid, {file:"./static/js/content.js"}, function() {
          // catch error where dest_tabid is closed while this executeScript call is running
          if(chrome.runtime.lastError) {
            console.log("Runtime error:");
            console.log(chrome.runtime.lastError);
          }
          // encourage SoundCloud to play
          else { 
            setTimeout(function() {
              chrome.runtime.sendMessage({play_button:true});
            }, 2000);    
          }
        })
        chrome.tabs.onUpdated.removeListener(execContent);
      }
    }
  );
}

/******************************************************************************************************/


// Listener:
//    handle messages from either React components or content script listeners

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  // message 1: NEW playlist folder has been selected, reset index etc.
  if (message.bookmarks_list != null) { 
    sendResponse({status: "folder_received"});
    chrome.storage.local.set({pl_playlist:message.bookmarks_list, pl_index:0}, function() {
      execValidTab(message.bookmarks_list, 0);
    });
  }

  // message 2: modify pl_index to bookmarks_index: callers MUST ensure that bookmarks_index is valid
  if (message.bookmarks_index != null) {
    sendResponse({status: "bookmarks_index_received"});
    chrome.storage.local.get(["pl_index","pl_playlist"], function(result) {
      if(result.pl_playlist != null) { // need extant playlist, not necessarily index
        chrome.storage.local.set({pl_index:message.bookmarks_index}, function() {
          execValidTab(result.pl_playlist, message.bookmarks_index);
        });
      }
    });
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
