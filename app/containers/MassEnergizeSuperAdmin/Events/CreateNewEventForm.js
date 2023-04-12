import React, { Component } from "react";
import PropTypes from "prop-types";
import states from "dan-api/data/states";
import { withStyles } from "@mui/styles";
import moment from "moment";
// import MassEnergizeForm from "../_FormGenerator";
import MassEnergizeForm from "../_FormGenerator/MassEnergizeForm";
import { getRandomStringKey } from "../ME  Tools/media library/shared/utils/utils";
import { makeTagSection } from "./EditEventForm";
import Loading from "dan-components/Loading";
import { connect } from "react-redux";
import fieldTypes from "../_FormGenerator/fieldTypes";
import { bindActionCreators } from "redux";
import { reduxKeepFormContent } from "../../../redux/redux-actions/adminActions";
import { PAGE_KEYS } from "../ME  Tools/MEConstants";
import { removePageProgressFromStorage } from "../../../utils/common";
import { withRouter } from "react-router-dom";

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

class CreateNewEventForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communities: [],
      formJson: null,
      loading: true,
      reRenderKey: "x-initial-key-x",
    };
  }

  static getDerivedStateFromProps = (props, state) => {
    const {
      communities,
      tags,
      auth,
      location,
      otherCommunities,
    } = props;

    const readyToRenderPageFirstTime =
      communities &&
      communities.length &&
      tags &&
      tags.length &&
      auth &&
      otherCommunities &&
      otherCommunities.length;

    const jobsDoneDontRunWhatsBelowEverAgain =
      !readyToRenderPageFirstTime || state.mounted;
    if (jobsDoneDontRunWhatsBelowEverAgain) return null;

    const coms = (communities || []).map((c) => ({
      ...c,
      displayName: c.name,
      id: "" + c.id,
    }));

    
    const section = makeTagSection({
      collections: tags,
      defaults: false,
    });

    const libOpen = location.state && location.state.libOpen;

    const formJson = createFormJson({
      communities: coms,
      auth,
      autoOpenMediaLibrary: libOpen,
      otherCommunities: otherCommunities || [],
    });

    if (formJson) formJson.fields.splice(1, 0, section);

    return {
      communities: coms,
      formJson,
      mounted: true,
    };
  };

 

  render() {
    const { classes } = this.props;
    const { formJson } = this.state;
    if (!formJson) return <Loading />;
    return (
      <div>
        <MassEnergizeForm
          pageKey={PAGE_KEYS.CREATE_EVENT.key}
          classes={classes}
          formJson={formJson}
          validator={validator}
          enableCancel
        />
      </div>
    );
  }
}

CreateNewEventForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    tags: state.getIn(["allTags"]),
    communities: state.getIn(["communities"]),
    auth: state.getIn(["auth"]),
    formState: state.getIn(["tempForm"]),
    otherCommunities: state.getIn(["otherCommunities"]),
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      saveFormTemporarily: reduxKeepFormContent,
    },
    dispatch
  );
};

const CreateEventMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateNewEventForm);

export default withStyles(styles, { withTheme: true })(
  withRouter(CreateEventMapped)
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

const whenStartDateChanges = ({ newValue, formData, setValueInForm }) => {
  formData = formData || {};
  const newEnd = moment(newValue).add(1, "hours");
  setValueInForm({ start_date_and_time: newValue, end_date_and_time: newEnd });
};

const createFormJson = ({
  communities,
  auth,
  progress,
  autoOpenMediaLibrary,
  otherCommunities,
}) => {
  const is_super_admin = auth && auth.is_super_admin;
  otherCommunities = otherCommunities || [];
  const otherCommunityList = otherCommunities.map((c) => ({
    displayName: c.name,
    id: c.id.toString(),
  }));
  const formJson = {
    title: "Create New Event or Campaign",
    subTitle: "",
    method: "/events.create",
    successRedirectPage: "/admin/read/events",
    fields: [
      {
        label: "About this event",
        fieldType: "Section",
        children: [
          {
            name: "name",
            label: "Name of Event or Campaign",
            placeholder: "Enter name of event or campaign",
            fieldType: "TextField",
            contentType: "text",
            isRequired: true,
            // defaultValue: progress.name || "",
            dbName: "name",
            readOnly: false,
          },
          {
            name: "featured_summary",
            label: "One sentence that describes this event",
            placeholder: "One sentence that describes this event",
            fieldType: "TextField",
            contentType: "text",
            isRequired: true,
            // defaultValue: progress.featured_summary || "",
            dbName: "featured_summary",
            readOnly: false,
          },
          {
            onChangeMiddleware: whenStartDateChanges,
            name: "start_date_and_time",
            label: "Start Date And Time",
            placeholder: "YYYY-MM-DD HH:MM",
            fieldType: "DateTime",
            contentType: "text",
            defaultValue: moment().startOf("hour"),
            dbName: "start_date_and_time",
            minDate: moment().startOf("hour"),
            readOnly: false,
          },
          {
            name: "end_date_and_time",
            label: "End Date And Time",
            placeholder: "YYYY-MM-DD HH:MM",
            fieldType: "DateTime",
            contentType: "text",
            defaultValue: moment()
              .startOf("hour")
              .add(1, "hours"),
            dbName: "end_date_and_time",
            minDate: moment().startOf("hour"),
            readOnly: false,
          },

          {
            name: "is_recurring",
            label: "Make this a recurring event",
            fieldType: "Radio",
            isRequired: true,
            defaultValue: "false",
            dbName: "is_recurring",
            readOnly: false,
            data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }],
            child: {
              dbName: "recurring_details",
              valueToCheck: "true",
              fields: [
                {
                  name: "separation_count",
                  label: "Repeat every",
                  fieldType: "Dropdown",
                  isRequired: true,
                  dbName: "separation_count",
                  contentType: "number",
                  defaultValue: 1,
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
                  // defaultValue: progress.recurring_type || null,
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
                  defaultValue: "",
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
                    'If you selected "month", choose the week of the month on which you want the event to repeat.',
                  fieldType: "Dropdown",
                  dbName: "week_of_month",
                  defaultValue: "",
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
                    "Final Date for recurring events, you can specify a final date, otherwise events will recur until cancelled. The time is ignored.",
                  placeholder: "YYYY-MM-DD",
                  fieldType: "DateTime",
                  contentType: "text",
                  isRequired: false,
                  defaultValue: "none",
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
                isRequired: true,
                defaultValue: "false",
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
                      defaultValue: null,
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
                defaultValue: communities[0] && communities[0].id,
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
            defaultValue: "OPEN",
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
                    defaultValue: [],
                    dbName: "publicity_selections",
                    data: otherCommunityList,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "have_address",
        label: "Want to add an address for this event?",
        fieldType: "Radio",
        isRequired: false,
        defaultValue: "false",
        dbName: "have_address",
        readOnly: false,
        data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }],
        child: {
          valueToCheck: "true",
          fields: [
            {
              name: "address",
              label: "Street Address",
              placeholder: "Street Address or Public Facility",
              fieldType: "TextField",
              contentType: "text",
              isRequired: true,
              defaultValue: "",
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
              defaultValue: "",
              dbName: "unit",
              readOnly: false,
            },
            {
              name: "city",
              label: "City",
              placeholder: "eg. Springfield",
              fieldType: "TextField",
              contentType: "text",
              isRequired: true,
              defaultValue: "",
              dbName: "city",
              readOnly: false,
            },
            {
              name: "state",
              label: "State ",
              fieldType: "Dropdown",
              contentType: "text",
              isRequired: false,
              data: states,
              defaultValue: "Massachusetts",
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
        defaultValue: null,
        dbName: "description",
      },
      {
        name: "image",
        placeholder: "Select an Image",
        fieldType: fieldTypes.MediaLibrary,
        dbName: "image",
        label: "Upload Files",
        selected: [],
        // defaultValue: progress.image || [],
        openState: autoOpenMediaLibrary,
        isRequired: false,
      },
      {
        name: "rsvp_enabled",
        label: "Enable RSVPs for this Event",
        fieldType: "Radio",
        isRequired: false,
        defaultValue: "false",
        dbName: "rsvp_enabled",
        readOnly: false,
        data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }],
        child: {
          valueToCheck: "true",
          fields: [
            {
              name: "send_rsvp_email",
              label:
                "Send an email with Zoom link or other details when user RSVPs they are coming?",
              fieldType: "Radio",
              isRequired: false,
              defaultValue: "false",
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
                    defaultValue: null,
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
        defaultValue: "false",
        dbName: "archive",
        readOnly: false,
        data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }],
      },
      {
        name: "is_approved",
        label: "Do you approve this event?",
        fieldType: "Radio",
        isRequired: false,
        defaultValue: "true",
        dbName: "is_approved",
        readOnly: false,
        data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }],
      },
      {
        name: "is_published",
        label: "Should this event Go Live?",
        fieldType: "Radio",
        isRequired: false,
        defaultValue: "false",
        dbName: "is_published",
        readOnly: false,
        data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }],
      },
    ],
  };
  return formJson;
};
