import { Avatar, Button, Paper, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHumanFriendlyDate, smartString } from "../../../utils/common";
import { apiCall } from "../../../utils/messenger";
import LightAutoComplete from "../Gallery/tools/LightAutoComplete";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import METable from "../ME  Tools/table /METable";
import CallMadeIcon from "@mui/icons-material/CallMade";
import { getLimit, handleFilterChange, onTableStateChange } from "../../../utils/helpers";
import SearchBar from "../../../utils/components/searchBar/SearchBar";
import ApplyFilterButton from "../../../utils/components/applyFilterButton/ApplyFilterButton";
import Seo from "../../../components/Seo/Seo";
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_ITEMS_PER_PAGE_OPTIONS, LOADING } from "../../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { withStyles } from "@mui/styles";
import styles from "../../../components/Widget/widget-jss";
import { reduxKeepOtherTestimonialState, reduxToggleUniversalModal } from "../../../redux/redux-actions/adminActions";
import ShareTestimonialModalComponent from "./ShareTestimonialModalComponent";

export const renderSelectedItems = (items, func) => {
  return <span style={{ fontWeight: "bold", color: "purple" }}>{items.map((it) => it?.name).join(", ")}</span>;
};
const LOADING_ERROR = "LOADING_ERROR";
const SEARCH_ERROR = "SEARCH_ERROR";
function TestimonialsFromOthers({ classes }) {
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const putStateInRedux = (data) => dispatch(reduxKeepOtherTestimonialState(data));
  // -----------------------------------------------------------------------------------------
  const state = useSelector((state) => state.getIn(["otherTestimonialsState"]));
  const auth = useSelector((state) => state.getIn(["auth"]));
  const listOfCommunities = useSelector((state) => state.getIn(["otherCommunities"]));
  let categories = useSelector((state) => state.getIn(["allTags"]));
  let tags = categories
    ?.map((c) => c.tags)
    .flat()
    .sort((a, b) => a?.name?.localeCompare(b?.name));
  const meta = useSelector((state) => state.getIn(["paginationMetaData"]));

  const stories = useSelector((state) => state.getIn(["allTestimonials"]));
  // -----------------------------------------------------------------------------------------

  const makeTitle = ({ shared }) => {
    const isSuperAdmin = auth?.is_super_admin;
    if (isSuperAdmin) return "Manage Sharing";
    if (!isSuperAdmin && shared) return `Unshare this testimonial`;
    return "Share";
  };

  const isShared = (community, list) => {
    list = list || auth?.admin_at;
    return list?.some((it) => it?.id === community.id);
  };
  const toggleShareModal = (props) => {
    const { show, ...rest } = props;
    const shared = isShared(rest.community);
    console.log("Lets see shared", shared);
    return dispatch(
      reduxToggleUniversalModal({
        show,
        title: makeTitle({ shared }),
        fullControl: true,
        renderComponent: () => <ShareTestimonialModalComponent shared={shared} story={{ ...rest }} />
      })
    );
  };

  console.log("lets see state", state);
  // -----------------------------------------------------------------------------------------

  const { communities, exclude, mounted, categories: selectedCategories } = state || {};

  // -----------------------------------------------------------------------------------------
  // const setCommunities = (communities) => {
  //   putStateInRedux({ ...(state || {}), communities });
  // };
  // const setMounted = (mounted) => {
  //   putStateInRedux({ ...(state || {}), mounted });
  // };

  const updateState = (key, value, old) => {
    const oldData = old || state;
    putStateInRedux({ ...(oldData || {}), [key]: value });
  };

  const fashionData = (data) => {
    if (!data) return [];

    const fashioned = data?.map((d) => [
      d.id,
      smartString(d?.title),
      `${smartString(d.tags.map((t) => t.name).join(", "), 30)}`,
      `${smartString(d.tags.map((t) => t.name).join(", "), 30)}`,
      d
    ]);
    return fashioned;
  };

  const data = fashionData(stories || []);

  const fetchOtherEvents = (passedComms = []) => {
    const ids = (passedComms || communities || []).map((it) => it.id);

    setLoading(true);
    apiCall("/events.others.listForCommunityAdmin", {
      community_ids: ids,
      exclude: exclude || false,
      limit: getLimit(PAGE_PROPERTIES.OTHER_COMMUNITY_EVENTS.key)
    })
      .then((response) => {
        setLoading(false);
        if (response.success) {
          putOtherEventsInRedux(response.data);
          putMetaDataToRedux({ ...meta, otherEvents: response.cursor });
        } else makeError(SEARCH_ERROR, response?.error || "An error occurred");
      })
      .catch((e) => {
        setLoading(false);
        console.log("OTHER_TESTIMONIALS_ERROR:", e.toString());
        makeError(SEARCH_ERROR, e.toString());
      });
  };

  const makeColumns = () => {
    return [
      {
        name: "ID",
        key: "id",
        options: {
          filter: false
        }
      },
      {
        name: "Title",
        key: "title",
        options: {
          filter: false,
          download: true
        }
      },
      {
        name: "Collections",
        key: "collections",
        options: {
          sort: false,
          filter: false,
          download: false
          // customBodyRender: (d) => (
          //   <div>
          //     {d?.tags?.join(",")}
          //     {/* {d.image && <Avatar alt={d.initials} src={d.image.url} style={{ margin: 10 }} />}
          //     {!d.image && <Avatar style={{ margin: 10 }}>{d.initials}</Avatar>} */}
          //   </div>
          // )
        }
      },
      {
        name: "Shared To",
        key: "shared-to",
        options: {
          filter: false,
          download: false
        }
      },

      {
        name: "Manage",
        key: "manage",
        options: {
          filter: false,
          delete: false,
          customBodyRender: (d) => {
            const shared = isShared(d.community);
            return (
              <small
                onClick={() => toggleShareModal({ show: true, shared, ...d })}
                className="touchable-opacity"
                style={{
                  background: shared ? "rgb(242 222 208)" : "rgb(218 242 208)",
                  color: shared ? "rgb(223 59 59)" : "green",
                  fontWeight: "bold",
                  borderRadius: 50,
                  padding: "3px 10px"
                }}
              >
                <i className={`fa fa-times`} /> {shared ? "Unshare" : "Share"}
              </small>
            );
          }
        }
      }
    ];
  };

  const URL = "/testimonials.others.listForCommunityAdmin";
  const metaData = meta && meta.otherEvents;
  const columns = makeColumns();
  const ids = (communities || []).map((it) => it.id);
  const options = {
    filterType: "dropdown",
    responsive: "standard",
    print: true,
    rowsPerPage: DEFAULT_ITEMS_PER_PAGE,
    rowsPerPageOptions: DEFAULT_ITEMS_PER_PAGE_OPTIONS,
    selectableRows: false,
    count: metaData && metaData.count,
    confirmFilters: true,
    onTableChange: (action, tableState) =>
      onTableStateChange({
        action,
        tableState,
        tableData: data,
        metaData,
        // updateReduxFunction: putOtherEventsInRedux,
        reduxItems: data,
        apiUrl: URL,
        pageProp: PAGE_PROPERTIES.SHARED_TESTIMONIALS,
        // updateMetaData: putMetaDataToRedux,
        name: "otherTestimonials",
        meta: meta,
        otherArgs: {
          community_ids: ids
        }
      }),
    customSearchRender: (searchText, handleSearch, hideSearch, options) => (
      <SearchBar
        url={URL}
        // reduxItems={otherEvents}
        // updateReduxFunction={putOtherEventsInRedux}
        handleSearch={handleSearch}
        hideSearch={hideSearch}
        pageProp={PAGE_PROPERTIES.OTHER_COMMUNITY_EVENTS}
        // updateMetaData={putMetaDataToRedux}
        name="otherTestimonials"
        meta={meta}
        otherArgs={{
          community_ids: ids
        }}
      />
    ),
    customFilterDialogFooter: (currentFilterList, applyFilters) => {
      return (
        <ApplyFilterButton
          url={URL}
          reduxItems={otherEvents}
          updateReduxFunction={putOtherEventsInRedux}
          columns={columns}
          limit={getLimit(PAGE_PROPERTIES.OTHER_COMMUNITY_EVENTS.key)}
          applyFilters={applyFilters}
          updateMetaData={putMetaDataToRedux}
          name="otherEvents"
          meta={meta}
          otherArgs={{
            community_ids: ids
          }}
        />
      );
    },

    whenFilterChanges: (changedColumn, filterList, type, changedColumnIndex, displayData) =>
      handleFilterChange({
        filterList,
        type,
        columns,
        page: PAGE_PROPERTIES.OTHER_COMMUNITY_EVENTS,
        updateReduxFunction: putOtherEventsInRedux,
        reduxItems: otherEvents,
        url: "/events.others.listForCommunityAdmin",
        updateMetaData: putMetaDataToRedux,
        name: "otherEvents",
        meta,
        otherArgs: {
          community_ids: ids
        }
      })
  };

  const makeError = (key, message) => {
    setError({ ...error, [key]: message });
  };

  const renderTable = ({ data, options }) => {
    if (loading)
      return (
        <Paper style={{ padding: "15px 25px" }}>
          <i className="fa fa-spinner fa-spin" style={{ marginRight: 6 }} />
          Looking for testimonials...
        </Paper>
      );
    if (!data.length)
      return (
        <Paper style={{ padding: "15px 25px" }}>
          {mounted ? (
            <span> No open testimonials are available for your list of filters. Select other ones</span>
          ) : (
            <span>
              When you select communities and <b>"Apply"</b>, testimonials will show here..
            </span>
          )}
        </Paper>
      );
    return (
      <METable
        classes={classes}
        page={PAGE_PROPERTIES.SHARED_TESTIMONIALS}
        tableProps={{
          title: "Testimonials from other communities",
          options,
          data,
          columns: makeColumns()
        }}
      />
    );
  };

  const loadingError = (error || {})[LOADING_ERROR];
  const searchError = (error || {})[SEARCH_ERROR];

  if (loadingError) return <Paper style={{ padding: "15px 25px", color: "red" }}>{loadingError}</Paper>;
  return (
    <div>
      <Seo name={`Testimonials from other communities`} />
      <Paper style={{ marginBottom: 15 }}>
        <div style={{ padding: 20 }}>
          <Typography variant="h6">Show testimonials from communities I select below</Typography>

          <small style={{ color: "grey" }}>
            When you are done selecting your communities, click the <b style={{ marginRight: 5 }}>"apply"</b>
            button below
          </small>

          <LightAutoComplete
            renderSelectedItems={renderSelectedItems}
            placeholder="Select Communities..."
            defaultSelected={[]}
            data={listOfCommunities}
            labelExtractor={(it) => it.name}
            valueExtractor={(it) => it.id}
            onChange={(items) => updateState("communities", items, state)}
            multiple
          />

          <small style={{ color: "grey" }}>Add categories and tags to narrow down your search</small>

          <LightAutoComplete
            placeholder="Add categories or tags as filters..."
            defaultSelected={selectedCategories || []}
            data={tags}
            labelExtractor={(it) => it.name}
            valueExtractor={(it) => it.id}
            onChange={(items) => updateState("categories", items, state)}
            multiple
          />
          {/* <FormControlLabel
              control={
                <Checkbox
                  checked={exclude}
                  onChange={(e) => setExclude(e.target.checked)}
                />
              }
              label="Exclude events from communities I have selected"
            /> */}
        </div>
        <div style={{ background: "#fbfbfb" }}>
          <Tooltip
            placement="top"
            title="Click this button to find events from the communities you have selected above "
          >
            <Button
              onClick={() => {
                fetchOtherEvents(null);
                updateState("mounted", true);
              }}
              disabled={!(communities || []).length || loading}
              variant="contained"
              color="secondary"
              style={{
                borderRadius: 0,
                padding: "10px 25px",
                minWidth: 200,
                borderBottomLeftRadius: 10
              }}
            >
              {loading && <i className=" fa fa-spinner fa-spin" style={{ marginRight: 5, color: "white" }} />}
              {loading ? "Fetching..." : "Apply"}
            </Button>
          </Tooltip>
        </div>
      </Paper>

      {searchError ? (
        <Paper style={{ padding: "15px 25px", color: "red" }}>{searchError}</Paper>
      ) : (
        renderTable({ data, options })
      )}
    </div>
  );
}

export default withStyles(styles)(TestimonialsFromOthers);
