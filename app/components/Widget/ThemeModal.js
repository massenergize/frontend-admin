import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from "@material-ui/core";
import React, { useState } from "react";

function ThemeModal({ children, onConfirm, onCancel, open }) {
  // const [open, setopen] = useState(second)
  return (
    <Dialog open={open}>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button color="default" onClick={() => onCancel && onCancel()}>
          No
        </Button>
        <Button color="primary" onClick={() => onConfirm && onConfirm()}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ThemeModal;
