/*global chrome*/
import React from 'react';
import {styles} from './styles.js';

function BookmarkController(props) {
  return (
    <div style={styles.BookmarkControllerContainer({})}>
      <div style={{display:"flex", width:"254px", justifyContent:"space-between"}}>
        <button 
          onClick = {
            function() {
              if(props.bm_index != null) {
                if(props.bm_index-1 >= 0) {
                  chrome.runtime.sendMessage({bookmarks_index:props.bm_index-1}, function(response) {
                    props.editIndex(props.bm_index-1);
                  });
                }
              }
            }
        }>
          Prev
        </button>

        <button
          onClick = {
            function() {
              chrome.storage.local.get(["pl_tabid"], function(result){
                if(result.pl_tabid != null) {
                  chrome.tabs.sendMessage(result.pl_tabid,{play_button:true})
                }
              });
            }
          }
        >
          Play/Pause
        </button>

        <button 
          onClick = {
            function() {
              if(props.bm_index != null) {
                if(props.bm_index+1 < props.bm_list.length) {
                  chrome.runtime.sendMessage({bookmarks_index:props.bm_index+1}, function(response) {
                    props.editIndex(props.bm_index+1);
                  });
                }
              }
            }
        }>
          Next
        </button>

        <button
          onClick = {
            function() {
              chrome.storage.local.remove(["pl_playlist", "pl_index"], function() {
                props.setPLView(false);
              })
            }
          }
        >
          New
        </button>

        <button 
          onClick = {
            function() {
              chrome.storage.local.get(["pl_tabid"], function(result) {
                if(result.pl_tabid != null) {
                  chrome.tabs.remove(result.pl_tabid, function() {
                    chrome.storage.local.remove(["pl_tabid", "pl_windowid", "pl_index"]);
                    props.editIndex(null);
                  })
                }
              })
            }
          }
        >
          Close
        </button>
      </div>
    </div>
    );
}

export default BookmarkController;