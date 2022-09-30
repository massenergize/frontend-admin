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
  okText,
  cancelText,
  noCancel = false,
  noOk,
  fullControl = false,
  contentStyle = {},
}) {
  // const [open, setopen] = useState(second)
  const fullControlStyles = { padding: 0 };
  return (
    <Dialog open={open}>
      <DialogContent
        style={
          fullControl
            ? { ...fullControlStyles, ...(contentStyle || {}) }
            : contentStyle || {}
        }
      >
        {children}
      </DialogContent>
      {!fullControl && (
        <DialogActions style={{ padding: 10 }}>
          <>
            {!noCancel && (
              <Button
                color="default"
                onClick={() => {
                  onCancel && onCancel();
                  if (close) return close();
                }}
              >
                {cancelText || "  No"}
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
          </>
        </DialogActions>
      )}
    </Dialog>
  );
}

export default ThemeModal;
