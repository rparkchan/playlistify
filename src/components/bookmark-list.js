/*global chrome*/
import React from 'react';
import BookmarkButton from './bookmark-button';
import BookmarkController from './bookmark-controller';
import {styles} from './styles.js'


// i.e. needs to flip depending on if there chrome.storage.local.playlisto_bm_list
class BookmarkList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bm_list: null,
      bm_index: null,
      bm_tab: null,
      view_index:0,
    };
    this.contRef = React.createRef();
  }

  componentDidMount() {
    var that = this;
    // load data from storage and change root div height
    chrome.storage.local.get(["pl_playlist", "pl_index", "pl_tabid", "pl_dumbo"], function(result) {
      that.setState({bm_list:result.pl_playlist, bm_index:result.pl_index, bm_tab:result.pl_tabid});
      if(result.pl_playlist != null) {
        document.getElementById('root').style.height = 24+28*Math.min(result.pl_playlist.length, 12) + "px";
        document.getElementById("button_container").scrollTop = (28*result.pl_index);
      }
    });
    // listener for content.js autoplay, only applicable when popup open AND content.js autoplays
    chrome.runtime.onMessage.addListener(function(message, sender, response) {
      chrome.storage.local.get(["pl_tabid"], function(result) {
        if(result.pl_tabid != null && result.pl_tabid == sender.tab.id && message.bookmarks_index != null) {
          that.editIndex(message.bookmarks_index);
        }
      })
    });
  }

  editIndex = (i) => {
    this.setState({bm_index:i});
  }

  // make sure we're setting state.view_index everywhere it needs to be set
  // does scroll happen automatically after content.js call?
  paneDidMount = (node) => {
    var that=this;
    if (node) {
      node.addEventListener('scroll', function(){
        that.setState({view_index:Math.floor(node.scrollTop / 28.)});
      });
    }
  };

  // this is very slow because it's redoing the map every time I think
  render() {
    var that = this;
    if(that.state.bm_list != null) {
      return (
        <div>
          <div style={{height:24}}>
            <BookmarkController 
              bm_index={that.state.bm_index}
              bm_list={that.state.bm_list}
              editIndex={that.editIndex}
              setPLView={that.props.setPLView}
            />
          </div>
          <div 
            id="button_container" 
            style= {{
              position:"fixed",
              top:36,
              height:(28*Math.min(that.state.bm_list.length, 12)) + "px",
              width:308, // to move the scroll bar all the way right
              overflow:"auto",
            }}
            ref={this.paneDidMount}
          > 
            {that.state.bm_list.map(function(bookmark,index) {
              if(index >= that.state.view_index - 4 && index <= that.state.view_index + 16) {
                return (
                  <BookmarkButton 
                    title={bookmark.title} 
                    url={bookmark.url}
                    list_pos={index} 
                    editIndex={that.editIndex}
                    current={(that.state.bm_index === index) ? true : false}
                  />
                );
              }
              else {
                return (
                  <div style={styles.BookmarkButtonContainer({})}/>
                )
              }
            })} 
          </div>
        </div>
      );
    }
    else { // i.e. while local storage hasn't yet called setState()
      return <div ref={this.paneDidMount}/>;
    }
  }
}

export default BookmarkList;