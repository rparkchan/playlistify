import XGray from "../images/x_gray.png";
import XBlack from "../images/x_black-sheet.png";
import Save from "../images/save.png";
import Lock from "../images/lock.png";

const icons = {
  XGray: XGray,
  XBlack: XBlack,
  Save: Save,
  Lock: Lock,
}

/******************************************************************************************************/

const SixteenButton = (params) => {
  return {
    background:"url(" + icons[params.icon] + ") no-repeat",
    backgroundPosition:"center center",
    height:16,
    width:16,
    border:"none",
  }  
}

/******************************************************************************************************/

const BookmarkControllerContainer = (params) => {
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

const BookmarkControllerInputDiv = (params) => {
  return {
    width:286,
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    height:16,
    marginBottom:2,
  }
}

const BookmarkControllerTextInput = (parmas) => {
  return {
    width:250,
    height:12
  }
}

const BookmarkControllerActions = (params) => {
  return {
    width:286,
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    height:20,
  }
}

const BookmarkControllerButtons = (params) => {
  return {
    width:256, 
    display:"flex", 
    justifyContent:"space-between"
  }
}

const BookmarkControllerButton = (params) => {
  return {
    border:"1px outset #d9d9d9",
    borderRadius:"4px",
    height:18,
    lineHeight:0,
  }
}

/******************************************************************************************************/

const BookmarkEntryContainer = (params) => {
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

const BookmarkEntryButton = (params) => {
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

const BookmarkEntryIcon = (params) => {
  return {
    marginLeft:4,
    width:16
  }
}

const BookmarkEntryTitle = (params) => {
  return {
    position:"absolute", 
    left:24, 
    height:24, 
    width:230, 
    overflow:"hidden",
  }
}

/******************************************************************************************************/

const BookmarkListEntries = (params) => {
  return {
    position:"fixed",
    // top:36,
    top:52,
    height:(28*Math.min(params.len, 8)) + "px",
    width:302, // to move the scroll bar all the way right
    overflow:"auto",
  }
}

const BookmarkListEmpty = (params) => {
  return {
    height:26, 
    width:254, 
    border:"1px solid"
  }
}

const BookmarkListController = (params) => {
  return {
    height:24
  }
}

/******************************************************************************************************/

const FolderEntryContainer = (params) => {
  return {
    display:"flex", 
    height:"16px", 
    alignItems:"center",
  }
}

const FolderEntryIcon = (params) => {
  return {
    height:12,
    width:12,
    marginLeft:params.depth*12
  }
}

const FolderEntryTitle = (params) => {
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

/******************************************************************************************************/

const styles = {
  bm_ctrl: {
    outer_div: BookmarkControllerContainer,
    search_div: BookmarkControllerInputDiv,
    text_input: BookmarkControllerTextInput,
    icon_button: SixteenButton,
    action_div: BookmarkControllerActions,
    action_div_left:BookmarkControllerButtons,
    action_div_button:BookmarkControllerButton,
  },

  bm_entry: {
    outer_div: BookmarkEntryContainer,
    click_div: BookmarkEntryButton,
    click_image: BookmarkEntryIcon,
    click_title: BookmarkEntryTitle,
    icon_button: SixteenButton,
  },

  bm_list: {
    entry_div: BookmarkListEntries,
    empty_div: BookmarkListEmpty, 
    controller_div: BookmarkListController,
  },

  fldr_entry: {
    outer_div: FolderEntryContainer,
    icon: FolderEntryIcon,
    title: FolderEntryTitle,
  },
}

export {styles};