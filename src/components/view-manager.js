/*global chrome*/

import React from 'react';
import FolderList from './folder-list.js';
import BookmarkList from './bookmark-list.js';

/** 
 * ViewManager:
 *   Manages whether popup is in playlist or folder view.
 */

class ViewManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist_view: false
    };
  }

  componentDidMount() {
    chrome.storage.local.get(['pl_view'], (result) => {
      this.setState({playlist_view:result.pl_view});
    })
  }

  setPLView = (view) => {
    chrome.storage.local.set({pl_view:view}, () => {
      this.setState({playlist_view:view});
    })
  };

  render() { 
    var contentList = this.state.playlist_view 
      ? <BookmarkList setPLView = {this.setPLView}/> 
      : <FolderList setPLView = {this.setPLView}/>;
    return (
      <div>
        {contentList}
      </div>
    );
  }
}

export default ViewManager;