import React, { useEffect, useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Button, FormControl, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { apiCall } from "../../../../utils/messenger";
import notification from "../../../../components/Notification/Notification";
import { findItemAtIndexAndRemainder, smartString } from "../../../../utils/common";
import { loadAllEvents } from "../../../../redux/redux-actions/adminActions";
import METab from "../../ME  Tools/me-tabbed-view/METab";
import NotificationChoices from "./NotificationChoicesOneCommunity";
import SavedNudgeSettings from "./SavedNudgeSettings";

export const OPTIONS = [
  {
    key: "when_first_posted",
    name: "Notify on first nudge after event is posted or shared",
    alias: "Notify on first nudge",
    value: false
  }, // { key: "when_first_uploaded", name: "Push" },
  {
    key: "within_30_days",
    name: "Notify with nudge 30 days to the event",
    alias: "Within 30 days",
    value: true
  },
  {
    key: "within_1_week",
    name: "Notify with nudge 1 week to event",
    alias: "Within 1 week",
    value: true
  },
  {
    key: "never",
    name: "No notifications for this event",
    alias: "No notifications",
    value: false
  }
];

const INITIAL_STATE = OPTIONS.reduce(
  (acc, t) => ({
    ...acc,
    [t.key]: t.value
  }),
  {}
);

export default function ScheduleEventNotification(props) {
  const { id, close, eventObj } = props || {}; // Contains all props, and all data in the event object
  const [state, setState] = useState({});
  const [targetCommunities, setTargetCommunities] = useState([]); // Holds the list of communities that these settings apply to
  const [profiles, setProfiles] = useState([]); // Holds the list of settings profiles that are on the event at any point
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("nudge-settings");
  const [notification, setNotification] = useState({});
  const dispatch = useDispatch();
  const allEvents = useSelector((state) => state.getIn(["allEvents"]));

  const resetOptions = () => {
    // const data = state?.notifications || {};
    const data = state || {};
    return Object.fromEntries(
      Object.entries(data)
        .filter(([key]) => key !== "never")
        .map(([key]) => [key, false])
    );
  };

  const notify = (message, type = "error") => {
    setNotification({
      message,
      type
    });
  };

  const updateNotification = (name, value) => {
    setState({
      ...state,
      [name]: value,
      never: false
    });
  };

  const handleChange = (event) => {
    const { name } = event.target;
    if (name === "never" && event.target.checked) {
      const remainder = resetOptions();
      return setState({
        ...remainder,
        never: true
      });
    }
    // "Never" never really gets to use this function
    updateNotification(name, event.target.checked);
  };

  const putEventInSamePosition = (event) => {
    const { index, remainder } = findItemAtIndexAndRemainder(allEvents, (ev) => ev.id === event?.id);
    const updatedEvents = [...remainder];
    updatedEvents.splice(index, 0, event);
    dispatch(loadAllEvents(updatedEvents));
  };

  const hasValidValues = () => {
    if (!targetCommunities?.length) {
      notify("Please select the communities that these settings apply to");
      return false;
    }

    return true;
  };

  const sendChangesToBackend = () => {
    // if (!hasValidValues()) return;
    setLoading(true);
    setNotification({});
    // const isALL = targetCommunities?.find((com) => typeof com === "string" && com?.toLowerCase() === "all");
    apiCall("/events.reminders.settings.create", {
      event_id: id,
      ...(state || {}), // This is the settings object (notifications object
      // community_ids: isALL ? targetCommunities : (targetCommunities || []).map((c) => c.id)

      community_ids: [props?.community?.id]
    })
      .then((response) => {
        setLoading(false);
        if (!response?.success) {
          notify(response?.error || "Error updating settings");
          return console.log("Error updating settings", response);
        }
        const event = response?.data;
        putEventInSamePosition(event);
        setProfiles(event?.settings?.notifications || []);
        notify("Settings updated successfully!", "success");
      })
      .catch((err) => {
        setLoading(false);
        notify(err?.toString());
        console.log("Error updating settings", err);
      });
  };

  const updateState = (newState) => {
    setState({
      ...state,
      ...(newState || {})
    });
  };

  const removeProfileOnBackend = (profile) => {
    apiCall("/events.reminders.settings.delete", {
      nudge_settings_id: profile?.id
    })
      .then((response) => {
        setLoading(false);
        if (!response?.success) {
          notify(response?.error || "Error removing settings");
          return console.log("Error removing settings", response);
        }
        if (response?.data?.deleted) {
          console.log("Deleted successfully!");
        }
      })
      .catch((err) => {
        setLoading(false);
        notify(err?.toString());
        console.log("Error removing settings", err);
      });
  };

  const removeProfile = (profile) => {
    const newProfiles = profiles?.filter((p) => p.id !== profile.id);
    setProfiles(newProfiles);
    const newObj = { ...eventObj, settings: { ...(eventObj?.settings || {}), notifications: newProfiles } };
    putEventInSamePosition(newObj);
    removeProfileOnBackend(profile);
  };

  const makeStateObject = (notification) => {
    return { ...INITIAL_STATE, ...(notification || {}) };
  };

  useEffect(() => {
    const { settings: settingsObject } = props || {};
    const defaultObj = (settingsObject?.notifications || [])[0];
    setProfiles(settingsObject?.notifications || []);
    const obj = makeStateObject(defaultObj?.settings);
    setTargetCommunities(defaultObj?.communities || []);
    setState(obj);
  }, []);

  const { message, type } = notification || {};
  const isError = type === "error";

  return (
    <div
      style={{
        width: "auto"
      }}
    >
      <div style={{ padding: "0px 20px", height: 300 }}>
        <Typography variant="h6" style={{ fontWeight: "bol", color: "black", marginTop: 10 }}>
          {smartString(eventObj?.name, 50) || "Notification Settings"}
        </Typography>
        <div style={{ padding: 10, border: "solid 1px #ab47bc", margin: "10px 0px" }}>
          <Typography variant="h6" style={{ fontWeight: "bold", color: "black", fontSize: 14, color: "#ab47bc" }}>
            EXCLUDE FROM NEWSLETTER
          </Typography>
          <FormControlLabel
            control={<Checkbox checked />}
            label="Exclude this event from news letters"
            style={{ color: "black" }}
          />
          <br />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",

          position: "absolute",
          bottom: 0,
          width: "100%",
          padding: "10px 20px",
          background: "white"
        }}
      >
        {message && (
          <small style={{ color: isError ? "#b93131" : "Green", fontWeight: "bold" }}>
            <i className={isError ? "fa fa-times" : "fa fa-check-circle"} style={{ marginRight: 6 }} />
            {message}
          </small>
        )}
        <div style={{ marginLeft: "auto" }}>
          <Button onClick={() => close && close()}>Close</Button>
          {/* {isChoicesTab && ( */}
          <Button onClick={() => sendChangesToBackend()}>
            {loading && <i className="fa fa-spinner fa-spin" style={{ marginRight: 10 }} />} {loading ? "" : "Apply"}
          </Button>
          {/* )} */}
        </div>
      </div>
    </div>
  );
}
