import { Button, TextField, Typography } from "@mui/material";
import React from "react";
// import MediaLibrary from "../ME  Tools/media library/MediaLibrary";
import { useSelector } from "react-redux";
import MediaLibrary from "../_FormGenerator/media library/FormMediaLibraryImplementation";

const PickLogo = ({ openLibrary, selected }) => {
  const [img] = selected || [];

  if (!img)
    return (
      <i
        onClick={() => openLibrary(true)}
        className="fa fa-upload touchable-opacity"
        style={{ fontSize: 50, color: "var(--app-purple)", marginTop: 10 }}
      />
    );
  return (
    <img
      onClick={() => openLibrary(true)}
      className="touchable-opacity"
      src={img?.url}
      alt="site logo"
      style={{ width: 200, height: 100, marginTop: 10, objectFit: "contain", border: "dashed 1px #8e24aa45" }}
    />
  );
};
function BrandCustomization() {
  const imagesObject = useSelector((state) => state.getIn(["galleryImages"]));
  return (
    <div
      style={{
        border: "dashed 1px #8e24aa45",
        padding: 15,
        width: "40%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: 300
      }}
    >
      <small>Click to select site logo</small>

      <MediaLibrary images={imagesObject?.images} customRender={(props) => <PickLogo {...props} />} />
      <TextField
        inputProps={{ style: { padding: 10 } }}
        placeholder="Enter external URL..."
        InputLabelProps={{
          shrink: true
        }}
        label="URL"
        style={{ width: "80%", marginTop: 15, marginBottom: 0 }}
      />

      <div
        style={{ display: "flex", alignItems: "center", marginTop: 10, paddingRight: 10 }}
        // style={{ display: "flex", alignItems: "center", marginLeft: 20, marginTop: 10, paddingRight: 20 }}
      >
        <Typography variant="caption" style={{ marginRight: 10 }}>
          Logo will lead to the default homepage if no URL is provided
        </Typography>
        <Button variant="contained">SAVE</Button>
      </div>
    </div>
  );
}

export default BrandCustomization;
