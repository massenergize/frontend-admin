import React, { Component } from "react";
import PropTypes from "prop-types";
import states from "dan-api/data/states";
import { withStyles } from "@material-ui/core/styles";
import MassEnergizeForm from "../_FormGenerator";
import { apiCall } from "../../../utils/messenger";
import { makeTagSection } from "../Events/EditEventForm";
import { connect } from "react-redux";
import Loading from "dan-components/Loading";


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
    margin: theme.spacing.unit * 4,
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
    const { communities, tags } = props;

    const section = makeTagSection({
      collections: tags,
      defaults: false,
      title: "Please select tag(s) that apply to this service provider",
    });
    const coms = communities.map((c) => ({
      ...c,
      displayName: c.name,
      id: "" + c.id,
    }));

    const jobsDoneDontRunWhatsBelowEverAgain =
      !(communities && communities.length && tags && tags.length) ||
      state.mounted;

    if (jobsDoneDontRunWhatsBelowEverAgain) return null;

    const formJson = createFormJson({ communities: coms });
    formJson.fields.splice(1, 0, section);

    return { formJson, communities, mounted: true };
  }

  // async componentDidMount() {
  //   const tagCollectionsResponse = await apiCall('/tag_collections.listForCommunityAdmin');
  //   const communitiesResponse = await apiCall('/communities.listForCommunityAdmin');
  //   if (communitiesResponse && communitiesResponse.data) {
  //     const communities = communitiesResponse.data.map(c => ({ ...c, displayName: c.name, id: '' + c.id }));
  //     await this.setStateAsync({ communities });
  //   }

  //   const formJson = await this.createFormJson();
  //   if (tagCollectionsResponse && tagCollectionsResponse.data) {
  //     const section = {
  //       label: 'Please select tag(s) that apply to this service provider',
  //       fieldType: 'Section',
  //       children: []
  //     };

  //     Object.values(tagCollectionsResponse.data).forEach(tCol => {
  //       const newField = {
  //         name: tCol.name,
  //         label: `${tCol.name} ${tCol.allow_multiple ? '(You can select multiple)' : '(Only one selection allowed)'}`,
  //         placeholder: '',
  //         fieldType: 'Checkbox',
  //         selectMany: tCol.allow_multiple,
  //         defaultValue: [],
  //         dbName: 'tags',
  //         data: tCol.tags.map(t => ({ ...t, displayName: t.name, id: '' + t.id }))
  //       };

  //       // want this to be the 5th field
  //       if (tCol.name === 'Category') {
  //         section.children.push(newField);
  //       }
  //     });

  //     // want this to be the 2nd field
  //     formJson.fields.splice(1, 0, section);
  //   }

  //   await this.setStateAsync({ formJson });
  // }

  // setStateAsync(state) {
  //   return new Promise((resolve) => {
  //     this.setState(state, resolve);
  //   });
  // }

  render() {
    const { classes } = this.props;
    const { formJson } = this.state;
    if (!formJson) return <Loading />;
    return (
      <div>
        <MassEnergizeForm classes={classes} formJson={formJson} enableCancel />
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
  };
};
const Mapped = connect(mapStateToProps)(CreateNewVendorForm);
export default withStyles(styles, { withTheme: true })(Mapped);

const createFormJson = ({ communities }) => {
  // const { communities } = this.state;
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
            defaultValue: "",
            dbName: "name",
            readOnly: false,
          },
          {
            name: "phone_number",
            label: "Primary Phone Number",
            placeholder: "eg. +1(571)-000-2231",
            fieldType: "TextField",
            contentType: "text",
            isRequired: true,
            defaultValue: "",
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
            defaultValue: [],
            dbName: "communities",
            readOnly: false,
            data: communities || [],
          },
          {
            name: "email",
            label: "Primary Email of this vendor",
            placeholder: "eg. abc@gmail.com",
            fieldType: "TextField",
            contentType: "text",
            isRequired: true,
            defaultValue: "",
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
            defaultValue: "",
            dbName: "description",
            readOnly: false,
          },
          {
            name: "website",
            label: "Vendor's Website",
            placeholder: "eg. https://www.vendorwebsite.com",
            fieldType: "TextField",
            contentType: "text",
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
                  defaultValue: "",
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
                {
                  name: "zipcode",
                  label: "Zip code",
                  fieldType: "TextField",
                  contentType: "text",
                  isRequired: true,
                  dbName: "zipcode",
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
              { id: "statewide", value: "Statewide", displayName: "Statewide" },
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
            defaultValue: "",
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
            isRequired: true,
            defaultValue: "",
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
        defaultValue: "",
        dbName: "onboarding_contact_email",
        readOnly: false,
      },
      {
        name: "image",
        placeholder: "Upload a Logo",
        fieldType: "File",
        dbName: "image",
        label: "Upload a logo for this Vendor",
        selectMany: false,
        isRequired: false,
        defaultValue: "",
        filesLimit: 1,
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
