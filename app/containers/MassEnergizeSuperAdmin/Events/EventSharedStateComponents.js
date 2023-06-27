import { Typography } from "@mui/material";
import React from "react";
import { PUBLICITY_PROPS } from "./EventFullView";

export const EventNotSharedWithAnyone = ({ publicity }) => {
  const pub = PUBLICITY_PROPS[publicity];
  console.log("These are the props", pub);
  return (
    <div style={{}}>
      <Typography>
        This event has not been shared by any communities yet.
      </Typography>
      <Typography variant="body">
        <b style={{ color: pub?.style?.background }}>{pub?.info}</b>{" "}
      </Typography>
    </div>
  );
};
