/*global chrome*/
import React from 'react';
import BookmarkButton from './bookmark-button';
import BookmarkController from './bookmark-controller';

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
    // load data from storage and change root div height
    chrome.storage.local.get(["pl_playlist", "pl_index", "pl_tab", "pl_dumbo"], function(result) {
      that.setState({bm_list:result.pl_playlist, bm_index:result.pl_index, bm_tab:result.pl_tab});
      if(result.pl_playlist != null) {
        document.getElementById('root').style.height = 24+28*Math.min(result.pl_playlist.length, 16) + "px";
        document.getElementById("button_container").scrollTop = 1+(28*result.pl_index);
      }
    });
    // listener for content.js autoplay, only applicable when popup open AND content.js autoplays
    chrome.runtime.onMessage.addListener(function(message, sender, response) {
      if(message.bookmarks_index != null) {
        that.editIndex(message.bookmarks_index);
      }
    });
  }

  // needs to be an arrow function to retain "this"
  editIndex = (i) => {
    this.setState({bm_index:i});
    document.getElementById("button_container").scrollTop = 1+(28*i);
  }

  // this is very slow because it's redoing the map every time I think
  render() {
    var that = this;
    if(that.state.bm_list != null) {
      return (
        <div>
          <div style={{position:"fixed",top:8,left:8,height:24,width:300}}>
            <BookmarkController 
              bm_index={that.state.bm_index}
              bm_length={that.state.bm_list.length}
              editIndex={that.editIndex}
              setPLView={that.props.setPLView}
            />
          </div>
          <div 
            id="button_container" 
            style= {{
              position:"fixed",
              top:32,
              height:2+(28*Math.min(that.state.bm_list.length, 16)) + "px",
              width:300,
              overflow:"auto"
            }}> 
            {
              that.state.bm_list.map(function(bookmark,index) {
                return (
                  <BookmarkButton 
                    title={bookmark.title} 
                    url={bookmark.url}
                    list_pos={index} 
                    editIndex={that.editIndex}
                    current={(that.state.bm_index === index) ? true : false}
                  />
                );
              })
            } 
          </div>
        </div>
      );
    }
    else { // i.e. while local storage hasn't yet called setState()
      return <div/>;
    }
  }
}

export default BookmarkList;