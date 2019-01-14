/*global chrome*/
import React from 'react';
import BookmarkButton from './bookmark-button';

// i.e. needs to flip depending on if there chrome.storage.local.playlisto_bm_list
class BookmarkList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bm_list: null,
      bm_index: null,
    };
  }

  componentDidMount() {
    var that = this;
    chrome.storage.local.get(["pl_playlist", "pl_index"], function(result) {
      that.setState({bm_list:result.pl_playlist, bm_index:result.pl_index});
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

  playButtonMessage() {
    chrome.storage.local.get(["pl_tabid"], function(result){
      if(result.pl_tabid != null) {
        chrome.tabs.sendMessage(result.pl_tabid,{play_button:true}, function(response) {
          console.log("play clicked!");
        });
      }
    });    
  }

  render() {
    var that = this;
    if(that.state.bm_list != null) {
      return (
        <div>
          <div>
            <button 
              onClick = {
                function() {
                  if(that.state.bm_index != null) {
                    if(that.state.bm_index+1 < that.state.bm_list.length) {
                      chrome.runtime.sendMessage({bookmarks_index:that.state.bm_index+1}, function(response) {
                        that.editIndex(that.state.bm_index+1);
                      });
                    }
                  }
                }
            }>
              NEXT
            </button>
            <button
              onClick = {
                () => {
                  this.playButtonMessage();
                }
              }
            >
              PLAY
            </button>
          </div>
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