import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  reduxLoadGalleryImages,
  reduxLoadImageInfos,
  setImageForEditAction,
} from "../../../../redux/redux-actions/adminActions";
import { Typography } from "@mui/material";
import { ProgressCircleWithLabel } from "../../Gallery/utils";
import { deleteImage, getMoreInfoOnImage } from "../../Gallery/Gallery";
import { DeleteVerificationBox, ImageInfoArea } from "../../Gallery/SideSheet";
import { Link } from "react-router-dom";
import { getHumanFriendlyDate } from "../../../../utils/common";

export const SidebarForMediaLibraryModal = ({
  auth,
  imageInfos,
  image,
  putImageInfoInRedux,
  toggleSidePane,
  imagesObject,
  putImagesInRedux,
  putImageInReduxForEdit,
  changeTabTo,
}) => {
  const [imageInfo, setImageInfo] = useState("loading");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const isSuperAdmin = !auth?.is_community_admin && auth?.is_super_admin;

  useEffect(() => {
    setImageInfo(image);
    getMoreInfoOnImage({
      id: image && image.id,
      updateStateWith: setImageInfo,
      updateReduxWith: putImageInfoInRedux,
      imageInfos,
    });
  }, [image]);

  var informationAboutImage = (imageInfo && imageInfo.information) || {};
  var uploader = informationAboutImage.user;
  const tags = imageInfo?.tags;
  const userCanDelete = isSuperAdmin || uploader?.id === auth?.id;

  const imageData = () => {
    const { information } = imageInfo || {};
    const info = information?.info || {};

    return {
      ...imageInfo,
      ...(information || {}),
      id: imageInfo?.id,
      user_upload_id: information?.id,
      uploader: information?.user,
      ...info,
    };
  };

  const { created_at } = imageInfo || {};

  const communityString = () => {
    const { communities } = informationAboutImage;
    return (communities || []).map((c) => c.name).join(" ,");
  };

  const availableTo = communityString();

  const {
    size_text,
    description,
    has_copyright_permission,
    copyright_att,
    has_children,
    guardian_info,
  } = imageData();

  return (
    <>
      <InfoBox title="Details" hidden={!uploader} outlined>
        <Typography
          variant="body2"
          style={{ marginBottom: 5, fontWeight: "400" }}
        >
          Uploaded by{" "}
          <b color="primary" style={{ color: "rgb(156, 39, 176)" }}>
            {(uploader && uploader.full_name) || "..."}
          </b>{" "}
          on {getHumanFriendlyDate(created_at, true, false)}
        </Typography>
        {size_text && (
          <Typography
            variant="h6"
            style={{
              marginBottom: 6,
              fontSize: "0.875rem",
              fontWeight: "bold",
            }}
          >
            Size: {size_text}
          </Typography>
        )}
        {description && (
          <>
            <Typography variant="body2" style={{ textDecoration: "underline" }}>
              <b>Description</b>
            </Typography>
            <Typography
              variant="body2"
              style={{ fontWeight: "400", marginBottom: 10 }}
            >
              {description}
            </Typography>
          </>
        )}
      </InfoBox>
      <InfoBox title="Take Action" hidden={!userCanDelete}>
        <>
          <Link
            to="#"
            style={{
              color: "var(--app-cyan)",
              fontWeight: "bold",
              fontSize: "0.875rem",
              display: "block",
            }}
            onClick={(e) => {
              e.preventDefault();
              // Now send the currently selected image to redux to be used in the mlib form
              putImageInReduxForEdit(imageInfo);
              changeTabTo("upload-form");
              toggleSidePane(false);
            }}
          >
            Edit Image Details
          </Link>
          <DeleteVerificationBox
            active={isDeleting}
            close={() => setIsDeleting(false)}
            onDelete={() => setIsDeleting(true)}
            loading={deleteLoading}
            onConfirm={() => {
              setDeleteLoading(true);
              deleteImage(
                image?.id,
                () => {
                  setIsDeleting(false);
                  toggleSidePane();
                  console.log(`Your image(${image?.id}) was deleted...`);
                },
                { oldData: imagesObject, putNewListInRedux: putImagesInRedux }
              );
            }}
          />
        </>
      </InfoBox>

      <InfoBox title="Available to" outlined hidden={!availableTo}>
        <Typography variant="body2">{availableTo}</Typography>
      </InfoBox>

      <InfoBox title="Related Keywords" outlined hidden={!tags?.length}>
        <Typography variant="body2">
          {(tags || []).map((tag) => tag.name).join(", ")}
        </Typography>{" "}
      </InfoBox>

      <InfoBox title="Copyright Information" hidden={false}>
        <>
          {!has_copyright_permission ? (
            <Typography variant="body2">Not provided...</Typography>
          ) : (
            <>
              <Typography variant="body2">
                <b>{uploader?.preferred_name}</b> has permission to upload this
                image
              </Typography>
              {copyright_att ? (
                <Typography variant="body2">
                  Image rights belong to <b>{copyright_att}</b>
                </Typography>
              ) : (
                <></>
              )}
            </>
          )}
        </>
      </InfoBox>
      <InfoBox
        title="Underage Information"
        color={has_children ? "#d31919" : "green"}
        hidden={false}
      >
        <>
          <Typography
            variant="body2"
            style={{
              textDecoration: "none",
              fontWeight: "500",
              color: has_children ? "#d31919" : "#389a38",
            }}
          >
            <i className="fa fa-child" style={{ marginRight: 6 }} />
            <span>
              <b>
                {" "}
                {has_children
                  ? "Shows kids under 13"
                  : "No kids under 13 shown"}
              </b>
            </span>
          </Typography>
          {guardian_info && (
            <div>
              <Typography
                variant="body2"
                style={{
                  textDecoration: "underline",
                  marginTop: 6,
                }}
              >
                <span style={{ fontWeight: "500" }}>Guardian Information</span>
              </Typography>
              <Typography style={{ fontWeight: "400" }} variant="body2">
                {guardian_info}
              </Typography>
            </div>
          )}
        </>
      </InfoBox>

      <ShowMoreInformationAboutImage
        imageInfos={imageInfos}
        image={image}
        putImageInfoInRedux={putImageInfoInRedux}
        imageInfo={imageInfo}
        setImageInfo={setImageInfo}
        isSuperAdmin={isSuperAdmin}
        auth={auth}
      />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    imageInfos: state.getIn(["imageInfos"]),
    auth: state.getIn(["auth"]),
    imagesObject: state.getIn(["galleryImages"]),
  };
};

const dispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      putImageInfoInRedux: reduxLoadImageInfos,
      putImagesInRedux: reduxLoadGalleryImages,
      putImageInReduxForEdit: setImageForEditAction,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  dispatchToProps
)(SidebarForMediaLibraryModal);

// --------------------------------------------------------
const ShowMoreInformationAboutImage = ({ auth, imageInfo, isSuperAdmin }) => {
  if (imageInfo === "loading") return <ProgressCircleWithLabel />;
  if (!imageInfo) return <></>;
  var informationAboutImage = (imageInfo && imageInfo.information) || {};
  var uploader = informationAboutImage.user;
  informationAboutImage = informationAboutImage.info || {};
  const guardian_info = informationAboutImage?.guardian_info;
  const {
    has_children,
    has_copyright_permission,
    copyright_att,
  } = informationAboutImage;
  const permBelongsTo = has_copyright_permission
    ? auth?.preferred_name || "..."
    : copyright_att;

  const relations = imageInfo?.relations || {};

  return (
    <>
      <div>
        <br />
        <Typography
          variant="body2"
          style={{ textDecoration: "underline", marginBottom: 10 }}
        >
          <b>Image Usage</b>
        </Typography>
        {Object.keys(relations).map((key, index) => {
          const imageInfo = {
            name: key,
            data: relations[key] || {},
          };

          return (
            <React.Fragment key={index.toString()}>
              <ImageInfoArea {...imageInfo} is_super_admin={isSuperAdmin} />
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};

const InfoBox = ({
  title,
  children,
  color,
  hidden = false,
  outlined = false,
}) => {
  if (hidden) return <></>;
  // color = color || "var(--app-purple)";
  color = color || "#363738";
  const _default = {
    background: color,
    padding: "6px 15px",
    borderRadius: 3,
    color: "white",
    fontWeight: "500",
  };

  const outlineStyle = {
    border: `solid 2px ${color}`,
    background: "white",
    color,
  };

  const theme = outlined ? outlineStyle : {};
  return (
    <div
      style={{
        marginBottom: 10,
        background: "#FCFCFC",
        marginTop: 6,
      }}
    >
      <Typography variant="body2" style={{ ..._default, ...theme }}>
        {title}
      </Typography>

      <div style={{ padding: 10 }}>{children}</div>
    </div>
  );
};
