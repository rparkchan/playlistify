## playlistify

Chrome extension lending playlist-like functionality to bookmarks. Featuring music mode, which allows autoplay through certain common media sites (YouTube, Soundcloud, Bandcamp, Vimeo); edit playlists by search+lock, shuffle, or removal without affecting underlying bookmarks; and more!

![alt text](https://raw.githubusercontent.com/rparkchan/playlistify/master/README_resources/bordered_folder_ex.jpg)
![alt text](https://raw.githubusercontent.com/rparkchan/playlistify/master/README_resources/bordered_teebs_ex.jpg)

### Instructions

This project was bootstrapped with create-react-app. 
1. Use the command `npm run build` to create the build folder
2. Open build folder in Chrome extensions "developer mode"
3. To enable background autoplay for Soundcloud specifically, navigate to chrome://flags and set the 'Autoplay policy' to 'No user gesture is required'

Note that in order for autoplay to function properly (enabled only in music mode), due to Chrome's throttling of non-active tabs, the music tab MUST be the active tab in its window: therefore in music mode by default playlistify will open bookmarks in a new popup window. 