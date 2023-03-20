import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";

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
  const fullControlStyles = { padding: 0 };
  return (
    <>
      <Dialog
        open={open}
        onClose={onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {!fullControl && (
          <DialogTitle id="alert-dialog-title">
            {"Confirmation Dialog"}
          </DialogTitle>
        )}
        <DialogContent
          style={
            fullControl
              ? { ...fullControlStyles, ...(contentStyle || {}) }
              : contentStyle || {}
          }
        >
          <DialogContentText id="alert-dialog-description">
            {children}
          </DialogContentText>
        </DialogContent>
        {!fullControl && (
          <DialogActions>
            {!noCancel && (
              <Button
                // color="default"
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
                // color="primary"
                onClick={() => {
                  onConfirm && onConfirm();
                  if (closeAfterConfirmation) close && close();
                }}
              >
                {okText || "Yes"}
              </Button>
            )}
          </DialogActions>
        )}
      </Dialog>
    </>
  );
}

export default ThemeModal;
