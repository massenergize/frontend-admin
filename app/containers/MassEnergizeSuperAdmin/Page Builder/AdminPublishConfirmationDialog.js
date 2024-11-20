import { Button } from "@mui/material";
import React from "react";

function AdminPublishConfirmationDialog() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "300px",
        padding: 15
      }}
    >
      <h2>Publish Confirmation</h2>
      <p style={{ margin: "10px 0px" }}>
        You are about to publish <b>"MassEnergize Main Resource Page"</b>, are you sure?{" "}
      </p>
      <div
        style={{ display: "flex", flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "center" }}
      >
        {/* <div style={{}}> */}
        <Button color="error" variant="outlined" style={{ marginRight: 10 }}>
          No
        </Button>
        <Button color="success" variant="contained">
          Yes
        </Button>
        {/* </div> */}
      </div>
    </div>
  );
}

export default AdminPublishConfirmationDialog;
