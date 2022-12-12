import { Checkbox, Tab, Tabs, Tooltip } from "@material-ui/core";
import { Button, FormControlLabel, Typography } from "@material-ui/core";

import React, { useEffect, useState } from "react";
import ThemeModal from "../../../components/Widget/ThemeModal";
import { fetchParamsFromURL } from "../../../utils/common";
import { FROM } from "../../../utils/constants";
import { apiCall } from "../../../utils/messenger";

/**
 * This component lists all communities that an admin
 * viewing an event is allowed to share to
 * @returns
 */

function EventShareModal({
  show,
  toggleModal,
  event,
  auth,
  communities,
  otherEvents,
  myEvents,
  updateEventInHeap,
  updateOtherEventListInRedux,
  updateNormalEventListInRedux,
}) {
  const [communitiesToShareTo, setCommunities] = useState([]); // Selected communities to share to
  const [changed, setChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  const isCommunityAdmin = auth && auth.is_community_admin;
  const isSuperAdmin = auth && auth.is_super_admin;

  const { from } = fetchParamsFromURL(window.location, "from");

  const replaceInRedux = (event, list, reduxFxn) => {
    const rem = (list || []).filter((ev) => ev.id !== event.id);
    reduxFxn([event, ...rem]);
  };

  useEffect(() => {
    var sharedTo = (event || {}).shared_to || [];
    const idsOfCommmunitiesSharedTo = sharedTo.map((com) => com.id);
    setCommunities(idsOfCommmunitiesSharedTo);
  }, [event]);

  /**
   * Uses the publicity status and allowed communities of an event
   * With the list of communities the admin manages
   * To create a new list that only includes communities that the current admin manages that are allowed
   * @returns
   */
  const getAllowedCommunities = () => {
    const { is_open, is_open_to, communities_under_publicity, is_closed_to } =
      event || {};
    const allowedCommunities = (communities_under_publicity || []).map(
      (c) => c.id
    );
    const adminCommunities = (auth && auth.admin_at) || [];
    // Event is open and user is a cadmin, they can share to any of their communities
    if (is_open && isCommunityAdmin) return (auth && auth.admin_at) || [];
    // Event is open and use is a super admin, they can share to any commmunity on the site
    if (is_open && isSuperAdmin) return communities || [];
    // Event is only open to a selection of communities, check the admin's community list
    // against the allowed community list, and retrieve only communities that the admin manages, that are allowed
    var allowed;
    if (is_open_to && isCommunityAdmin) {
      allowed = adminCommunities.filter((c) =>
        allowedCommunities.includes(c.id)
      );
      return allowed;
    }

    if (is_open_to && isSuperAdmin) {
      allowed = (communities || []).filter((c) =>
        allowedCommunities.includes(c.id)
      );

      return allowed;
    }

    // If event is open to everyone but closed to a certain group
    // Check if any of the admin's communities is listed under the disallowed communities and remove

    if (is_closed_to && isCommunityAdmin) {
      allowed = adminCommunities.filter(
        (c) => !allowedCommunities.includes(c.id)
      );
      return allowed;
    }

    if (is_closed_to && isSuperAdmin) {
      allowed = communities.filter((c) => !allowedCommunities.includes(c.id));
      return allowed;
    }

    return [];
  };

  const groupTheOptions = () => {
    const allowed = getAllowedCommunities();
    // Collect all communities that this event has been shared to
    var sharedTo = (event || {}).shared_to || [];
    var alreadySharedTo = sharedTo.map((c) => c.id);
    // Given the allowed communities based on the admin's communties(they manage), only retrieve the communities that the event has not been shared to
    var shareTo = allowed.filter((c) => !alreadySharedTo.includes(c.id));
    const shareIds = shareTo.map((c) => c.id);

    var unShare = allowed.filter((c) => !shareIds.includes(c.id));

    return { shareTo, unShare };
  };

  /**
   * Sends a request to the backend to update the content
   */
  const sendApiRequest = () => {
    setLoading(true);
    apiCall("/events.update", {
      shared_to: communitiesToShareTo,
      event_id: event.id,
    })
      .then((response) => {
        setLoading(false);
        if (!response.success)
          return console.log("SHARING_ERROR_BE:", response.error);

        setCommunities([]);
        setChanged(false);

        // Now we have the event object with updated "shared_to" field so
        updateEventInHeap(response.data);
        if (from === FROM.MAIN_EVENTS)
          return replaceInRedux(
            response.data,
            myEvents,
            updateOtherEventListInRedux
          );

        // Means the admin is viewing an event from outside all their communities
        if (from === FROM.OTHER_EVENTS) {
          return replaceInRedux(
            response.data,
            otherEvents,
            updateNormalEventListInRedux
          );
        }
      })
      .catch((e) => {
        console.log("SHARING_ERROR: ", e.toString());
        setLoading(false);
      });
  };

  /**
   * Add checked communities to a list to be sent to api
   * (whether in sharing/unsharing mode)
   * @param {*} id
   * @returns
   */
  const add = (id, communities) => {
    if (!communities.includes(id)) return [...communities, id];
    var rem = communities.filter((_id) => _id !== id);
    return rem;
  };

  //   -------------------------------------------------------------------

  return (
    <div>
      <ThemeModal
        open={show}
        fullControl
        close={() => toggleModal && toggleModal(false)}
      >
        <div
          style={{
            padding: "10px 20px",
            border: "solid 0px #fbfbfb",
            borderBottomWidth: 2,
          }}
        >
          <Typography variant="h6" style={{ fontSize: 18 }}>
            Select communities
          </Typography>
          <Typography variant="caption">
            Communities that you are allowed to share this event to
          </Typography>
        </div>
        <div
          style={{
            minHeight: 300,
            maxHeight: 400,
            width: 550,
            maxWidth: 550,
            minWidth: 550,
            position: "relative",
            overflowY: "scroll",
          }}
        >
          <div
            style={{
              padding: "0px 20px",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              maxHeight: 400,
              overflowY: "scroll",
            }}
          >
            <ShareWith
              selected={communitiesToShareTo}
              communities={getAllowedCommunities()}
              addSelected={(id) => {
                setCommunities(add(id, communitiesToShareTo));
                setChanged(true);
              }}
            />
          </div>
          {/* ----------- Footer -------------- */}
          <div
            style={{
              width: "100%",
              position: "absolute",
              bottom: 0,
              background: "#fbfbfb",
              display: "flex",
            }}
          >
            <div style={{ marginLeft: "auto" }}>
              <Button
                variant="contained"
                color="primary"
                style={{
                  borderRadius: 0,

                  padding: "8px 25px",
                  background: "#d97c7c",
                }}
                className="touchable-opacity"
                onClick={() => toggleModal && toggleModal(false)}
              >
                CLOSE
              </Button>

              <Button
                variant="contained"
                color="primary"
                style={{
                  borderRadius: 0,

                  padding: "8px 25px",
                  pointerEvents: "all",
                  cursor: "pointer",
                }}
                disabled={!changed}
                onClick={() => sendApiRequest()}
              >
                {loading && (
                  <i
                    className="fa fa-spinner fa-spin"
                    style={{ marginRight: 5, color: "white" }}
                  />
                )}
                <Tooltip placement="top" title="Save sharing Changes">
                  <span>{loading ? "Saving Changes..." : "Apply"}</span>
                </Tooltip>
              </Button>
              {/* )} */}
            </div>
          </div>
        </div>
      </ThemeModal>
    </div>
  );
}

export default EventShareModal;

const ShareWith = ({ communities, addSelected, selected }) => {
  if (!communities || !communities.length) {
    return (
      <Typography
        variant="caption"
        style={{ padding: 15, textAlign: "center", color: "grey" }}
      >
        No communities on this list, you must have shared this to all available
        communities already
      </Typography>
    );
  }

  (communities || []).sort((a, b) => (a.name < b.name ? -1 : 1));
  return communities.map((comm, index) => {
    return (
      <div style={{ width: "50%" }} key={index.toString()}>
        <FormControlLabel
          key={index.toString()}
          control={
            <Checkbox
              onChange={(e) => addSelected(comm.id)}
              checked={selected.includes(comm.id)}
            />
          }
          label={comm.name}
        />
      </div>
    );
  });
};

const UnShare = ({ communities, addSelected }) => {
  if (!communities || !communities.length) {
    return (
      <Typography
        variant="caption"
        style={{ padding: 15, textAlign: "center", color: "grey" }}
      >
        If you already shared to a community on your list, it will appear here
      </Typography>
    );
  }
  (communities || []).sort((a, b) => (a.name < b.name ? -1 : 1));

  return communities.map((comm, index) => {
    return (
      <div style={{ width: "50%" }} key={index.toString()}>
        <FormControlLabel
          key={index.toString()}
          control={<Checkbox onChange={(e) => addSelected(comm.id)} />}
          label={comm.name}
        />
      </div>
    );
  });
};
