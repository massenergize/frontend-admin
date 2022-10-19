import {
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

function EventsFromOtherCommunities({
  putOtherEventsInRedux,
  otherCommunities,
  otherEvents,
  classes,
}) {
  const [exclude, setExclude] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);

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
    console.log("Lets see comms", otherEvents);
    if (!data) return [];
    const fashioned = data.map((d) => [
      d.id,
      getHumanFriendlyDate(d.start_date_and_time, true),
      {
        id: d.id,
        image: d.image,
        initials: `${d.name && d.name.substring(0, 2).toUpperCase()}`,
      },
      smartString(d.name), // limit to first 30 chars
      `${smartString(d.tags.map((t) => t.name).join(", "), 30)}`,
      d.is_global ? "Template" : d.community && d.community.name,
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
        name: "Date",
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

      //   {
      //     name: "Edit",
      //     key: "edit_or_copy",
      //     options: {
      //       filter: false,
      //       download: false,
      //       customBodyRender: (id) => (
      //         <div>
      //           <Link
      //             onClick={async () => {
      //               const copiedEventResponse = await apiCall("/events.copy", {
      //                 event_id: id,
      //               });
      //             }}
      //             to="/admin/read/events"
      //           >
      //             <FileCopy size="small" variant="outlined" color="secondary" />
      //           </Link>
      //         </div>
      //       ),
      //     },
      //   },
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
  return (
    <div>
      <Paper style={{ marginBottom: 15 }}>
        <div style={{ padding: 20 }}>
          <Typography variant="h6">
            Show events from communities I select below
          </Typography>

          <LightAutoComplete
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
            label="From all communities, except the ones I have selected"
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

      <METable
        classes={classes}
        page={PAGE_PROPERTIES.OTHER_COMMUNITY_EVENTS}
        tableProps={{
          title: "From other communities",
          options,
          data,
          colums: makeColumns(),
        }}
      />
    </div>
  );
}

export default EventsFromOtherCommunities;
