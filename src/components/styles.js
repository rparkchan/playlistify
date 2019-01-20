import XGray from "../images/x_gray.png";
import XWhite from "../images/x_white.png";
import XBlack from "../images/x_black.png";
import XRed from "../images/x_red.png";

function BookmarkButtonContainer(props) {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height:"24px",
    // marginTop: props.list_pos==0 ? 4 : 0,
    // marginBottom: 4,
    paddingBottom: 2,
    paddingTop: 2,
    width: "288px",
  };
}

function BookmarkButtonEntry(props) {
  return {
    color: props.current ? "red" : "black",
    // background: "url(chrome://favicon/size/16@1x/" + props.url + ") no-repeat", // 1x or 2x
    // backgroundPosition: "4px center",
    border: "1px solid",
    borderColor: props.current ? "red" :  " #808080",
    borderRadius: "2px",
    // paddingLeft: "24px",
    height: "24px",
    width: "254px",
    lineHeight: "24px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
  };
}

function BookmarkButtonRemove(props) {
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
  BookmarkButtonContainer: BookmarkButtonContainer,
  BookmarkButtonEntry: BookmarkButtonEntry,
  BookmarkButtonRemove: BookmarkButtonRemove, 
  BookmarkControllerContainer: BookmarkControllerContainer,
  BookmarkControllerButton: BookmarkControllerButton,
}

export {styles};