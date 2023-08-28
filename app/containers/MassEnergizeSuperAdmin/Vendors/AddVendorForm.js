import React, { Component } from "react";
import PropTypes from "prop-types";
import states from "dan-api/data/states";
import { withStyles } from "@mui/styles";
import { apiCall } from "../../../utils/messenger";
import { makeTagSection } from "../Events/EditEventForm";
import { connect } from "react-redux";
import Loading from "dan-components/Loading";
import fieldTypes from "../_FormGenerator/fieldTypes";
import { bindActionCreators } from "redux";
import { reduxKeepFormContent } from "../../../redux/redux-actions/adminActions";
import { PAGE_KEYS } from "../ME  Tools/MEConstants";
import { withRouter } from "react-router-dom";
import MassEnergizeForm from "../_FormGenerator/MassEnergizeForm";
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

class CreateNewVendorForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formJson: null,
      communities: [],
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { communities, tags, formState, location, auth } = props;

    const isSuperAdmin = auth?.is_super_admin;

    const section = makeTagSection({
      collections: tags,
      defaults: true,
      title: "Please select tag(s) that apply to this service provider",
    });
    const coms = (communities || []).map((c) => ({
      ...c,
      displayName: c.name,
      id: c.id,
    }));

    const jobsDoneDontRunWhatsBelowEverAgain =
      !(communities && communities.length && tags.length) || state.mounted;

    if (jobsDoneDontRunWhatsBelowEverAgain) return null;

    const libOpen = location.state && location.state.libOpen;
    const formJson = createFormJson({
      communities: coms,
      autoOpenMediaLibrary: libOpen,
      isSuperAdmin,
    });
    formJson.fields.splice(1, 0, section);

    return { formJson, communities, mounted: true };
  }

  render() {
    const { classes } = this.props;
    const { formJson } = this.state;
    if (!formJson) return <Loading />;
    return (
      <div>
        <MassEnergizeForm
          classes={classes}
          pageKey={PAGE_KEYS.CREATE_VENDOR.key}
          formJson={formJson}
          enableCancel
        />
      </div>
    );
  }
}

CreateNewVendorForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    communities: state.getIn(["communities"]),
    tags: state.getIn(["allTags"]),
    formState: state.getIn(["tempForm"]),
    auth: state.getIn(["auth"]),
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
const Mapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CreateNewVendorForm));
export default withStyles(styles, { withTheme: true })(Mapped);

const createFormJson = ({
  communities,
  progress,
  autoOpenMediaLibrary,
  isSuperAdmin,
}) => {
  const formJson = {
    title: "Create New Vendor",
    subTitle: "",
    method: "/vendors.create",
    successRedirectPage: "/admin/read/vendors",
    fields: [
      {
        label: "About this Vendor",
        fieldType: "Section",
        children: [
          {
            name: "name",
            label: "Name of this Vendor",
            placeholder: "eg. Solar Provider Inc.",
            fieldType: "TextField",
            contentType: "text",
            isRequired: true,
            // defaultValue: progress.name || "",
            dbName: "name",
            readOnly: false,
          },
          {
            name: "phone_number",
            label: "Primary Phone Number",
            placeholder: "eg. +1(571)-000-2231",
            fieldType: "TextField",
            contentType: "text",
            isRequired: false,
            // defaultValue: progress.phone_number || "",
            dbName: "phone_number",
            readOnly: false,
          },
          {
            name: "communities",
            label: "Which communities would this vendor service ?",
            fieldType: "Checkbox",
            contentType: "text",
            isRequired: true,
            selectMany: true,
            // defaultValue: progress.communities || [],
            dbName: "communities",
            readOnly: false,
            data: communities || [],
            isAsync: true,
            endpoint: isSuperAdmin
              ? "/communities.listForSuperAdmin"
              : "/communities.listForCommunityAdmin",
          },
          {
            name: "email",
            label: "Primary Email of this vendor",
            placeholder: "eg. abc@gmail.com",
            fieldType: "TextField",
            contentType: "text",
            isRequired: true,
            // defaultValue: progress.email || "",
            dbName: "email",
            readOnly: false,
          },
          {
            name: "description",
            label: "Tell us about the services this vendor provides",
            placeholder: "Tell us more ...",
            fieldType: "HTMLField",
            contentType: "text",
            isRequired: true,
            isMultiline: true,
            // defaultValue: progress.description || "",
            dbName: "description",
            readOnly: false,
          },
          {
            name: "website",
            label: "Vendor's Website",
            placeholder: "eg. https://www.vendorwebsite.com",
            fieldType: "TextField",
            contentType: "text",
            // defaultValue: progress.website || "",
            isRequired: false,
            dbName: "website",
            readOnly: false,
          },
          {
            name: "have_address",
            label: "Do you have an address?",
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
                  placeholder: "Enter street address",
                  fieldType: "TextField",
                  contentType: "text",
                  isRequired: true,
                  // defaultValue: progress.address || "",
                  dbName: "address",
                  readOnly: false,
                },
                {
                  name: "city",
                  label: "City",
                  placeholder: "eg. Springfield",
                  fieldType: "TextField",
                  contentType: "text",
                  isRequired: true,
                  // defaultValue: progress.city || "",
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
                {
                  name: "zipcode",
                  label: "Zip code",
                  fieldType: "TextField",
                  contentType: "text",
                  isRequired: true,
                  dbName: "zipcode",
                  // defaultValue: progress.zipcode || "",
                  readOnly: false,
                },
              ],
            },
          },
        ],
      },
      {
        label: "Services",
        fieldType: "Section",
        children: [
          {
            name: "service_area",
            label: "Please select your service Area",
            fieldType: "Radio",
            contentType: "text",
            isRequired: true,
            defaultValue: "national",
            dbName: "service_area",
            readOnly: false,
            data: [
              { id: "national", value: "National", displayName: "National" },
              {
                id: "statewide",
                value: "Statewide",
                displayName: "Statewide",
              },
            ],
            child: {
              valueToCheck: "statewide",
              fields: [
                {
                  name: "service_area_states",
                  label: "Which States? Separate them by commas",
                  placeholder: "eg. Massachusetts",
                  fieldType: "Checkbox",
                  contentType: "text",
                  data: states,
                  selectMany: true,
                  isRequired: false,
                  defaultValue: [],
                  dbName: "service_area_states",
                  readOnly: false,
                },
              ],
            },
          },
          {
            name: "properties_serviced",
            label: "Please select your customer type(s)",
            placeholder: "eg. Please select one or more options",
            fieldType: "Checkbox",
            contentType: "text",
            isRequired: true,
            selectMany: true,
            defaultValue: [],
            dbName: "properties_serviced",
            readOnly: false,
            data: [
              {
                id: "residential",
                value: "Residential",
                displayName: "Residential",
              },
              {
                id: "commercial",
                value: "Commercial",
                displayName: "Commercial",
              },
            ],
          },
        ],
      },
      {
        label: "Key Contact Person",
        fieldType: "Section",
        children: [
          {
            name: "key_contact_full_name",
            label: "Contact Person's Full Name",
            placeholder: "eg. Grace Tsu",
            fieldType: "TextField",
            contentType: "text",
            isRequired: true,
            // defaultValue: progress.key_contact_full_name || "",
            dbName: "key_contact_name",
            readOnly: false,
          },
          {
            name: "key_contact_email",
            label:
              "Contact Person's Email (this person should already have an account with us)",
            placeholder: "eg. johny.appleseed@gmail.com",
            fieldType: "TextField",
            contentType: "text",
            isRequired: false,
            // defaultValue: progress.key_contact_full_name || "",
            dbName: "key_contact_email",
            readOnly: false,
          },
        ],
      },
      {
        name: "onboarding_contact_email",
        label: "Email of Person onboarding this vendor",
        placeholder: "eg. johny.appleseed@gmail.com",
        fieldType: "TextField",
        contentType: "text",
        isRequired: true,
        // defaultValue: progress.onboarding_contact_email || "",
        dbName: "onboarding_contact_email",
        readOnly: false,
      },
      {
        name: "image",
        placeholder: "Add a Logo",
        fieldType: fieldTypes.MediaLibrary,
        openState: autoOpenMediaLibrary,
        dbName: "image",
        selected: [],
        label: "Upload a logo for this Vendor",
        isRequired: false,
        openState: true, // REMOVE BEFOR PR (BPR)
      },
      {
        name: "is_verified",
        label: "Have you verified this Vendor?",
        fieldType: "Radio",
        isRequired: false,
        defaultValue: "false",
        dbName: "is_verified",
        readOnly: false,
        data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }],
      },
      {
        name: "is_published",
        label: "Should this vendor go live?",
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
