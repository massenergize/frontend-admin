import { Button, Paper, Tooltip, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getHumanFriendlyDate } from "../../../utils/common";
import { apiCall } from "../../../utils/messenger";
import Loading from "dan-components/Loading";
import { useHistory, withRouter } from "react-router-dom";
import {
  loadAllEvents,
  reduxAddToHeap,
} from "../../../redux/redux-actions/adminActions";

function EventFullView({
  events,
  match,
  storeEventInHeap,
  eventsInHeap,
  auth,
  putEventsInRedux,
  myEvents,
}) {
  const history = useHistory();
  const [event, setEvent] = useState(undefined);
  const [hasControl, setHasControl] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
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
  var id = match.params.id;
  id = id && id.toString();
  //   ------------------------------------------------------------------------------------
  useEffect(() => {
    // Find from the list of "other events" in the table

    var foundInRedux = (events || []).find((ev) => ev.id.toString() === id); // search locally in the "otherCommunities" list
    if (!foundInRedux)
      foundInRedux = (myEvents || []).find((ev) => ev.id.toString() === id); // search locally in admin's community list

    if (foundInRedux) {
      checkIfAdminControlsEvent(foundInRedux, auth);
      return setEvent(foundInRedux);
    }

    // Otherwise, check if the item has been loaded before, and is in the heap
    const foundInHeap = (eventsInHeap || {})[id];
    if (foundInHeap) {
      checkIfAdminControlsEvent(foundInHeap, auth);
      return setEvent(foundInHeap);
    }

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
        checkIfAdminControlsEvent(response.data, auth);
      })
      .catch((e) => {
        console.log("FETCH_EVENT_ERR:", e.toString());
      });
  }, []);

  useEffect(() => {
    checkIfAdminControlsEvent(event, auth);
  }, [auth]);

  const checkIfAdminControlsEvent = (event, auth) => {
    const coms = ((auth && auth.admin_at) || []).map((c) => c.id.toString());
    if (event) {
      const { community } = event || {};
      const ID = community && community.id;
      setHasControl(coms.includes(ID && ID.toString()));
    }
  };

  const copyEvent = () => {
    setIsCopying(true);
    apiCall("/events.copy", {
      event_id: id,
    })
      .then((copiedEventResponse) => {
        if (copiedEventResponse && copiedEventResponse.success) {
          const newEvent = copiedEventResponse && copiedEventResponse.data;
          history.push(`/admin/edit/${newEvent.id}/event`);
          putEventsInRedux([newEvent, ...(myEvents || [])]);
        } else console.log("ERROR_COPYING_BE:", copiedEventResponse.error);
      })
      .catch((e) => {
        setIsCopying(false);
        console.log("EVENT_COPY_ERROR:", e.toString());
      });
  };
  //   ----------------------------------------------------------------------------------------
  const pageIsLoading = event === undefined;
  const couldNotFindEvent = event === null;
  //   ----------------------------------------------------------------------
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
            All Events
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
        <Footer
          history={history}
          community={community}
          hasControl={hasControl}
          id={id}
          copyEvent={copyEvent}
          isCopying={isCopying}
        />
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
        <Footer
          history={history}
          community={community}
          hasControl={hasControl}
          id={id}
          isCopying={isCopying}
        />
      </Paper>
    </div>
  );
}
const mapStateToProps = (state) => {
  const heap = state.getIn(["heap"]);
  return {
    events: state.getIn(["otherEvents"]),
    eventsInHeap: (heap || {}).eventsInHeap,
    myEvents: state.getIn(["allEvents"]),
    auth: state.getIn(["auth"]),
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      storeEventInHeap: reduxAddToHeap,
      putEventsInRedux: loadAllEvents,
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(EventFullView));

// --------------------------------------------------------------
const Footer = ({
  history,
  community,
  hasControl,
  id,
  copyEvent,
  isCopying,
}) => {
  const eventNotice = hasControl
    ? ""
    : `Only admins of ${(community && community.name) ||
        "..."} can edit this event`;
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
        <i className="fa fa-long-arrow-left" style={{ marginRight: 6 }} /> All
        Events
      </Button>
      <div style={{ marginLeft: "auto" }}>
        <Button
          disabled={!hasControl}
          variant="contained"
          color="secondary"
          style={{
            borderRadius: 0,
            padding: 10,
            width: 200,
            pointerEvents: "all",
            cursor: "pointer",
          }}
          onClick={() => history.push(`/admin/edit/${id}/event`)}
        >
          <Tooltip placement="top" title={eventNotice}>
            <span> Edit Event</span>
          </Tooltip>
        </Button>

        <Button
          variant="contained"
          color="primary"
          style={{
            borderRadius: 0,
            padding: 10,
            width: 200,
          }}
          onClick={() => copyEvent && copyEvent()}
          disabled={isCopying}
        >
          {isCopying && (
            <i
              className=" fa fa-spinner fa-spin"
              style={{ color: "white", marginRight: 5 }}
            />
          )}
          Copy Event
        </Button>
      </div>
    </div>
  );
};
