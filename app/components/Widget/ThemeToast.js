import { Alert, Snackbar, Typography } from "@mui/material";
import React from "react";

export default function ThemeToast({ variant, open, show, onClose, message, duration }) {
  return (
    <div>
      <Snackbar
        open={open || show}
        autoHideDuration={duration || 2500}
        onClose={onClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={onClose} severity={variant || "success"} sx={{ width: "100%" }}>
          <Typography>{message}</Typography>
        </Alert>
      </Snackbar>
    </div>
  );
}
