/*global chrome*/

/******************************************************************************************************/

// Helper function:
//    run bm_list at bm_index in either valid, existing tab, OR new tab

function execValidTab(bm_list, bm_index, callback) {
  chrome.storage.local.get(["pl_tabid"], function(tab_result) {
    if(tab_result.pl_tabid) {
      chrome.tabs.get(tab_result.pl_tabid, function() { // valid?
        if(!chrome.runtime.lastError) {
          chrome.tabs.update(tab_result.pl_tabid, {url:bm_list[bm_index].url}, function () {
            postLoadExec(tab_result.pl_tabid, callback);
          });
        }
        else {
          newPlaylistTab(bm_list,bm_index, callback);     
        }
      });
    }
    else {
      newPlaylistTab(bm_list,bm_index, callback);
    }
  }); 
}

// Helper function:
//    create a new tab (optionally, new window) to begin playing bm_list at bm_index

function newPlaylistTab(bm_list, bm_index, callback) {
  // chrome.tabs.create({url:bm_list[bm_index].url, active:true}, function (tab) {
  //   chrome.windows.create({tabId: tab.id}, function(ic_window) {
  //     chrome.storage.local.set({pl_tabid:tab.id,pl_windowid:ic_window.id}, function () { 
  //       postLoadExec(tab.id, callback);
  //     });
  //   });
  // });
    chrome.windows.create({url:bm_list[bm_index].url, type:"popup"}, function(ic_window) {
      chrome.storage.local.set({pl_tabid:ic_window.tabs[0].id,pl_windowid:ic_window.id}, function () { 
        postLoadExec(ic_window.tabs[0].id, callback);
      });
    });
}

// Helper function:
//    wait until DOM content loads in dest_tabid; execute content.js

function postLoadExec(dest_tabid, callback) { 
  chrome.tabs.onUpdated.addListener(
    function execContent(tabId,changeInfo,tab) {
      if(changeInfo.status == "complete" && tabId == dest_tabid) {      
        chrome.tabs.executeScript(dest_tabid, {file:"./static/js/content.js"}, function() {
          // catch error where dest_tabid is closed while this executeScript call is running
          if(chrome.runtime.lastError) {
            console.log("Runtime error:");
            console.log(chrome.runtime.lastError);
          }
          else {
            callback({status:"exec_complete"}); // callback is a sendResponse ideally
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
    chrome.storage.local.set({pl_playlist:message.bookmarks_list, pl_index:0}, function() {
      execValidTab(message.bookmarks_list, 0, 
        (resp) => console.log(resp)
      );
    });
  }

  // message 2: modify pl_index to bookmarks_index: callers MUST ensure that bookmarks_index is valid
  if (message.bookmarks_index != null) {
    chrome.storage.local.get(["pl_index","pl_playlist"], function(result) {
      if(result.pl_playlist != null) { // need extant playlist, not necessarily index
        chrome.storage.local.set({pl_index:message.bookmarks_index}, function() {
          execValidTab(result.pl_playlist, message.bookmarks_index, 
            (resp) => console.log(resp)
          );
        });
      }
    });
  }

  // message 3: close the playlist completely
  if (message.close_playlist != null) {
    chrome.storage.local.get(["pl_tabid"], function(result) {
      if(result.pl_tabid != null) {
        chrome.tabs.remove(result.pl_tabid, function() {
          chrome.storage.local.remove(["pl_playlist", "pl_index", "pl_tabid", "pl_windowid", "pl_view"])
        })
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