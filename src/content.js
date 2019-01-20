/*global chrome*/

var music_regex = {
  youtube: /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/,
  bandcamp: /((https?:\/\/(www\.)?(.*\.bandcamp\.com\/track\/.*|.*\.bandcamp\.com\/album\/.*)))/i,
  soundcloud: /((https?:\/\/(www\.)?(.*soundcloud\.com\/.*\/.*|.*soundcloud\.com\/.*\/.*\/.*)))/i,
  vimeo: /((https?:\/\/(www\.)?(vimeo\.com\/.*)))/i
}
var url = window.location.href;
var play_button = [], videos = [], audios = [];

function playNext() {
  chrome.storage.local.get(["pl_playlist", "pl_index"], function(result) {
    if(result.pl_playlist != null) { // can happen i.e. with "New" button
      var next_index = result.pl_index + 1;
      if(next_index < result.pl_playlist.length) {
        chrome.runtime.sendMessage({bookmarks_index:next_index});
      }
      else {
        chrome.runtime.sendMessage({playlist_finished:true});
      }
    }
  });
}

// YouTube
if(url.match(music_regex.youtube)) {
  // no need to start upon load
  console.log("youtube match");
  play_button = document.getElementsByClassName("ytp-play-button ytp-button");
  
  // listen for end of video
  videos = document.getElementsByTagName('video');
  if(videos.length > 0) { 
    videos[0].addEventListener('ended',function pn() {
      playNext();
      videos[0].removeEventListener('ended', pn);
    });
  }
  else {
    console.log("this is a YouTube link with no video content!");
  }
}

// Bandcamp
else if(url.match(music_regex.bandcamp)) {
  // Bandcamp links don't start automatically
  console.log("bandcamp match");
  play_button = document.getElementsByClassName('playbutton');
  if(play_button[0]) {
    if(play_button[0].className == "playbutton") {
      play_button[0].click();
    }
  }

  // listen for end of audio
  audios = document.getElementsByTagName('audio');
  if(audios.length > 0) { 
    audios[0].addEventListener('ended',function() {
      playNext();
    });
  }
}

// Soundcloud
else if(url.match(music_regex.soundcloud)) {
  // Soundcloud links don't start automatically
  console.log("soundcloud match");
  play_button = document.getElementsByClassName("sc-button-play playButton sc-button m-stretch");
  if(play_button[0]) {
    if(play_button[0].title == "Play") {
      play_button[0].click();
    }
  }

  // listen for end of audio
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

// Vimeo
else if(url.match(music_regex.vimeo)) {
  // Vimeo links don't start automatically
  console.log("vimeo match");
  play_button = document.getElementsByClassName("play rounded-box");
  if(play_button[0]) {
    if(play_button[0].title == "Play") {
      play_button[0].click();
    }
  }

  // listen for end of audio
  videos = document.getElementsByTagName('video');
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
//    handle popup.js "Play/Pause"

chrome.runtime.onMessage.addListener(function(message, sender, response) {
  // Play/Pause
  if(message.play_button != null) {
    if(play_button[0]) {
      play_button[0].click();
    }
  }
});