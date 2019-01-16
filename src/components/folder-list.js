/*global chrome*/
import React from 'react';
import FolderButton from './folder-button.js'
import FolderIcon from '../images/folder.png'


class FolderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      folders: [], 
      shuffle: false,
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
        <div>
          <input 
            type="checkbox"
            id="shuffle"
            onChange={function() {
              that.setState({shuffle:!that.state.shuffle});
            }}
          >
          </input>
          <label for="shuffle"> Shuffle </label>
        </div>
        <div 
          style={{
            listStyleImage:"url(" + FolderIcon + ")"
          }}
        > 
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
      </div>
    )
  }
}

export default FolderList;