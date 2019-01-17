/*global chrome*/
import React from 'react';
import {styles} from './styles.js'

//
//

function BookmarkButton(props) {
  return (
    <div style={styles.BookmarkButtonContainer(props)}>
      <div 
        style={styles.BookmarkButtonEntry(props)}
        onClick={
          function() {
            chrome.runtime.sendMessage({bookmarks_index:props.list_pos}, function(response) {
              props.editIndex(props.list_pos);
            });
          }
        }  
      > 
        {props.title}
      </div>
      <button style={styles.BookmarkButtonRemove(props)}/>
    </div>
  )
}

export default BookmarkButton;