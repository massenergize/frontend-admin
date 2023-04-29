import { Typography } from "@mui/material";
import React from "react";

function SocketNotificationModal({ message }) {
  return (
    <div>
      <Typography variant="body" style={{ color: "black" }}>
        {message}
      </Typography>
    </div>
  );
}

export default SocketNotificationModal;
