import { Button, TextField, Typography } from "@mui/material";
import React from "react";

function BrandCustomization() {
  return (
    <div
      style={{
        border: "dashed 1px #8e24aa45",
        padding: 15,
        width: "40%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: 300
      }}
    >
      <small>Click to select site logo</small>

      <img
        src="https://massenergize-prod-files.s3.amazonaws.com/media/EnergizeActon.logo.draft.1_p.2.jpeg"
        alt="site logo"
        style={{ width: 200, height: 100, marginTop: 10, objectFit: "contain", border: "dashed 1px #8e24aa45" }}
      />

      <TextField
        inputProps={{ style: { padding: 10 } }}
        placeholder="Enter external URL..."
        InputLabelProps={{
          shrink: true
        }}
        label="URL"
        style={{ width: "80%", marginTop: 15, marginBottom: 0 }}
      />

      <div
        style={{ display: "flex", alignItems: "center", marginLeft: "auto", marginTop: 10, paddingRight: 10 }}
        // style={{ display: "flex", alignItems: "center", marginLeft: 20, marginTop: 10, paddingRight: 20 }}
      >
        <Typography variant="caption" style={{ marginRight: 10 }}>
          Logo will lead to the default homepage if no URL is provided
        </Typography>
        <Button variant="contained">SAVE</Button>
      </div>
    </div>
  );
}

export default BrandCustomization;
