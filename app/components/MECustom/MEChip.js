import React from "react";

function MEChip({
  label,
  style,
  className,
  children,
  containerStyle,
  containerClassName,
  onClick,
}) {
  return (
    <div
      style={containerStyle || {}}
      className={`me-chip-container ${containerClassName || ""}`}
    >
      <p
        className={`me-chip ${className || ""}`}
        style={style || {}}
        onClick={() => onClick && onClick()}
      >
        {label || children || "..."}
      </p>
    </div>
  );
}

export default MEChip;
