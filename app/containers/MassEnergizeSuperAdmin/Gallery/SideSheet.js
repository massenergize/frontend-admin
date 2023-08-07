import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, CircularProgress, Paper, Typography } from "@mui/material";
import MediaLibrary from "./../ME  Tools/media library/MediaLibrary";
import "./anime.css";
import { ProgressCircleWithLabel } from "./utils";
import { Link, withRouter } from "react-router-dom";

export const SideSheet = (props) => {
  const { classes, hide, infos, data, deleteImage, is_super_admin } = props;
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const info = (data && data.relations) || {};
  var informationAboutImage = (data && data.information) || {};
  var uploader = informationAboutImage.user;
  informationAboutImage = informationAboutImage.info || {};
  const { size_text, description } = informationAboutImage;
  const getContent = () => {
    const isLoading = data && data === "loading";
    if (isLoading)
      return (
        <div className={classes.sideSheetInnerContainer}>
          <ProgressCircleWithLabel label="Loading info..." />
        </div>
      );
    if (!data)
      return (
        <div className={classes.sideSheetInnerContainer}>
          <Typography>No image info was found...</Typography>
        </div>
      );

    return (
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
              objectFit: "contain",
            }}
            imageSource={data.url}
          />
          <DeleteVerificationBox
            active={isDeleting}
            close={() => setIsDeleting(false)}
            onDelete={() => setIsDeleting(true)}
            loading={deleteLoading}
            onConfirm={() => {
              setDeleteLoading(true);
              deleteImage(data && data.id, () => {
                setIsDeleting(false);
                hide();
                console.log(`Your image(${data && data.id}) was deleted...`);
              });
            }}
          />
          {(size_text || description || uploader) && (
            <div style={{ marginBottom: 5, padding: 15 }}>
              <Typography variant="body2">
                <i>
                  Uploaded by <b>{(uploader && uploader.full_name) || "..."}</b>
                </i>
              </Typography>
              {size_text && (
                <Typography
                  variant="h6"
                  color="primary"
                  style={{
                    marginBottom: 6,
                    marginTop: 5,
                    fontSize: "0.875rem",
                  }}
                >
                  Size: {size_text}
                </Typography>
              )}
              {description && (
                <>
                  <Typography variant="body2">
                    <b>Description</b>
                  </Typography>
                  <Typography variant="body2">{description}</Typography>
                </>
              )}
            </div>
          )}
          <ShowTagsOnPane tags={data.tags || []} />
          {Object.keys(info).map((key, index) => {
            const imageInfo = {
              name: key,
              data: info[key] || {},
            };

            return (
              <React.Fragment key={index.toString()}>
                <ImageInfoArea {...imageInfo} is_super_admin={is_super_admin} />
              </React.Fragment>
            );
          })}
        </div>
        <HideButton
          hide={hide}
          style={{ position: "absolute", bottom: 0, width: "100%" }}
        />
      </div>
    );
  };

  return (
    <Paper
      className={`${classes.sideSheetWrapper} elevate-float anime-slide-in`}
      style={{ borderRadius: 0 }}
    >
      {getContent()}
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
    <div style={{ marginBottom: 10 }}>
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

const ImageInfoArea = ({ name, data = [], is_super_admin }) => {
  const desc =
    data.length === 0
      ? `No ${name}(s) use this image`
      : `${name}(s) that use this image : (${data.length})`;
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
                {is_super_admin ? (
                  <a
                    href={`/admin/edit/${item.id}/${name}`}
                    target="_blank"
                    style={{ color: "#00BCD4", fontWeight: "bold" }}
                  >
                    {index + 1}. {item.title || item.name}
                  </a>
                ) : (
                  <small style={{ color: "#00BCD4", fontWeight: "bold" }}>
                    {index + 1}. {item.title || item.name}
                  </small>
                )}
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

export default connect(mapStateToProps)(withRouter(SideSheet));

export const ShowTagsOnPane = ({ tags, style }) => {
  if (!tags || !tags.length) return <></>;
  return (
    <div
      style={{
        padding: "15px 0px",

        ...(style || {}),
      }}
    >
      <Typography variant="body2" style={{ textDecoration: "underline" }}>
        <b>Related Tags</b>
      </Typography>
      {/* <small style={{ color: "grey" }}>Tags</small> */}

      <Typography variant="body2">
        {(tags || []).map((tag) => tag.name).join(", ")}
      </Typography>
      {/* <br /> */}
      {/* {(tags || []).map((tag) => {
        return (
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            style={{ fontSize: 11, padding: "0px 5px", marginRight: 5 }}
          >
            {tag.name}
          </Button>
        );
      })} */}
    </div>
  );
};
