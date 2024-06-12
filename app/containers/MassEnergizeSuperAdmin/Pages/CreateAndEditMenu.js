import { CheckBox } from "@mui/icons-material";
import { Button, FormControlLabel, TextField, Typography } from "@mui/material";
import React from "react";
import MEDropdown from "../ME  Tools/dropdown/MEDropdown";

function CreateAndEditMenu() {
  return (
    <div style={{ padding: 20, width: 500 }}>
      <Typography variant="h5" style={{ color: "var(--app-purple)", fontWeight: "bold" }} gutterBottom>
        Create New Menu Item
      </Typography>
      <div style={{ border: "dashed 1px #8e24aa45", padding: 20 }}>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: "5px 10px" }}>
          <div>
            <FormControlLabel control={<CheckBox />} style={{}} label="Is Live" />
          </div>

          <a href="#" variant="caption" style={{ marginLeft: "auto", color: "#cd3131", fontWeight: "bold" }}>
            {" "}
            Delete{" "}
          </a>
        </div>
        <TextField
          style={{ width: "100%", marginTop: 10 }}
          label="Name"
          placeholder="Name"
          InputLabelProps={{
            shrink: true
          }}
          inputProps={{ style: { padding: "10px 20px", width: "100%" } }}
          variant="outlined"
        />
        {/* ------- EXTERNAL & INTERNAL LINKS ----------- */}
        <div style={{ border: "dashed 1px #8e24aa45", padding: 20, margin: "10px 0px" }}>
          <div style={{ marginLeft: 10, marginBottom: 10 }}>
            <FormControlLabel control={<CheckBox />} style={{}} label="Internal" />
            <FormControlLabel control={<CheckBox />} style={{}} label="External" />
          </div>
          <div>
            <TextField
              style={{ width: "100%", marginTop: 10 }}
              label="URL"
              placeholder="Example: https://www.massenergize.org"
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{ style: { padding: "10px 20px", width: "100%" } }}
              variant="outlined"
            />
          </div>
        </div>

        <Typography variant="caption" style={{ margin: "10px 0px" }}>
          Parent (This menu will be a submenu if you choose a parent){" "}
        </Typography>

        <MEDropdown />

        {/* <Typography variant="caption" style={{ marginTop: 10 }}>
        
        </Typography> */}
        <TextField
          style={{ width: "100%", marginTop: 15 }}
          label="Order (Indicate the order of the menu item)"
          placeholder="Order Example: 1"
          InputLabelProps={{
            shrink: true
          }}
          inputProps={{ style: { padding: "10px 20px", width: "100%" } }}
          variant="outlined"
        />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
        <Button variant="contained" style={{ marginRight: 10, background: "#cd3131" }}>
          Cancel
        </Button>
        <Button variant="contained">OK</Button>
      </div>
    </div>
  );
}

export default CreateAndEditMenu;
