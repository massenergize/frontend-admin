import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import states from "dan-api/data/states";
import MassEnergizeForm from "../_FormGenerator";
import { apiCall } from "../../../utils/messenger";
import Loading from "dan-components/Loading";
import { makeTagSection } from "../Events/EditEventForm";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { reduxAddToHeap } from "../../../redux/redux-actions/adminActions";
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
      loading: true,
      vendor: null,
      communities: [],
    };
  }

  static getDerivedStateFromProps(props, state) {
    // you need: communities, vendor, vendors, tags
    const { match, communities, vendors, tags, vendorsInfos } = props;
    const { id } = match.params;
    const vendor = vendorsInfos[id.toString()];
    const readyToRenderPageFirstTime =
      vendor &&
      vendors &&
      vendors.length &&
      communities &&
      communities.length &&
      tags &&
      tags.length;

    const jobsDoneDontRunWhatsBelowEverAgain =
      !readyToRenderPageFirstTime || state.mounted;

    if (jobsDoneDontRunWhatsBelowEverAgain) return null;

    const section = makeTagSection({
      collections: tags,
      event: vendor,
      title: "Please select tag(s) that apply to this service provider",
    });
    const coms = communities.map((c) => ({
      ...c,
      displayName: c.name,
      id: "" + c.id,
    }));

    const formJson = createFormJson({ vendor, communities: coms });
    formJson.fields.splice(1, 0, section);

    return { formJson, communities, vendor, mounted: true };
  }

  async componentDidMount() {
    const { addVendorToHeap, vendorsInfos, match } = this.props;
    const { id } = match.params;
    const vendorResponse = await apiCall("/vendors.info", { vendor_id: id });
    if (vendorResponse && vendorResponse.success) {
      addVendorToHeap({
        vendorsInfos: { ...vendorsInfos, [id.toString()]: vendorResponse.data },
      });
      // await this.setStateAsync({ vendor: vendorResponse.data, loading: false });
    }
    // const communitiesResponse = await apiCall(
    //   "/communities.listForCommunityAdmin"
    // );
    // if (communitiesResponse && communitiesResponse.data) {
    //   const communities = communitiesResponse.data.map((c) => ({
    //     ...c,
    //     displayName: c.name,
    //     id: "" + c.id,
    //   }));
    //   await this.setStateAsync({ communities });
    // }
    // const formJson = await this.createFormJson();
    // const tagCollectionsResponse = await apiCall(
    //   "/tag_collections.listForCommunityAdmin"
    // );
    // if (tagCollectionsResponse && tagCollectionsResponse.data) {
    //   const section = {
    //     label: "Please select tag(s) that apply to this service provider",
    //     fieldType: "Section",
    //     children: [],
    //   };
    //   Object.values(tagCollectionsResponse.data).forEach((tCol) => {
    //     const { vendor } = this.state;
    //     const newField = {
    //       name: tCol.name,
    //       label: `${tCol.name} ${
    //         tCol.allow_multiple
    //           ? "(You can select multiple)"
    //           : "(Only one selection allowed)"
    //       }`,
    //       placeholder: "",
    //       fieldType: "Checkbox",
    //       selectMany: tCol.allow_multiple,
    //       defaultValue: this.getSelectedIds(vendor.tags, tCol.tags),
    //       dbName: "tags",
    //       data: tCol.tags.map((t) => ({
    //         ...t,
    //         displayName: t.name,
    //         id: "" + t.id,
    //       })),
    //     };
    //     // want this to be the 5th field
    //     if (tCol.name === "Category") {
    //       section.children.push(newField);
    //     }
    //   });
    //   // want this to be the 2nd field
    //   formJson.fields.splice(1, 0, section);
    // }
    // await this.setStateAsync({ formJson, loading: false });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  getSelectedIds = (selected, dataToCrossCheck) => {
    const res = [];
    selected.forEach((s) => {
      if (dataToCrossCheck.filter((d) => d.id === s.id).length > 0) {
        res.push("" + s.id);
      }
    });
    return res;
  };

  render() {
    const { classes } = this.props;
    const { formJson } = this.state;
    if (!formJson) return <Loading />;
    return (
      <div>
        <MassEnergizeForm classes={classes} formJson={formJson} />
      </div>
    );
  }
}

CreateNewVendorForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const heap = state.getIn(["heap"]);
  return {
    vendors: state.getIn(["allVendors"]),
    tags: state.getIn(["allTags"]),
    communities: state.getIn(["communities"]),
    vendorsInfos: heap.vendorsInfos || {},
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      addVendorToHeap: reduxAddToHeap,
    },
    dispatch
  );
};

const Wrapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateNewVendorForm);

export default withStyles(styles, { withTheme: true })(Wrapped);

const createFormJson = ({ vendor, communities }) => {
  // const { vendor, communities } = this.state;
  const formJson = {
    title: "Update Vendor",
    subTitle: "",
    method: "/vendors.update",
    successRedirectPage: "/admin/read/vendors",
    fields: [
      {
        label: "About this Vendor",
        fieldType: "Section",
        children: [
          {
            name: "id",
            label: "ID",
            placeholder: "eg. 100",
            fieldType: "TextField",
            contentType: "text",
            isRequired: true,
            defaultValue: vendor.id,
            dbName: "vendor_id",
            readOnly: true,
          },
          {
            name: "vendor_name",
            label: "Name of this Vendor",
            placeholder: "eg. Solar Provider Inc.",
            fieldType: "TextField",
            contentType: "text",
            isRequired: true,
            defaultValue: vendor.name,
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
            defaultValue: vendor.phone_number,
            dbName: "phone_number",
            readOnly: false,
          },
          {
            name: "communities",
            label: "Which communities would this vendor service ?",
            placeholder: "eg. +1(571)-000-2231",
            fieldType: "Checkbox",
            contentType: "text",
            isRequired: true,
            selectMany: true,
            defaultValue:
              vendor && vendor.communities
                ? vendor.communities.map((c) => "" + c.id)
                : [],
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
            defaultValue: vendor.email,
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
            defaultValue: vendor.description,
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
            defaultValue: vendor.more_info && vendor.more_info.website,
            dbName: "website",
            readOnly: false,
          },
          {
            name: "have_address",
            label: "Do you have an address?",
            fieldType: "Radio",
            isRequired: false,
            defaultValue: vendor.location ? "true" : "false",
            dbName: "have_address",
            readOnly: false,
            data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }],
            child: {
              valueToCheck: "true",
              fields: [
                {
                  name: "address",
                  label: "Street Address",
                  placeholder: "",
                  fieldType: "TextField",
                  contentType: "text",
                  isRequired: true,
                  defaultValue: vendor.location && vendor.location.address,
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
                  defaultValue: vendor.location && vendor.location.city,
                  dbName: "city",
                  readOnly: false,
                },
                {
                  name: "state",
                  label: "State ",
                  placeholder: "eg. Massachusetts",
                  fieldType: "Dropdown",
                  contentType: "text",
                  isRequired: false,
                  data: states,
                  defaultValue: vendor.location && vendor.location.state,
                  dbName: "state",
                  readOnly: false,
                },
                {
                  name: "zipcode",
                  label: "Zip code",
                  placeholder: "eg. 01020",
                  fieldType: "TextField",
                  contentType: "text",
                  isRequired: true,
                  defaultValue: vendor.location && vendor.location.zipcode,
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
            label: "Please select your service sector(s)",
            placeholder: "eg. Grace Tsu",
            fieldType: "Radio",
            contentType: "text",
            isRequired: true,
            defaultValue: vendor.service_area,
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
                  label: "Please select the states you serve",
                  placeholder: "eg. New York",
                  fieldType: "Checkbox",
                  contentType: "text",
                  data: states,
                  selectMany: true,
                  isRequired: false,
                  defaultValue: vendor && (vendor.service_area_states || []),
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
            defaultValue: vendor.properties_serviced || [],
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
            defaultValue: vendor.key_contact && vendor.key_contact.name,
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
            defaultValue: vendor.key_contact && vendor.key_contact.email,
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
        defaultValue:
          vendor &&
          vendor.onboarding_contact &&
          vendor.onboarding_contact.email,
        dbName: "onboarding_contact_email",
        readOnly: true,
      },
      {
        name: "image",
        placeholder: "Upload a Logo",
        fieldType: "File",
        dbName: "image",
        label: "Upload a logo for this Vendor",
        previewLink: vendor.logo && vendor.logo.url,
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
        defaultValue: vendor.is_verified ? "true" : "false",
        dbName: "is_verified",
        readOnly: false,
        data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }],
      },
      {
        name: "is_published",
        label: "Should this vendor go live?",
        fieldType: "Radio",
        isRequired: false,
        defaultValue: vendor.is_published ? "true" : "false",
        dbName: "is_published",
        readOnly: false,
        data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }],
      },
    ],
  };
  return formJson;
};
