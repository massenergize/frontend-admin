import { Typography } from "@mui/material";
import React from "react";

function MEPaperBlock({
  children,
  customHeader,
  title,
  subtitle,
  containerStyle,
  titleStyle
}) {
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
          <div style={{ marginBottom: 20 }}>
            {title && (
              <Typography
                variant="h3"
                style={{
                  fontSize: 24,
                  color: "#8E24AA",
                  marginBottom: 8,
                  fontWeight: "bold",
                  ...(titleStyle ||{})
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
