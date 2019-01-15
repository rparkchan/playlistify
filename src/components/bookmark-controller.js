/*global chrome*/
import React from 'react';

// i.e. needs to flip depending on if there chrome.storage.local.playlisto_bm_list
class BookmarkController extends React.Component {
  render() {
    var that = this;
    return (
      <div>
        <button 
          onClick = {
            function() {
              if(that.props.bm_index != null) {
                if(that.props.bm_index-1 >= 0) {
                  chrome.runtime.sendMessage({bookmarks_index:that.props.bm_index-1}, function(response) {
                    that.props.editIndex(that.props.bm_index-1);
                  });
                }
              }
            }
        }>
          Prev
        </button>
        <button
          onClick = {
            function() {
              chrome.storage.local.get(["pl_tabid"], function(result){
                if(result.pl_tabid != null) {
                  chrome.tabs.sendMessage(result.pl_tabid,{play_button:true})
                }
              });    
            }
          }
        >
          Play
        </button>
        <button 
          onClick = {
            function() {
              if(that.props.bm_index != null) {
                if(that.props.bm_index+1 < that.props.bm_list.length) {
                  chrome.runtime.sendMessage({bookmarks_index:that.props.bm_index+1}, function(response) {
                    that.props.editIndex(that.props.bm_index+1);
                  });
                }
              }
            }
        }>
          Next
        </button>
        <button
          onClick = {
            function() {
              chrome.runtime.sendMessage({close_playlist:true}, function() {
                that.props.setPLView(false); // and more
              });
            }
          }
        >
          Close
        </button>
      </div>
      );
  }
}

export default BookmarkController;