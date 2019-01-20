/*global chrome*/
import React from 'react';
import {styles} from './styles.js';

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
        <img style={{marginLeft:4, marginRight:4}} src={"chrome://favicon/size/16@1x/" + props.url}/>
        <div style={{height:24, overflow:"hidden"}}>
          {props.title}
        </div>
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