/*global chrome*/

import React from 'react';
import {styles} from './styles.js'
import Folder from '../images/opened_folder.png'

/** 
 * FolderButton:
 *   A button in a FolderList: when clicked, sets the ViewManager state and
 *   loads a new (non-empty) playlist into storage
 */

function FolderButton(props) {
  return (
    <div style={styles.FolderButtonContainer({})}>
      <img style={styles.FolderButtonIcon(props)} src={Folder}/>
      <div 
        style={styles.FolderButtonTitle({})}
        onClick={() => {
          var bookmarks_list = [];
          processBookmarks(props.node, bookmarks_list);
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
function processBookmarks(node_list, bookmarks_list) { 
  node_list.children.forEach((node) => {
    if(!node.children) { 
      bookmarks_list.push({url:node.url, title:node.title});
    }
    else {
      processBookmarks(node, bookmarks_list);
    }
  });
}

export default FolderButton;