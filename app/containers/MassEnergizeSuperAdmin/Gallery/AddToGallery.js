import { RadioGroup, Typography, withStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { apiCall } from "../../../utils/messenger";
import MediaLibrary from "../ME  Tools/media library/MediaLibrary";
import FormGenerator from "./../_FormGenerator/index";
import LightAutoComplete from "./tools/LightAutoComplete";
import { Radio } from "@material-ui/core";
import { FormControlLabel } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { bindActionCreators } from "redux";
import {
  reduxCallLibraryModalImages,
  reduxFetchImages,
  reduxLoadGalleryImages,
} from "../../../redux/redux-actions/adminActions";
const styles = (theme) => {
  const spacing = theme.spacing.unit;
  const error = {
    background: "rgb(255, 214, 214)",
    color: "rgb(170, 28, 28)",
    width: "100%",
    marginTop: 6,
    padding: "16px 25px",
    borderRadius: 5,
    cursor: "pointer",
  };
  return {
    container: {
      padding: spacing * 3,
      borderRadius: 5,
    },
    header: {
      marginBottom: spacing * 2,
    },
    dropdownArea: {
      marginBottom: spacing * 1,
    },
    error: error,
    success: {
      ...error,
      background: "rgb(174, 223, 174)",
      color: "rgb(12, 131, 30)",
    },
  };
};

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
    classes,
    communities = [],
    fetchGalleryImages,
    insertImagesInRedux,
    loadMoreModalImages,
    loadModalImages,
    modalImages,
  } = props;

  const [chosenComs, setChosenComs] = useState([]);
  const [scope, setScope] = useState(CHOICES.SPECIFIC);
  const [state, setState] = useState(defaultState);
  const [resetAutoComplete, setResetorForAutoComplete] = useState(null);
  const superAdmin = auth.is_super_admin;

  const getCommunityList = () => {
    if (auth.is_super_admin) return communities;
    if (auth.is_community_admin) return auth.communities;
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
    const apiJson = {
      user_id: auth.id,
      file: files[0] || null, // TODO: allow multiple
      community_ids: cleanCommunities(),
      is_universal: scope === CHOICES.ALL,
      scope: scope,
      title: state.title,
    };

    apiCall(UPLOAD_URL, apiJson)
      .then((response) => {
        if (!response.success) {
          console.log("UPLOADRESPONSEERROR:", response.error);
          notify(response.error.message, "error");
          return;
        }
        resetThisComponent();
        notify("Upload to library was successful!", "success");
        reset();
        closeModal();
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

  // const makeLoadMoreFunction = (cb) => {
  //   loadMoreModalImages({
  //     old: modalImages,
  //     ...makeCommunityListParamsForFetch(),
  //     cb,
  //   });
  // };

  // useEffect(() => {
  //   loadModalImages({
  //     old: modalImages,
  //     ...makeCommunityListParamsForFetch(),
  //   });
  // }, []);

  const json = {
    fields: [
      {
        label: "Testing Library In Form Generator",
        fieldType: "Section",
        children: [
          {
            name: "le Image",
            label: "Choose community images",
            actionText: "Choose Image from here bro....",
            fieldType: FormGenerator.FieldTypes.MediaLibrary,
            dbName: "le_images",
          },
        ],
      },
    ],
  };
  return (
    <Paper className={classes.container}>
      <Typography variant="h5" className={classes.header}>
        <FormGenerator classes={classes} formJson={json} />
      </Typography>
    </Paper>
  );
  return (
    <Paper className={classes.container}>
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
            // defaultSelected={auth.admin_at}
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
        inputProps={{ maxLength: 30 }}
      />
      <MediaLibrary
        onUpload={onUpload}
        actionText="Add to library"
        defaultTab={MediaLibrary.Tabs.UPLOAD_TAB}
        images={modalImages && modalImages.images}
        sourceExtractor={(item) => item && item.url}
        loadMoreFunction={makeLoadMoreFunction}
      />
      {state.notification_type && (
        <p
          className={
            state.notification_type === "error"
              ? classes.error
              : classes.success
          }
          onClick={() => notify()}
        >
          {state.notification_msg}
        </p>
      )}
    </Paper>
  );
}

const mapStateToProps = (state) => ({
  auth: state.getIn(["auth"]),
  communities: state.getIn(["communities"]),
  modalImages: state.getIn(["modalLibraryImages"]),
});
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      loadModalImages: reduxCallLibraryModalImages,
      insertImagesInRedux: reduxLoadGalleryImages,
      loadMoreModalImages: reduxCallLibraryModalImages,
    },
    dispatch
  );
};
const GalleryWithProps = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddToGallery);
export default withStyles(styles)(GalleryWithProps);
