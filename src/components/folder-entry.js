/*global chrome*/

import React from 'react';
import {styles} from './styles.js'
import Folder from '../images/opened_folder.png'

/** 
 * FolderEntry:
 *   An entry in a FolderList: when title clicked, sets the ViewManager state 
 *   and loads a new (non-empty) playlist into storage
 */

function FolderEntry(props) {
  return (
    <div style={styles.fldr_entry.outer_div({})}>
      <img style={styles.fldr_entry.icon(props)} src={Folder}/>
      <div 
        className={"FolderEntryTitle"}
        style={styles.fldr_entry.title({})}
        onClick={() => {
          var bookmarks_list = [];
          processBookmarks(props.node, bookmarks_list);
          indexList(bookmarks_list);
          console.log(bookmarks_list);
          if(!(bookmarks_list.length === 0)) {
            chrome.storage.local.set({pl_playlist:bookmarks_list}, () => {
              props.setPLView(true);
            })
          }
          else {
            alert("There are no bookmarks in this folder!");
          }
        }}
      > 
        {props.node.title ? props.node.title : "Root!"} 
      </div>
    </div>
  )
}

// destructive: traverse bookmark tree, filling bookmarks_list with bookmarks
const processBookmarks = (node_list, bookmarks_list) => { 
  node_list.children.forEach((node) => {
    if(!node.children) { 
      bookmarks_list.push({url:node.url, title:node.title});
    }
    else {
      processBookmarks(node, bookmarks_list);
    }
  });
}

// add a list_pos property to bookmarks_list entries: important for search
const indexList = (bookmarks_list) => {
  for(let i=0; i<bookmarks_list.length; i++) {
    bookmarks_list[i].list_pos = i;
  }
}

export default FolderEntry;