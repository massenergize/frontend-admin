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
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_ITEMS_PER_PAGE_OPTIONS } from "../../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { withStyles } from "@mui/styles";
import styles from "../../../components/Widget/widget-jss";
import { reduxToggleUniversalModal } from "../../../redux/redux-actions/adminActions";
import ShareTestimonialModalComponent from "./ShareTestimonialModalComponent";

function TestimonialsFromOthers({ classes, state }) {
  const dispatch = useDispatch();
  const listOfCommunities = useSelector((state) => state.getIn(["otherCommunities"]));
  let categories = useSelector((state) => state.getIn(["allTags"]));
  let tags = categories
    ?.map((c) => c.tags)
    .flat()
    .sort((a, b) => a?.name?.localeCompare(b?.name));
  const meta = useSelector((state) => state.getIn(["paginationMetaData"]));

  const stories = useSelector((state) => state.getIn(["allTestimonials"]));

  const toggleShareModal = (props) => {
    const { show, ...rest } = props;
    return dispatch(
      reduxToggleUniversalModal({
        show,
        title: "Share Testimonial",
        fullControl: true,
        renderComponent: () => <ShareTestimonialModalComponent {...rest} />
      })
    );
  };

  // -----------------------------------------------------------------------------------------
  const [loading, setLoading] = useState(false);
  const { communities, exclude, mounted } = state || {};

  // -----------------------------------------------------------------------------------------
  const setCommunities = (communities) => {
    // putStateInRedux({ ...(state || {}), communities });
  };
  const setMounted = (mounted) => {
    // putStateInRedux({ ...(state || {}), mounted });
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

  const renderSelected = (items, func) => {
    return <span style={{ fontWeight: "bold", color: "purple" }}>{items.map((it) => it?.name).join(", ")}</span>;
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
        }
      })
      .catch((e) => {
        setLoading(false);
        console.log("OTHER_EVENTS_BE_ERROR:", e.toString());
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
        name: "Full View",
        key: "full-view",
        options: {
          filter: false,
          delete: false,
          customBodyRender: (d) => (
            <small
              onClick={() => toggleShareModal({ show: true, ...d })}
              className="touchable-opacity"
              style={{
                background: "rgb(218 242 208)",
                color: "green",
                fontWeight: "bold",
                borderRadius: 50,
                padding: "3px 10px"
              }}
            >
              <i className="fa fa-share" /> Share
            </small>
          )
        }
      }
    ];
  };
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
        apiUrl: "/events.others.listForCommunityAdmin",
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
        url={"/events.others.listForCommunityAdmin"}
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
          url={"/events.others.listForCommunityAdmin"}
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
            renderSelectedItems={renderSelected}
            placeholder="Select Communities..."
            defaultSelected={[]}
            data={listOfCommunities}
            labelExtractor={(it) => it.name}
            valueExtractor={(it) => it.id}
            onChange={(items) => setCommunities(items)}
            multiple
          />

          <small style={{ color: "grey" }}>Add categories and tags to narrow down your search</small>

          <LightAutoComplete
            placeholder="Add categories or tags as filters..."
            defaultSelected={communities || []}
            data={tags}
            labelExtractor={(it) => it.name}
            valueExtractor={(it) => it.id}
            onChange={(items) => setCommunities(items)}
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
                setMounted(true);
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

      {renderTable({ data, options })}
    </div>
  );
}

export default withStyles(styles)(TestimonialsFromOthers);
