import { Typography, withStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import React, { useState } from "react";
import { connect } from "react-redux";
import { apiCall } from "../../../utils/messenger";
import MediaLibrary from "../ME  Tools/media library/MediaLibrary";
import FormGenerator from "./../_FormGenerator/index";
import Select from "@material-ui/core/Select";
import { ALL, NULL } from "./tools";
import LightAutoComplete from "./tools/LightAutoComplete";
const styles = (theme) => {
  const spacing = theme.spacing.unit;
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
  };
};

const UPLOAD_URL = "/gallery.add";

function AddToGallery(props) {
  const { auth, classes, communities = [] } = props;

  const onUpload = (files) => {
    const apiJson = {
      user_id: auth.id,
      file: files[0] || null,
      community_id: auth.communities[0].id,
    };
    apiCall(UPLOAD_URL, apiJson);
  };

  const [chosenComs, setChosenComs] = useState([]);

  const chooseCommunity = (value) => {
    if (value === NULL) return setChosenComs([]);
    if (value == ALL) return setChosenComs(communities.map((com) => com.id));
    setChosenComs((prev) => [...prev, value]);
  };

  return (
    <Paper className={classes.container}>
      <Typography variant="h5" className={classes.header}>
        Add an image to your community's library{" "}
      </Typography>
      <div className={classes.dropdownArea}>
        <Typography style={{ marginBottom: 5 }}>
          Which community is this upload related to?
        </Typography>
        <LightAutoComplete
          classes={classes}
          data={communities}
          valueExtractor={(com) => com.id}
          labelExtractor={(com) => com.name}
        />
      </div>
      <MediaLibrary onUpload={onUpload} />
    </Paper>
  );
}

const mapStateToProps = (state) => ({
  auth: state.getIn(["auth"]),
  communities: state.getIn(["communities"]),
});
const GalleryWithProps = connect(mapStateToProps)(AddToGallery);
export default withStyles(styles)(GalleryWithProps);
