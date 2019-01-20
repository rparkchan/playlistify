/*global chrome*/
import React from 'react';
import {styles} from './styles.js';
import XBlack from '../images/x_black.png';

function BookmarkController(props) {
  return (
    <div style={styles.BookmarkControllerContainer({})}>
      <button 
        style={{marginRight:4,}}
        onClick = {
          function() {
            chrome.storage.local.remove(["pl_playlist", "pl_index"], function() {
              props.setPLView(false);
            })
          }
        }
      >
        &#x021AB; Back
      </button>

      <button
        style = {{
          marginRight:4,
        }}
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
        style = {{
          marginRight:4,
        }}
        onClick = {
          function() {
            props.shufflePlaylist();
          }
        }
      >
        Shuffle
      </button>

      <button
        style = {{
          marginRight:4,
        }}
        onClick = {
          function() {
            
          }
        }
      >
        Tab?
      </button>

      <button 
        style={{
          background:"url(" + XBlack + ") no-repeat",
          backgroundPosition:"center center",
          border:"none",
          height:16,
          width:16,
        }}
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
      </button>
    </div>
    );
}

export default BookmarkController;