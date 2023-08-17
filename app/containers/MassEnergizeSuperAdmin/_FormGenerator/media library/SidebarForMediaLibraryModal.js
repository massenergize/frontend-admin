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
    setImageInfo(image)
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

  return (
    <>
      <Typography variant="body2" style={{ marginBottom: 5 }}>
        Uploaded by{" "}
        <b color="primary" style={{ color: "rgb(156, 39, 176)" }}>
          {(uploader && uploader.full_name) || "..."}
        </b>
      </Typography>

      {userCanDelete && (
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
              // NOw send the currently selected image to redux to be used in the mlib form
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
      )}
      {tags?.length ? (
        <div
          style={{
            padding: "15px 0px",
          }}
        >
          <Typography variant="body2" style={{ textDecoration: "underline" }}>
            <b>Related Tags</b>
          </Typography>
          <Typography variant="body2">
            {(tags || []).map((tag) => tag.name).join(", ")}
          </Typography>{" "}
        </div>
      ) : (
        <></>
      )}
      <ShowMoreInformationAboutImage
        imageInfos={imageInfos}
        image={image}
        putImageInfoInRedux={putImageInfoInRedux}
        imageInfo={imageInfo}
        setImageInfo={setImageInfo}
        isSuperAdmin={isSuperAdmin}
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
const ShowMoreInformationAboutImage = ({
  image,
  imageInfos,
  putImageInfoInRedux,
  imageInfo,
  setImageInfo,
  isSuperAdmin,
}) => {
  if (imageInfo === "loading") return <ProgressCircleWithLabel />;
  if (!imageInfo) return <></>;
  var informationAboutImage = (imageInfo && imageInfo.information) || {};
  var uploader = informationAboutImage.user;
  informationAboutImage = informationAboutImage.info || {};
  const guardian_info = informationAboutImage?.guardian_info;
  const {
    size_text,
    description,
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
      {(size_text || description || uploader) && (
        <div style={{ marginBottom: 5 }}>
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
              <Typography
                variant="body2"
                style={{ textDecoration: "underline" }}
              >
                <b>Description</b>
              </Typography>
              <Typography variant="body2">{description}</Typography>
            </>
          )}
        </div>
      )}

      <div
        style={{
          width: "100%",
          //   background: "#faebd74d",
          background: "rgb(232 232 232 / 30%)",
          border: "2px solid #e9e9e9",
          padding: 10,
          borderRadius: 4,
        }}
      >
        <Typography
          variant="body2"
          style={{ textDecoration: "none", fontWeight: "bold" }}
        >
          <i className="fa fa-copyright" />
          <span>opyright Information</span>
        </Typography>
        {!has_copyright_permission && !copyright_att ? (
          <Typography variant="caption">Not provided...</Typography>
        ) : (
          <Typography variant="caption">
            Image rights belong to <b>{permBelongsTo}</b>
          </Typography>
        )}

        <Typography
          variant="body2"
          style={{
            textDecoration: "none",
            fontWeight: "bold",
            // color: "#389a38",
            color: has_children ? "rgb(199 102 102)" : "#389a38",
          }}
        >
          <i className="fa fa-child" style={{ marginRight: 6 }} />
          <span>
            {has_children ? "Shows kids under 13" : "No kids under 13 shown"}
          </span>
        </Typography>
        {guardian_info && (
          <div>
            <Typography
              variant="body2"
              style={{
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              <span>Guardian Information</span>
            </Typography>
            <Typography variant="caption">{guardian_info}</Typography>
          </div>
        )}
      </div>
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
