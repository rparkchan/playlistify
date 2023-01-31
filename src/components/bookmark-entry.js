/*global chrome*/

import React from 'react';
import {styles} from './styles.js';

/** 
 * BookmarkEntry:
 *   An entry in a BookmarkList: contains a clickable image/title to change index 
 *   and a button to remove the element from the list.
 */

// see https://stackoverflow.com/a/75035074
const favicon = (pageUrl, size) => {
  const url = new URL(`chrome-extension://${chrome.runtime.id}/_favicon/`);
  url.searchParams.append("pageUrl", pageUrl);
  url.searchParams.append("size", size.toString());

  return url.href;
};

function BookmarkEntry(props) {
  return (
    <div style={styles.bm_entry.outer_div({})}>
      <div 
        style={styles.bm_entry.click_div(props)}
        onClick={() => {
          chrome.runtime.sendMessage({new_index:props.list_pos}, (response) => {
            props.editIndex(props.list_pos);
          });
        }}  
      > 
        {/* <img style={styles.bm_entry.click_image({})} src={"chrome://favicon/size/16@1x/"+props.url}/> */}
        <img style={styles.bm_entry.click_image({})} src={favicon(props.url, 16)} loading={'lazy'}/>
        <div style={styles.bm_entry.click_title({})}>
          {props.title}
        </div>
      </div>
      <button 
        style={styles.bm_entry.icon_button({icon:"XGray"})}
        onClick= {() => {
          props.removeElement(props.list_pos);
        }}
      />
    </div>
  )
}

export default BookmarkEntry;