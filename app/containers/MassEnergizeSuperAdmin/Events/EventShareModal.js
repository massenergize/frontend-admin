import { Checkbox } from "@material-ui/core";
import { Button, FormControlLabel, Typography } from "@material-ui/core";

import React, { useState } from "react";
import ThemeModal from "../../../components/Widget/ThemeModal";

/**
 * This component lists all communities that an admin
 * viewing an event is allowed to share to
 * @returns
 */
function EventShareModal({ show, toggleModal }) {
  const [communities, setCommunities] = useState([]); // Selected communities to share to

  const add = (id) => {
    if (!communities.includes(id)) setCommunities([...communities, id]);
    var rem = communities.filter((_id) => _id !== id);
    setCommunities([...rem, id]);
  };
  return (
    <div>
      <ThemeModal
        open={true}
        fullControl
        close={() => toggleModal && toggleModal(false)}
      >
        <div
          style={{
            padding: "10px 20px",
            border: "solid 0px #fbfbfb",
            borderBottomWidth: 2,
          }}
        >
          <Typography variant="h6" style={{ fontSize: 18 }}>
            Select communities
          </Typography>
          <Typography variant="caption">
            Communities that you are allowed to share this event to
          </Typography>
        </div>
        <div
          style={{
            minHeight: 400,
            maxHeight: 400,
            width: 550,
            maxWidth: 550,
            minWidth: 550,
            position: "relative",
            paddingBottom: 60,
            overflowY: "scroll",
          }}
        >
          <div
            style={{
              padding: "0px 20px",
            }}
          >
            {[1, 2, 3, 4, 5, 6, 4, 3, 3, 45, 3].map((com) => {
              return (
                <FormControlLabel
                  key={com}
                  control={<Checkbox onChange={(e) => set} />}
                  label={`Community number ${com}`}
                />
              );
            })}
          </div>
          {/* ----------- Footer -------------- */}
          <div
            style={{
              width: "100%",
              position: "absolute",
              bottom: 0,
              background: "#fbfbfb",
              display: "flex",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              style={{
                borderRadius: 0,
                marginLeft: "auto",
                padding: "8px 25px",
              }}
            >
              Share to (3) communities
            </Button>
          </div>
        </div>
      </ThemeModal>
    </div>
  );
}

export default EventShareModal;
