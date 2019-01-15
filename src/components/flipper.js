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
      that.setState({playlist_view:result.pl_view, bm_list:result.pl_playlist, bm_index:result.pl_index});
    })
  }

  // needs to set state in order to re-render
  setPlaylistView = (status) => {
    chrome.storage.local.set({pl_view:status}, () => {
      this.setState({playlist_view:status});
    })
  };

  render() { 
    var contentList = this.state.playlist_view ? <BookmarkList/> : <FolderList/>;
    return (
      <div>
        <div
          style={{
            display:"flex",
            width:"300px",
          }}
        >
          <button onClick={() => this.setPlaylistView(false)}>Folder Selection</button>
          <button onClick={() => this.setPlaylistView(true)}>Playlist</button>
        </div>
        <div>
          {contentList}
        </div>
      </div>
    );
  }
}

export default Flipper;