import { Checkbox, Tooltip } from "@material-ui/core";
import { Button, FormControlLabel, Typography } from "@material-ui/core";

import React, { useState } from "react";
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
  events,
  myEvents,
  updateEventInHeap,
  updateOtherEventListInRedux,
  updateNormalEventListInRedux
}) {
  const [communitiesToShareTo, setCommunities] = useState([]); // Selected communities to share to
  const [loading, setLoading] = useState(false);

  const isCommunityAdmin = auth && auth.is_community_admin;
  const isSuperAdmin = auth && auth.is_super_admin;

  const { from } = fetchParamsFromURL(window.location, "from");

  const replaceInRedux = (event, list, reduxFxn) => {
    const rem = (list || []).filter((ev) => ev.id !== event.id);
    reduxFxn([event, ...rem]);
  };

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
  const commsToShow = getAllowedCommunities();

  /**
   * Sends a request to the backend to update the content
   */
  const shareToCommunities = () => {
    setLoading(true);
    const share_to = communitiesToShareTo.map((c) => c.id);
    apiCall("/events.update", { share_to })
      .then((response) => {
        if (!response.success)
          return console.log("SHARING_ERROR_BE:", response.error);

        setLoading(false);
        // Now we have the event object with updated "share_to" field so
        updateEventInHeap(response.data);
        if (from === FROM.MAIN_EVENTS)
          return replaceInRedux(
            response.data,
            myEvents,
            updateOtherEventListInRedux
          );

        // Means the admin is viewing an event from outside all their communities
        if (from === FROM.OTHER_EVENTS)
          return replaceInRedux(
            response.data,
            myEvents,
            updateNormalEventListInRedux
          );
      })
      .catch((e) => {
        console.log("SHARING_ERROR: ", e.toString());
        setLoading(false);
      });
  };

  const add = (id) => {
    const communities = communitiesToShareTo;
    if (!communities.includes(id)) return setCommunities([...communities, id]);
    var rem = communities.filter((_id) => _id !== id);
    setCommunities(rem);
  };

  const numberOf = communitiesToShareTo.length;

  const buttonText = (numberOf) => {
    if (!numberOf) return "Share";

    return ` Share to (${numberOf ? numberOf : ""}) ${
      numberOf === 1 ? "community" : "communities"
    }`;
  };

  //   -------------------------------------------------------------------
  return (
    <div>
      <ThemeModal
        open={true}
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
            minHeight: 200,
            maxHeight: 400,
            width: 550,
            maxWidth: 550,
            minWidth: 550,
            position: "relative",
            // paddingBottom: 60,
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
            {commsToShow.map((comm, index) => {
              return (
                <div style={{ width: "50%" }}>
                  <FormControlLabel
                    key={index.toString()}
                    control={<Checkbox onChange={(e) => add(comm.id)} />}
                    label={comm.name}
                  />
                </div>
              );
            })}
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
                //   onClick={() => toggleModal && toggleModal(false)}
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
                disabled={!numberOf}
              >
                <Tooltip placement="top" title="Select communities to share to">
                  <span>{buttonText(numberOf)}</span>
                </Tooltip>
              </Button>
            </div>
          </div>
        </div>
      </ThemeModal>
    </div>
  );
}

export default EventShareModal;
