import { Typography } from "@mui/material";
import React from "react";

function MEPaperBlock({
  children,
  customHeader,
  title,
  subtitle,
  containerStyle,
  banner,
  icon,
}) {
  if (banner)
    return (
      <div
        className="elevate-float"
        style={{
          width: "100%",
          minHeight: "auto",
          padding: "15px 25px",
          marginBottom: 10,
          background: "#fefbf3",
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          ...(containerStyle || {}),
        }}
      >
        {icon && <i className={icon} style={{ marginRight: 7 }} />}
        {children}
      </div>
    );
  return (
    <div>
      <div
        className="elevate-float"
        style={{
          width: "100%",
          minHeight: 200,
          padding: 30,
          background: "white",
          borderRadius: 10,
          marginBottom: 20,
          ...(containerStyle || {}),
        }}
      >
        {!customHeader ? (
          <div style={{ marginBottom: title ? 20 : 0 }}>
            {title && (
              <Typography
                variant="h3"
                style={{
                  fontSize: 24,
                  color: "#8E24AA",
                  marginBottom: 8,
                  fontWeight: "bold",
                }}
              >
                {title}
              </Typography>
            )}
            {subtitle?.length ? (
              <Typography variant="body" style={{ fontSize: "1rem" }}>
                {subtitle}
              </Typography>
            ) : (
              <>{subtitle}</>
            )}
          </div>
        ) : (
          <>{customHeader}</>
        )}
        {children}
      </div>
    </div>
  );
}

export default MEPaperBlock;
