/*global chrome*/
import React from 'react';

// destructive: traverse bookmark tree, filling bookmarks_list with bookmarks
// TODO: options for "no subfolders"
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

// 
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

function FolderButton(props) {
  return (
    <li 
      style={{
        paddingLeft:props.depth*12,
      }}
      className="FolderButton"
      key={props.node.id}
      onClick={
        function() {
          var bookmarks_list = [];
          processBookmarks(props.node, bookmarks_list);
          if(props.shuffle) 
            shuffleArray(bookmarks_list);
          if(!(bookmarks_list.length === 0)){
            chrome.runtime.sendMessage({bookmarks_list:bookmarks_list}, function(response) { 
              props.setPLView(true);
            });
          }
          else {
            alert("There are no bookmarks in this folder!");
          }
        }
      }
    > 
      {props.node.title ? props.node.title : "ROOT"} 
    </li>
  )
}

export default FolderButton;