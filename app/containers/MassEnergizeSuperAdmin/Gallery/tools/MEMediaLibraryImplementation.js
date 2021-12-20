import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MediaLibrary from "../../ME  Tools/media library/MediaLibrary";
import { reduxCallLibraryModalImages } from "../../../../redux/redux-actions/adminActions";

export const MEMediaLibraryImplementation = (props) => {
  const { auth, modalImageResponse, loadModalImages, onInsert } = props;

  const makeCommunityListParamsForFetch = () => {
    const obj = { community_ids: [], from_all_communities: false };
    if (!auth) return obj;
    if (auth.is_super_admin) return { ...obj, from_all_communities: true };
    if (auth.is_community_admin) {
      const coms = (auth.admin_at || []).map((com) => com.id);
      return { ...obj, community_ids: coms };
    }
    return obj;
  };

  const handleInsert = (files) => {
    if (!onInsert) return;
    onInsert((files || []).map((img) => img.id));
  };

  const makeLoadMoreFunction = (cb) => {
    loadModalImages({
      old: modalImageResponse,
      ...makeCommunityListParamsForFetch(),
      cb,
    });
  };

  useEffect(() => {
    loadModalImages({
      old: modalImageResponse,
      ...makeCommunityListParamsForFetch(),
    });
  }, []);

  return (
    <div>
      <MediaLibrary
        images={(modalImageResponse && modalImageResponse.images) || []}
        actionText="Choose From Library"
        sourceExtractor={(item) => item && item.url}
        excludeTabs={["upload"]}
        useAwait={true}
        {...props}
        onInsert={handleInsert}
        loadMoreFunction={makeLoadMoreFunction}
      />
    </div>
  );
};

MEMediaLibraryImplementation.propTypes = {
  props: PropTypes,
};

const mapStateToProps = (state) => ({
  modalImageResponse: state.getIn(["modalLibraryImages"]),
  auth: state.getIn(["auth"]),
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    { loadModalImages: reduxCallLibraryModalImages },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MEMediaLibraryImplementation);
