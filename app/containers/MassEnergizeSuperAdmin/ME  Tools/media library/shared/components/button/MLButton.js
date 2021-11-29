import React from 'react';

export default function MLButton({
  onClick,
  style = {},
  backColor = 'green',
  btnColor = 'white',
  className,
  children,
}) {
  return (
    <button
      className={`ml-footer-btn ${className}`}
      style={{
        '--btn-color': btnColor,
        '--btn-background': backColor,
        ...style,
      }}
      onClick={() => (onClick ? onClick() : null)}
    >
      {children}
    </button>
  );
}
