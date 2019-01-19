/*global chrome*/

// execValidTab
//    Run bm_list at bm_index (invariantly valid) in either valid, existing tab, OR new tab
//    and set the index in storage

function execValidTab(bm_list, bm_index) {
  chrome.storage.local.set({pl_index:bm_index}, function() {
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
  });
}

// newPlaylistTab
//    create a new tab (optionally, new window) to begin playing bm_list at bm_index

function newPlaylistTab(bm_list, bm_index) {
  chrome.windows.create({url:bm_list[bm_index].url, type:"popup"}, function(ic_window) {
    chrome.storage.local.set({pl_tabid:ic_window.tabs[0].id,pl_windowid:ic_window.id}, function () { 
      postLoadExec(ic_window.tabs[0].id);
    });
  });
}

// postLoadExec
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
        })
        chrome.tabs.onUpdated.removeListener(execContent);
      }
    }
  );
}

export {execValidTab, newPlaylistTab, postLoadExec};