import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import MediaLibrary from "../ME  Tools/media library/MediaLibrary";

export const FormMediaLibraryImplementation = (props) => {
  const {
    auth,
    modalImageResponse,
    loadModalImages,
    onInsert,
    imagesObject,
    handleInsert,
  } = props;
  return (
    <div>
      <MediaLibrary
        images={(imagesObject && imagesObject.images) || []}
        actionText="Choose From Library"
        sourceExtractor={(item) => item && item.url}
        excludeTabs={["upload"]}
        useAwait={true}
        {...props}
        onInsert={handleInsert}
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
  return bindActionCreators({}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormMediaLibraryImplementation);
