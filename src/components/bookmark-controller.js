/*global chrome*/

import React from 'react';
import {styles} from './styles.js';

/**
 * BookmarkController:
 *   Persistent top bar of BookmarkList: contains buttons to revert to 
 *   FolderList view, play/pause audio or video content, shuffle current 
 *   playlist, switch to music mode, or exit the current playlist tab/window.
 */

class BookmarkController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      musmode: false,
    }
  }

  componentDidMount() {
    chrome.storage.local.get(['pl_musmode'], (result) => {
      if(result.pl_musmode != null) {
        this.setState({musmode:result.pl_musmode})
      }
      else {
        chrome.storage.local.set({pl_musmode:false});
      }
    })
  }

  render() {
    return (
      <div style={styles.BookmarkControllerContainer({})}>
        <div style={{width:254, display:"flex"}}>
          <button 
            style={styles.BookmarkControllerButton({})}
            onClick = {() => {
              chrome.storage.local.remove(["pl_playlist", "pl_index"], () => {
                this.props.setPLView(false);
              })
            }}
          >
            &#x021AB; Back
          </button>

          <button
            style={styles.BookmarkControllerButton({})}
            onClick = {() => {
              chrome.storage.local.get(["pl_tabid"], (result) => {
                if(result.pl_tabid != null) {
                  chrome.tabs.sendMessage(result.pl_tabid,{play_button:true})
                }
              });
            }}
          >
            Play/Pause
          </button>

          <button
            style={styles.BookmarkControllerButton({})}
            onClick = {() => {
              this.props.shufflePlaylist();
            }}
          >
            Shuffle
          </button>

          <button
            style = {{
              ...styles.BookmarkControllerButton({}), 
              ...{backgroundColor:this.state.musmode ? "red" : "white"}
            }}
            onClick = {() => {
              this.setState({musmode:!this.state.musmode}, () => {
                chrome.storage.local.set({pl_musmode:this.state.musmode});
              });
            }}
          >
            &#x0266A; Mode
          </button>
        </div>

        <button 
          style={styles.BookmarkControllerExit({})}
          onClick = {() => {
            chrome.storage.local.get(["pl_tabid"], (result) => {
              if(result.pl_tabid != null) {
                chrome.tabs.remove(result.pl_tabid, () => {
                  let window_vars = ["pl_tabid", "pl_windowid", "pl_index"]
                  chrome.storage.local.remove(window_vars);
                  this.props.editIndex(null);
                })
              }
            })
          }}
        />
      </div>
    );
  }
}

export default BookmarkController;