import XGray from "../images/x_gray.png";
import XWhite from "../images/x_white.png";
import XBlack from "../images/x_black.png";
import XRed from "../images/x_red.png";

function BookmarkEntryContainer(props) {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height:"24px",
    paddingBottom: 2,
    paddingTop: 2,
    width: "288px",
  };
}

function BookmarkEntryButton(props) {
  return {
    color: props.current ? "red" : "black",
    border: "1px solid",
    borderColor: props.current ? "red" :  " #808080",
    borderRadius: "2px",
    height: "24px",
    width: "254px",
    lineHeight: "24px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
  };
}

function BookmarkEntryTitle(props) {
  return {
    position:"absolute", 
    left:24, 
    height:24, 
    width:230, 
    overflow:"hidden"
  }
}

function BookmarkEntryRemove(props) {
  return {
    height: "16px",
    width: "16px",
    background: "url(" + XGray + ") no-repeat",
    backgroundPosition: "center center",
    border: "none",
  };
}

function BookmarkControllerContainer(props) {
  return {
    position:"fixed",
    top:8,
    left:8,
    height:24,
    width:288,
    display:"flex",
    alignItems:"center",
    justifyContent:"space-between",
  };
}

function BookmarkControllerButton(props) {
  return {
    marginRight:3,
    border:"1px outset #d9d9d9",
    borderRadius:"4px",
    height:18,
    lineHeight:0,
  }
}

const styles = {
  BookmarkEntryContainer: BookmarkEntryContainer,
  BookmarkEntryButton: BookmarkEntryButton,
  BookmarkEntryRemove: BookmarkEntryRemove, 
  BookmarkControllerContainer: BookmarkControllerContainer,
  BookmarkControllerButton: BookmarkControllerButton,
  BookmarkEntryTitle: BookmarkEntryTitle,
}

export {styles};