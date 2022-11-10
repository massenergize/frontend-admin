import React, { Component } from "react";
import PropTypes from "prop-types";
import states from "dan-api/data/states";
import { withStyles } from "@material-ui/core/styles";
import MassEnergizeForm from "../_FormGenerator";
import { apiCall } from "../../../utils/messenger";
import { makeTagSection } from "../Events/EditEventForm";
import { connect } from "react-redux";
import Loading from "dan-components/Loading";
import fieldTypes from "../_FormGenerator/fieldTypes";
import { bindActionCreators } from "redux";
import { reduxKeepFormContent } from "../../../redux/redux-actions/adminActions";
import { PAGE_KEYS } from "../ME  Tools/MEConstants";
import { removePageProgressFromStorage } from "../../../utils/common";

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
    const { communities, tags, formState } = props;

    const progress = (formState || {})[PAGE_KEYS.CREATE_VENDOR.key] || {};
    const section = makeTagSection({
      collections: tags,
      defaults: true,
      title: "Please select tag(s) that apply to this service provider",
      progress,
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

    const formJson = createFormJson({ communities: coms, progress });
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

  preserveFormData(formState) {
    const { saveFormTemporarily } = this.props;
    const { formData } = formState || {};
    const oldFormState = this.props.formState;
    saveFormTemporarily({
      key: PAGE_KEYS.CREATE_VENDOR.key,
      data: formData,
      whole: oldFormState,
    });
  }
  clearProgress(resetForm) {
    resetForm();
    const { saveFormTemporarily } = this.props;
    const oldFormState = this.props.formState;
    saveFormTemporarily({
      key: PAGE_KEYS.CREATE_VENDOR.key,
      data: {},
      whole: oldFormState,
    });
    removePageProgressFromStorage(PAGE_KEYS.CREATE_VENDOR.key);
  }

  render() {
    const { classes } = this.props;
    const { formJson } = this.state;
    if (!formJson) return <Loading />;
    return (
      <div>
        <MassEnergizeForm
          classes={classes}
          formJson={formJson}
          unMount={this.preserveFormData.bind(this)}
          clearProgress={this.clearProgress.bind(this)}
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
)(CreateNewVendorForm);
export default withStyles(styles, { withTheme: true })(Mapped);

const createFormJson = ({ communities, progress }) => {
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
            defaultValue: progress.name || "",
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
            defaultValue: progress.phone_number || "",
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
            defaultValue: progress.communities || [],
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
            defaultValue: progress.email || "",
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
            defaultValue: progress.description || "",
            dbName: "description",
            readOnly: false,
          },
          {
            name: "website",
            label: "Vendor's Website",
            placeholder: "eg. https://www.vendorwebsite.com",
            fieldType: "TextField",
            contentType: "text",
            defaultValue: progress.website || "",
            isRequired: false,
            dbName: "website",
            readOnly: false,
          },
          {
            name: "have_address",
            label: "Do you have an address?",
            fieldType: "Radio",
            isRequired: false,
            defaultValue: progress.have_address || "false",
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
                  defaultValue: progress.address || "",
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
                  defaultValue: progress.city || "",
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
                  defaultValue: progress.state || "Massachusetts",
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
                  defaultValue: progress.zipcode || "",
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
            defaultValue: progress.service_area || "national",
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
                  defaultValue: progress.service_area_states || [],
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
            defaultValue: progress.properties_serviced || [],
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
            defaultValue: progress.key_contact_full_name || "",
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
            defaultValue: progress.key_contact_full_name || "",
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
        defaultValue: progress.onboarding_contact_email || "",
        dbName: "onboarding_contact_email",
        readOnly: false,
      },
      {
        name: "image",
        placeholder: "Add a Logo",
        fieldType: fieldTypes.MediaLibrary,
        dbName: "image",
        defaultValue: progress.image || [],
        selected: progress.image || [],
        label: "Upload a logo for this Vendor",
        isRequired: false,
      },
      {
        name: "is_verified",
        label: "Have you verified this Vendor?",
        fieldType: "Radio",
        isRequired: false,
        defaultValue: progress.is_verified || "false",
        dbName: "is_verified",
        readOnly: false,
        data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }],
      },
      {
        name: "is_published",
        label: "Should this vendor go live?",
        fieldType: "Radio",
        isRequired: false,
        defaultValue: progress.is_published || "false",
        dbName: "is_published",
        readOnly: false,
        data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }],
      },
    ],
  };
  return formJson;
};
