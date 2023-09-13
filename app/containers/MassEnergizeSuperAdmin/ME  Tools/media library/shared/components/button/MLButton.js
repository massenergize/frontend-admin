import React from "react";

export default function MLButton({
  onClick,
  style = {},
  backColor = "green",
  btnColor = "white",
  className,
  children,
  disabled,
  loading,
}) {
  return (
    <button
      disabled={disabled}
      className={`ml-footer-btn ${className}`}
      style={{
        "--btn-color": btnColor,
        "--btn-background": backColor,
        alignItems: "center",
        ...style,
      }}
      onClick={(e) => (onClick ? onClick(e) : null)}
    >
      {loading && (
        <i
          className="fa fa-spinner fa-spin"
          style={{ fontSize: 13, color: "white", marginRight: 5 }}
        />
      )}
      {children}
    </button>
  );
}
