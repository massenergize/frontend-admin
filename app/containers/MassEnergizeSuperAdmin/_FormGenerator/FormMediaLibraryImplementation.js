import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import MediaLibrary from "../ME  Tools/media library/MediaLibrary";
import {
  reduxFetchImagesFromGallery,
  universalFetchFromGallery,
} from "../../../redux/redux-actions/adminActions";

export const FormMediaLibraryImplementation = (props) => {
  const { fetchImages, auth, onInsert, imagesObject, handleInsert } = props;
  console.log("I am the image object I think", imagesObject);
  const loadMoreImages = (cb) => {
    if (!auth) return;
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
  return (
    <div>
      <MediaLibrary
        images={(imagesObject && imagesObject.images) || []}
        actionText="Select From Library"
        sourceExtractor={(item) => item && item.url}
        useAwait={true}
        {...props}
        onInsert={handleInsert}
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
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormMediaLibraryImplementation);
