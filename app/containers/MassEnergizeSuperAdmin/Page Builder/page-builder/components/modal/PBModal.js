import React from "react";
import "./pb-modal.css";

function PBModal({ children, close, style }) {
  return (
    <div className="pb-modal-root">
      <div className="pb-ghost" onClick={() => close && close()}></div>
      <div className="pb-modal-content" style={style || {}}>
        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <i
            style={{ position: "absolute", right: 20, top: 10, color: "#dbdbdb" }}
            className="fa fa-times touchable-opacity"
            onClick={() => close && close()}
          ></i>
        </div>
        {children}
      </div>
    </div>
  );
}

export default PBModal;
