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
import {
  reduxKeepOtherTestimonialState,
  reduxLoadMetaDataAction,
  reduxLoadOtherTestimonials,
  reduxToggleUniversalModal,
  reduxToggleUniversalToast
} from "../../../redux/redux-actions/adminActions";
import ShareTestimonialModalComponent from "./ShareTestimonialModalComponent";

export const renderSelectedItems = (items, func) => {
  return <span style={{ fontWeight: "bold", color: "purple" }}>{items.map((it) => it?.name).join(", ")}</span>;
};

const LOADING_ERROR = "LOADING_ERROR";
const SEARCH_ERROR = "SEARCH_ERROR";

function TestimonialsFromOthers({ classes }) {
  // -----------------------------------------------------------------------------------------
  const URL = "/testimonials.other.listForCommunityAdmin";
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const putStateInRedux = (data) => dispatch(reduxKeepOtherTestimonialState(data));
  const putOtherTestimonialsInRedux = (data) => dispatch(reduxLoadOtherTestimonials(data));
  const putMetaDataToRedux = (data) => dispatch(reduxLoadMetaDataAction(data));
  const toggleToast = (data) => dispatch(reduxToggleUniversalToast(data));
  // -----------------------------------------------------------------------------------------
  const otherTestimonials = useSelector((state) => state.getIn(["otherTestimonials"]));
  const state = useSelector((state) => state.getIn(["otherTestimonialsState"]));
  const auth = useSelector((state) => state.getIn(["auth"]));
  const adminAt = (auth?.admin_at || [])[0];
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
    return list?.some((it) => it?.id === community?.id);
  };

  const afterResponse = (error, data) => {
    if (error || !data) return toast(error || "Sorry, an error occured", false);

    // find the testimonial with its index in the "otherTestimonial" list
    const index = otherTestimonials.findIndex((it) => it?.id === data?.id);
    const copy = [...otherTestimonials];
    copy[index] = data;
    putOtherTestimonialsInRedux(copy);
    toast(`"${data?.title} has been added to your testimonials! You will now see it in your list of testimonials"`);
  };

  const toast = (message, good = true) => {
    toggleToast({ show: true, message, variant: good ? "success" : "error" });
  };

  const toggleShareModal = (props) => {
    const { show, ...rest } = props;
    const shared = isShared(adminAt, rest?.shared_with);
    return dispatch(
      reduxToggleUniversalModal({
        show,
        title: makeTitle({ shared }),
        fullControl: true,
        renderComponent: () => (
          <ShareTestimonialModalComponent
            onComplete={afterResponse}
            close={() => toggleShareModal({ show: false })}
            shared={shared}
            story={{ ...rest }}
          />
        )
      })
    );
  };
  // -----------------------------------------------------------------------------------------

  const { communities, exclude, mounted, categories: selectedCategories } = state || {};

  // -----------------------------------------------------------------------------------------

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
      d,
      // `${smartString(d.tags.map((t) => t.name).join(", "), 30)}`,
      d
    ]);
    return fashioned;
  };

  const data = fashionData(otherTestimonials || []);

  const fetch = (passedComms = []) => {
    const ids = (passedComms || communities || []).map((it) => it.id);
    makeError(SEARCH_ERROR, null);
    setLoading(true);
    apiCall(URL, {
      community_ids: ids,
      category_ids: selectedCategories?.map((it) => it.id),
      exclude: exclude || false,
      limit: getLimit(PAGE_PROPERTIES.SHARED_TESTIMONIALS.key)
    })
      .then((response) => {
        setLoading(false);
        if (response.success) {
          putOtherTestimonialsInRedux(response.data);
          putMetaDataToRedux({ ...meta, otherTestimonials: response.cursor });
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
        name: "Shared With",
        key: "shared-to",
        options: {
          filter: false,
          download: false,
          customBodyRender: (d) => {
            return <b>{smartString(d?.shared_with?.map((t) => t.name).join(", "), 30) || "..."}</b>;
          }
        }
      },

      {
        name: "Manage",
        key: "manage",
        options: {
          filter: false,
          delete: false,
          customBodyRender: (d) => {
            const shared = isShared(adminAt, d?.shared_with);
            return (
              <small
                onClick={() => toggleShareModal({ show: true, shared, ...d })}
                className="touchable-opacity"
                style={{
                  background: shared ? "rgb(255 239 228)" : "rgb(218 242 208)",
                  color: shared ? "rgb(232 54 54)" : "green",
                  fontWeight: "bold",
                  borderRadius: 50,
                  padding: "3px 10px"
                }}
              >
                <i className={`fa fa-${shared ? "times" : "plus"}`} /> {shared ? "Remove" : "Add"}
              </small>
            );
          }
        }
      }
    ];
  };

  const metaData = meta && meta.otherTestimonials;
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
        updateReduxFunction: putOtherTestimonialsInRedux,
        reduxItems: data,
        apiUrl: URL,
        pageProp: PAGE_PROPERTIES.SHARED_TESTIMONIALS,
        updateMetaData: putMetaDataToRedux,
        name: "otherTestimonials",
        meta: meta,
        otherArgs: {
          community_ids: ids
        }
      }),
    customSearchRender: (searchText, handleSearch, hideSearch, options) => (
      <SearchBar
        url={URL}
        reduxItems={otherTestimonials}
        updateReduxFunction={putOtherTestimonialsInRedux}
        handleSearch={handleSearch}
        hideSearch={hideSearch}
        pageProp={PAGE_PROPERTIES.SHARED_TESTIMONIALS}
        updateMetaData={putMetaDataToRedux}
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
          reduxItems={otherTestimonials}
          updateReduxFunction={putOtherTestimonialsInRedux}
          columns={columns}
          limit={getLimit(PAGE_PROPERTIES.SHARED_TESTIMONIALS.key)}
          applyFilters={applyFilters}
          updateMetaData={putMetaDataToRedux}
          name="otherTestimonials"
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
        page: PAGE_PROPERTIES.SHARED_TESTIMONIALS,
        updateReduxFunction: putOtherTestimonialsInRedux,
        reduxItems: otherTestimonials,
        url: URL,
        updateMetaData: putMetaDataToRedux,
        name: "otherTestimonials",
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
          title: "Testimonials that are open to be shared with your community",
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
            defaultSelected={communities || []}
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
        <div style={{ background: "#fbfbfb", borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
          <Tooltip
            placement="top"
            title="Click this button to find events from the communities you have selected above "
          >
            <Button
              onClick={() => {
                fetch(null);
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
