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

export const FormMediaLibraryImplementation = (props) => {
  const { fetchImages, auth, imagesObject, putImagesInRedux } = props;
  const [available, setAvailable] = useState(false);

  const loadMoreImages = (cb) => {
    if (!auth) return console.log("It does not look like you are signed in...");
    fetchImages({
      body: {
        any_community: true,
        filters: ["uploads", "actions", "events", "testimonials"],
        target_communities: [],
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
        images = images.sort((a, b) => (a.id > b.id ? 1 : -1));
        const data = {
          lower_limit: images[0].id,
          upper_limit: images[images.length - 1].id,
          images,
        };
        putImagesInRedux({
          data,
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
  return (
    <div>
      {comms && (
        <>
          {" "}
          <div>
            The images you upload here will be available to <b>{comms}</b>{" "}
          </div>
          <FormControlLabel
            label="Make the image(s) available to other communities"
            control={
              <Checkbox
                checked={available}
                onChange={() => setAvailableTo(!available)}
              />
            }
          />
        </>
      )}
    </div>
  );
};
