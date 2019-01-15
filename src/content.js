/*global chrome*/

/******************************************************************************************************/

// Autoplay:
//    website-dependent listeners/other for autoplay functionality

function playNext() {
  chrome.storage.local.get(["pl_playlist", "pl_index"], function(result) {
    var bookmarks_index = result.pl_index + 1;
    if(bookmarks_index < result.pl_playlist.length) {
      chrome.runtime.sendMessage({bookmarks_index:bookmarks_index});
    }
    else {
      chrome.runtime.sendMessage({playlist_finished:true});
    }
  });
}

var url = window.location.href;

var vids = document.getElementsByTagName('video');
var auds = document.getElementsByTagName('audio');
console.log(vids);
console.log(auds);

// Youtube
var yt_exp = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
if(url.match(yt_exp)) {
  console.log("youtube match");

  var videos = document.getElementsByTagName('video');
  if(videos.length > 0) { 
    videos[0].addEventListener('ended',function() {
      playNext();
    });
  }
  else {
    console.log("this is a YouTube link with no video content!");
  }
}

// bandcamp
var bc_exp = /((https?:\/\/(www\.)?(.*\.bandcamp\.com\/track\/.*|.*\.bandcamp\.com\/album\/.*)))/i;
if(url.match(bc_exp)) {
  console.log("bandcamp match");
  var play_button = document.getElementsByClassName('playbutton');
  if(play_button[0]) {
    if(play_button[0].className == "playbutton") {
      play_button[0].click();
    }
  }

  var audios = document.getElementsByTagName('audio');
  if(audios.length > 0) { 
    audios[0].addEventListener('ended',function() {
      playNext();
    });
  }
}

// soundcloud
var sc_exp = /((https?:\/\/(www\.)?(.*soundcloud\.com\/.*\/.*|.*soundcloud\.com\/.*\/.*\/.*)))/i;
if(url.match(sc_exp)) {
  console.log("soundcloud match");
  var play_button = document.getElementsByClassName("sc-button-play playButton sc-button m-stretch");
  if(play_button[0]) {
    if(play_button[0].title == "Play") {
      play_button[0].click();
    }
  }

  var config = {attributes : true, childlist: true, subtree: true, characterData: true};
  var el = document.getElementsByClassName("playbackSoundBadge");
  var icon_href = document.getElementsByClassName("playbackSoundBadge__avatar sc-media-image")[0].href;
  var observer = new MutationObserver(function(mutationslist, obs) {
    var new_icon_href = document.getElementsByClassName("playbackSoundBadge__avatar sc-media-image")[0].href;
    if (new_icon_href !== icon_href) {
      obs.disconnect();
      playNext();
    }
  })
  observer.observe(el[0], config);
} 

// vimeo
var vim_exp = /((https?:\/\/(www\.)?(vimeo\.com\/.*)))/i;
if(url.match(vim_exp)) {
  console.log("vimeo match");
  var play_button = document.getElementsByClassName("play rounded-box");
  if(play_button[0]) {
    if(play_button[0].title == "Play") {
      play_button[0].click();
    }
  }

  var videos = document.getElementsByTagName('video');
  if(videos.length > 0) { 
    videos[0].addEventListener('ended',function() {
      playNext();
    });
  }
  else {
    console.log("this is a Vimeo link with no video content!");
  }
}

/******************************************************************************************************/

// Listener:
//    handle popup.js "Play/Pause", "Volume", and "Skip" commands

chrome.runtime.onMessage.addListener(function(message, sender, response) {
  console.log(message);
  // so this works when triggered by popup button only... wtf
  if(message.play_button != null) {
    var play_button = document.getElementsByClassName("playControl sc-ir playControls__control playControls__play")[0];
    if(play_button) {
      play_button.focus();
      play_button.click();
    }
  }
});