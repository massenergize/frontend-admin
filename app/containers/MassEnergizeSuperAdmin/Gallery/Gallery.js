import {
  Button,
  Checkbox,
  CircularProgress,
  Fab,
  FormControlLabel,
  Icon,
} from "@material-ui/core";
import { Paper, Typography, withStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  reduxFetchImages,
  reduxLoadGalleryImages,
  reduxLoadSearchedImages,
  reduxSearchForImages,
} from "../../../redux/redux-actions/adminActions";
import { apiCall } from "../../../utils/messenger";
import MediaLibrary from "../ME  Tools/media library/MediaLibrary";
import { SideSheet } from "./SideSheet";
import { styles } from "./styles";
import LightAutoComplete from "./tools/LightAutoComplete";

const ALL_COMMUNITIES = "all-communities";
const filters = [
  { name: "Actions", value: "actions" },
  { name: "Events", value: "events" },
  { name: "Testimonials", value: "testimonials" },
  { name: "My Uploads", value: "uploads" },
];

function Gallery(props) {
  const fetchController = new AbortController();
  const { signal } = fetchController;
  const {
    classes,
    auth,
    communities,
    searchResults = {},
    putSearchResultsInRedux,
  } = props;

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
  const [searching, setSearching] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [queryHasChanged, setQueryHasChanged] = useState(true); //

  const fetchContent = (body = {}) => {
    setSearching(true);
    apiCall("/gallery.search", { ...body, signal })
      .then((response) => {
        if (!response.success)
          return console.log("SEARCHERROR_BE", response && response.error);
        setSearching(false);
        putSearchResultsInRedux({ data: response.data, old: searchResults });
        console.log("i am the search response data", response.data);
      })
      .catch((e) => {
        if (e.name === "AbortError")
          console.log("Image search api call was cancelled...");
        setSearching(false);
        console.log("SEARCHERROR_SYNT: ", e.toString());
      });
  };

  const runSearch = () => {
    const form = {
      any_community: targetAllComs,
      target_communities: targetComs,
      filters: filterOptions,
    };
    fetchContent(form);
  };

  const selectAllCommunities = () => {
    // set all an admins community as target community if they are a community. Leave things empty if superadmin though
    if (auth.is_super_admin) setTargetComs([]);
    else if (auth.is_community_admin) setTargetComs(getCommunityList());
    setTargetAllComs((prev) => !prev);
  };

  const selectAllFilters = () => {
    setFilterOptions(filters.map((f) => f.value));
    setAllAsFilter((prev) => !prev);
  };

  const setOptions = (option) => {
    const isIn = filterOptions.includes(option);
    if (isIn)
      return setFilterOptions(filterOptions.filter((op) => op !== option));
    setFilterOptions((prev) => [...prev, option]);
    setQueryHasChanged(true);
  };

  useEffect(() => {
    //preselect "all" communities and "all" filters
    selectAllFilters();
    selectAllCommunities();
  }, []);

  useEffect(() => {
    // run a general query to retrieve images onload
    fetchContent({
      any_community: true,
      target_communities: getCommunityList(),
      filters: filters.map((f) => f.value),
    });

    return () => fetchController.abort();
  }, []);

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
                onChange={() => selectAllCommunities()}
                value={ALL_COMMUNITIES}
                color="primary"
              />
            }
            label="All communities"
          />
          <LightAutoComplete
            onChange={(coms) => {
              setQueryHasChanged(true);
              setTargetComs(coms);
            }}
            placeholder="Specify community..."
            data={getCommunityList()}
            labelExtractor={(com) => com.name}
            valueExtractor={(com) => com.id}
            disabled={targetAllComs}
            defaultSelected={targetComs}
            allowChipRemove={!targetAllComs}
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
                  onChange={() => selectAllFilters()}
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
              onClick={() => runSearch()}
              disabled={searching}
            >
              <Icon style={{ fontSize: 15 }}>search</Icon>
              Search
            </Button>
          </div>
        </div>
        <div>
          {/*------------------------------- IMAGES --------------------------  */}
          <ImageCollectionTray
            searching={searching}
            images={(searchResults && searchResults.images) || []}
            classes={classes}
          />
          {/* <ProgressCircleWithLabel /> */}
        </div>
      </Paper>
    </div>
  );
}

const ImageCollectionTray = ({ images = [], classes, searching }) => {
  if (searching)
    return <ProgressCircleWithLabel label="We are fetching your data..." />;

  return (
    <div classesName={classes.thumbnailContainer}>
      {(images || []).map((image, index) => {
        return (
          <div key={index} style={{ display: "inline-block" }}>
            <MediaLibrary.Image
              onClick={() => setShowMoreInfo(true)}
              imageSource={image && image.url}
            />
          </div>
        );
      })}
    </div>
  );
};

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
  searchResults: state.getIn(["searchedImages"]),
});
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      fetchGalleryImages: reduxFetchImages,
      insertImagesInRedux: reduxLoadGalleryImages,
      putSearchResultsInRedux: reduxLoadSearchedImages,
    },
    dispatch
  );
};

const MainGalleryPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(Gallery);
export default withStyles(styles)(MainGalleryPage);
