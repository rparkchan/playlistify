function BookmarkButtonContainer(props) {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height:"24px",
    marginTop: "4px",
    width: "288px",
  }
}

function BookmarkButtonEntry(props) {
  return {
    color: props.current ? "red" : "black",
    background: "url(chrome://favicon/size/16@1x/" + props.url + ") no-repeat", // 1x or 2x
    backgroundPosition: "4px center",
    border: "1px solid",
    borderRadius: "2px",
    paddingLeft: "24px",
    height: "24px",
    width: "230px",
    lineHeight: "24px",
    overflow: "hidden",
  }
}

function BookmarkButtonRemove(props) {
  return {
    height: "16px",
    width: "16px",
  }
}

const styles = {
  BookmarkButtonContainer: BookmarkButtonContainer,
  BookmarkButtonEntry: BookmarkButtonEntry,
  BookmarkButtonRemove: BookmarkButtonRemove, 
}

export {styles};