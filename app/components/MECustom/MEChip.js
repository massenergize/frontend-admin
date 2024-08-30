import { Tooltip } from "@mui/material";
import React from "react";

function MEChip({ label, style, className, children, containerStyle, containerClassName, onClick, tooltip }) {
  return (
    <div style={containerStyle || {}} className={`me-chip-container ${containerClassName || ""}`}>
      <Tooltip title="Halleyluah" {...tooltip || {}}>
        <p className={`me-chip ${className || ""}`} style={style || {}} onClick={() => onClick && onClick()}>
          {label || children || "..."}
        </p>
      </Tooltip>
    </div>
  );
}

export default MEChip;
