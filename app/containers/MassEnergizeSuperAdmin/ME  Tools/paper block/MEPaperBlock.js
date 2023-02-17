import { Typography } from "@mui/material";
import React from "react";

function MEPaperBlock({ children, customHeader, title, subtitle }) {
  return (
    <div>
      <div
        className="elevate-float"
        style={{
          width: "100%",
          minHeight: 200,
          padding: 30,
          background: "white",

          //   boxShadow:
          //     "0px 1px 8px 0px rgb(80 80 80 / 20%), 0px 3px 4px 0px rgb(80 80 80 / 14%), 0px 3px 3px -2px rgb(80 80 80 / 12%)",
        }}
      >
        {!customHeader ? (
          <div style={{ marginBottom: 200 }}>
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
            {subtitle && (
              <Typography variant="body" style={{ fontSize: "1rem" }}>
                {subtitle}
              </Typography>
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
