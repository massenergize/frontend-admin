import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, CircularProgress, Paper, Typography } from "@material-ui/core";
import MediaLibrary from "./../ME  Tools/media library/MediaLibrary";
import "./anime.css";

const imageInfo = [
  { name: "event", data: [], plural: "events" },
  { name: "action", data: [], plural: "actions" },
  { name: "testimonial", data: [], plural: "testimonials" },
  { name: "community", data: [], plural: "communities" },
];

export const SideSheet = (props) => {
  const { classes, hide } = props;

  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <Paper
      className={`${classes.sideSheetWrapper} elevate-float anime-slide-in`}
    >
      <div style={{ position: "relative", height: "100%" }}>
        <div className={classes.sideSheetContainer}>
          <HideButton hide={hide} />
          <MediaLibrary.Image
            style={{
              margin: 0,
              width: "100%",
              height: 230,
              borderWidth: 0,
              padding: 0,
              borderRadius: 0,
            }}
          />
          <DeleteVerificationBox
            active={isDeleting}
            onDelete={() => setIsDeleting(true)}
          />
          {imageInfo.map((info, ind) => {
            return (
              <React.Fragment key={ind}>
                <ImageInfoArea {...info} />
              </React.Fragment>
            );
          })}
        </div>
        <HideButton
          hide={hide}
          style={{ position: "absolute", bottom: 0, width: "100%" }}
        />
      </div>
    </Paper>
  );
};

const DeleteVerificationBox = ({
  onDelete,
  active = false,
  close,
  onConfirm,
  loading,
}) => {
  if (loading)
    return (
      <div style={{ width: "100%", textAlign: "center", margin: 5 }}>
        <CircularProgress />
      </div>
    );

  if (!active)
    return (
      <Button
        onClick={() => onDelete && onDelete()}
        variant="contained"
        style={{ borderRadius: 0, background: "#c95353", color: "white" }}
      >
        Delete
      </Button>
    );

  return (
    <div>
      <Typography style={{ padding: "5px 15px" }}>
        Are you sure you want to delete this image?
      </Typography>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          borderRadius: 0,
        }}
      >
        <Button
          variant="contained"
          style={{ borderRadius: 0, background: "#c95353" }}
          color="secondary"
          onClick={() => close && close()}
        >
          NO
        </Button>
        <Button
          variant="contained"
          style={{ borderRadius: 0, background: "Green", color: "white" }}
          onClick={() => onConfirm && onConfirm()}
        >
          YES
        </Button>
      </div>
    </div>
  );
};

const ImageInfoArea = ({ name, data = [], plural }) => {
  name = data.length === 1 ? name : plural;
  const desc =
    data.length > 0
      ? `This image is used in ${data.length} ${name}`
      : `No ${plural} use this image`;
  return (
    <div style={{}}>
      <div>
        <div
          style={{
            padding: "5px 15px",
            border: "solid 0px #f7f7f7",
            borderBottomWidth: 1,
            borderTopWidth: 1,
          }}
        >
          <Typography
            variant="h6"
            style={{ fontSize: 14, textTransform: "uppercase" }}
          >
            {name}
          </Typography>
          <Typography style={{ fontSize: 12 }}>{desc}</Typography>
        </div>

        <div style={{ padding: "6px 15px" }}>
          {data.map((item, index) => {
            return (
              <div style={{ width: "100%" }} key={index.toString()}>
                <small>
                  This is some community that you can view and go do something
                  there...
                </small>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <a href="#void">
                    <small>See in admin</small>
                  </a>
                  <a href="#void" style={{ marginLeft: "auto" }}>
                    <small>See on portal</small>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const HideButton = ({ style = {}, hide }) => {
  return (
    <Button
      onClick={() => hide && hide()}
      color="primary"
      variant="contained"
      style={{ borderRadius: 0, ...style }}
    >
      HIDE
    </Button>
  );
};
SideSheet.propTypes = {
  props: PropTypes,
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideSheet);
