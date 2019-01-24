/*global chrome*/

import React from 'react';
import {styles} from './styles.js';

/** 
 * BookmarkEntry:
 *   An entry in a BookmarkList: contains a clickable image/title to change index 
 *   and a button to remove the element from the list.
 */

function BookmarkEntry(props) {
  return (
    <div style={styles.BookmarkEntryContainer({})}>
      <div 
        style={styles.BookmarkEntryButton(props)}
        onClick={() => {
          chrome.runtime.sendMessage({new_index:props.list_pos}, (response) => {
            props.editIndex(props.list_pos);
          });
        }}  
      > 
        <img style={{marginLeft:4,width:16}} src={"chrome://favicon/size/16@1x/"+props.url}/>
        <div style={styles.BookmarkEntryTitle({})}>
          {props.title}
        </div>
      </div>
      <button 
        style={styles.SixteenButton({icon:"XGray"})}
        onClick= {() => {
          props.removeElement(props.list_pos);
        }}
      />
    </div>
  )
}

export default BookmarkEntry;