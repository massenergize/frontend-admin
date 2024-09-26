import { Avatar, Button, Checkbox, FormControl, Paper, Tooltip, Typography } from "@mui/material";
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
import { renderSelectedItems } from "../Testimonials/TestimonialsFromOthers";
import { FormControlLabel } from "@mui/material";

function EventsFromOtherCommunities({
  putOtherEventsInRedux,
  otherCommunities,
  otherEvents,
  classes,
  state,
  putStateInRedux,
  meta,
  putMetaDataToRedux
}) {
  const [loading, setLoading] = useState(false);
  const { communities, exclude, mounted } = state || {};

  const setCommunities = (communities) => {
    putStateInRedux({ ...(state || {}), communities });
  };
  const setMounted = (mounted) => {
    putStateInRedux({ ...(state || {}), mounted });
  };

  const fashionData = (data) => {
    if (!data) return [];

    const fashioned = data.map((d) => [
      d.id,
      getHumanFriendlyDate(d.start_date_and_time, true),
      {
        id: d.id,
        image: d.image,
        initials: `${d.name && d.name.substring(0, 2).toUpperCase()}`
      },
      smartString(d.name), // limit to first 30 chars
      `${smartString(d.tags.map((t) => t.name).join(", "), 30)}`,
      d.is_global ? "Template" : d.community && d.community.name,
      d.id
    ]);
    return fashioned;
  };

  const data = fashionData(otherEvents || []);

  useEffect(() => {
    if (!mounted) {
      // First time the page loads, Preselect all communities
      setCommunities(otherCommunities || []);
      // fetchOtherEvents(otherCommunities);  // Uncheck if we want to automatically load in events from all the preselected communities as well
    }
  }, [otherCommunities]);

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
        name: "Date",
        key: "date",
        options: {
          filter: false,
          download: true
        }
      },
      {
        name: "Event",
        key: "event",
        options: {
          sort: false,
          filter: false,
          download: false,
          customBodyRender: (d) => (
            <div>
              {d.image && <Avatar alt={d.initials} src={d.image.url} style={{ margin: 10 }} />}
              {!d.image && <Avatar style={{ margin: 10 }}>{d.initials}</Avatar>}
            </div>
          )
        }
      },
      {
        name: "Name",
        key: "name",
        options: {
          filter: false
        }
      },

      {
        name: "Tags",
        key: "tags",
        options: {
          filter: true,
          filterType: "multiselect"
        }
      },
      {
        name: "Community",
        key: "community",
        options: {
          filter: true,
          filterType: "multiselect"
        }
      },
      {
        name: "Full View",
        key: "full-view",
        options: {
          filter: false,
          delete: false,
          customBodyRender: (id) => (
            <Link to={`/admin/read/event/${id}/event-view?from=others`}>
              <CallMadeIcon size="small" variant="outlined" color="secondary" />
            </Link>
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
        updateReduxFunction: putOtherEventsInRedux,
        reduxItems: otherEvents,
        apiUrl: "/events.others.listForCommunityAdmin",
        pageProp: PAGE_PROPERTIES.OTHER_COMMUNITY_EVENTS,
        updateMetaData: putMetaDataToRedux,
        name: "otherEvents",
        meta: meta,
        otherArgs: {
          community_ids: ids
        }
      }),
    customSearchRender: (searchText, handleSearch, hideSearch, options) => (
      <SearchBar
        url={"/events.others.listForCommunityAdmin"}
        reduxItems={otherEvents}
        updateReduxFunction={putOtherEventsInRedux}
        handleSearch={handleSearch}
        hideSearch={hideSearch}
        pageProp={PAGE_PROPERTIES.OTHER_COMMUNITY_EVENTS}
        updateMetaData={putMetaDataToRedux}
        name="otherEvents"
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
        meta: meta,
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
          Looking for events...
        </Paper>
      );
    if (!data.length)
      return (
        <Paper style={{ padding: "15px 25px" }}>
          {mounted ? (
            <span> No open events are available for your list of communities. Select other ones</span>
          ) : (
            <span>
              When you select communities and <b>"Apply"</b>, events will show here..
            </span>
          )}
        </Paper>
      );
    return (
      <METable
        classes={classes}
        page={PAGE_PROPERTIES.OTHER_COMMUNITY_EVENTS}
        tableProps={{
          title: "Events from other communities",
          options,
          data,
          columns: makeColumns()
        }}
      />
    );
  };

  return (
    <div>
      <Seo name={`Events from other communities`} />
      <Paper style={{ marginBottom: 15 }}>
        <div style={{ padding: 20 }}>
          <Typography variant="h6">Show events from communities I select below</Typography>

          <small style={{ color: "grey" }}>
            When you are done selecting your communities, click the <b>"apply"</b>
            button below
          </small>

          <LightAutoComplete
            renderSelectedItems={renderSelectedItems}
            placeholder="Select Communities..."
            defaultSelected={communities || []}
            data={otherCommunities || []}
            labelExtractor={(it) => it.name}
            valueExtractor={(it) => it.id}
            onChange={(items) => setCommunities(items)}
            multiple
          />
      
          {/* <FormControlLabel
            control={
            
              <Checkbox
                // checked={exclude}
                // onChange={(e) => setExclude(e.target.checked)}
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
                minWidth: 200
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

export default EventsFromOtherCommunities;
