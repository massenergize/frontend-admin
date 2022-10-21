import {
  Avatar,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Typography,
} from "@material-ui/core";
import { FileCopy } from "@material-ui/icons";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getHumanFriendlyDate, smartString } from "../../../utils/common";
import { apiCall } from "../../../utils/messenger";
import LightAutoComplete from "../Gallery/tools/LightAutoComplete";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import METable from "../ME  Tools/table /METable";
import CallMadeIcon from "@material-ui/icons/CallMade";

function EventsFromOtherCommunities({
  putOtherEventsInRedux,
  otherCommunities,
  otherEvents,
  classes,
  state,
  putStateInRedux,
}) {
  const [loading, setLoading] = useState(false);
  const { communities, exclude } = state || {};

  const setCommunities = (communities) => {
    putStateInRedux({ ...(state || {}), communities });
  };
  const setExclude = (exclude) => {
    putStateInRedux({ ...(state || {}), exclude });
  };

  const fetchOtherEvents = () => {
    const ids = (communities || []).map((it) => it.id);
    setLoading(true);
    apiCall("/events.others.listForCommunityAdmin", {
      community_ids: ids,
      exclude: exclude || false,
    })
      .then((response) => {
        setLoading(false);
        if (response.success) return putOtherEventsInRedux(response.data);
      })
      .catch((e) => {
        setLoading(false);
        console.log("OTHER_EVENTS_BE_ERROR:", e.toString());
      });
  };

  const fashionData = (data) => {
    if (!data) return [];

    const fashioned = data.map((d) => [
      d.id,
      getHumanFriendlyDate(d.start_date_and_time, true),
      getHumanFriendlyDate(d.end_date_and_time, true),
      {
        id: d.id,
        image: d.image,
        initials: `${d.name && d.name.substring(0, 2).toUpperCase()}`,
      },
      smartString(d.name), // limit to first 30 chars
      `${smartString(d.tags.map((t) => t.name).join(", "), 30)}`,
      d.is_global ? "Template" : d.community && d.community.name,
      d.id,
    ]);
    return fashioned;
  };

  const makeColumns = () => {
    return [
      {
        name: "ID",
        key: "id",
        options: {
          filter: false,
        },
      },
      {
        name: "Start Date",
        key: "date",
        options: {
          filter: false,
          download: false,
        },
      },
      {
        name: "End Date",
        key: "date",
        options: {
          filter: false,
          download: false,
        },
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
              {d.image && (
                <Avatar
                  alt={d.initials}
                  src={d.image.url}
                  style={{ margin: 10 }}
                />
              )}
              {!d.image && <Avatar style={{ margin: 10 }}>{d.initials}</Avatar>}
            </div>
          ),
        },
      },
      {
        name: "Name",
        key: "name",
        options: {
          filter: false,
        },
      },

      {
        name: "Tags",
        key: "tags",
        options: {
          filter: true,
          filterType: "textField",
        },
      },
      {
        name: "Community",
        key: "community",
        options: {
          filter: true,
          filterType: "multiselect",
        },
      },
      {
        name: "Full View",
        key: "full-view",
        options: {
          filterType: "multiselect",
          customBodyRender: (id) => (
            <Link to={`/admin/read/event/${id}/event-view`}>
              <CallMadeIcon size="small" variant="outlined" color="secondary" />
            </Link>
          ),
        },
      },
    ];
  };

  const data = fashionData(otherEvents || []);
  const options = {
    filterType: "dropdown",
    responsive: "stacked",
    print: true,
    rowsPerPage: 25,
    rowsPerPageOptions: [10, 25, 100],
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
          {" "}
          No open events are available for your list of communities. Select
          other ones
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
          columns: makeColumns(),
        }}
      />
    );
  };

  return (
    <div>
      <Paper style={{ marginBottom: 15 }}>
        <div style={{ padding: 20 }}>
          <Typography variant="h6">
            Show events from communities I select below
          </Typography>

          <LightAutoComplete
            defaultSelected={communities || []}
            data={otherCommunities || []}
            labelExtractor={(it) => it.name}
            valueExtractor={(it) => it.id}
            onChange={(items) => setCommunities(items)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={exclude}
                onChange={(e) => setExclude(e.target.checked)}
              />
            }
            label="Exclude events from communities I have selected"
          />
        </div>
        <div style={{ background: "#fbfbfb" }}>
          <Button
            onClick={() => fetchOtherEvents()}
            disabled={!(communities || []).length || loading}
            variant="contained"
            color="secondary"
            style={{
              borderRadius: 0,
              padding: 10,
              width: 200,
            }}
          >
            {loading && (
              <i
                className=" fa fa-spinner fa-spin"
                style={{ marginRight: 5, color: "white" }}
              />
            )}
            {loading ? "Fetching..." : "Fetch"}
          </Button>
        </div>
      </Paper>

      {renderTable({ data, options })}
    </div>
  );
}

export default EventsFromOtherCommunities;
