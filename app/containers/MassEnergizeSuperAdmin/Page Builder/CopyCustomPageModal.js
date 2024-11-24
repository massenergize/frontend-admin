import { Button } from "@mui/material";
import React from "react";

function CopyCustomPageModal({ close }) {
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
          <Button onClick={() => close && close()} color="error" variant="outlined" style={{ marginRight: 10 }}>
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

export function DeleteCustomPageModalConfirmation({ close, deleteFunction, data }) {
  const closeModal = () => close && close();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "auto",
        padding: 20
      }}
    >
      <h2>Delete Confirmation</h2>
      <p style={{ marginBottom: 0 }}>Are you sure you want to remove the following pages?</p>
      <ol>{data?.map((p) => <li style={{ fontWeight: "bold", color: "#db4646" }}>{p?.page?.title}</li>)}</ol>
      <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
        <div style={{ marginLeft: "auto" }}>
          <Button onClick={() => closeModal()} color="error" variant="outlined" style={{ marginRight: 10 }}>
            No
          </Button>
          <Button
            onClick={() => {
              deleteFunction();
              closeModal();
            }}
            color="success"
            variant="contained"
          >
            Yes
          </Button>
        </div>
      </div>
    </div>
  );
}
