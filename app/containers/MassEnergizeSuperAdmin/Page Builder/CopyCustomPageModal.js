import { Button } from "@mui/material";
import React from "react";

function CopyCustomPageModal() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        // alignItems: "center",
        // justifyContent: "center",
        height: "auto",
        padding: 20
      }}
    >
      <h2>Copy "New Custom Page"</h2>
      <p style={{ marginBottom: 10 }}>
        You are about to publish <b>"MassEnergize Main Resource Page"</b>, are you sure?{" "}
      </p>
      <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
        <div style={{ marginLeft: "auto" }}>
          <Button color="error" variant="outlined" style={{ marginRight: 10 }}>
            No
          </Button>
          <Button color="success" variant="contained">
            Yes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CopyCustomPageModal;

export function DeleteCustomPageModalConfirmation() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          // alignItems: "center",
          // justifyContent: "center",
          height: "auto",
          padding: 20
        }}
      >
        <h2>Delete "New Custom Page"</h2>
        <p style={{ marginBottom: 10 }}>
          You are about to remove <b>"MassEnergize Main Resource Page"</b>, are you sure?{" "}
        </p>
        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <div style={{ marginLeft: "auto" }}>
            <Button color="error" variant="outlined" style={{ marginRight: 10 }}>
              No
            </Button>
            <Button color="success" variant="contained">
              Yes
            </Button>
          </div>
        </div>
      </div>
    );
  }
  