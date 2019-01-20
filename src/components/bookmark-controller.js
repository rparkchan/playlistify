/*global chrome*/
import React from 'react';
import {styles} from './styles.js';
import XBlack from '../images/x_black.png';

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
        this.setState({tabmode:result.pl_musmode})
      }
      else { // should only be the very first time
        console.log("first time here?");
        chrome.storage.local.set({pl_musmode:false});
      }
    })
  }

  render() {
    return (
      <div style={styles.BookmarkControllerContainer({})}>
        <button 
          style={{marginRight:4,}}
          onClick = {
            () => {
              chrome.storage.local.remove(["pl_playlist", "pl_index"], () => {
                this.props.setPLView(false);
              })
            }
          }
        >
          &#x021AB; Back
        </button>

        <button
          style = {{
            marginRight:4,
          }}
          onClick = {
            () => {
              chrome.storage.local.get(["pl_tabid"], function(result){
                if(result.pl_tabid != null) {
                  chrome.tabs.sendMessage(result.pl_tabid,{play_button:true})
                }
              });
            }
          }
        >
          Play/Pause
        </button>

        <button
          style = {{
            marginRight:4,
          }}
          onClick = {
            () => {
              this.props.shufflePlaylist();
            }
          }
        >
          Shuffle
        </button>

        <button
          style = {{
            backgroundColor:this.state.musmode ? "red" : "white",
            height:18,
            lineHeight:0,
          }}
          onClick = {
            () => {
              chrome.storage.local.set({pl_musmode:!this.state.musmode}, () => {
                this.setState({musmode:!this.state.musmode});
              })
            }
          }
        >
          &#x0266A; Mode
        </button>

        <button 
          style={{
            background:"url(" + XBlack + ") no-repeat",
            backgroundPosition:"center center",
            marginLeft:22,
            border:"none",
            height:16,
            width:16,
          }}
          onClick = {
            () => {
              chrome.storage.local.get(["pl_tabid"], (result) => {
                if(result.pl_tabid != null) {
                  chrome.tabs.remove(result.pl_tabid, () => {
                    chrome.storage.local.remove(["pl_tabid", "pl_windowid", "pl_index"]);
                    this.props.editIndex(null);
                  })
                }
              })
            }
          }
        >
        </button>
      </div>
      );
  }
}

export default BookmarkController;