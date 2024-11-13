import React from "react";
import { renderSection } from "../../utils/engine/engine";
import "./pb-render.css";

function PBRender({ json, onClick, onBlockClick, remove, inFocus }) {
  const html = renderSection(json?.template);
  return (
    <div
      onClick={() => onBlockClick && onBlockClick()}
      className={`pb-render-wrapper ${inFocus ? "pb-in-focus" : ""}`}
      style={{ position: "relative" }}
    >
      {html}
      <div
        className="render-plus elevate-float"
      >
        <i className=" touchable-opacity fa fa-times" onClick={() => remove && remove()} />
        <i className="touchable-opacity fa fa-plus" onClick={() => onClick && onClick()} />
      </div>
    </div>
  );
}

export default PBRender;
