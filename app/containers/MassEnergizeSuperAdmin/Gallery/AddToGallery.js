import { RadioGroup, Typography, withStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import React, { useState } from "react";
import { connect } from "react-redux";
import { apiCall } from "../../../utils/messenger";
import MediaLibrary from "../ME  Tools/media library/MediaLibrary";
import FormGenerator from "./../_FormGenerator/index";
import LightAutoComplete from "./tools/LightAutoComplete";
import { Radio } from "@material-ui/core";
import { FormControlLabel } from "@material-ui/core";
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
function AddToGallery(props) {
  const { auth, classes, communities = [] } = props;

  const [chosenComs, setChosenComs] = useState([]);
  const [scope, setScope] = useState(CHOICES.SPECIFIC);
  const [state, setState] = useState({ error: false, success: false});
  const superAdmin = auth.is_super_admin;
  const getCommunityList = () => {
    if (auth.is_super_admin) return communities;
    if (auth.is_community_admin) return auth.communities;
    return [];
  };

  const list = getCommunityList();
  const cleanCommunities = () => {
    var coms = chosenComs || [];
    return coms.map((com) => com.id);
  };
  const onUpload = (files, reset) => {
    const apiJson = {
      user_id: auth.id,
      file: files[0] || null, // TODO: allow multiple
      community_ids: cleanCommunities(),
      is_universal: scope === CHOICES.ALL,
      scope: scope,
    };
    apiCall(UPLOAD_URL, apiJson)
      .then((response) => {
        if (!response.success) {
          console.log("UPLOADRESPONSEERROR:", response.error);
          return;
        }
      })
      .catch((e) => console.log("UPLOADERROR: ", e));
  };

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
      <MediaLibrary
        onUpload={onUpload}
        actionText="Add to library"
        defaultTab={MediaLibrary.Tabs.UPLOAD_TAB}
      />
      <p className={classes.success}>This is the error</p>
    </Paper>
  );
}

const mapStateToProps = (state) => ({
  auth: state.getIn(["auth"]),
  communities: state.getIn(["communities"]),
});
const GalleryWithProps = connect(mapStateToProps)(AddToGallery);
export default withStyles(styles)(GalleryWithProps);
