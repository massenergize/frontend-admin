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
  noCancel,
  noOk,
  okText,
  cancelText,
}) {
  // const [open, setopen] = useState(second)
  return (
    <Dialog open={open}>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        {!noCancel && (
          <Button
            color="default"
            onClick={() => {
              onCancel && onCancel();
              if (close) close();
            }}
          >
            {cancelText || "No"}
          </Button>
        )}
        {!noOk && (
          <Button
            color="primary"
            onClick={() => {
              onConfirm && onConfirm();
              if (closeAfterConfirmation) close && close();
            }}
          >
            {okText || "Yes"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default ThemeModal;
