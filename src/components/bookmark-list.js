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
    };
  }

  componentDidMount() {
    chrome.storage.local.get(["pl_playlist", "pl_index"], (result) => {
      this.setState({bm_list:result.pl_playlist, bm_index:result.pl_index});
      if(result.pl_playlist != null) {
        let root_height = 24+28*Math.min(result.pl_playlist.length, 10) + "px";
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
      n_ind = n_ind == null ? null : n_ind-(i < n_ind);
      chrome.storage.local.set({pl_playlist:ed, pl_index:n_ind}, () => {
        this.setState({bm_list:ed, bm_index:n_ind});
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
    chrome.storage.local.set({pl_playlist:shuffled}, () => {
      this.setState({bm_list:shuffled});
    });
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
    if(this.state.bm_list != null) {
      return (
        <div>
          <div style={{height:24}}>
            <BookmarkController 
              bm_index={this.state.bm_index}
              bm_list={this.state.bm_list}
              editIndex={this.editIndex}
              setPLView={this.props.setPLView}
              shufflePlaylist={this.shufflePlaylist}
            />
          </div>
          <div 
            id="entries_container" 
            style={styles.BookmarkListEntries({len:this.state.bm_list.length})}
            ref={this.scrollListener}
          > 
            {this.state.bm_list.map((bookmark,index) => {
              let lower_ind = this.state.view_index - 6;
              let upper_ind = this.state.view_index + 18;
              if(index >= lower_ind && index <= upper_ind) {
                return (
                  <BookmarkEntry 
                    title={bookmark.title} 
                    url={bookmark.url}
                    list_pos={index} 
                    editIndex={this.editIndex}
                    current={(this.state.bm_index === index)}
                    removeElement={this.removeElement}
                  />
                );
              }
              else {
                return ( // empty container
                  <div style={styles.BookmarkEntryContainer({})}/>
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

export default BookmarkList;