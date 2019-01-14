/*global chrome*/

chrome.storage.local.get(["pl_playlist"], function(result) {
  console.log("in content: a set:");
  console.log(result);
})

// youtube etc.
var videos = document.getElementsByTagName('video');
console.log(videos)
if(videos.length > 0) { // TEMPORARY instead of YouTube
  videos[0].addEventListener('ended',function() {
    chrome.storage.local.get(["pl_playlist", "pl_index"], function(result) {
      var bookmarks_index = result.pl_index + 1;
      if(bookmarks_index < result.pl_playlist.length) {
        chrome.runtime.sendMessage({bookmarks_index:bookmarks_index}, function(response) {
          console.log(response);
        });
      }
      else {
        chrome.runtime.sendMessage({playlist_finished:true}, function(response) {
          console.log(response);
        });
      }
    });
  });
}

// for soundcloud links, a hacky way is to watch the top left play button and see when it turns!
// doens't work for playlists but that's NBD, playlists should probably be broken anyways
var play_button = document.getElementsByClassName("playControl sc-ir playControls__control playControls__play");
console.log(play_button);
if(play_button.length > 0) {}

// bandcamp etc.
var audios = document.getElementsByTagName('audio');
console.log(audios);

chrome.runtime.onMessage.addListener(function(message, sender, response) {
  console.log(message);
  // so this works completely. So maybe the solution is to have a callback in postLoadExec: 
  // so after content.js is executed completely, background.js can send a short message which
  // will trigger the following listener IFF the button is currently paused
  if(message.play_button != null) {
    var play_button = document.getElementsByClassName("playControl sc-ir playControls__control playControls__play")[0];
    // DOM 2 Events
    
    // console.log(play_button);
    // if(play_button.title == "Play current") {
    //   console.log("clicking!");
    //   play_button.focus();
    //   play_button.click();
    // }

    // var s = document.createElement('script');
    // s.src = chrome.extension.getURL('dumbo.js');
    // s.onload = function() {
    //     this.remove();
    // };
    // (document.head || document.documentElement).appendChild(s);
  }
});