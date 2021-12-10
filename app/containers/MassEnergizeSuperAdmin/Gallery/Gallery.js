import {
  Checkbox,
  CircularProgress,
  Fab,
  FormControlLabel,
  Icon,
} from "@material-ui/core";
import { Paper, Typography, withStyles } from "@material-ui/core";
import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  reduxFetchImages,
  reduxLoadGalleryImages,
} from "../../../redux/redux-actions/adminActions";
import MediaLibrary from "../ME  Tools/media library/MediaLibrary";
import { SideSheet } from "./SideSheet";
import LightAutoComplete from "./tools/LightAutoComplete";

const styles = () => {
  return {
    title: { color: "white" },
    container: { minHeight: 400, padding: 20, marginTop: 15 },
    thumbnailContainer: {
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
    },
    filterBox: {
      border: "solid 0px #fafafa",
      borderBottomWidth: 2,
      marginBottom: 10,
    },
    button: {
      padding: "10px 40px",
      margin: 10,
    },
    sideSheetContainer: { 

    }
  };
};

const filters = [
  { name: "All", value: "all" },
  { name: "Actions", value: "actions" },
  { name: "Events", value: "events" },
  { name: "Testimonials", value: "testimonials" },
];

function Gallery(props) {
  const { classes, auth, communities } = props;

  const getCommunityList = () => {
    if (auth.is_super_admin) return communities;
    if (auth.is_community_admin) return auth.communities;
    return [];
  };

  const [searchData, setSearchData] = useState({});
  const [filterOptions, setFilterOptions] = useState([]);

  const setOptions = (option) => {
    const isIn = filterOptions.includes(option);
    if (isIn)
      return setFilterOptions(filterOptions.filter((op) => op !== option));
    setFilterOptions((prev) => [...prev, option]);
  };

  const setState = (name, data = null) => {
    if (!name) return;
    setSearchData((prev) => ({ ...prev, [name]: data }));
  };

  return (
    <div>
      <SideSheet classes={classes} />
      <Typography variant="h5" className={classes.title}>
        Manage images for your community
      </Typography>
      <Paper className={classes.container}>
        <div className={classes.filterBox}>
          <Typography variant="h6">Filter</Typography>
          <LightAutoComplete
            onChange={(coms) => setState("communities", coms)}
            placeholder="Specify community..."
            data={getCommunityList()}
            labelExtractor={(com) => com.name}
            valueExtractor={(com) => com.id}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {filters.map((opt, ind) => {
              return (
                <FormControlLabel
                  key={ind.toString()}
                  control={
                    <Checkbox
                      checked={
                        filterOptions && filterOptions.includes(opt.value)
                      }
                      onChange={(e) => setOptions(e.target.value)}
                      value={opt.value}
                      color="primary"
                    />
                  }
                  label={opt.name}
                />
              );
            })}

            <Fab
              variant="extended"
              color="secondary"
              aria-label="Delete"
              className={classes.button}
            >
              <Icon>search</Icon>
              Search
            </Fab>
          </div>
        </div>
        <div>
          {/* <ProgressCircleWithLabel label="We are fetching your data..." /> */}
          <div classesName={classes.thumbnailContainer}>
            {[1, 2, 3, 4, 5].map((itm, index) => {
              return (
                <div key={index} style={{ display: "inline-block" }}>
                  <MediaLibrary.Image
                    imageSource={`https://i.pravatar.cc/100?${index}`}
                  />
                </div>
              );
            })}
          </div>
          <ProgressCircleWithLabel />
        </div>
      </Paper>
    </div>
  );
}

const ProgressCircleWithLabel = ({ label }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: 20,
      }}
    >
      <CircularProgress thickness={5} />
      {label && <Typography style={{ marginTop: 10 }}>{label}</Typography>}
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.getIn(["auth"]),
  communities: state.getIn(["communities"]),
});
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      fetchGalleryImages: reduxFetchImages,
      insertImagesInRedux: reduxLoadGalleryImages,
    },
    dispatch
  );
};

const MainGalleryPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(Gallery);
export default withStyles(styles)(MainGalleryPage);
