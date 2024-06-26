import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
// import MediaLibrary from "../ME  Tools/media library/MediaLibrary";
import { useSelector } from "react-redux";
import MediaLibrary from "../_FormGenerator/media library/FormMediaLibraryImplementation";
import { isValidURL } from "../../../utils/common";

const PickLogo = ({ openLibrary, media }) => {
  const [img] = media || [];

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
      style={{
        padding: 10,
        width: 200,
        height: 100,
        marginTop: 10,
        objectFit: "contain",
        border: "dashed 1px #8e24aa45"
      }}
    />
  );
};
function BrandCustomization({ saveChanges, onChange, form, loading }) {
  const { link, media } = form || {};
  const imagesObject = useSelector((state) => state.getIn(["galleryImages"]));

  const linkIsValid = isValidURL(link);
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

      <MediaLibrary
        selected={media}
        onInsert={(item) => onChange("media", item)}
        images={imagesObject?.images}
        customRender={(props) => <PickLogo {...props} media={media} />}
      />
      {/* <div style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%" }}> */}
      <TextField
        inputProps={{ style: { padding: 10 } }}
        placeholder="Enter external URL..."
        InputLabelProps={{
          shrink: true
        }}
        onChange={(e) => onChange("link", e.target.value)}
        label="URL"
        value={link}
        style={{ width: "80%", marginTop: 15, marginBottom: 0 }}
      />

      {/* </div> */}

      <div
        style={{ display: "flex", alignItems: "center", marginTop: 10, paddingRight: 10 }}
        // style={{ display: "flex", alignItems: "center", marginLeft: 20, marginTop: 10, paddingRight: 20 }}
      >
        <Typography variant="caption" style={{ marginRight: 10 }}>
          {!link ? (
            <span>Logo will lead to the default homepage if no URL is provided </span>
          ) : (
            <span
              variant="body2"
              style={{
                marginTop: 5,
                fontWeight: "bold",
                color: linkIsValid ? "rgb(54 150 54)" : "rgb(205, 49, 49)"
              }}
            >
              <i className={`fa ${linkIsValid ? "fa-check-circle" : "fa-times-circle"}`} style={{ marginRight: 0 }} />{" "}
              URL should be like this{" "}
              <span style={{ textDecoration: "underline", fontWeight: "bold" }}>https://www.massenergize.org</span>
            </span>
          )}
        </Typography>
        {/* <Button disabled={loading} onClick={() => saveChanges()} variant="contained">
          {loading ? <i className="fa fa-spin fa-spinner" /> : "SAVE"}
        </Button> */}
      </div>

      <Button
        disabled={loading || (link && !linkIsValid)}
        style={{ marginTop: 5 }}
        onClick={() => saveChanges()}
        variant="contained"
      >
        {loading ? <i className="fa fa-spin fa-spinner" /> : "SAVE"}
      </Button>
    </div>
  );
}

export default BrandCustomization;
