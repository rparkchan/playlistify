/*global chrome*/

import React from 'react';
import FolderEntry from './folder-entry.js'

/** 
 * FolderList
 *   Contains a div of multiple FolderEntry's
 */

class FolderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      folders: [], 
    }
  }

  componentDidMount() {
    chrome.bookmarks.getTree((node_list) => {
      this.processFolders(node_list, 0);
    });
  }
  processFolders(node_list, depth) { 
    node_list.forEach((node) => {
      if(node.children) { // then it's a folder!
        this.setState((prevState) => ({
          folders: [...prevState.folders, {node:node, depth:depth}]
        }));
        this.processFolders(node.children, depth+1);
      }
    });
  }

  render() {
    return (
      <div> 
        {this.state.folders.map((folder) => {
          return (
            <FolderEntry 
              node={folder.node} 
              depth={folder.depth} 
              setPLView={this.props.setPLView}
              shuffle={this.state.shuffle}
            />
          )
        })}
      </div>
    )
  }
}

export default FolderList;