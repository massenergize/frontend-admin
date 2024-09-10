import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import { apiCall } from "../../../utils/messenger";
import MassEnergizeForm from "../_FormGenerator/MassEnergizeForm";
import Loading from "dan-components/Loading";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getSelectedIds } from "../Actions/EditActionForm";
import { makeTagSection } from "../Events/EditEventForm";
import { Paper, Typography } from "@mui/material";
import fieldTypes from "../_FormGenerator/fieldTypes";
import { withRouter } from "react-router-dom";
import { fetchLatestNextSteps } from "../../../redux/redux-actions/adminActions";
import { PAGE_KEYS } from "../ME  Tools/MEConstants";
import Seo from "../../../components/Seo/Seo";

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

class EditTestimonial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communities: [],
      actions: [],
      vendors: [],
      formJson: null,
      testimonial: null
    };
  }

  static getDerivedStateFromProps(props, state) {
    // you need: communities, actions, vendors, tags, testimonials, testimonial
    var { testimonials, vendors, actions, tags, communities, match, auth } = props;
    const { id } = match.params;
    let testimonial = (testimonials || []).find((t) => t.id.toString() === id.toString());
    if (!testimonial) {
      apiCall("/testimonials.info", { id: id }).then((response) => {
        if (response.success) {
          testimonial = response.data;
        }
      });
    }
    const readyToRenderThePageFirstTime =
      testimonials &&
      testimonials.length &&
      vendors &&
      vendors.length &&
      actions &&
      actions.length &&
      tags &&
      tags.length;
    const isSuperAdmin = auth?.is_super_admin;

    const jobsDoneDontRunWhatsBelowEverAgain = !readyToRenderThePageFirstTime || state.mounted;

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

    if (jobsDoneDontRunWhatsBelowEverAgain) return null;

    const section = makeTagSection({
      collections: tags,
      event: testimonial,
      title: "Please select tag(s) that apply to this testimonial"
    });
    const formJson = createFormJson({
      communities: coms,
      actions: acts,
      vendors: vends,
      testimonial,
      isSuperAdmin,
      otherCommunities: props.otherCommunities
    });
    formJson.fields.splice(1, 0, section);

    return {
      formJson,
      actions: acts,
      vendors: vends,
      communities: coms,
      mounted: true,
      testimonial
    };
  }

  onComplete(_, __, resetForm) {
    const pathname = "/admin/read/testimonials";
    const { location, history, match, updateNextSteps } = this.props;
    const { id } = match.params;
    var ids = location.state && location.state.ids;

    resetForm && resetForm();
    updateNextSteps();
    // Just means admin just answered message normally, so form should just reset, and redirect back to the same page, just like the old fxnality
    if (!ids || !ids.length) return history.push(pathname);

    // -- Then follow up with going back to the msg list page, but with the id of the just-answered msg, removed
    ids = ids.filter((_id) => _id.toString() !== id && id.toString());
    history.push({
      pathname,
      state: { ids }
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
    const { classes, match } = this.props;
    const { formJson, testimonial } = this.state;
    const { id } = match.params;
    if (!formJson) return <Loading />;
    return (
      <>
        <Seo name={`Edit Testimonial - ${testimonial?.title}`} />
        <Paper style={{ padding: 15 }}>
          <Typography variant="h6">Created By</Typography>
          {testimonial && testimonial.user && (
            <Typography>
              {testimonial.user.full_name}
              ,&nbsp;
              {testimonial.user.email}
            </Typography>
          )}
          {testimonial && !testimonial.user && <p>Created By: Community Admin</p>}
        </Paper>
        <br />
        <MassEnergizeForm
          classes={classes}
          formJson={formJson}
          onComplete={this.onComplete.bind(this)}
          pageKey={`${PAGE_KEYS.EDIT_TESTIMONIALS.key}-${id}`}
          enableCancel
        />
      </>
    );
  }
}

EditTestimonial.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    vendors: state.getIn(["allVendors"]),
    actions: state.getIn(["allActions"]),
    tags: state.getIn(["allTags"]),
    testimonials: state.getIn(["allTestimonials"]),
    communities: state.getIn(["communities"]),
    auth: state.getIn(["auth"]),
    otherCommunities: state.getIn(["otherCommunities"])
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      updateNextSteps: fetchLatestNextSteps
    },
    dispatch
  );
};

const Wrapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(EditTestimonial));

export default withStyles(styles, { withTheme: true })(Wrapped);

const createFormJson = ({ communities, actions, vendors, testimonial, isSuperAdmin, otherCommunities }) => {
  const otherCommunityList = otherCommunities?.map((c) => ({
    displayName: c.name,
    id: c.id
  }));

  const audience = (testimonial?.audience || []).map((c) => c.id.toString());
console.log("SOCAH TOAH", testimonial)
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
            defaultValue: testimonial && testimonial.id,
            dbName: "testimonial_id",
            readOnly: true
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
            readOnly: false
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
            defaultValue: testimonial && testimonial.body,
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
            defaultValue: testimonial && testimonial.rank,
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
            defaultValue: testimonial?.community?.id,
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
            defaultValue: testimonial?.action?.id,
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
            defaultValue: testimonial?.vendor?.id,
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
            defaultValue: testimonial && testimonial.other_vendor,
            dbName: "other_vendor"
          }
        ]
      },
      {
        name: "image",
        placeholder: "Select an Image",
        fieldType: fieldTypes.MediaLibrary,
        dbName: "image",
        selected: testimonial && testimonial.file ? [testimonial.file] : [],
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
            defaultValue: testimonial?.sharing_type || null,
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
                    defaultValue: audience,
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
        label: "Do you approve this testimonial?",
        fieldType: "Radio",
        isRequired: false,
        defaultValue: testimonial && testimonial.is_approved ? "true" : "false",
        dbName: "is_approved",
        readOnly: false,
        data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }]
      },
      {
        name: "is_published",
        label: "Should this go live ?",
        fieldType: "Radio",
        isRequired: false,
        defaultValue: testimonial && testimonial.is_published ? "true" : "false",
        dbName: "is_published",
        readOnly: false,
        data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }]
      }
    ]
  };
  return formJson;
};
