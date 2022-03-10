import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { apiCall } from "../../../utils/messenger";
import MassEnergizeForm from "../_FormGenerator";
import Loading from "dan-components/Loading";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getSelectedIds } from "../Actions/EditActionForm";
import { makeTagSection } from "../Events/EditEventForm";
import { Paper, Typography } from "@material-ui/core";

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

class EditTestimonial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communities: [],
      actions: [],
      vendors: [],
      formJson: null,
      testimonial: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    // you need: communities, actions, vendors, tags, testimonials, testimonial
    var { testimonials, vendors, actions, tags, communities, match } = props;
    const { id } = match.params;
    const testimonial = (testimonials || []).find(
      (t) => t.id.toString() === id.toString()
    );
    const readyToRenderThePageFirstTime =
      testimonials &&
      testimonials.length &&
      vendors &&
      vendors.length &&
      actions &&
      actions.length &&
      tags &&
      tags.length;

    const jobsDoneDontRunWhatsBelowEverAgain =
      !readyToRenderThePageFirstTime || state.mounted;

    const coms = communities.map((c) => ({
      ...c,
      id: "" + c.id,
      displayName: c.name,
    }));

    const vends = vendors.map((c) => ({
      ...c,
      displayName: c.name,
      id: "" + c.id,
    }));
    const acts = actions.map((c) => ({
      ...c,
      id: "" + c.id,
      displayName: c.title + ` - ${c.community && c.community.name}`,
    }));

    if (jobsDoneDontRunWhatsBelowEverAgain) return null;

    const section = makeTagSection({
      collections: tags,
      event: testimonial,
      title: "Please select tag(s) that apply to this testimonial",
    });
    const formJson = createFormJson({
      communities: coms,
      actions: acts,
      vendors: vends,
      testimonial,
    });
    formJson.fields.splice(1, 0, section);

    return {
      formJson,
      actions: acts,
      vendors: vends,
      communities: coms,
      mounted: true,
      testimonial,
    };
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
    const { formJson, testimonial } = this.state;
    if (!formJson) return <Loading />;
    return (
      <>
        <Paper style={{ padding: 15 }}>
          <Typography variant="h6">Created By</Typography>
          {testimonial.user && (
            <Typography>
              {testimonial.user.full_name}
              ,&nbsp;
              {testimonial.user.email}
            </Typography>
          )}
          {!testimonial.user && <p>Created By: Community Admin</p>}
        </Paper>
        <br />
        <MassEnergizeForm classes={classes} formJson={formJson} />
      </>
    );
  }
}

EditTestimonial.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    vendors: state.getIn(["allVendors"]),
    actions: state.getIn(["allActions"]),
    tags: state.getIn(["allTags"]),
    testimonials: state.getIn(["allTestimonials"]),
    communities: state.getIn(["communities"]),
  };
};


const Wrapped = connect(mapStateToProps)(EditTestimonial);

export default withStyles(styles, { withTheme: true })(Wrapped);

const createFormJson = ({ communities, actions, vendors, testimonial }) => {
  const formJson = {
    title: "Edit Testimonial",
    subTitle: "",
    method: "/testimonials.update",
    successRedirectPage: "/admin/read/testimonials",
    fields: [
      {
        label: "About this Testimonial",
        fieldType: "Section",
        children: [
          {
            name: "ID",
            label: "ID",
            placeholder: "0",
            fieldType: "TextField",
            contentType: "text",
            isRequired: true,
            defaultValue: testimonial && testimonial.id,
            dbName: "testimonial_id",
            readOnly: true,
          },
          {
            name: "preferredName",
            label: "Preferred user name to display",
            placeholder: "User name",
            fieldType: "TextField",
            contentType: "text",
            isRequired: false,
            defaultValue: testimonial && testimonial.preferred_name,
            dbName: "preferred_name",
            readOnly: false,
          },
          {
            name: "title",
            label: "Title of Testimonial",
            placeholder: "Enter a catchy title",
            fieldType: "TextField",
            contentType: "text",
            isRequired: true,
            defaultValue: testimonial && testimonial.title,
            dbName: "title",
            readOnly: false,
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
            defaultValue: testimonial && testimonial.body,
            dbName: "body",
            readOnly: false,
          },
          {
            name: "rank",
            label:
              "Give this testimonial a number to determine which order it appears in.  Smaller appears first",
            placeholder: "eg. 0",
            fieldType: "TextField",
            contentType: "number",
            isRequired: true,
            defaultValue: testimonial && testimonial.rank,
            dbName: "rank",
            readOnly: false,
          },
        ],
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
            defaultValue:
              testimonial &&
              testimonial.community &&
              "" + testimonial.community.id,
            dbName: "community_id",
            data: [{ displayName: "--", id: "" }, ...communities],
          },
          {
            name: "action",
            label: "Primary Action",
            placeholder: "eg. Action",
            fieldType: "Dropdown",
            defaultValue:
              testimonial && testimonial.action && "" + testimonial.action.id,
            dbName: "action_id",
            data: [{ displayName: "--", id: "" }, ...actions],
          },
          {
            name: "vendor",
            label: "Which Vendor did you use?",
            placeholder: "eg. Wayland",
            fieldType: "Dropdown",
            defaultValue:
              testimonial &&
              testimonial.vendor &&
              testimonial &&
              "" + testimonial.vendor.id,
            dbName: "vendor_id",
            data: [{ displayName: "--", id: "" }, ...vendors],
          },
          {
            name: "other_vendor",
            label: "Other Vendor",
            placeholder: "Other Vendor",
            fieldType: "TextField",
            contentType: "text",
            defaultValue: testimonial && testimonial.other_vendor,
            dbName: "other_vendor",
          },
        ],
      },
      {
        name: "image",
        placeholder: "Select an Image",
        fieldType: "File",
        dbName: "image",
        previewLink: testimonial && testimonial.image && testimonial.image.url,
        label: "Upload a file for this testimonial",
        selectMany: false,
        isRequired: true,
        defaultValue: "",
        filesLimit: 1,
      },
      {
        name: "is_approved",
        label: "Do you approve this testimonial?",
        fieldType: "Radio",
        isRequired: false,
        defaultValue: testimonial && testimonial.is_approved ? "true" : "false",
        dbName: "is_approved",
        readOnly: false,
        data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }],
      },
      {
        name: "is_published",
        label: "Should this go live ?",
        fieldType: "Radio",
        isRequired: false,
        defaultValue:
          testimonial && testimonial.is_published ? "true" : "false",
        dbName: "is_published",
        readOnly: false,
        data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }],
      },
    ],
  };
  return formJson;
};
