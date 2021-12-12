import {
  Button,
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
import { styles } from "./styles";
import LightAutoComplete from "./tools/LightAutoComplete";

const ALL_COMMUNITIES = "all-communities";
const filters = [
  { name: "Actions", value: "actions" },
  { name: "Events", value: "events" },
  { name: "Testimonials", value: "testimonials" },
];

function Gallery(props) {
  const { classes, auth, communities } = props;

  const getCommunityList = () => {
    if (auth.is_super_admin) return communities || [];
    if (auth.is_community_admin) return auth.communities || [];
    return [];
  };

  const [targetComs, setTargetComs] = useState([]);
  const [targetAllComs, setTargetAllComs] = useState(false);
  const [useAllFilters, setAllAsFilter] = useState(false);
  const [filterOptions, setFilterOptions] = useState([]);
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  const setOptions = (option) => {
    const isIn = filterOptions.includes(option);
    if (isIn)
      return setFilterOptions(filterOptions.filter((op) => op !== option));
    setFilterOptions((prev) => [...prev, option]);
  };

  return (
    <div>
      {showMoreInfo && (
        <SideSheet classes={classes} hide={() => setShowMoreInfo(false)} />
      )}
      <Typography variant="h5" className={classes.title}>
        Manage images for your community
      </Typography>
      <Paper className={classes.container}>
        <div className={classes.filterBox}>
          <Typography variant="h6">Filter</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={targetAllComs}
                onChange={(e) => setTargetAllComs((prev) => !prev)}
                value={ALL_COMMUNITIES}
                color="primary"
              />
            }
            label="All communities"
          />
          <LightAutoComplete
            onChange={(coms) => setTargetComs(coms)}
            placeholder="Specify community..."
            data={getCommunityList()}
            labelExtractor={(com) => com.name}
            valueExtractor={(com) => com.id}
            disabled={targetAllComs}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={useAllFilters}
                  onChange={() => setAllAsFilter((prev) => !prev)}
                  value="all"
                  color="primary"
                />
              }
              label="All"
            />
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
                  disabled={useAllFilters}
                />
              );
            })}
            <Button
              variant="contained"
              color="secondary"
              style={{ fontSize: 13, textTransform: "capitalize" }}
            >
              <Icon style={{ fontSize: 15 }}>search</Icon>
              Search
            </Button>
          </div>
        </div>
        <div>
          {/* <ProgressCircleWithLabel label="We are fetching your data..." /> */}
          <div classesName={classes.thumbnailContainer}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5].map((itm, index) => {
              return (
                <div key={index} style={{ display: "inline-block" }}>
                  <MediaLibrary.Image
                    onClick={() => setShowMoreInfo(true)}
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
