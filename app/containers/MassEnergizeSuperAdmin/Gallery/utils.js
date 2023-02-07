


import React from "react";
import { CircularProgress, Typography } from "@mui/material";

  export const ProgressCircleWithLabel = ({ label }) => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: 20,
        }}
      >
        <CircularProgress thickness={5} />
        {label && <Typography style={{ marginTop: 10 }}>{label}</Typography>}
      </div>
    );
  };
  