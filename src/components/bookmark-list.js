/*global chrome*/

import React from 'react';
import BookmarkEntry from './bookmark-entry';
import BookmarkController from './bookmark-controller';
import {styles} from './styles.js'

/** 
 * BookmarkList:
 *   Contains a BookmarkController and a div of multiple BookmarkEntry's. 
 *   Manages the current playlist, index, and scroll as state.
 */

class BookmarkList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bm_list: null,
      bm_index: null,
      view_index:0,
      filtered_list: null,
      filter_term: "",
    };
  }

  componentDidMount() {
    chrome.storage.local.get(["pl_playlist", "pl_index"], (result) => {
      this.setState({bm_list:result.pl_playlist, bm_index:result.pl_index}, () => {
        this.filterSearch("", false);
      });
      if(result.pl_playlist != null) {
        let root_height = 40+28*Math.min(result.pl_playlist.length, 8) + "px";
        let scrl_height = (28*Math.max(result.pl_index-2,0));
        document.getElementById('root').style.height = root_height;
        document.getElementById("entries_container").scrollTop = scrl_height;
      }
    });
    chrome.runtime.onMessage.addListener((message, sender, response) => {
      if(message.new_index != null) {
        chrome.storage.local.get(["pl_tabid", "pl_musmode"], (result) => {
          let p_tab = result.pl_tabid!=null && result.pl_tabid==sender.tab.id;
          if(p_tab && result.pl_musmode) {
            this.editIndex(message.new_index);
          }
        })
      }
    });
  }

  // set the current playlist index
  editIndex = (i) => {
    this.setState({bm_index:i});
  }

  // remove the i^{th} entry if it's not the current entry
  removeElement = (i) => {
    if(i != this.state.bm_index) {
      let ed = this.state.bm_list;
      let n_ind = this.state.bm_index;
      ed.splice(i,1);
      listPos(ed);
      n_ind = n_ind == null ? null : n_ind-(i < n_ind);
      chrome.storage.local.set({pl_playlist:ed, pl_index:n_ind}, () => {
        this.setState({bm_list:ed, bm_index:n_ind}, () => {
          this.filterSearch(this.state.filter_term, false);
        });
      });
    }
  }
  
  // pseudo-shuffle the playlist but keep the current index song intact
  shufflePlaylist = () => {
    let shuffled = this.state.bm_list.slice();
    for(let i = shuffled.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      if(i != this.state.bm_index && j != this.state.bm_index)
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    listPos(shuffled); // re-listPos the actual playlist
    chrome.storage.local.set({pl_playlist:shuffled}, () => {
      this.setState({bm_list:shuffled}, () => {
        this.filterSearch(this.state.filter_term, false);
      });
    });
  }

  // update this state's filtered_list and filter_term by search term
  filterSearch = (term, autoscroll) => {
    let filtered = this.state.bm_list.filter( 
      (node) => (node.title.toLowerCase().includes(term.toLowerCase()) 
              || node.url.toLowerCase().includes(term.toLowerCase())))
    let root_height = 40+28*Math.min(filtered.length, 8) + "px";
    document.getElementById('root').style.height = root_height;
    this.setState({filter_term:term, filtered_list:filtered}, () => {
      if(autoscroll) {
        if(term == "") {
          let scrl_height = (28*Math.max(this.state.bm_index-2,0));
          document.getElementById("entries_container").scrollTop = scrl_height;
        }
        else {
          document.getElementById("entries_container").scrollTop = 0;
        }
      }
    });
  }

  // edit the current playlist to be the filtered playlist
  saveFiltered = () => {
    let new_plist = this.state.filtered_list;
    listPos(new_plist);
    let new_index = null;
    if(this.state.bm_index != null) {
      if(new_plist.includes(this.state.bm_list[this.state.bm_index])) {
        new_index = new_plist.indexOf(this.state.bm_list[this.state.bm_index])
      }
    }
    this.setState({bm_list:new_plist, bm_index:new_index}, () => {
      chrome.storage.local.set({pl_playlist:new_plist,pl_index:new_index});
    })
  }

  // callback ref: when the BookmarkList mounts, attach listener for scroll
  scrollListener = (el) => {
    if(el) {
      el.addEventListener('scroll', () => {
        this.setState({view_index:Math.floor(el.scrollTop / 28.)});
      });
    }
  };

  render() {
    if(this.state.filtered_list != null) {
      return (
        <div>
          <div style={{height:24}}>
            <BookmarkController 
              bm_index={this.state.bm_index}
              bm_list={this.state.bm_list}
              editIndex={this.editIndex}
              setPLView={this.props.setPLView}
              shufflePlaylist={this.shufflePlaylist}
              filterSearch={this.filterSearch}
              saveFiltered={this.saveFiltered}
            />
          </div>
          <div 
            id="entries_container" 
            style={styles.BookmarkListEntries({len:this.state.filtered_list.length})}
            ref={this.scrollListener}
          >  
            {this.state.filtered_list.map((bookmark,index) => { 
              let lower_ind = this.state.view_index - 6;
              let upper_ind = this.state.view_index + 18;
              if(index >= lower_ind && index <= upper_ind) {
                return (
                  <BookmarkEntry 
                    title={bookmark.title}  // can be condensed these three lines
                    url={bookmark.url}
                    list_pos={bookmark.list_pos} 
                    editIndex={this.editIndex}
                    current={(this.state.bm_index === bookmark.list_pos)}
                    removeElement={this.removeElement}
                  />
                );
              }
              else {
                return ( // empty container, 28 high total
                  <div style={{height:26, width:254, border:"1px solid"}}/>
                )
              }
            })} 
          </div>
        </div>
      );
    }
    else { // i.e. while local storage hasn't yet called setState()
      return <div ref={this.scrollListener}/>;
    }
  }
}

// add a list_pos property to bookmarks_list entries: important for search
function listPos(bookmarks_list) {
  for(let i=0; i<bookmarks_list.length; i++) {
    bookmarks_list[i].list_pos = i;
  }
}

export default BookmarkList;