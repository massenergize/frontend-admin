import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import MassEnergizeForm from "../_FormGenerator";
import Loading from "dan-components/Loading";
import { makeTagSection } from "../Events/EditEventForm";
import { connect } from "react-redux";
import fieldTypes from "../_FormGenerator/fieldTypes";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    padding: 30
  },
  field: {
    width: "100%",
    marginBottom: 20
  },
  fieldBasic: {
    width: "100%",
    marginBottom: 20,
    marginTop: 10
  },
  inlineWrap: {
    display: "flex",
    flexDirection: "row"
  },
  buttonInit: {
    margin: theme.spacing(4),
    textAlign: "center"
  }
});

class CreateNewTestimonialForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communities: [],
      actions: [],
      vendors: [],
      formJson: null,
      reRenderKey: "x-initial-key-x"
    };
  }

  static getDerivedStateFromProps(props, state) {
    var { vendors, actions, tags, communities, auth } = props;
    const readyToRenderThePageFirstTime = vendors && actions && actions.length && tags && tags.length;
    const isSuperAdmin = auth?.is_super_admin;
    const jobsDoneDontRunWhatsBelowEverAgain = !readyToRenderThePageFirstTime || state.mounted;

    if (jobsDoneDontRunWhatsBelowEverAgain) return null;

    const coms = (communities || []).map((c) => ({
      ...c,
      id: c.id,
      displayName: c.name
    }));

    const vends = (vendors || []).map((c) => ({
      ...c,
      displayName: c.name,
      id: c.id
    }));
    const acts = (actions || []).map((c) => ({
      ...c,
      id: c.id,
      displayName: c.title + ` - ${c.community && c.community.name}`
    }));

    const section = makeTagSection({
      collections: tags,
      title: "Please select tag(s) that apply to this testimonial",
      defaults: false
    });
    const formJson = createFormJson({
      communities: coms,
      actions: acts,
      vendors: vends,
      otherCommunities: props.otherCommunities
    });
    formJson.fields.splice(1, 0, section);

    return {
      formJson,
      actions: acts,
      vendors: vends,
      communities: coms,
      mounted: true,
      isSuperAdmin
    };
  }

  render() {
    const { classes } = this.props;
    const { formJson } = this.state;
    if (!formJson) return <Loading />;
    return (
      <div key={this.state.reRenderKey}>
        <MassEnergizeForm classes={classes} formJson={formJson} enableCancel />
      </div>
    );
  }
}

CreateNewTestimonialForm.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    vendors: state.getIn(["allVendors"]),
    actions: state.getIn(["allActions"]),
    tags: state.getIn(["allTags"]),
    auth: state.getIn(["auth"]),
    communities: state.getIn(["communities"]),
    otherCommunities: state.getIn(["otherCommunities"])
  };
};
const Mapped = connect(mapStateToProps)(CreateNewTestimonialForm);
export default withStyles(styles, { withTheme: true })(Mapped);

const createFormJson = ({ communities, actions, vendors, isSuperAdmin, otherCommunities }) => {
  // const { communities, actions, vendors } = this.state;
  const otherCommunityList = otherCommunities?.map((c) => ({
    displayName: c.name,
    id: c.id
  }));

  const formJson = {
    title: "Create New Testimonial",
    subTitle: "",
    method: "/testimonials.create",
    successRedirectPage: "/admin/read/testimonials",
    fields: [
      {
        label: "About this Testimonial",
        fieldType: "Section",
        children: [
          {
            name: "title",
            label: "Title of Testimonial",
            placeholder: "A catchy title so people will read it",
            fieldType: "TextField",
            contentType: "text",
            isRequired: true,
            defaultValue: "",
            dbName: "title",
            readOnly: false
          },
          {
            name: "body",
            label: "Body",
            placeholder: "Tell us more ...",
            // fieldType: 'TextField',
            fieldType: "HTMLField",
            contentType: "text",
            isRequired: true,
            isMultiline: true,
            defaultValue: "",
            dbName: "body",
            readOnly: false
          },
          {
            name: "rank",
            label: "Give this testimonial a number to determine which order it appears in.  Smaller appears first",
            placeholder: "eg. 0",
            fieldType: "TextField",
            contentType: "number",
            isRequired: false,
            defaultValue: "",
            dbName: "rank",
            readOnly: false
          }
        ]
      },
      {
        label: "What this Testimonial is linked to",
        fieldType: "Section",
        children: [
          {
            name: "community",
            label: "Primary Community",
            placeholder: "eg. Wayland",
            fieldType: "Dropdown",
            defaultValue: null,
            dbName: "community_id",
            data: [{ displayName: "--", id: "" }, ...communities],
            isAsync: true,
            endpoint: isSuperAdmin ? "/communities.listForSuperAdmin" : "/communities.listForCommunityAdmin"
          },
          {
            name: "action",
            label: "Primary Action",
            placeholder: "eg. Action",
            fieldType: "Dropdown",
            defaultValue: null,
            dbName: "action_id",
            data: [{ displayName: "--", id: "" }, ...actions],
            isAsync: true,
            endpoint: isSuperAdmin ? "/actions.listForSuperAdmin" : "/actions.listForCommunityAdmin"
          },
          {
            name: "vendor",
            label: "Which Vendor did you use?",
            placeholder: "eg. Wayland",
            fieldType: "Dropdown",
            defaultValue: null,
            dbName: "vendor_id",
            data: [{ displayName: "--", id: "" }, ...vendors],
            isAsync: true,
            endpoint: isSuperAdmin ? "/vendors.listForSuperAdmin" : "/vendors.listForCommunityAdmin"
          },
          {
            name: "other_vendor",
            label: "Other Vendor",
            placeholder: "Other Vendor",
            fieldType: "TextField",
            contentType: "text",
            defaultValue: null,
            dbName: "other_vendor"
          },
          {
            name: "user_email",
            label: "Please provide email of the user",
            placeholder: "eg. johny.appleseed@massenergize.org",
            fieldType: "TextField",
            contentType: "text",
            isRequired: true,
            defaultValue: "",
            dbName: "user_email",
            readOnly: false
          },
          {
            name: "preferredName",
            label: "Preferred user name to display",
            placeholder: "User name",
            fieldType: "TextField",
            contentType: "text",
            isRequired: false,
            defaultValue: "",
            dbName: "preferred_name",
            readOnly: false
          }
        ]
      },
      {
        name: "image",
        placeholder: "Select an Image",
        fieldType: fieldTypes.MediaLibrary,
        dbName: "image",
        label: "Upload a file for this testimonial",
        uploadMultiple: false,
        multiple: false,
        isRequired: false
      },
      {
        label: "Who can see this testimonial?",
        fieldType: "Section",
        children: [
          {
            name: "sharing_type",
            label: "Who should be able to see this testimonial?",
            fieldType: "Radio",
            isRequired: false,
            dbName: "sharing_type",
            readOnly: false,
            data: [
              { id: "OPEN", value: "All communities can use this testimonial " },
              {
                id: "OPEN_TO",
                value: "Only communities I select should see this"
              },
              {
                id: "CLOSE",
                value: "No one can see this, keep this in my community only "
              }

              // { id: "CLOSED_TO", value: "All except these communities" },
            ],
            conditionalDisplays: [
              {
                valueToCheck: "OPEN_TO",
                fields: [
                  {
                    name: "audience",
                    label: `Select the communities that can see and use this testimonial`,
                    placeholder: "",
                    fieldType: "Checkbox",
                    selectMany: true,
                    dbName: "audience",
                    data: otherCommunityList,
                    isAsync: true,
                    endpoint: isSuperAdmin
                      ? "/communities.listForSuperAdmin"
                      : "/communities.others.listForCommunityAdmin"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: "is_approved",
        label: "Is this testimonial approved ?",
        fieldType: "Radio",
        isRequired: false,
        defaultValue: "true",
        dbName: "is_approved",
        readOnly: false,
        data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }]
      },
      {
        name: "is_published",
        label: "Should this go live ?",
        fieldType: "Radio",
        isRequired: false,
        defaultValue: "false",
        dbName: "is_published",
        readOnly: false,
        data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }]
      }
    ]
  };
  return formJson;
};
