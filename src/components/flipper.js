/*global chrome*/
import React from 'react';
import FolderList from './folder-list.js';
import BookmarkList from './bookmark-list.js';

class Flipper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist_view: false
    };
  }

  componentDidMount() {
    var that = this;
    chrome.storage.local.get(['pl_view', 'pl_playlist', 'pl_index'], function(result) {
      that.setState({playlist_view:result.pl_view});
    })
  }

  // needs to set state in order to re-render
  setPLView = (playlist_view) => {
    chrome.storage.local.set({pl_view:playlist_view}, () => {
      this.setState({playlist_view:playlist_view});
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

export default Flipper;