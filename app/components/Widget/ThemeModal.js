import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from "@material-ui/core";
import React, { useState } from "react";

function ThemeModal({
  children,
  onConfirm,
  onCancel,
  open,
  closeAfterConfirmation,
  close,
}) {
  // const [open, setopen] = useState(second)
  return (
    <Dialog open={open}>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button
          color="default"
          onClick={() => {
            onCancel && onCancel();
            if (close) close();
          }}
        >
          No
        </Button>
        <Button
          color="primary"
          onClick={() => {
            onConfirm && onConfirm();
            if (closeAfterConfirmation) close && close();
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ThemeModal;
