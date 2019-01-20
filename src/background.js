/*global chrome*/

var i = 0;
var curr_index = null;

/******************************************************************************************************/

// Helper function:
//    run bm_list at bm_index in either valid, existing tab, OR new tab

function execValidTab(bm_list, bm_index, into) {
  chrome.storage.local.get(["pl_tabid"], function(tab_result) {
    if(tab_result.pl_tabid) {
      chrome.tabs.get(tab_result.pl_tabid, function() { // valid?
        if(!chrome.runtime.lastError) {
          chrome.tabs.update(tab_result.pl_tabid, {url:bm_list[bm_index].url}, function () {
            console.log("exec1");
            postLoadExec(tab_result.pl_tabid, into);
          });
        }
        else {
          console.log("exec2");
          newPlaylistTab(bm_list,bm_index, into);     
        }
      });
    }
    else {
      console.log("exec4");
      newPlaylistTab(bm_list,bm_index, into);
    }
  }); 
}

// Helper function:
//    create a new tab (optionally, new window) to begin playing bm_list at bm_index

function newPlaylistTab(bm_list, bm_index, into) {
  chrome.windows.create({url:bm_list[bm_index].url, type:"popup"}, function(ic_window) {
    chrome.storage.local.set({pl_tabid:ic_window.tabs[0].id,pl_windowid:ic_window.id}, function () { 
      postLoadExec(ic_window.tabs[0].id, into);
    });
  });
}

// Helper function:
//    wait until DOM content loads in dest_tabid; execute content.js

function postLoadExec(dest_tabid,into) { 
  var completed = false; // race condition
  chrome.tabs.onUpdated.addListener(
    function execContent(tabId,changeInfo,tab) {
      if(changeInfo.status == "complete" && tabId == dest_tabid && !completed) {  
        chrome.tabs.onUpdated.removeListener(execContent);
        // console.log(into);
        completed=true; 
        chrome.tabs.executeScript(dest_tabid, {file:"./static/js/content.js",allFrames:false}, function() {
          // catch error where dest_tabid is closed while this executeScript call is running
          if(chrome.runtime.lastError) {
            console.log("Runtime error:");
            console.log(chrome.runtime.lastError);
          }
        })
      }
    }
  );
  // console.log("trying to exec");
  // setTimeout(function() {
  //   chrome.tabs.executeScript(dest_tabid, {file:"./static/js/content.js",runAt:"document_idle"}, function() {
  //     if(!chrome.runtime.lastError) {
  //       console.log("successful exec");
  //     }
  //   })
  // }, 2000)
}

/******************************************************************************************************/


// Listener:
//    handle messages from either React components or content script listeners

// HUGE race condition: if i.e. user hits next button many times in succession,
// all of the messages send at once which means this listener is triggered a bunch of times,
// so content script is sent a bunch
// Basically the fix to this (and other problems) is make sure that this listener is only being triggered
// one time

// also just generally it seems like this message is being called many times... because there are many content scripts
// and this makes it worse?

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log(sender);
  if(message.bookmarks_index != null) {
    console.log("received: the following index: " + message.bookmarks_index + "currently have " + curr_index);
    if(message.bookmarks_index != curr_index) { // make sure we only go once
      curr_index = message.bookmarks_index;
      console.log("actioning: set curr_index to " + curr_index)
      chrome.storage.local.get(["pl_index","pl_playlist"], function(result) {
        if(result.pl_playlist != null) { // need extant playlist, not necessarily index
          chrome.storage.local.set({pl_index:message.bookmarks_index}, function() {
            execValidTab(result.pl_playlist, message.bookmarks_index, i);
            i+=1;
          });
        }
      });
    }
    else {
      console.log("but not actioning")
    }
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