import { Alert, Snackbar, Typography } from '@mui/material';
import React from 'react'

export default function ThemeToast({variant, open, onClose, message}) {
  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={2500}
        onClose={onClose}
        anchorOrigin={{ vertical:"bottom", horizontal:"center" }}
      >
        <Alert
          onClose={onClose}
          severity={variant || "success"}
          sx={{ width: "100%" }}
        >
          <Typography>{message}</Typography>
        </Alert>
      </Snackbar>
    </div>
  );
}
