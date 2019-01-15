/*global chrome*/
import React from 'react';
import BookmarkButton from './bookmark-button';
import BookmarkController from './bookmark-controller';
import { DH_UNABLE_TO_CHECK_GENERATOR } from 'constants';

// i.e. needs to flip depending on if there chrome.storage.local.playlisto_bm_list
class BookmarkList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bm_list: null,
      bm_index: null,
      bm_tab: null,
    };
  }

  componentDidMount() {
    var that = this;
    chrome.storage.local.get(["pl_playlist", "pl_index", "pl_tab"], function(result) {
      that.setState({bm_list:result.pl_playlist, bm_index:result.pl_index, bm_tab:result.pl_tab});
    });
    // listener for content.js autoplay, ONLY useful when popup open and content.js triggers
    chrome.runtime.onMessage.addListener(function(message, sender, response) {
      if(message.bookmarks_index != null) {
        that.editIndex(message.bookmarks_index);
      }
    });
  }

  // needs to be an arrow function to retain "this"
  editIndex = (i) => {
    this.setState({bm_index:i});
  }


  render() {
    var that = this;
    if(that.state.bm_list != null) {
      return (
        <div>
          <BookmarkController 
            editIndex={that.editIndex}
            bm_index={that.state.bm_index}
            bm_list={that.state.bm_list}
            setPLView={that.props.setPLView}
          />
          <div> {
            that.state.bm_list.map(function(bookmark,index) {
              return <BookmarkButton 
                title={bookmark.title} 
                url={bookmark.url}
                list_pos={index} 
                editIndex={that.editIndex}
                current={(that.state.bm_index === index) ? true : false}/>
            })
          } </div>
        </div>
      );
    }
    else {
      return <div/>;
    }
  }
}

export default BookmarkList;