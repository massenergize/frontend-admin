import React from "react";
import { renderSection } from "../../utils/engine/engine";
import "./pb-render.css";

function PBRender({ json, onClick, onBlockClick, remove }) {
  const html = renderSection(json?.template);
  return (
    <div onClick={() => onBlockClick && onBlockClick()} className="pb-render-wrapper" style={{ position: "relative" }}>
      {html}
      {/* <i
        style={{ position: "absolute", bottom: -23, zIndex: "7", transform: "translate(35vw, 0)" }}
        className=" render-plus elevate-float fa fa-times pb-sectionizer-plus-icon touchable-opacity"
        // onClick={() => onClick && onClick()}
      /> */}
      {/* <i
        style={{ position: "absolute", bottom: -23, zIndex: "7", transform: "translate(38vw, 0)" }}
        className=" render-plus elevate-float fa fa-plus pb-sectionizer-plus-icon touchable-opacity"
        onClick={() => onClick && onClick()}
      /> */}
      <div
        // style={{ position: "absolute", bottom: -23, zIndex: "7", }}
        className=" render-plus elevate-float   "
        // onClick={() => onClick && onClick()}
      >
        <i className=" touchable-opacity fa fa-times" onClick={() => remove && remove()}></i>
        <i className="touchable-opacity fa fa-plus" onClick={() => onClick && onClick()}></i>
      </div>
    </div>
  );
}

export default PBRender;
