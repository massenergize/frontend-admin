import { Typography } from "@mui/material";
import React from "react";

function CustomPageTitle({ children }) {
  return (
    <>
      <Typography variant="h4" style={{ fontWeight: "bold", color: "white", marginBottom: 10 }}>
        {children}
      </Typography>
      <br />
    </>
  );
}

export default CustomPageTitle;
