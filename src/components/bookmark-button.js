/*global chrome*/
import React from 'react';

//
//

class BookmarkButton extends React.Component {
  render() {
    var that = this;
    return (
      <div 
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height:"24px",
          // margin: "4px",
          marginLeft: "2px",
          // marginBottom: "2px",
          marginTop: "4px",
          width: "288px",
          // border: "1px solid #ccc",
          // borderRadius: "8px",
        }}
      >
        <div 
          onClick={
            function() {
              chrome.runtime.sendMessage({bookmarks_index:that.props.list_pos}, function(response) {
                that.props.editIndex(that.props.list_pos);
              });
            }
          }
          style={{
            color: that.props.current ? "red" : "black",
            background: "url(chrome://favicon/size/16@1x/" + that.props.url + ") no-repeat", // 1x or 2x
            backgroundPosition: "left center",
            border: "1px solid",
            paddingLeft: "24px",
            height: "24px",
            width: "230px",
            lineHeight: "24px",
            overflow: "hidden",
          }}
        > 
          {that.props.title}
        </div>
        <button 
          style={{
            height: "16px",
            width: "16px",
          }}
        >
        </button>
      </div>
    )
  }
}

export default BookmarkButton;