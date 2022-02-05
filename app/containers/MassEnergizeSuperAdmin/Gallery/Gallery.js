import {
  Button,
  Checkbox,
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
  reduxLoadImageInfos,
  reduxLoadSearchedImages,
} from "../../../redux/redux-actions/adminActions";
import { apiCall } from "../../../utils/messenger";
import MediaLibrary from "../ME  Tools/media library/MediaLibrary";
import { SideSheet } from "./SideSheet";
import { styles } from "./styles";
import LightAutoComplete from "./tools/LightAutoComplete";
import { ProgressCircleWithLabel } from "./utils";

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
    putImageInfoInRedux,
    imageInfos,
  } = props;

  const getCommunityList = () => {
    if (auth && auth.is_super_admin) return communities || [];
    if (auth && auth.is_community_admin) return auth.communities || [];
    return [];
  };

  const [targetComs, setTargetComs] = useState([]);
  const [targetAllComs, setTargetAllComs] = useState(false);
  const [useAllFilters, setAllAsFilter] = useState(false);
  const [filterOptions, setFilterOptions] = useState([]);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [searching, setSearching] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [queryHasChanged, setQueryHasChanged] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [oneImageInfo, setOneImageInfo] = useState(null);

  const deleteImage = (id, cb) => {
    if (!id) return;
    apiCall("/gallery.remove", { media_id: id })
      .then((response) => {
        if (!response.success)
          return console.log("REMOVE IMAGE ERROR_BE", response.error);
        const images = (searchResults && searchResults.images) || [];
        const rem = images.filter((img) => img.id !== id);
        putSearchResultsInRedux({
          data: { ...(searchResults || {}), images: rem },
          old: searchResults,
          append: false,
        });
        if (cb) cb();
      })
      .catch((e) => {
        console.log("REMOVE IMAGE ERROR_SYNT", e.toString());
        if (cb) cb();
      });
  };

  const getMoreInfoOnImage = (id) => {
    if (!id) return console.log("The image id provided is invalid...", id);
    setOneImageInfo("loading");
    apiCall("/gallery.image.info", { media_id: id })
      .then((response) => {
        if (response && !response.success) {
          setOneImageInfo(null);
          return console.log("IMAGE INFO REQ BE: ", response.error);
        }
        setOneImageInfo(response.data);
        putImageInfoInRedux({
          oldInfos: imageInfos,
          newInfo: response.data,
        });
      })
      .catch((e) => {
        setOneImageInfo(null);
        console.log("IMAGE INFO REQ SYNTAX: ", e.toString());
      });
  };

  const fetchContent = (body = {}, cb) => {
    setSearching(true); // activate circular spinner to show loading to user
    setNoResults(false); // remove the "No results" text if it was showing from previous search
    apiCall("/gallery.search", { ...body, signal })
      .then((response) => {
        if (!response.success)
          return console.log("SEARCHERROR_BE", response && response.error);
        putSearchResultsInRedux({
          data: response.data,
          old: searchResults,
          append: queryHasChanged ? false : true,
        });
        setSearching(false); // remove loading spinner
        setQueryHasChanged(false); // reset the query has changed field
        if (response.data.images.length === 0) setNoResults(true);
        if (cb) cb(response.data);
      })
      .catch((e) => {
        if (e.name === "AbortError")
          console.log("Image search api call was cancelled...");
        setSearching(false); // remove loading spinner
        console.log("SEARCHERROR_SYNT: ", e.toString());
        setQueryHasChanged(false); // reset the query has changed field
        if (cb) cb(null);
      });
  };

  const makeRequestBody = (extraParams = {}) => {
    return {
      any_community: targetAllComs,
      target_communities: targetComs,
      filters: filterOptions,
      ...extraParams,
    };
  };
  const runSearch = () => {
    const form = makeRequestBody();
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
    setQueryHasChanged(true);
    if (isIn)
      return setFilterOptions(filterOptions.filter((op) => op !== option));
    setFilterOptions((prev) => [...prev, option]);
  };

  // ------------------------------------------------------
  useEffect(() => {
    //preselect "all" communities and "all" filters
    selectAllFilters();
    selectAllCommunities();
  }, []);

  useEffect(() => {
    // run a general query to retrieve images onload, if there is no content yet
    if (!searchResults || !searchResults.images)
      fetchContent({
        any_community: true,
        target_communities: getCommunityList().map((com) => com.id),
        filters: filters.map((f) => f.value),
      });

    return () => fetchController.abort();
  }, []);

  useEffect(() => {}, [searchResults]);
  // -------------------------------------------------------

  const loadMoreImages = () => {
    setLoadMore(true);
    const limits = {
      upper_limit: searchResults && searchResults.upper_limit,
      lower_limit: searchResults && searchResults.lower_limit,
    };
    fetchContent(makeRequestBody(limits), () => setLoadMore(false));
  };

  return (
    <div>
      {showMoreInfo && (
        <SideSheet
          classes={classes}
          hide={() => setShowMoreInfo(false)}
          infos={imageInfos}
          data={oneImageInfo}
          deleteImage={deleteImage}
        />
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
                onChange={() => {
                  selectAllCommunities();
                  setQueryHasChanged(true);
                }}
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
                  onChange={() => {
                    selectAllFilters();
                    setQueryHasChanged(true);
                  }}
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
              disabled={searching || !queryHasChanged}
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
            showMoreInfo={(id) => {
              setShowMoreInfo(true);
              getMoreInfoOnImage(id);
            }}
          />
          {noResults && (
            <Typography
              style={{ margin: 10, width: "100%", textAlign: "center" }}
            >
              No images were found in last search...
            </Typography>
          )}
          <LoadMoreContainer
            loading={loadMore}
            loadMoreFunction={loadMoreImages}
          />
        </div>
      </Paper>
    </div>
  );
}

export const LoadMoreContainer = ({
  loadMoreFunction,
  loading,
  style = {},
}) => {
  if (loading) return <ProgressCircleWithLabel />;
  return (
    <Button
      variant="contained"
      color="secondary"
      style={{
        width: "100%",
        margin: 6,
        borderRadius: 4,
        marginTop: 20,
        ...style,
      }}
      onClick={() => loadMoreFunction && loadMoreFunction()}
    >
      Load More
    </Button>
  );
};

const ImageCollectionTray = ({
  images = [],
  classes,
  searching,
  showMoreInfo,
}) => {
  if (searching)
    return <ProgressCircleWithLabel label="We are fetching your data..." />;
  return (
    <div classesName={classes.thumbnailContainer}>
      {(images || []).map((image, index) => {
        return (
          <div key={index} style={{ display: "inline-block" }}>
            <MediaLibrary.Image
              onClick={() => showMoreInfo(image && image.id)}
              imageSource={image && image.url}
            />
          </div>
        );
      })}
    </div>
  );
};


const mapStateToProps = (state) => ({
  auth: state.getIn(["auth"]),
  communities: state.getIn(["communities"]),
  searchResults: state.getIn(["searchedImages"]),
  imageInfos: state.getIn(["imageInfos"]),
});
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      fetchGalleryImages: reduxFetchImages,
      insertImagesInRedux: reduxLoadGalleryImages,
      putSearchResultsInRedux: reduxLoadSearchedImages,
      putImageInfoInRedux: reduxLoadImageInfos,
    },
    dispatch
  );
};

const MainGalleryPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(Gallery);
export default withStyles(styles)(MainGalleryPage);
