import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import MomentUtils from "@date-io/moment";
import TextField from "@mui/material/TextField";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ScheduleMessageModal({
  data,
  open,
  handleClose,
  onSubmit,
}) {
  const [date, setDate] = React.useState("");

  const onDateSelect = () => {
    if (!date) return handleClose();
    let dateText = date?._d;
    data = {
      ...data,
      schedule: dateText,
    };
    handleClose();
    onSubmit(data);
  };
  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          {"When do you want this message to be sent ?"}
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider
            dateAdapter={AdapterMoment}
            utils={MomentUtils}
            style={{ width: "100%" }}
          >
            <DateTimePicker
              renderInput={(props) => <TextField {...props} />}
              // minDateTime={new Date()}
              value={date}
              onChange={(date) => {
                setDate(date);
              }}
              label="" // don't put label in the box {field.label}
              // mask="MM/DD/YYYY, h:mm a"
              inputFormat="MM/DD/YYYY HH:mm:ss"
              mask={"__/__/____ __:__:__"}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDateSelect}>Set Schedule</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
