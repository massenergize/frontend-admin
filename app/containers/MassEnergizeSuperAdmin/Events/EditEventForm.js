import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import states from "dan-api/data/states";
import { Link } from "react-router-dom";
import { Paper } from "@mui/material";
import { withStyles } from "@mui/styles";
import { apiCall } from "../../../utils/messenger";
import MassEnergizeForm from "../_FormGenerator";
import Typography from "@mui/material/Typography";
import { checkIfReadOnly, getSelectedIds } from "../Actions/EditActionForm";
import { bindActionCreators } from "redux";
import {
  reduxAddToHeap,
  reduxUpdateHeap,
} from "../../../redux/redux-actions/adminActions";
import Loading from "dan-components/Loading";
import fieldTypes from "../_FormGenerator/fieldTypes";
const styles = (theme) => ({
  root: {
    flexGrow: 1,
    padding: 30,
  },
  field: {
    width: "100%",
    marginBottom: 20,
  },
  fieldBasic: {
    width: "100%",
    marginBottom: 20,
    marginTop: 10,
  },
  inlineWrap: {
    display: "flex",
    flexDirection: "row",
  },
  buttonInit: {
    margin: theme.spacing(4),
    textAlign: "center",
  },
});

export const makeTagSection = ({
  collections,
  event,
  title,
  defaults = true,
}) => {
  const section = {
    label: title || "Please select tag(s) that apply to this event",
    fieldType: "Section",
    children: [],
  };

  (collections || []).forEach((tCol) => {
    var selected = (event && event.tags) || [];
    // selected = selected.length ? selected : (progress || {})[tCol.name];
    const newField = {
      name: tCol.name,
      label: `${tCol.name} ${
        tCol.allow_multiple
          ? "(You can select multiple)"
          : "(Only one selection allowed)"
      }`,
      placeholder: "",
      fieldType: "Checkbox",
      selectMany: tCol.allow_multiple,
      // defaultValue: defaults && getSelectedIds(selected, tCol.tags || []),
      processedDefaultValue: (selected) =>
        getSelectedIds(selected || [], tCol.tags || []),
      dbName: "tags",
      data: tCol.tags.map((t) => ({
        ...t,
        displayName: t.name,
        id: "" + t.id,
      })),
    };

    if (tCol.name === "Category") {
      section.children.push(newField);
    }
  });
  return section;
};

const findEventFromBackend = ({ id, reduxFxn }) => {
  apiCall("events.info", { event_id: id }).then((response) => {
    if (!response.success)
      return console.log("Sorry, could not load event with ID" + id);
    reduxFxn && reduxFxn(response.data);
  });
};
class EditEventForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communities: [],
      formJson: null,
      event: null,
      rescheduledEvent: undefined,
      readOnly: false,
    };
  }

  /**
   * All this needs to happen inside getDerivedState because
   * We need a lifecycle that runs whenever our props change.
   * The data we load from the API will always come in late.
   * That is why this is the best place.
   *
   * Summary Of Whats Happening Here:
   * 1. Find event object (Look inside, already loaded event lists, or check event heap, if none of them have it already, just fetch from API)
   * 2. Use the object to prefill the formJson and use it to create a form.
   */
  static getDerivedStateFromProps = (props, state) => {
    const {
      match,
      communities,
      tags,
      events,
      auth,
      exceptions,
      location,
      otherCommunities,
      eventsInHeap,
      eventsFromOtherCommunities,
      putEventInHeap,
      heap,
      passedEvent, // In cases where this component is being used as a child component, the event object will be passed here directly
    } = props;

    const { id } = (match && match.params) || {};

    var { rescheduledEvent } = state;

    rescheduledEvent = exceptions[id] || rescheduledEvent;
    var event;

    // ----------------------------------------------------------------------
    if (!passedEvent) {
      //--- Search for events from my event list
      event = (events || []).find((e) => e.id.toString() === id.toString());

      //--- If not found, look inside heap
      if (!event) event = (eventsInHeap || {})[id];

      //--- If not found look inside list of "other Events"
      if (!event)
        event = (eventsFromOtherCommunities || []).find(
          (e) => e.id.toString() === id.toString()
        );

      const storeEventInHeap = (data) => {
        putEventInHeap(
          { eventsInHeap: { ...eventsInHeap, [id.toString()]: data } },
          heap
        );
      };

      //--- If all local searches fail, just retrieve from backend
      if (!event) findEventFromBackend({ id, storeEventInHeap });
    } else event = passedEvent;
    // ----------------------------------------------------------------------

    const readOnly = checkIfReadOnly(event, auth);
    const thereIsNothingInEventsExceptionsList = rescheduledEvent === null;

    /** The whole point of this is to make sure all of the following have loaded in,
     *   before we start creating the form. If all of these values load in,  *"readyToRenderPageFirstTime" will be a positive value
     */
    const readyToRenderPageFirstTime =
      event &&
      events &&
      tags &&
      tags.length &&
      (readOnly || rescheduledEvent || thereIsNothingInEventsExceptionsList) &&
      otherCommunities &&
      otherCommunities.length;

    /**
     * Now, when all the values needed to create the form are loaded in, we now need to create the form
     * "jobsDoneDontRunWhatsBelowEverAgain" is setup to always be the inverse value of "readyToRender...". Meaning when "readyToRender..." is true, "jobsDone..." will be false.
     "state.mounted" is initally always false (will get to that soon). Since the If statement below resolves to false, code below will run. The formJson will be created nicely as well as the other things...
     * Then after, to ensure that the creation never happens again, there has  to
     * be a third party that indicates that all the loading processes are done, form is created and that everything is finished here. That is where "state.mounted" comes in.
     * "state.mounted" is set to true the first time the formJson is created.
     * This way, even if "getDerivedStateFromProps" is triggered from a props change somewhere down the line, the whole process will terminate here...
     */
    const jobsDoneDontRunWhatsBelowEverAgain =
      !readyToRenderPageFirstTime || state.mounted; // state.mounted will only be true when the code below has run at least once!

    //--- When this value is true, it means we have been able to load all data needed to show the form, so no need to recreate formJson
    if (jobsDoneDontRunWhatsBelowEverAgain) return null;

    const coms = (communities || []).map((c) => ({
      ...c,
      displayName: c.name,
      id: "" + c.id,
    }));

    const libOpen = location.state && location.state.libOpen;
    const formJson = createFormJson({
      event,
      communities: coms,
      rescheduledEvent,
      auth,
      autoOpenMediaLibrary: libOpen,
      otherCommunities,
    });

    const section = makeTagSection({ collections: tags, event });

    if (formJson) formJson.fields.splice(1, 0, section);

    return {
      event,
      events,
      readOnly,
      communities: coms,
      formJson,
      mounted: true,
    };
  };

  componentDidMount() {
    const { match, passedEvent } = this.props;
    const { id } = (match && match.params) || passedEvent || {};
    var { event } = this.state;
    const { auth, events, addExceptionsToHeap, heap, exceptions } = this.props;

    event =
      event || (events || []).find((e) => e.id.toString() === id.toString());

    const readOnly = checkIfReadOnly(event, auth);
    if (!readOnly) {
      apiCall("events.exceptions.list", { event_id: id })
        .then((json) => {
          if (json.success) {
            const rescheduledEvent = json.data[0] || null;

            this.setState({
              rescheduledEvent,
            });
            addExceptionsToHeap({
              ...heap,
              exceptions: { ...exceptions, [id.toString()]: rescheduledEvent },
            });
          } else {
            console.log(json.error);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  render() {
    const { classes } = this.props;
    const { formJson, readOnly, event, mounted } = this.state;

    if (!event && mounted)
      return (
        <p>
          Sorry, we could not load the event you are looking for. If you are
          sure your event exists, please report this!
        </p>
      );

    if (!formJson) return <Loading />;
    return (
      <div>
        {!readOnly && event.rsvp_enabled ? (
          <Paper style={{ padding: 20, marginBottom: 15 }}>
            <Typography>
              Would you like to see a list of users who have RSVP-ed for this
              event?
            </Typography>
            <Link
              to={`/admin/edit/${event && event.id}/event-rsvps`}
              style={{ marginTop: 6, color: "var(--app-cyan)" }}
            >
              See A Full List Here
            </Link>
          </Paper>
        ) : null}

        <MassEnergizeForm
          classes={classes}
          formJson={formJson}
          readOnly={readOnly}
          enableCancel
          validator={validator}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const heap = state.getIn(["heap"]);
  return {
    auth: state.getIn(["auth"]),
    community: state.getIn(["selected_community"]),
    tags: state.getIn(["allTags"]),
    communities: state.getIn(["communities"]),
    events: state.getIn(["allEvents"]),
    heap: state.getIn(["heap"]),
    exceptions: (heap && heap.exceptions) || {},
    otherCommunities: state.getIn(["otherCommunities"]),
    eventsInHeap: (heap || {}).eventsInHeap || {},
    eventsFromOtherCommunities: state.getIn(["otherEvents"]),
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      addExceptionsToHeap: reduxUpdateHeap,
      putEventInHeap: reduxAddToHeap,
    },
    dispatch
  );
};
const EditEventMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditEventForm);

EditEventForm.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles, { withTheme: true })(
  withRouter(EditEventMapped)
);

const validator = (cleaned) => {
  const start = (cleaned || {})["start_date_and_time"];
  const end = (cleaned || {})["end_date_and_time"];
  const endDateComesLater = new Date(end) > new Date(start);
  return [
    endDateComesLater,
    !endDateComesLater &&
      "Please provide an end date that comes later than your start date",
  ];
};

/**
 * If an event is open, allow event to be shared to any of the admin's communities
 * If it's open_to, only select which of the admin's communities that have been listed as allowed to show in the dropdown
 * If its closed_to, only select which of the admin's communities that have not been exempted to show in the dropdown
 * @param {*} adminOf
 * @param {*} list
 * @param {*} publicity
 * @returns
 */
const getAllowedCommunities = ({ adminOf, list, publicity }) => {
  if (publicity === "OPEN") return adminOf;
  list = (list || []).map((c) => c.id);
  // This part happens when an admin has already copied an event, and is trying to edit, (we select only communities that are allowed) to be shown in the dropdown
  var coms;
  if (publicity === "OPEN_TO") {
    coms = adminOf.filter((c) => list.includes(c.id));
    return coms;
  }

  if (publicity === "CLOSED_TO") {
    coms = adminOf.filter((c) => !list.includes(c.id));
    return coms;
  }

  return [];
};
const createFormJson = ({
  event,
  rescheduledEvent,
  communities,
  auth,
  autoOpenMediaLibrary,
  otherCommunities,
}) => {
  const statuses = ["Draft", "Live", "Archived"];
  if (!event || !communities) return;
  const is_super_admin = auth && auth.is_super_admin;

  communities = is_super_admin
    ? communities
    : getAllowedCommunities({
        adminOf: auth.admin_at,
        list: event.communities_under_publicity,
        publicity: event.publicity,
      });

  communities = (communities || []).map((c) => ({
    displayName: c.name,
    id: c.id.toString(),
  }));

  const publicityCommunities = (
    (event && event.communities_under_publicity) ||
    []
  ).map((c) => c.id.toString());

  // Now check which of the communities are listed under publicity, and which ones match the admin's communities

  const otherCommunityList = otherCommunities.map((c) => ({
    displayName: c.name,
    id: c.id.toString(),
  }));

  const formJson = {
    title: "Edit Event or Campaign",
    subTitle: "",
    method: "/events.update",
    successRedirectPage: "/admin/read/events",
    fields: [
      {
        label: "Update this event",
        fieldType: "Section",
        children: [
          {
            name: "event_id",
            label: "Event ID",
            placeholder: "Event ID",
            fieldType: "TextField",
            contentType: "number",
            defaultValue: event.id,
            dbName: "event_id",
            readOnly: true,
          },
          {
            name: "name",
            label: "Name of Event",
            placeholder: "Enter name of event or campaign",
            fieldType: "TextField",
            contentType: "text",
            isRequired: true,
            defaultValue: event.name,
            dbName: "name",
            readOnly: false,
          },
          {
            name: "featured_summary",
            label: "One sentence that describes this event",
            placeholder: "Enter a catchy summary",
            fieldType: "TextField",
            contentType: "text",
            isRequired: true,
            defaultValue: event.featured_summary,
            dbName: "featured_summary",
            readOnly: false,
          },
          {
            name: "rank",
            label:
              "Rank (Which order should this event appear in?  Lower numbers come first)",
            placeholder: "eg. 1",
            fieldType: "TextField",
            contentType: "number",
            isRequired: false,
            defaultValue: event.rank,
            dbName: "rank",
            readOnly: false,
          },
          {
            name: "start_date_and_time",
            label: "Start Date And Time",
            placeholder: "YYYY-MM-DD HH:MM",
            fieldType: "DateTime",
            contentType: "text",
            defaultValue: event.start_date_and_time,
            dbName: "start_date_and_time",
            readOnly: false,
          },
          {
            name: "end_date_and_time",
            label: "End Date And Time",
            placeholder: "YYYY-MM-DD HH:MM",
            fieldType: "DateTime",
            contentType: "text",
            defaultValue: event.end_date_and_time,
            dbName: "end_date_and_time",
            readOnly: false,
          },
          {
            name: "is_recurring",
            label:
              "Make this a recurring event (if this is a rescheduled instance of a previous recurring event, you cannot make this recurring)",
            fieldType: "Radio",
            isRequired: true,
            defaultValue: event.is_recurring ? "true" : "false",
            dbName: "is_recurring",
            readOnly: false,
            data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }],
            child: {
              dbName: "recurring_details",
              valueToCheck: "true",
              fields: [
                {
                  name: "upcoming_is_cancelled",
                  label:
                    "Do you want to cancel the next instance of this recurring event?",
                  fieldType: "Radio",
                  isRequired: false,
                  defaultValue:
                    event.recurring_details &&
                    event.recurring_details.is_cancelled
                      ? "true"
                      : "false",
                  dbName: "upcoming_is_cancelled",
                  readOnly: false,
                  data: [
                    { id: "false", value: "No" },
                    { id: "true", value: "Yes" },
                  ],
                },

                {
                  name: "upcoming_is_rescheduled",
                  label:
                    "Do you want to reschedule the next instance of the event?",
                  fieldType: "Radio",
                  isRequired: false,
                  defaultValue: rescheduledEvent ? "true" : "false",
                  dbName: "upcoming_is_rescheduled",
                  readOnly: false,
                  data: [
                    { id: "false", value: "No" },
                    { id: "true", value: "Yes" },
                  ],
                  child: {
                    dbName: "rescheduled_details",
                    valueToCheck: "true",
                    fields: [
                      {
                        name: "rescheduled_start_datetime",
                        dbName: "rescheduled_start_datetime",
                        label:
                          "Date and time you want your rescheduled event to take place (must occur before the next instance of the event; e.g., if your event is scheduled for every Friday, you cannot reschedule this Friday to next Saturday.",
                        fieldType: "DateTime",
                        defaultValue: null,
                        contentType: "text",
                        isRequired: true,
                      },
                      {
                        name: "rescheduled_end_datetime",
                        dbName: "rescheduled_end_datetime",
                        label:
                          "Date and time you want your rescheduled event to end",
                        fieldType: "DateTime",
                        defaultValue: null,
                        contentType: "text",
                        isRequired: true,
                      },
                    ],
                  },
                },
                {
                  name: "separation_count",
                  label: "Repeat every",
                  fieldType: "Dropdown",
                  isRequired: true,
                  dbName: "separation_count",
                  contentType: "number",
                  defaultValue:
                    event.recurring_details &&
                    event.recurring_details.separation_count
                      ? event.recurring_details.separation_count
                      : "0",
                  data: [
                    { id: 1, displayName: "1" },
                    { id: 2, displayName: "2" },
                    { id: 3, displayName: "3" },
                    { id: 4, displayName: "4" },
                    { id: 5, displayName: "5" },
                    { id: 6, displayName: "6" },
                  ],
                },
                {
                  name: "recurring_type",
                  label: "",
                  fieldType: "Radio",
                  dbName: "recurring_type",
                  isRequired: true,
                  defaultValue:
                    event.recurring_details &&
                    event.recurring_details.recurring_type
                      ? event.recurring_details.recurring_type
                      : "none",
                  data: [
                    { id: "week", value: "weeks" },
                    { id: "month", value: "months" },
                  ],
                },
                {
                  name: "day_of_week",
                  label:
                    "Choose the day of the week on which you want the event to repeat.",
                  fieldType: "Dropdown",
                  isRequired: true,
                  dbName: "day_of_week",
                  defaultValue:
                    event.recurring_details &&
                    event.recurring_details.day_of_week
                      ? event.recurring_details.day_of_week
                      : "none",
                  data: [
                    { id: "Monday", displayName: "Monday" },
                    { id: "Tuesday", displayName: "Tuesday" },
                    { id: "Wednesday", displayName: "Wednesday" },
                    { id: "Thursday", displayName: "Thursday" },
                    { id: "Friday", displayName: "Friday" },
                    { id: "Saturday", displayName: "Saturday" },
                    { id: "Sunday", displayName: "Sunday" },
                  ],
                },
                {
                  name: "week_of_month",
                  label:
                    'ONLY if you selected "month", choose the week of the month on which you want the event to repeat.',
                  fieldType: "Dropdown",
                  isRequired: true,
                  dbName: "week_of_month",
                  defaultValue:
                    event.recurring_details &&
                    event.recurring_details.week_of_month
                      ? event.recurring_details.week_of_month
                      : "none",
                  data: [
                    { id: "first", displayName: "first" },
                    { id: "second", displayName: "second" },
                    { id: "third", displayName: "third" },
                    { id: "fourth", displayName: "fourth" },
                  ],
                },
                {
                  name: "final_date",
                  label:
                    "Final Date for recurring events, you can specify a final date, otherwise events will recur until cancelled.  The time is ignored.",
                  placeholder: "YYYY-MM-DD",
                  fieldType: "DateTime",
                  contentType: "text",
                  isRequired: false,
                  defaultValue:
                    event.recurring_details &&
                    event.recurring_details.final_date
                      ? event.recurring_details.final_date
                      : "none",
                  dbName: "final_date",
                  readOnly: false,
                },
              ],
            },
          },
          is_super_admin
            ? {
                name: "is_global",
                label: "Is this Event a Template?",
                fieldType: "Radio",
                isRequired: false,
                defaultValue: "" + event.is_global,
                dbName: "is_global",
                readOnly: false,
                data: [
                  { id: "false", value: "No" },
                  { id: "true", value: "Yes" },
                ],
                child: {
                  valueToCheck: "false",
                  fields: [
                    {
                      name: "community",
                      label: "Primary Community (select one)",
                      fieldType: "Dropdown",
                      defaultValue: event.community && event.community.id,
                      dbName: "community_id",
                      data: [{ displayName: "--", id: "" }, ...communities],
                      isRequired: true,
                    },
                  ],
                },
              }
            : {
                name: "community",
                label: "Primary Community (select one)",
                fieldType: "Dropdown",
                defaultValue: event.community && event.community.id,
                dbName: "community_id",
                data: [{ displayName: "--", id: "" }, ...communities],
                isRequired: true,
              },
        ],
      },
      {
        label: "Who can see this event?",
        fieldType: "Section",
        children: [
          {
            name: "publicity",
            label: "Who should be able to see this event?",
            fieldType: "Radio",
            isRequired: false,
            defaultValue: event && event.publicity,
            dbName: "publicity",
            readOnly: false,
            data: [
              { id: "OPEN", value: "All communities can see this event " },
              {
                id: "OPEN_TO",
                value: "Only communities I select should see this",
              },
              {
                id: "CLOSE",
                value: "No one can see this, keep this in my community only ",
              },

              // { id: "CLOSED_TO", value: "All except these communities" },
            ],
            conditionalDisplays: [
              {
                valueToCheck: "OPEN_TO",
                fields: [
                  {
                    name: "can-view-event",
                    label: `Select the communities that can see this event`,
                    placeholder: "",
                    fieldType: "Checkbox",
                    selectMany: true,
                    defaultValue: publicityCommunities,
                    dbName: "publicity_selections",
                    data: otherCommunityList,
                  },
                ],
              },
              // {
              //   valueToCheck: "CLOSED_TO",
              //   fields: [
              //     {
              //       name: "cannot-view-event",
              //       label: `Select the communities should NOT see this event`,
              //       placeholder: "",
              //       fieldType: "Checkbox",
              //       selectMany: true,
              //       defaultValue: publicityCommunities,
              //       dbName: "publicity_selections",
              //       data: otherCommunityList,
              //     },
              //   ],
              // },
            ],
          },
        ],
      },
      {
        name: "have_address",
        label: "Do you have an address?",
        fieldType: "Radio",
        isRequired: false,
        defaultValue: event.location ? "true" : "false",
        dbName: "have_address",
        readOnly: false,
        data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }],
        child: {
          valueToCheck: "true",
          fields: [
            {
              name: "address",
              label: "Street Address",
              placeholder: "Street address or public facility",
              fieldType: "TextField",
              contentType: "text",
              isRequired: true,
              defaultValue: event.location && event.location.address,
              dbName: "address",
              readOnly: false,
            },
            {
              name: "unit",
              label: "Unit Number",
              placeholder: 'eg. "2A"',
              fieldType: "TextField",
              contentType: "text",
              isRequired: false,
              defaultValue: event.location && event.location.unit,
              dbName: "unit",
              readOnly: false,
            },
            {
              name: "city",
              label: "City",
              placeholder: "eg. Spriingfield",
              fieldType: "TextField",
              contentType: "text",
              isRequired: true,
              defaultValue: event.location && event.location.city,
              dbName: "city",
              readOnly: false,
            },
            {
              name: "state",
              label: "State ",
              placeholder: "eg. Massachusetts",
              fieldType: "Dropdown",
              contentType: "text",
              isRequired: true,
              data: states,
              defaultValue: event.location && event.location.state,
              dbName: "state",
              readOnly: false,
            },
          ],
        },
      },
      {
        name: "description",
        label: "Event Description",
        placeholder: "eg. This event is happening in ...",
        fieldType: "HTMLField",
        isRequired: true,
        defaultValue: event.description,
        dbName: "description",
      },
      {
        name: "image",
        placeholder: "Select an Image",
        fieldType: fieldTypes.MediaLibrary,
        openState: autoOpenMediaLibrary,
        dbName: "image",
        label: "Upload Files",
        isRequired: false,
        selected: event.image ? [event.image] : [],
      },
      {
        name: "rsvp_enabled",
        label: "Enable RSVPs for this Event",
        fieldType: "Radio",
        isRequired: false,
        defaultValue: "" + event.rsvp_enabled,
        dbName: "rsvp_enabled",
        readOnly: false,
        data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }],
        child: {
          dbName: "rsvp_communication",
          valueToCheck: "true",
          fields: [
            {
              name: "send_rsvp_email",
              label:
                "Send an email with Zoom link or other details when user RSVPs they are coming?",
              fieldType: "Radio",
              isRequired: false,
              defaultValue: "" + event.rsvp_email,
              dbName: "rsvp_email",
              readOnly: false,
              data: [
                { id: "false", value: "No" },
                { id: "true", value: "Yes" },
              ],
              child: {
                dbName: "rsvp_details",
                valueToCheck: "true",
                fields: [
                  {
                    name: "rsvp_message_text",
                    label: "Message to send to RSVP",
                    placeholder: "eg. This event is happening in ...",
                    fieldType: "HTMLField",
                    isRequired: true,
                    defaultValue: event.rsvp_message,
                    dbName: "rsvp_message",
                  },
                ],
              },
            },
          ],
        },
      },
      {
        name: "archive",
        label: "Archive this Event",
        fieldType: "Radio",
        isRequired: false,
        defaultValue: "" + event.archive,
        dbName: "archive",
        readOnly: false,
        data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }],
      },
      {
        name: "is_approved",
        label: "Do you approve this event?",
        fieldType: "Radio",
        isRequired: false,
        defaultValue: "" + event.is_approved,
        dbName: "is_approved",
        readOnly: false,
        data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }],
      },
      {
        name: "is_published",
        label: "Should this event Go Live?",
        fieldType: "Radio",
        isRequired: false,
        defaultValue: "" + event.is_published,
        dbName: "is_published",
        readOnly: false,
        data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }],
      },
    ],
  };
  return formJson;
};
