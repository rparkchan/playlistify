/*global chrome*/
import React from 'react';
import BookmarkEntry from './bookmark-entry';
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
  }

  componentDidMount() {
    var that = this;
    // load data from storage and change root div height
    chrome.storage.local.get(["pl_playlist", "pl_index", "pl_tabid", "pl_dumbo"], function(result) {
      that.setState({bm_list:result.pl_playlist, bm_index:result.pl_index, bm_tab:result.pl_tabid});
      if(result.pl_playlist != null) {
        document.getElementById('root').style.height = 24+28*Math.min(result.pl_playlist.length, 10) + "px";
        document.getElementById("button_container").scrollTop = (28*Math.max(result.pl_index-2,0));
      }
    });
    // listener for content.js autoplay, only applicable when popup open AND content.js autoplays
    chrome.runtime.onMessage.addListener(function(message, sender, response) {
      chrome.storage.local.get(["pl_tabid"], function(result) {
        if(result.pl_tabid != null && result.pl_tabid == sender.tab.id && message.new_index != null) {
          that.editIndex(message.new_index);
        }
      })
    });
  }

  editIndex = (i) => {
    this.setState({bm_index:i});
  }

  removeElement = (i) => {
    var ed = this.state.bm_list;
    ed.splice(i,1);
    var r = i < this.state.bm_index;
    chrome.storage.local.set({pl_playlist:ed, pl_index:this.state.bm_index-r}, () => {
      this.setState({bm_list:ed, bm_index:this.state.bm_index-r});
    });
  }
  
  // shuffle the playlist but keep the current index song intact (if it exists)
  shufflePlaylist = () => {
    var shuffled = this.state.bm_list.slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      if(i != this.state.bm_index && j != this.state.bm_index)
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    chrome.storage.local.set({pl_playlist:shuffled}, () => {
      this.setState({bm_list:shuffled});
    });
  }

  // store view_index as topmost element in playlist view
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
              shufflePlaylist={that.shufflePlaylist}
            />
          </div>
          <div 
            id="button_container" 
            style= {{
              position:"fixed",
              top:36,
              height:(28*Math.min(that.state.bm_list.length, 10)) + "px",
              width:308, // to move the scroll bar all the way right
              overflow:"auto",
            }}
            ref={this.paneDidMount}
          > 
            {that.state.bm_list.map(function(bookmark,index) {
              if(index >= that.state.view_index - 6 && index <= that.state.view_index + 18) {
                return (
                  <BookmarkEntry 
                    title={bookmark.title} 
                    url={bookmark.url}
                    list_pos={index} 
                    editIndex={that.editIndex}
                    current={(that.state.bm_index === index) ? true : false}
                    removeElement={that.removeElement}
                  />
                );
              }
              else {
                return (
                  <div style={styles.BookmarkEntryContainer({})}/>
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