import { RadioGroup, Typography } from "@mui/material";

import Paper from "@mui/material/Paper";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { apiCall } from "../../../utils/messenger";
import MediaLibrary from "../ME  Tools/media library/MediaLibrary";
import LightAutoComplete from "./tools/LightAutoComplete";
import { Radio } from "@mui/material";
import { FormControlLabel } from "@mui/material";
import { TextField } from "@mui/material";
import { bindActionCreators } from "redux";
import {
  reduxAddToGalleryImages,
  reduxAddToSearchedImages,
  reduxCallLibraryModalImages,
} from "../../../redux/redux-actions/adminActions";
import {
  getFileSize,
  smartString,
} from "../ME  Tools/media library/shared/utils/utils";
import MEDropdown from "../ME  Tools/dropdown/MEDropdown";
import {withStyles} from '@mui/styles'
import PapperBlock from "../../../components/PapperBlock/PapperBlock";
import { fetchParamsFromURL } from "../../../utils/common";
import { makeStyles, } from "@mui/styles";

  const error = {
    background: "rgb(255, 214, 214)",
    color: "rgb(170, 28, 28)",
    width: "100%",
    marginTop: 6,
    padding: "16px 25px",
    borderRadius: 5,
    cursor: "pointer",
  };

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
    borderRadius: 5,
  },
  error: {
    background: "rgb(255, 214, 214)",
    color: "rgb(170, 28, 28)",
    width: "100%",
    marginTop: 6,
    padding: "16px 25px",
    borderRadius: 5,
    cursor: "pointer",
  },
  header: {
    marginBottom: theme.spacing(2),
  },
  dropdownArea: {
    marginBottom: theme.spacing(1),
  },
  success: {
    ...error,
    background: "rgb(174, 223, 174)",
    color: "rgb(12, 131, 30)",
  }
}));


const UPLOAD_URL = "/gallery.add";
const CHOICES = { MINE: "MINE", ALL: "ALL", SPECIFIC: "SPECIFIC" };
const defaultState = {
  notification_msg: null,
  notification_type: null,
  title: null,
};

function AddToGallery(props) {
  const {
    auth,
    communities = [],
    loadMoreModalImages,
    loadModalImages,
    modalImages,
    tags,
    location,
    history,
    addImageToGalleryList,
    addImageToSearchedList,
    imagesFromGallery,
    imagesFromSearchResults,
  } = props;

   const classes = useStyles();

  const [chosenComs, setChosenComs] = useState([]);
  const [scope, setScope] = useState(CHOICES.SPECIFIC);
  const [state, setState] = useState(defaultState);
  const [resetAutoComplete, setResetorForAutoComplete] = useState(null);
  const [showTagAddingBox, setShowTagAddingBox] = useState(false);
  const [needsToReturn, setNeedsToReturn] = useState(false); // user needs to return to the page they came from
  const [addedTags, setAddedTags] = useState({});
  const superAdmin = auth && auth.is_super_admin;

  const getCommunityList = () => {
    if (auth && auth.is_super_admin) return communities;
    if (auth && auth.is_community_admin) return auth.communities;
    return [];
  };

  const resetThisComponent = () => {
    setChosenComs([]);
    setScope(CHOICES.SPECIFIC);
    setState({ title: null });
    if (resetAutoComplete) resetAutoComplete();
  };

  const list = getCommunityList();

  const cleanCommunities = () => {
    var coms = coms || chosenComs || [];
    if (scope === CHOICES.MINE) coms = auth.admin_at;
    return coms.map((com) => com.id);
  };

  const notify = (message, type) => {
    setState((prev) => ({
      ...prev,
      notification_type: type,
      notification_msg: message && message.toString(),
    }));
  };

  const onUpload = (files, reset, closeModal) => {
    const file = files[0] || null;
    let tags = Object.entries(addedTags).map(([_, _tags]) => _tags);
    let spread = [];
    for (let _tags of tags) spread = [...spread, ..._tags];
    const apiJson = {
      user_id: auth.id,
      file, // TODO: allow multiple
      community_ids: cleanCommunities(),
      is_universal: scope === CHOICES.ALL,
      scope: scope,
      title: smartString(state.title, 27),
      size: (file && file.size) || null,
      size_text: getFileSize(file),
      description: state.title,
      tags: spread,
    };

    apiCall(UPLOAD_URL, apiJson)
      .then((response) => {
        if (!response.success) {
          console.log("UPLOADRESPONSEERROR:", response.error);
          notify(response.error.message, "error");
          return;
        }
        addImageToGalleryList({
          old: imagesFromGallery,
          data: [response.data.image],
        });
        addImageToSearchedList({
          old: imagesFromSearchResults,
          data: [response.data.image],
        });
        resetThisComponent();
        notify("Upload to library was successful!", "success");
        reset();
        closeModal();
        setAddedTags({});
      })
      .catch((e) => console.log("UPLOADERROR: ", e));
  };

  const handleOnChange = (e, name) => {
    const value = e.target.value;
    setState((state) => ({ ...state, [name]: value }));
  };

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

  const makeLoadMoreFunction = (cb) => {
    loadMoreModalImages({
      old: modalImages,
      ...makeCommunityListParamsForFetch(),
      cb,
    });
  };

  useEffect(() => {
    const { tmb } = fetchParamsFromURL(location, "tmb"); // tmb: take me back
    setNeedsToReturn(tmb);

    loadModalImages({
      old: modalImages,
      ...makeCommunityListParamsForFetch(),
    });
  }, []);

  const isError = state.notification_type === "error";
  return (
    <PapperBlock>
      <Typography variant="h5" className={classes.header}>
        Add an image to your community's library{" "}
      </Typography>
      <RadioGroup
        aria-label="Upload choices"
        name="upload-choices"
        onChange={(e) => setScope(e.target.value)}
        value={scope}
      >
        <FormControlLabel
          value={CHOICES.MINE}
          control={<Radio />}
          label="Make this available to all communities I manage"
        />
        <FormControlLabel
          value={CHOICES.ALL}
          control={<Radio />}
          label="Make this available to any community"
        />
        <FormControlLabel
          value={CHOICES.SPECIFIC}
          control={<Radio />}
          label="I want to choose specific communities"
        />
      </RadioGroup>

      {scope === CHOICES.SPECIFIC && (
        <div className={classes.dropdownArea}>
          <Typography variant="small" style={{ marginBottom: 5 }}>
            Which community is this upload related to?
          </Typography>
          <LightAutoComplete
            classes={classes}
            data={communities}
            valueExtractor={(com) => com.id}
            labelExtractor={(com) => com.name}
            onChange={(communities) => setChosenComs(communities)}
            onMount={(reset) => setResetorForAutoComplete(() => reset)}
          />
          <Typography style={{ color: "gray" }}>
            <i>
              As a {superAdmin ? "Super Admin" : "Community Admin"}, you can
              choose from ({list.length}) communit
              {list.length === 1 ? "y" : "ies"}
            </i>
          </Typography>
        </div>
      )}

      <TextField
        name="title"
        style={{ width: "100%" }}
        label="Any descriptive text for this upload? (optional) (30 chars)"
        onChange={(e) => handleOnChange(e, "title")}
        margin="normal"
        variant="outlined"
        autoComplete="off"
        value={state.title || ""}
        // inputProps={{ maxLength: 30 }}
      />

      <Typography
        className="touchable-opacity"
        variant="body1"
        style={{
          fontWeight: "bold",
          cursor: "pointer",
          marginBottom: 10,
          display: "inline-block",
        }}
        color="secondary"
        onClick={() => setShowTagAddingBox(!showTagAddingBox)}
      >
        <i className="fa fa-plus" style={{ marginRight: 5 }} />
        Would you like to add tags to your image?
      </Typography>
      {showTagAddingBox && (
        <AddTags
          tags={tags}
          handleOnChange={setAddedTags}
          selections={addedTags}
        />
      )}
      <MediaLibrary
        onUpload={onUpload}
        actionText="Select Image"
        defaultTab={MediaLibrary.Tabs.UPLOAD_TAB}
        images={modalImages && modalImages.images}
        sourceExtractor={(item) => item && item.url}
        loadMoreFunction={makeLoadMoreFunction}
        excludeTabs={["library"]}
      />
      {state.notification_type && (
        <p
          className={isError ? classes.error : classes.success}
          onClick={() => notify()}
        >
          {state.notification_msg}

          {/* --------------------------------------- */}
          {!isError && !needsToReturn && (
            <Link
              onClick={() =>
                history.push({
                  pathname: "/admin/gallery",
                })
              }
              style={{ textDecoration: "underline" }}
              className={isError ? classes.error : classes.success}
            >
              <i>
                {" "}
                Want to see what you just added?
                <i
                  style={{ marginLeft: 5 }}
                  className="fa fa-long-arrow-right"
                />
              </i>
            </Link>
          )}
          {/* -------------------- USER NEEDS TO RETURN TO CREATING CONTENT------------------- */}
          {!isError && needsToReturn && (
            <Link
              onClick={() =>
                history.push({
                  pathname: needsToReturn,
                  state: { libOpen: true },
                })
              }
              style={{ textDecoration: "underline" }}
              className={isError ? classes.error : classes.success}
            >
              <i>
                {" "}
                Return to the page you were on{" "}
                <i
                  style={{ marginLeft: 5 }}
                  className="fa fa-long-arrow-right"
                />
              </i>
            </Link>
          )}
        </p>
      )}
    </PapperBlock>
  );
}

const mapStateToProps = (state) => ({
  auth: state.getIn(["auth"]),
  communities: state.getIn(["communities"]),
  modalImages: state.getIn(["modalLibraryImages"]),
  imagesFromGallery: state.getIn(["galleryImages"]),
  imagesFromSearchResults: state.getIn(["searchedImages"]),
  tags: state.getIn(["allTags"]),
});
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      loadModalImages: reduxCallLibraryModalImages,
      loadMoreModalImages: reduxCallLibraryModalImages,
      addImageToGalleryList: reduxAddToGalleryImages,
      addImageToSearchedList: reduxAddToSearchedImages,
    },
    dispatch
  );
};
const GalleryWithProps = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddToGallery);
export default withStyles(styles)(withRouter(GalleryWithProps));

const AddTags = ({ tags, selections, handleOnChange }) => {
  if (!tags) return <></>;
  return (
    <div style={{ marginBottom: 20 }}>
      <div>
        {(tags || []).map((collection) => {
          return (
            <>
              <div>
                <small>{collection.name}</small>
              </div>
              <MEDropdown
                data={collection.tags || []}
                valueExtractor={(it) => it.id}
                labelExtractor={(it) => it.name}
                defaultValue={selections[collection.id.toString()] || []}
                onItemSelected={(items) => {
                  handleOnChange({
                    ...(selections || {}),
                    [collection.id.toString()]: items,
                  });
                }}
                multiple
              />
            </>
          );
        })}
      </div>
    </div>
  );
};
