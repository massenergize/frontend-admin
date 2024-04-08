import React, { useEffect, useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { apiCall } from "../../../../utils/messenger";
import { findItemAtIndexAndRemainder, smartString } from "../../../../utils/common";
import { loadAllEvents } from "../../../../redux/redux-actions/adminActions";
import Accordion from "../../../../components/Accordion/Accordion";
import MEDropdown from "../../ME  Tools/dropdown/MEDropdown";

const UNIT_LIST = [{ id: "days", name: "Days" }, { id: "weeks", name: "Weeks" }];
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

const INITIAL_REMINDER_STATE = { amount_of_time: "", unit_of_time: "days" };
export default function ScheduleEventNotification(props) {
  const { id, close, eventObj } = props || {}; // Contains all props, and all data in the event object
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({});
  const [reminders, setReminders] = useState({});

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

  const putEventInSamePosition = (event) => {
    const { index, remainder } = findItemAtIndexAndRemainder(allEvents, (ev) => ev.id === event?.id);
    const updatedEvents = [...remainder];
    updatedEvents.splice(index, 0, event);
    dispatch(loadAllEvents(updatedEvents));
  };

  const sendChangesToBackend = () => {
    // if (!hasValidValues()) return;

    const form = {
      community_ids: [props?.community?.id],
      event_id: eventObj?.id,
      reminders: Object.values(reminders).map((reminder) => reminder)
    };

    return console.log("sendChangesToBackend", form);
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
        // setProfiles(event?.settings?.notifications || []);
        notify("Settings updated successfully!", "success");
      })
      .catch((err) => {
        setLoading(false);
        notify(err?.toString());
        console.log("Error updating settings", err);
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

  const makeStateObject = (notification) => {
    return { ...INITIAL_STATE, ...(notification || {}) };
  };

  useEffect(() => {
    const { settings: settingsObject } = props || {};
    const defaultObj = (settingsObject?.notifications || [])[0];
    // setProfiles(settingsObject?.notifications || []);
    const obj = makeStateObject(defaultObj?.settings);
    // setTargetCommunities(defaultObj?.communities || []);
    setState(obj);
  }, []);

  const addNewSchedule = () => {
    const id = new Date().getTime();
    setReminders({ ...reminders, [id]: INITIAL_REMINDER_STATE });
  };
  const removeReminder = (id) => {
    const { [id]: removed, ...rest } = reminders;
    setReminders(rest);
  };

  const { message, type } = notification || {};
  const isError = type === "error";

  return (
    <div
      style={{
        width: "auto"
      }}
    >
      <Typography variant="h6" style={{ padding: "0px 20px", fontWeight: "bold", color: "black", marginTop: 10 }}>
        {smartString(eventObj?.name, 50) || "Notification Settings"}
      </Typography>
      <div
        style={{
          marginBottom: 50,
          padding: "0px 20px",
          minHeight: 400,
          maxHeight: 550,
          minWidth: 530,
          overflowY: "scroll"
        }}
      >
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
        <div>
          <Accordion title={smartString(`Schedule notifications for ${props?.community?.name} members`, 60)} opened>
            {Object.entries(reminders).map(([id, reminder], index) => (
              <OneSchedule
                remove={(id) => removeReminder(id)}
                updateItem={(data) => {
                  setReminders({ ...reminders, [id]: data });
                }}
                key={id}
                reminder={{ ...reminder, id }}
                prefix={index === 0}
              />
            ))}

            <h6
              onClick={addNewSchedule}
              className="touchable-opacity"
              style={{ marginTop: 10, fontSize: 15, color: "rgb(171, 71, 188)", textDecoration: "underline" }}
            >
              <i className="fa fa-plus" style={{ marginRight: 3 }} />
              Add Schedule
            </h6>
          </Accordion>
        </div>
        {/* <center>
          <Button variant="contained">
            Add Notification <i className="fa fa-plus" style={{ marginLeft: 5 }} />
          </Button>
        </center> */}
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

const OneSchedule = ({ prefix, suffix = true, reminder, updateItem, remove }) => {
  const { amount_of_time, unit_of_time } = reminder || {};
  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: 6 }}>
      <Typography variant="p" style={{ color: "black", opacity: prefix ? 1 : 0 }}>
        Send Notification
      </Typography>

      <input
        onChange={(e) => updateItem({ ...reminder, amount_of_time: e.target.value })}
        placeholder="00"
        value={amount_of_time}
        style={{
          padding: 3,
          border: "solid 1px rgb(171, 71, 188)",
          textAlign: "center",
          width: 40,
          margin: "0px 10px",
          color: "rgb(171, 71, 188)",
          fontWeight: "bold",
          borderRadius: 3
        }}
      />
      <MEDropdown
        onItemSelected={(item) => updateItem({ ...reminder, unit_of_time: (item || [])[0] })}
        value={[unit_of_time || "days"]}
        labelExtractor={(item) => item.name}
        valueExtractor={(item) => item.id}
        data={UNIT_LIST}
        headerStyle={{ border: "solid 1px rgb(171, 71, 188)", padding: "3px 7px", borderRadius: 3 }}
        fullControl
        placeholder="Select a time unit"
        onHeaderRender={(labels) => (
          <span style={{ color: "rgb(171, 71, 188)", fontWeight: "bold" }}>
            {labels?.length ? labels.join(",") : "Time Unit"}
          </span>
        )}
      />
      {suffix && (
        <Typography style={{ marginLeft: 10, color: "black" }} variant="p">
          before event
        </Typography>
      )}

      <i
        onClick={() => remove(reminder?.id)}
        className=" fa fa-times"
        style={{ fontSize: 24, marginLeft: "auto", marginRight: 6, color: "#c54c4c", cursor: "pointer" }}
      />
    </div>
  );
};
