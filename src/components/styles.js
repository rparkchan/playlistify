import XGray from "../images/x_gray.png";
import XBlack from "../images/x_black.png";

function BookmarkControllerContainer(params) {
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

function BookmarkControllerButton(params) {
  return {
    marginRight:3,
    border:"1px outset #d9d9d9",
    borderRadius:"4px",
    height:18,
    lineHeight:0,
  }
}

function BookmarkControllerExit(params) {
  return {
    background:"url(" + XBlack + ") no-repeat",
    backgroundPosition:"center center",
    height:16,
    width:16,
    border:"none",
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
    width: "288px",
  };
}

function BookmarkEntryButton(params) {
  return {
    color: params.current ? "red" : "black",
    border: "1px solid",
    borderColor: params.current ? "red" :  " #808080",
    borderRadius: "2px",
    height: "24px",
    width: "254px",
    lineHeight: "24px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
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

function BookmarkEntryRemove(params) {
  return {
    height: "16px",
    width: "16px",
    background: "url(" + XGray + ") no-repeat",
    backgroundPosition: "center center",
    border: "none",
  };
}

function BookmarkListEntries(params) {
  return {
    position:"fixed",
    top:36,
    height:(28*Math.min(params.len, 10)) + "px",
    width:308, // to move the scroll bar all the way right
    overflow:"auto",
  }
}

function FolderButtonContainer(params) {
  return {
    display:"flex", 
    height:"16px", 
    alignItems:"center"
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
  }
}

const styles = {
  BookmarkControllerContainer: BookmarkControllerContainer,
  BookmarkControllerButton: BookmarkControllerButton,
  BookmarkControllerExit: BookmarkControllerExit,

  BookmarkEntryContainer: BookmarkEntryContainer,
  BookmarkEntryButton: BookmarkEntryButton,
  BookmarkEntryRemove: BookmarkEntryRemove, 
  BookmarkEntryTitle: BookmarkEntryTitle,
  
  BookmarkListEntries: BookmarkListEntries,

  FolderButtonContainer: FolderButtonContainer,
  FolderButtonIcon: FolderButtonIcon,
  FolderButtonTitle: FolderButtonTitle,
}

export {styles};