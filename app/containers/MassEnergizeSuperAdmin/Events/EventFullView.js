import { Button, Paper, Tooltip, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getHumanFriendlyDate } from "../../../utils/common";
import { apiCall } from "../../../utils/messenger";
import Loading from "dan-components/Loading";
import { useHistory, withRouter } from "react-router-dom";
import { reduxAddToHeap } from "../../../redux/redux-actions/adminActions";

function EventFullView({ events, match, storeEventInHeap, eventsInHeap }) {
  const history = useHistory();
  const [event, setEvent] = useState(undefined);

  const {
    name,
    community,
    description,
    featured_summary,
    image,
    end_date_and_time,
    start_date_and_time,
    location,
    tags,
  } = event || {};
  const tagString = (tags || []).map((t) => t.name).join(", ");
  const { address, city, state, zipcode, unit } = location || {};

  //   ------------------------------------------------------------------------------------
  useEffect(() => {
    var id = match.params.id;
    id = id && id.toString();
    // Find from the list of "other events" in the table
    const foundInRedux = (events || {}).find((ev) => ev.id.toString() === id);
    if (foundInRedux) return setEvent(foundInRedux);

    // Otherwise, check if the item has been loaded before, and is in the heap
    const foundInHeap = (eventsInHeap || {})[id];
    if (foundInHeap) return setEvent(foundInHeap);

    //  ------ Else fetch from API (Probably means the user is loading directly into this page(or refreshing)) -------
    apiCall("/events.info", { event_id: id })
      .then((response) => {
        if (!response.success) {
          setEvent(null);
          return console.log("FETCH_EVENT_ERR:", response.error);
        }
        setEvent(response.data);
        storeEventInHeap({
          eventsInHeap: { ...(eventsInHeap || {}), [id]: response.data },
        });
      })
      .catch((e) => {
        console.log("FETCH_EVENT_ERR:", e.toString());
      });
  }, []);

  //   ----------------------------------------------------------------------------------------
  const pageIsLoading = event === undefined;
  const couldNotFindEvent = event === null;

  if (couldNotFindEvent)
    return (
      <Paper>
        <div style={{ padding: "15px 25px" }}>
          <Typography variant="body1">
            Sorry, we could not find the event you were looking for....
          </Typography>
        </div>
        <div style={{ background: "#fbfbfb", display: "flex" }}>
          <Button
            variant="contained"
            color="secondary"
            className="touchable-opacity"
            style={{
              borderRadius: 0,
              padding: 10,
              width: 200,
              background: "#d97c7c",
            }}
            onClick={() => history.push("/admin/read/events")}
          >
            <i className="fa fa-long-arrow-left" style={{ marginRight: 6 }} />{" "}
            Back
          </Button>
        </div>
      </Paper>
    );
  if (pageIsLoading) return <Loading />;

  //   ----------------------------------------------------------------------------------------
  return (
    <div>
      <Paper style={{ marginBottom: 10 }}>
        <div style={{ padding: "15px 25px" }}>
          <Typography variant="h5">{name || "..."}</Typography>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" style={{ marginRight: 15, fontSize: 17 }}>
              {getHumanFriendlyDate(start_date_and_time, true, false)}
            </Typography>
            <hr
              style={{
                width: 100,
                // border: "dotted 0px #e3e3e3",
                border: "dotted 0px #00bcd4",
                borderBottomWidth: 4,
              }}
            />

            <Typography variant="h6" style={{ marginLeft: 15, fontSize: 17 }}>
              {getHumanFriendlyDate(end_date_and_time, true, false)}
            </Typography>
            <Typography
              variant="h6"
              color="primary"
              style={{ marginLeft: "auto" }}
            >
              {(community && community.name) || "..."}
            </Typography>
          </div>
          {location && (
            <div>
              <Typography variant="caption" color="grey">
                LOCATION
              </Typography>
              <Typography variant="body1">
                {address || ""}
                <br />
                {`${state || ""} ${city || ""} ${unit || ""} ${zipcode || ""}`}
              </Typography>
            </div>
          )}
        </div>
        <Footer history={history} community={community} />
      </Paper>

      <Paper>
        <div style={{ padding: "15px 25px" }}>
          <div style={{ marginBottom: 10 }}>
            <Typography variant="h6">FEATURED SUMMARY</Typography>
            <div dangerouslySetInnerHTML={{ __html: featured_summary }} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <Typography variant="h6">TAGS</Typography>
            <Typography variant="body2">{tagString}</Typography>
          </div>
          <div style={{ marginBottom: 10 }}>
            <img
              src={(image || {}).url}
              style={{ width: "100%", maxHeight: 400, objectFit: "contain" }}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <Typography variant="h6">DESCRIPTION</Typography>
            <div dangerouslySetInnerHTML={{ __html: description }} />
          </div>
        </div>
        <Footer history={history} community={community} />
      </Paper>
    </div>
  );
}
const mapStateToProps = (state) => {
  const heap = state.getIn(["heap"]);
  return {
    events: state.getIn(["otherEvents"]),
    eventsInHeap: (heap || {}).eventsInHeap,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      storeEventInHeap: reduxAddToHeap,
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(EventFullView));

// --------------------------------------------------------------
const Footer = ({ history, community }) => {
  return (
    <div style={{ background: "#fbfbfb", display: "flex" }}>
      <Button
        variant="contained"
        color="secondary"
        className="touchable-opacity"
        style={{
          borderRadius: 0,
          padding: 10,
          width: 200,
          background: "#d97c7c",
        }}
        onClick={() => history.push("/admin/read/events")}
      >
        <i className="fa fa-long-arrow-left" style={{ marginRight: 6 }} /> Back
      </Button>
      <div style={{ marginLeft: "auto" }}>
        <Tooltip
          placement="top"
          title={`Only admins of ${(community && community.name) ||
            "..."} can edit this event`}
        >
          <Button
            variant="contained"
            color="secondary"
            style={{
              borderRadius: 0,
              padding: 10,
              width: 200,
            }}
          >
            Edit Event
          </Button>
        </Tooltip>
        <Button
          variant="contained"
          color="primary"
          style={{
            borderRadius: 0,
            padding: 10,
            width: 200,
          }}
        >
          Copy Event
        </Button>
      </div>
    </div>
  );
};
