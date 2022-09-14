import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import MediaLibrary from "../ME  Tools/media library/MediaLibrary";
import {
  reduxLoadGalleryImages,
  testRedux,
  universalFetchFromGallery,
} from "../../../redux/redux-actions/adminActions";
import { apiCall } from "../../../utils/messenger";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { makeLimitsFromImageArray } from "../../../utils/common";
import { Link } from "react-router-dom";
import GalleryFilter from "../Gallery/tools/GalleryFilter";
import { filters } from "../Gallery/Gallery";

const DEFAULT_SCOPE = ["all", "uploads", "actions", "events", "testimonials"];
export const FormMediaLibraryImplementation = (props) => {
  const {
    fetchImages,
    auth,
    imagesObject,
    putImagesInRedux,
    selected,
    tags,
  } = props;
  const [available, setAvailable] = useState(auth && auth.is_super_admin);
  const [selectedTags, setSelectedTags] = useState({ scope: DEFAULT_SCOPE });

  const loadMoreImages = (cb) => {
    if (!auth) return console.log("It does not look like you are signed in...");

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
      old: imagesObject,
      cb,
      append: true,
    });
  };

  const handleUpload = (files, reset, _, changeTabTo) => {
    const isUniversal = available ? { is_universal: true } : {};
    const apiJson = {
      user_id: auth.id,
      community_ids: ((auth && auth.admin_at) || []).map((com) => com.id),
      title: "Media library upload",
      ...isUniversal,
    };
    /**
     * Upload all selected files to the backend,
     * B.E will return the URL of all the images uploaded successfully,
     * Add the image urls to the list of items in the library locally, and change tabs
     * So that users see the effect of thier upload right away
     */
    Promise.all(
      files.map((file) => apiCall("/gallery.add", { ...apiJson, file: file }))
    )
      .then((response) => {
        var images = response.map(
          (res) => (res.data && res.data.image) || null
        );
        putImagesInRedux({
          data: makeLimitsFromImageArray(images),
          old: imagesObject,
          append: true,
          prepend: true,
        });
        reset();
        changeTabTo(MediaLibrary.Tabs.LIBRARY_TAB);
      })
      .catch((e) => {
        console.log("Sorry, there was a problem uploading some items...: ", e);
      });
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

  return (
    <div>
      <MediaLibrary
        images={(imagesObject && imagesObject.images) || []}
        actionText="Select From Library"
        sourceExtractor={(item) => item && item.url}
        renderBeforeImages={
          <GalleryFilter
            dropPosition="left"
            style={{
              marginLeft: 10,
              color: "#00BCD4",
              fontWeight: "bold",
            }}
            selections={selectedTags}
            onChange={(items) => {
              console.log("I tihkn I am the selected items", items);
              setSelectedTags(items);
            }}
            scopes={[{ name: "All", value: "all" }, ...filters]}
            tags={tags}
            label={
              <small style={{ marginRight: 7 }}>
                Add filters to tune your search
              </small>
            }
          />
        }
        useAwait={true}
        onUpload={handleUpload}
        uploadMultiple
        accept={MediaLibrary.AcceptedFileTypes.Images}
        multiple={false}
        extras={extras}
        {...props}
        loadMoreFunction={loadMoreImages}
      />
    </div>
  );
};

FormMediaLibraryImplementation.propTypes = {
  props: PropTypes,
};

const mapStateToProps = (state) => ({
  auth: state.getIn(["auth"]),
  imagesObject: state.getIn(["galleryImages"]),
  tags: state.getIn(["allTags"]),
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      fetchImages: universalFetchFromGallery,
      fireTestFunction: testRedux,
      putImagesInRedux: reduxLoadGalleryImages,
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
      {comms && is_community_admin && (
        <>
          <div>
            The images you upload here will be available to <b>{comms}</b>{" "}
          </div>
        </>
      )}
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
    </div>
  );
};
