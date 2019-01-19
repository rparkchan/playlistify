/*global chrome*/
import React from 'react';
import {styles} from './styles.js';
import {execValidTab} from './helpers.js';

//
//

function BookmarkButton(props) {
  return (
    <div style={styles.BookmarkButtonContainer(props)}>
      <div 
        style={styles.BookmarkButtonEntry(props)}
        onClick={
          function() {
            chrome.storage.local.get(["pl_index","pl_playlist"], function(result) {
              execValidTab(result.pl_playlist, props.list_pos);
              props.editIndex(props.list_pos);
            });
          }
        }  
      > 
        {props.title}
      </div>
      <button 
        style={styles.BookmarkButtonRemove(props)}
        onClick= {
          function() {
            
          }
        }
      />
    </div>
  )
}

export default BookmarkButton;