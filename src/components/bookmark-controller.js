/*global chrome*/
import React from 'react';
import {styles} from './styles.js'


// i.e. needs to flip depending on if there chrome.storage.local.playlisto_bm_list
function BookmarkController(props) {
  return (
    <div style={styles.BookmarkControllerContainer({})}>
      <div style={{display:"flex", width:"230px",}}>
        <button 
          style={{marginRight:4}}
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
          style={{marginRight:4}}
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
                if(props.bm_index+1 < props.bm_length) {
                  chrome.runtime.sendMessage({bookmarks_index:props.bm_index+1}, function(response) {
                    props.editIndex(props.bm_index+1);
                  });
                }
              }
            }
        }>
          Next
        </button>
      </div>
      <button 
        style={styles.BookmarkControllerExit({})}
        onClick = {
          function() {
            chrome.runtime.sendMessage({close_playlist:true}, function() {
              props.setPLView(false); // and more
            });
          }
        }
      >
      </button>
    </div>
    );
}

export default BookmarkController;