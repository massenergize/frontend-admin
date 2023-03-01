import { Typography } from "@mui/material";
import React from "react";

function EngagementCard({
  color,
  theme,
  icon,
  title,
  subtitle,
  value,
  onClick,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "15px 30px",
        background: theme || "#FFFAEA",
        width: "28%",
        borderRadius: 10,
        margin: 10,
      }}
    >
      <Typography
        variant="p"
        style={{
          fontSize: 12,
          marginBottom: 5,
          fontWeight: "bold",
          color,
        }}
      >
        {title || "..."}
      </Typography>
      <Typography
        variant="h5"
        style={{
          fontWeight: "bold",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <>{value || "0"}</>
        {icon && (
          <i
            className={`fa ${icon}`}
            style={{ marginLeft: "auto", color, opacity: "0.2" }}
          />
        )}
      </Typography>
      {subtitle ? (
        <Typography
          className="touchable-opacity"
          variant="caption"
          onClick={() => onClick && onClick()}
          style={{
            cursor: "pointer",
            marginTop: 5,
            fontWeight: "bold",
            color,
            border: "dotted 0px",
            borderBottomWidth: 2,
          }}
        >
          {subtitle}
        </Typography>
      ) : (
        <></>
      )}
    </div>
  );
}

export default EngagementCard;
