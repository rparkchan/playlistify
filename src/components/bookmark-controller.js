/*global chrome*/

import React from 'react';
import {styles} from './styles.js';

/**
 * BookmarkController:
 *   Persistent top bar of BookmarkList: contains search bar, back button,
 *   play/pause audio or video content, shuffle current playlist, switch to 
 *   music mode, or exit the current playlist tab/window.
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
        <div style={styles.BookmarkControllerInputs({})}>
          <input 
            type="text>" 
            style={styles.BookmarkControllerSearch({})}
            placeholder="Search for bookmarks..."
            onChange={(update) => this.props.filterSearch(update.target.value, true)}
          />
          <button 
            style={styles.SixteenButton({icon:"Save"})}
            onClick={() => {
              this.props.saveFiltered()
            }}
          />
        </div>

        <div style={styles.BookmarkControllerActions({})}>
          <div style={styles.BookmarkControllerButtons({})}>
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
              &#x02928; Shuffle
            </button>

            <button
              style = {{
                ...styles.BookmarkControllerButton({}), 
                ...{backgroundColor:this.state.musmode ? "#ccffcc" : "white"}
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
            style={styles.SixteenButton({icon:"XBlack"})}
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
      </div>
    );
  }
}

export default BookmarkController;