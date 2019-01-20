/*global chrome*/
import React from 'react';
import FolderButton from './folder-button.js'
import {styles} from './styles.js'


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
    var that = this;
    return (
      <div> 
        {this.state.folders.map(function(folder) {
          return (
            <FolderButton 
              node={folder.node} 
              depth={folder.depth} 
              setPLView={that.props.setPLView}
              shuffle={that.state.shuffle}
            />
          )
        })}
      </div>
    )
  }
}

export default FolderList;