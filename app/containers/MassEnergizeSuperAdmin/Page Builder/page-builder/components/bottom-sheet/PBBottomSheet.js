import React, { useState } from "react";
import "./pb-bottom-sheet.css";

// const DEFAULT_HEIGHT = "80vh";
function PBBottomSheet({ children, close, height, toggleHeight, toggled }) {
  // const [height, setHeight] = useState(null);

  // const toggleHeight = () => {
  //   if (height === DEFAULT_HEIGHT) return setHeight(null);
  //   setHeight(DEFAULT_HEIGHT);
  // };
  // const toggled = height === DEFAULT_HEIGHT;
  return (
    <div className="pb-bottom-sheet" style={{ "--dynamic-height": height }}>
      <div className="pb-bottom-sheet-content">
        <div className="pb-bs-ribbon">
          <span onClick={() => close && close()} className="touchable-opacity" style={{ color: "red" }}>
            &#10005;
          </span>
          <span
            onClick={() => toggleHeight()}
            className="touchable-opacity"
            style={{ transform: toggled ? "rotate(180deg)" : "rotate(0deg)", marginLeft: 10, color: "green" }}
          >
            &#9651;
          </span>
        </div>
        {/* <button onClick={() => close && close()} className="pb-close-btn">
          <span>&#10005;</span>
        </button> */}
        {children}
      </div>
      <div style={{ flexBasis: "20%" }}></div>
    </div>
  );
}

export default PBBottomSheet;
