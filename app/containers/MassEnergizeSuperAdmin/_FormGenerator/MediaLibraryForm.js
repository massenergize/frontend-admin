import { TextField, Typography } from "@mui/material";
import React from "react";

export default function MediaLibraryForm() {
  return (
    <div style={{ padding: "25px 50px" }}>
      <Typography variant="h6">Hello Frimpong,</Typography>
      <Typography variant="body">
        Before you upload, there a few details you need to provide. Please not
        that the items marked (*) are compulsory.
        <div>
          <Typography variant="body2">Name of the uploader</Typography>
          <TextField />
        </div>
      </Typography>
    </div>
  );
}
