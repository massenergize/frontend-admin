import { Button, Paper, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  fetchParamsFromURL,
  getHumanFriendlyDate,
} from "../../../utils/common";
import { apiCall } from "../../../utils/messenger";
import Loading from "dan-components/Loading";
import { useHistory, withRouter } from "react-router-dom";
import {
  loadAllEvents,
  reduxAddToHeap,
  reduxLoadAllOtherEvents,
  reduxUpdateHeap,
} from "../../../redux/redux-actions/adminActions";
import EventShareModal from "./EventShareModal";

import { PORTAL_HOST } from "../../../config/constants";
import { dateFormatString } from "../Community/utils";
import EditEventForm from "./EditEventForm";
import Seo from "../../../components/Seo/Seo";

const open = {
  background: "#4faa4f",
};
const close = {
  background: "#d87c7b",
};
export const PUBLICITY_PROPS = {
  OPEN: {
    icon: "fa-globe",
    style: open,
    info: "This event/campaign can be shared to any community",
    label: "Open",
    tooltip: "Share with any community",
  },
  OPEN_TO: {
    icon: "fa-users",
    style: open,
    info:
      "This event/campaign can only be shared with the listed communities below",
    label: "Open To",
    tooltip: "Share with a few selected",
  },
  CLOSE: {
    icon: "fa-lock",
    style: close,
    info:
      "This event/compaign is closed. It can't be shared with any community",
    label: "Closed",
    tooltip: "Cannot be shared",
  },
  CLOSED_TO: {
    icon: "fa-users",
    style: { ...close, background: "#e79157" },
    info: "This event/campaign is only closed to the communities listed below",
    label: "Closed To",
    tooltip: "Open to all except a few listed",
  },
};
export const listToString = (list) => {
  if (!list || !list.length) return "";

  var str = "";
  for (var i in list) {
    const com = list[i];
    if (Number(i) === 0) str += com.name;
    else str += `, ${com.name}`;
  }
  return str;
};
function EventFullView(props) {
  const {
    events,
    match,
    storeEventInHeap,
    eventsInHeap,
    auth,
    putEventsInRedux,
    myEvents, // Events that are from the communities the current admin manages
    communities,
    putOtherEventsInRedux,
    heap,
  } = props;
  const history = useHistory();
  const [event, setEvent] = useState(undefined);
  const [hasControl, setHasControl] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  // ------------------------------------------------------------
  const { dialog } = fetchParamsFromURL(window.location, "dialog");
  const { from } = fetchParamsFromURL(window.location, "from");

  const modalState = (dialog || "").toLowerCase() === "open";
  // ------------------------------------------------------------
  const [showShareModal, setshowShareModal] = useState(modalState);
  const {
    name,
    community,
    end_date_and_time,
    start_date_and_time,
    location,

    publicity,
    communities_under_publicity,
  } = event || {};

  // const publicityProps = PUBLICITY_PROPS[publicity] || {};
  // const tagString = (tags || []).map((t) => t.name).join(", ");
  const { address, city, state, zipcode, unit } = location || {};
  var id = match.params.id;
  id = id && id.toString();

  const putEventInHeap = (event) => {
    storeEventInHeap(
      {
        eventsInHeap: { ...(eventsInHeap || {}), [event.id.toString()]: event },
      },
      heap
    );
  };
  //   ------------------------------------------------------------------------------------

  const finder = (ev, id) => ev.id.toString() === id;
  useEffect(() => {
    // Find from the list of "other events" in the table

    var foundInRedux = (events || []).find((ev) => finder(ev, id)); // search locally in the "otherEvents" list
    if (!foundInRedux)
      foundInRedux = (myEvents || []).find((ev) => finder(ev, id)); // search locally in admin's events list

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
        putEventInHeap(response.data);
        checkIfAdminControlsEvent(response.data, auth);
      })
      .catch((e) => {
        console.log("FETCH_EVENT_ERR:", e.toString());
      });
  }, []);

  useEffect(() => {
    checkIfAdminControlsEvent(event, auth);
  }, [auth]);

  useEffect(() => {
    const found = (eventsInHeap || {})[id];
    if (found) setEvent(found);
  }, [eventsInHeap]);
  // ---------------------------------------------------------------------------------------
  const checkIfAdminControlsEvent = (event, auth) => {
    if (auth && auth.is_super_admin && !auth.is_community_admin)
      return setHasControl(true); // super admin always has control

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
  //   ---------------------------------------------------------------------------------------
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
            onClick={() => history.goBack()}
          >
            <i className="fa fa-long-arrow-left" style={{ marginRight: 6 }} />{" "}
            Back
          </Button>
        </div>
      </Paper>
    );
  if (pageIsLoading) return <Loading />;

  //   -------------------------------------- HTML MARK UP --------------------------------------------------

  const sharedTo = listToString(event.shared_to);

  const makeURL = (event) => {
    return `${PORTAL_HOST}/${event &&
      (event.community || {}).subdomain}/events/${event && event.id}`;
  };
  return (
    <div>
      <Seo name={`Full View - ${event?.name}`} />
      <EventShareModal
        auth={auth}
        communities={communities}
        show={showShareModal}
        close={() => setshowShareModal(false)}
        toggleModal={setshowShareModal}
        event={event}
        updateEventInHeap={putEventInHeap}
        otherEvents={events}
        myEvents={myEvents}
        updateNormalEventListInRedux={putEventsInRedux}
        updateOtherEventListInRedux={putOtherEventsInRedux}
      />

      <Paper style={{ marginBottom: 10 }}>
        <div style={{ padding: "15px 25px" }}>
          <Typography
            variant="h5"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {name || "..."}{" "}
          </Typography>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" style={{ marginRight: 15, fontSize: 17 }}>
              {dateFormatString(
                new Date(start_date_and_time),
                new Date(end_date_and_time)
              )}
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
              <Typography variant="caption" color="primary">
                <b> LOCATION</b>
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
          viewOnPortal={() => window.open(makeURL(event), "_blank")}
          history={history}
          community={community}
          hasControl={hasControl}
          id={id}
          copyEvent={copyEvent}
          isCopying={isCopying}
          publicity={publicity}
          communities={communities_under_publicity}
          share={() => setshowShareModal(true)}
          from={from}
        />
      </Paper>

      <Paper style={{ marginBottom: 10 }}>
        <div style={{ padding: "15px 25px" }}>
          <Typography variant="body1">
            {listToString(event.communities_under_publicity)}
          </Typography>
          <div style={{ marginTop: 10 }}>
            <Typography variant="H6" color="primary">
              <b>CURRENTLY SHARED TO</b>
            </Typography>
            <Typography variant="body1">
              {sharedTo ? (
                sharedTo
              ) : (
                <span style={{ color: "#d5d5d5" }}>
                  Has not been shared with any communities yet
                </span>
              )}
            </Typography>
          </div>
        </div>
      </Paper>

      <EditEventForm passedEvent={event} />
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
    communities: state.getIn(["communities"]),
    heap,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      storeEventInHeap: reduxAddToHeap,
      putEventsInRedux: loadAllEvents,
      putOtherEventsInRedux: reduxLoadAllOtherEvents,
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
  publicity,
  communities,
  from,
  share,
  viewOnPortal,
}) => {
  const eventNotice = hasControl
    ? ""
    : `Only admins of ${(community && community.name) ||
        "..."} can edit this event`;

  const cannotBeShared = publicity === "CLOSE";

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
        onClick={() => history.push(`/admin/read/events?from=${from}`)}
      >
        <i className="fa fa-long-arrow-left" style={{ marginRight: 6 }} /> Back
      </Button>
      <Button
        variant="contained"
        color="secondary"
        style={{
          borderRadius: 0,
          padding: 10,
          width: 200,
          pointerEvents: "all",
          cursor: "pointer",
        }}
        onClick={() => {
          viewOnPortal && viewOnPortal();
        }}
      >
        <Tooltip
          placement="top"
          title={"See what event looks like on the community portal"}
        >
          <span> View Event on Portal </span>
        </Tooltip>
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
            pointerEvents: "all",
            cursor: "pointer",
          }}
          disabled={cannotBeShared && !hasControl}
          onClick={() => share && share()}
        >
          {isCopying && (
            <i
              className=" fa fa-spinner fa-spin"
              style={{ color: "white", marginRight: 5 }}
            />
          )}
          <Tooltip placement="top" title="Share event to your community">
            <>
              <span> Share Event</span>
              <i
                className="fa fa-long-arrow-right"
                style={{ marginLeft: 6 }}
              />{" "}
            </>
          </Tooltip>
        </Button>
      </div>
    </div>
  );
};
