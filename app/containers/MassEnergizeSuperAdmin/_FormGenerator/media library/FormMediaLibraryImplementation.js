import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import MediaLibrary from "../../ME  Tools/media library/MediaLibrary";
import {
  reduxAddToGalleryImages,
  reduxLoadGalleryImages,
  reduxLoadImageInfos,
  setImageForEditAction,
  testRedux,
  universalFetchFromGallery,
} from "../../../../redux/redux-actions/adminActions";
import { apiCall } from "../../../../utils/messenger";
import { Checkbox, FormControlLabel, Typography, Tooltip } from "@mui/material";
import { makeLimitsFromImageArray } from "../../../../utils/common";
import { ProgressCircleWithLabel } from "../../Gallery/utils";
import { getMoreInfoOnImage } from "../../Gallery/Gallery";
//import { Link } from "react-router-dom";
import GalleryFilter from "../../Gallery/tools/GalleryFilter";
import { filters } from "../../Gallery/Gallery";
import { ShowTagsOnPane, ImageInfoArea } from "../../Gallery/SideSheet";
import MediaLibraryForm from "./MediaLibraryForm";
import { getFileSize } from "../../ME  Tools/media library/shared/utils/utils";
import SidebarForMediaLibraryModal from "./SidebarForMediaLibraryModal";
import FilterBarForMediaLibrary from "./FilterBarForMediaLibrary";

const DEFAULT_SCOPE = ["all", "uploads", "actions", "events", "testimonials"];
export const FormMediaLibraryImplementation = (props) => {
  const {
    fetchImages,
    auth,
    imagesObject,
    putImagesInRedux,
    tags,
    selected,
    defaultValue,
    addOnToWhatImagesAreInRedux,
    communities,
    sendImageToReduxForEdit,
    imageForEdit,
    imageInfos,
    putImageInfosInRedux,
  } = props;
  const [available, setAvailable] = useState(auth && auth.is_super_admin);
  const [selectedTags, setSelectedTags] = useState({ scope: DEFAULT_SCOPE });
  const [queryHasChanged, setQueryHasChanged] = useState(false);
  const [userSelectedImages, setUserSelectedImages] = useState([]);
  const [mlibraryFormData, setmlibraryFormData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [outsideNotification, setOutsideNotification] = useState(null);
  const isInEditMode = imageForEdit;
  const notify = (message, error = false, extras) => {
    const obj = {
      message: message,
      // loading: true,
      theme: { background: error ? "#c30707" : "green" },
      textTheme: { color: "white" },
      close: () => setOutsideNotification(null),
      ...(extras || {}),
    };
    setOutsideNotification(obj);
  };
  const fetchNeededImages = (ids, cb) => {
    setOutsideNotification({
      message: "Finding selected images that are not here yet...",
      loading: true,
      theme: { background: "green" },
      textTheme: { color: "white" },
      close: () => setOutsideNotification(null),
    });
    apiCall("/gallery.find", { ids }).then((response) => {
      setOutsideNotification(null);
      if (!response.success) {
        setError(response.error);
        return console.log("Error finding images from B.E", response.error);
      }
      cb && cb(response.data);
    });
  };

  const useIdsToFindObjs = (ids) => {
    const images = imagesObject.images;

    if (!ids.length) return;
    var bank = (images || []).map((img) => img.id);
    // sometimes an image that is preselected, may not be in the library's first load
    // in that case just add it to the library's list
    var isNotThere = selected.filter((img) => !bank.includes(img));
    const alreadyAvailableHere = images.filter((img) => ids.includes(img.id)); // Needed because there is a chance that some might be available in the list, but not all

    if (isNotThere?.length)
      // only run this if some items are not found in the already loaded redux content
      return fetchNeededImages(ids, (fromBackend) => {
        const together = [...alreadyAvailableHere, ...(fromBackend || [])];
        addOnToWhatImagesAreInRedux({ old: imagesObject, data: fromBackend });
        setUserSelectedImages(together);
      });

    if (alreadyAvailableHere.length)
      //all items were found here, so we move without any B.E requests
      setUserSelectedImages(alreadyAvailableHere);
  };

  useEffect(() => {
    // The value of "preselected" could either be a list of numbers(ids), or a list of objects(json image objects from backend)
    // This happens because when the page loads afresh, and we pass down images as default value in some "formGenerator JSON", it comes in as objects
    // But then when the user goes around and selects images from the library, the form generator is setup to only
    // make use of the ID values on the image objects (because that is all we need to send to the backend)
    let preselected = selected || defaultValue;
    if (!preselected || !preselected.length) return;
    // so over here all that is happening is:
    // We are checking if the items that are preselected have come as objects. If they are objects,
    // then we know we can easily check them on the list right away
    // If they are not, we use the id to fetch them as objects and put them in the list
    const theyAreImageObjects = typeof preselected[0] !== "number";
    const justResetting = preselected[0] === "reset";
    if (theyAreImageObjects) {
      preselected = preselected.map((img) => img.id);
      // addOnToWhatImagesAreInRedux({ old: imagesObject, data: preselected });
      // return setUserSelectedImages(preselected);
    }
    // if (!justResetting) setUserSelectedImages(preselected);
    if (!justResetting) useIdsToFindObjs(preselected);
  }, [selected, defaultValue]);

  const loadMoreImages = (cb) => {
    if (!auth) return console.log("It does not look like you are signed in...");
    notify("Collecting more images...", false, {
      loading: true,
      type: "loading-more",
    });
    const scopes = (selectedTags.scope || []).filter((s) => s != "all");
    var tags = Object.values(selectedTags.tags || []);
    var spread = [];
    for (let t of tags) spread = [...spread, ...t];

    fetchImages({
      body: {
        any_community: auth.is_super_admin && !auth.is_community_admin,
        filters: scopes,
        target_communities: (auth.admin_at || []).map((c) => c.id),
        tags: spread,
      },
      old: queryHasChanged ? {} : imagesObject,
      cb: () => {
        setOutsideNotification(null);
        cb && cb();
        setQueryHasChanged(false);
      },
      append: !queryHasChanged, //Query Changes? Dont append new  content retrieved. If it doesnt, append all new search results
    });
  };

  // As of 1st August 2023, handleUpload is not what actually does the upload
  // Now, it just switches to the media library form. And the context button there is what validates the form, and process to upload & insert if all checks out
  const handleUpload = ({ changeTabTo }) => {
    sendImageToReduxForEdit(null); // Empty whatever value is in there before switching
    changeTabTo("upload-form");
  };

  const doUpload = ({
    files,
    reset,
    changeTabTo,
    insertSelectedImages,
    json,
  }) => {
    const isUniversal = available ? { is_universal: true } : {};
    const apiJson = {
      user_id: auth.id,
      // community_ids: ((auth && auth.admin_at) || []).map((com) => com.id),
      // title: "Media library upload",
      ...isUniversal,
      ...(json || {}),
    };
    setUploading(true);

    /**
     * Upload all selected files to the backend,
     * B.E will return the URL of all the images uploaded successfully,
     * Add the image urls to the list of items in the library locally, and change tabs
     * So that users see the effect of thier upload right away
     */
    Promise.all(
      files.map((file) => {
        const info = {
          title: file?.name + "-media library upload",
          size: file?.size?.toString(),
          size_text: getFileSize(file),
        };
        return apiCall("/gallery.add", { ...apiJson, ...info, file: file });
      })
    )
      .then((response) => {
        setUploading(false);
        var images = response.map(
          (res) => (res.data && res.data.image) || null
        );
        putImagesInRedux({
          data: makeLimitsFromImageArray(images),
          old: imagesObject,
          append: true,
          prepend: true,
        });
        insertSelectedImages(images, response);
        // reset();
        // changeTabTo(MediaLibrary.Tabs.LIBRARY_TAB);
      })
      .catch((e) => {
        setUploading(false);
        console.log("Sorry, there was a problem uploading some items...: ", e);
      });
  };

  const saveImageEdits = ({ json, toggleSidePane, changeTabTo }) => {
    setUploading(true);
    setOutsideNotification(null);
    apiCall("/gallery.item.edit", {
      ...json,
      user_upload_id: imageForEdit?.information?.id,
      media_id: imageForEdit?.id,
    })
      .then((response) => {
        setUploading(false);
        if (!response.success) return notify(response.error, true);
        putImageInfosInRedux({ oldInfos: imageInfos, newInfo: response.data });
        toggleSidePane(true);
        changeTabTo(MediaLibrary.Tabs.LIBRARY_TAB);
      })
      .catch((e) => {
        setUploading(false);
        console.log("ERROR_UPDATING_ITEM_DETAILS", e.toString());
      });
  };

  const uploadAndSaveForm = (props) => {
    const train = {
      ...props,
      json: { ...mlibraryFormData, user_id: auth?.id },
    };
    if (isInEditMode) return saveImageEdits(train);
    doUpload(train);
  };
  const liveFormValidation = () => {
    const { copyright, copyright_att } = mlibraryFormData || {};
    if (!copyright && !copyright_att)
      return {
        invalid: true,
        message:
          "Please indicate who owns the item(s) if you dont have permission to use",
      };
    return {
      invalid: false,
      message: isInEditMode
        ? "Your changes will be saved when you click here"
        : "Items will be uploaded and inserted when you click",
    };
  };

  const buttonText = () => {
    if (isInEditMode && !uploading) return "UPDATE";
    if (isInEditMode && uploading) return "UPDATING...";

    if (uploading) return "UPLOADING...";
    return "UPLOAD & INSERT";
  };

  const extras = {
    [MediaLibrary.Tabs.UPLOAD_TAB]: (
      <UploadIntroductionComponent
        auth={auth}
        available={available}
        setAvailableTo={setAvailable}
      />
    ),
  };

  const validation = liveFormValidation();

  const renderOnFooter = ({ currentTab }) => {
    const isOnLibraryTab = currentTab === MediaLibrary.Tabs.LIBRARY_TAB;
    const loadingMore = outsideNotification?.type === "loading-more";
    const images = imagesObject?.images || [];
    if (isOnLibraryTab)
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MediaLibrary.Button
            disabled={loadingMore}
            backColor="#363738"
            onClick={() => {
              loadMoreImages();
            }}
          >
            LOAD MORE
          </MediaLibrary.Button>
          <small style={{ fontWeight: "bold", marginLeft: 15 }}>
            <i className="fa fa-images" /> {(images && images.length) || 0}{" "}
            items
          </small>
        </div>
      );
  };
  return (
    <div>
      <MediaLibrary
        renderOnFooter={renderOnFooter}
        passedNotification={outsideNotification}
        defaultTab={MediaLibrary.Tabs.UPLOAD_TAB}
        images={(imagesObject && imagesObject.images) || []}
        actionText="Select From Library"
        sourceExtractor={(item) => item && item.url}
        renderBeforeImages={(props) => (
          <FilterBarForMediaLibrary {...props} />
          // <GalleryFilter
          //   {...props}
          //   dropPosition="left"
          //   style={{
          //     marginLeft: 10,
          //     color: "#00BCD4",
          //     fontWeight: "bold",
          //   }}
          //   selections={selectedTags}
          //   onChange={(items) => {
          //     setSelectedTags(items);
          //     setQueryHasChanged(true);
          //   }}
          //   scopes={[{ name: "All", value: "all" }, ...filters]}
          //   tags={tags}
          //   label={
          //     <small style={{ marginRight: 7 }}>
          //       Add filters to tune your search
          //     </small>
          //   }
          //   reset={() => setSelectedTags({})}
          //   apply={loadMoreImages}
          // />
        )}
        insertAfterUpload
        useAwait={true}
        onUpload={handleUpload}
        uploadMultiple
        accept={MediaLibrary.AcceptedFileTypes.Images}
        multiple={false}
        extras={extras}
        sideExtraComponent={(props) => (
          <SidebarForMediaLibraryModal {...props} />
        )}
        TooltipWrapper={({ children, title, placement }) => {
          return (
            <Tooltip title={title} placement={placement || "top"}>
              {children}
            </Tooltip>
          );
        }}
        tabModifiers={{
          [MediaLibrary.Tabs.LIBRARY_TAB]: {
            name: "Choose From Library",
          },
        }}
        {...props}
        selected={userSelectedImages}
        loadMoreFunction={loadMoreImages}
        customTabs={[
          {
            tab: {
              headerName: "About Image",
              key: "upload-form",
              onlyShowOnDemand: true,
              order: 1,
              component: (props) => (
                <MediaLibraryForm
                  {...props}
                  auth={auth}
                  onChange={(data) => setmlibraryFormData(data)}
                  communities={communities}
                />
              ),
            },
            renderContextButton: (props) => (
              <MediaLibrary.Button
                loading={uploading}
                disabled={validation?.invalid || uploading}
                onClick={(e) => {
                  e?.preventDefault();
                  uploadAndSaveForm(props);
                }}
              >
                <Tooltip title={validation?.message} placement="top">
                  {/* {uploading ? "UPLOADING..." : "UPLOAD & INSERT"} */}
                  {buttonText()}
                </Tooltip>
              </MediaLibrary.Button>
            ),
          },
        ]}
      />
    </div>
  );
};

FormMediaLibraryImplementation.propTypes = {
  props: PropTypes.object,
};

const mapStateToProps = (state) => ({
  auth: state.getIn(["auth"]),
  imagesObject: state.getIn(["galleryImages"]),
  tags: state.getIn(["allTags"]),
  communities: state.getIn(["communities"]),
  imageForEdit: state.getIn(["imageBeingEdited"]),
  imageInfos: state.getIn(["imageInfos"]),
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      fetchImages: universalFetchFromGallery,
      fireTestFunction: testRedux,
      putImagesInRedux: reduxLoadGalleryImages,
      addOnToWhatImagesAreInRedux: reduxAddToGalleryImages,
      sendImageToReduxForEdit: setImageForEditAction,
      putImageInfosInRedux: reduxLoadImageInfos,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormMediaLibraryImplementation);

const UploadIntroductionComponent = ({ auth, setAvailableTo, available }) => {
  const comms = (auth.admin_at || []).map((c) => c.name).join(", ");
  const is_community_admin =
    auth && auth.is_community_admin && !auth.is_super_admin;

  return (
    <div>
      <Typography variant="body">
        After selecting items, click <b>"Continue"</b>. You will be asked to
        provide a few details about your items before uploading
      </Typography>
      {/* {comms && is_community_admin && (
        <>
          <div>
            The images you upload here will be available to <b>{comms}</b>{" "}
          </div>
        </>
      )} */}
      {/* we are disabling sharing images to other communities for now
      {is_community_admin && (
        <FormControlLabel
          label="Make the image(s) available to other communities"
          control={
            <Checkbox
              checked={available}
              onChange={() => setAvailableTo(!available)}
            />
          }
        />
      )}
       <div>
        <Link to="/admin/gallery/add">
          Upload an image for specific communities instead
        </Link>
        </div> 
        */}
    </div>
  );
};
