import XGray from "../images/x_gray.png";
import XBlack from "../images/x_black-sheet.png";
import Save from "../images/save.png";
import Lock from "../images/lock.png";

var icons = {
  XGray: XGray,
  XBlack: XBlack,
  Save: Save,
  Lock: Lock,
}

function SixteenButton(params) {
  return {
    background:"url(" + icons[params.icon] + ") no-repeat",
    backgroundPosition:"center center",
    height:16,
    width:16,
    border:"none",
  }  
}

function BookmarkControllerContainer(params) {
  return {
    position:"fixed",
    top:8,
    left:8,
    height:44,
    width:286,
    display:"flex",
    flexWrap:"wrap",
  };
}

function BookmarkControllerInputs(params) {
  return {
    width:286,
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    height:16,
    marginBottom:2,
  }
}

function BookmarkControllerActions(params) {
  return {
    width:286,
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    height:20,
  }
}

function BookmarkControllerButtons(params) {
  return {
    width:256, 
    display:"flex", 
    justifyContent:"space-between"
  }
}

function BookmarkControllerButton(params) {
  return {
    border:"1px outset #d9d9d9",
    borderRadius:"4px",
    height:18,
    lineHeight:0,
  }
}

function BookmarkEntryContainer(params) {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height:"24px",
    paddingBottom: 2,
    paddingTop: 2,
    width: 286,
  };
}

function BookmarkEntryButton(params) {
  return {
    color: params.current ? "red" : "black",
    border: "1px solid",
    borderColor: params.current ? "red" :  "#737373",
    borderRadius: "2px",
    height: "24px",
    width: "254px",
    lineHeight: "24px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    cursor:"pointer",
  };
}

function BookmarkEntryTitle(params) {
  return {
    position:"absolute", 
    left:24, 
    height:24, 
    width:230, 
    overflow:"hidden"
  }
}

function BookmarkListEntries(params) {
  return {
    position:"fixed",
    // top:36,
    top:52,
    height:(28*Math.min(params.len, 8)) + "px",
    width:302, // to move the scroll bar all the way right
    overflow:"auto",
  }
}

function FolderButtonContainer(params) {
  return {
    display:"flex", 
    height:"16px", 
    alignItems:"center",
  }
}

function FolderButtonIcon(params) {
  return {
    height:12,
    width:12,
    marginLeft:params.depth*12
  }
}

function FolderButtonTitle(params) {
  return {
    height:"16px",
    marginLeft:"4px",
    lineHeight:"16px",
    overflow:"hidden",
    fontFamily:"Courier New",
    textDecoration:"underline",
    cursor: "pointer",
  }
}

const styles = {
  BookmarkControllerContainer: BookmarkControllerContainer,
  BookmarkControllerInputs: BookmarkControllerInputs,
  BookmarkControllerActions: BookmarkControllerActions,
  BookmarkControllerButtons: BookmarkControllerButtons,
  BookmarkControllerButton: BookmarkControllerButton,

  BookmarkEntryContainer: BookmarkEntryContainer,
  BookmarkEntryButton: BookmarkEntryButton,
  BookmarkEntryTitle: BookmarkEntryTitle,
  
  BookmarkListEntries: BookmarkListEntries,

  FolderButtonContainer: FolderButtonContainer,
  FolderButtonIcon: FolderButtonIcon,
  FolderButtonTitle: FolderButtonTitle,

  SixteenButton: SixteenButton,
}

export {styles};