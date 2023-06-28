import { Typography } from "@mui/material";
import React from "react";
import { PUBLICITY_PROPS, listToString } from "./EventFullView";
import { Link } from "react-router-dom/cjs/react-router-dom";

export const EventNotSharedWithAnyone = ({ publicity, shareable_to, id }) => {
  const pub = PUBLICITY_PROPS[publicity];
  return (
    <div style={{}}>
      <Typography style={{ marginBottom: 10 }}>
        This event has not been shared to any communities yet.
      </Typography>

      <Typography variant="body1" style={{ color: pub?.style?.background }}>
        <i className={`fa ${pub?.icon || ""}`} style={{ marginRight: 6 }} />
        <span>{pub?.info}</span>{" "}
      </Typography>
      <Typography>
        <b>{listToString(shareable_to)}</b>
      </Typography>

      <div style={{ marginTop: 10 }}>
        <Link to={`/admin/edit/${id}/event`}>
          Change Who Can See This Event
        </Link>
      </div>
    </div>
  );
};

export const EventSharedWithCommunity = ({
  publicity,
  shared_to,
  shareable_to,
}) => {
  const pub = PUBLICITY_PROPS[publicity];
  return (
    <div style={{}}>
      <Typography variant="body1">
        This event is currently shared to the following communities:
      </Typography>
      <Typography>
        <b>{listToString(shared_to)}</b>
      </Typography>
      <br />
      <Typography variant="body1" style={{ color: pub?.style?.background }}>
        <i className={`fa ${pub?.icon || ""}`} style={{ marginRight: 6 }} />
        <span>{pub?.info}:</span>{" "}
      </Typography>
      <Typography>
        <b>{listToString(shareable_to)}</b>
      </Typography>
    </div>
  );
};
