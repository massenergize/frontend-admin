import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { apiCall } from "../../../utils/messenger";
import MassEnergizeForm from "../_FormGenerator";
import Loading from "dan-components/Loading";
import { connect } from "react-redux";
import { checkIfReadOnly, makeTagSection } from "./EditActionForm";
import { getRandomStringKey } from "../ME  Tools/media library/shared/utils/utils";
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
    margin: theme.spacing.unit * 4,
    textAlign: "center",
  },
});

class CreateNewActionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communities: [],
      ccActions: [],
      vendors: [],
      formJson: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { communities, tags, vendors, ccActions, auth } = props;
    const fullyMountedNeverRunThisAgain =
      communities &&
      communities.length &&
      tags &&
      tags.length &&
      vendors &&
      vendors.length &&
      ccActions &&
      ccActions.length;

    if (!fullyMountedNeverRunThisAgain && !state.mounted) return null;
    const coms = (communities || []).map((c) => ({
      ...c,
      displayName: c.name,
      id: "" + c.id,
    }));
    const vends = (vendors || []).map((c) => ({
      ...c,
      displayName: c.name,
      id: "" + c.id,
    }));
    const modifiedCCActions = (ccActions || []).map((c) => ({
      ...c,
      displayName: c.description,
      id: "" + c.id,
    }));
    const formJson = createFormJson({
      communities: coms,
      vendors: vends,
      ccActions: modifiedCCActions,
      auth,
    });

    const section = makeTagSection({ collections: tags, defaults: false });

    if (formJson) formJson.fields.splice(1, 0, section);

    return {
      mounted: true,
      communities: coms,
      ccActions: modifiedCCActions,
      vendors: vends,
      formJson,
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

CreateNewActionForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  tags: state.getIn(["allTags"]),
  communities: state.getIn(["communities"]),
  vendors: state.getIn(["allVendors"]),
  ccActions: state.getIn(["ccActions"]),
  actions: state.getIn(["allActions"]),
  auth: state.getIn(["auth"]),
});

const NewActionMapped = connect(mapStateToProps)(CreateNewActionForm);
export default withStyles(styles, { withTheme: true })(NewActionMapped);

const createFormJson = ({ communities, ccActions, vendors, auth }) => {
  const is_super_admin = auth && auth.is_super_admin;
  console.log(communities[0])
  const formJson = {
    title: "Create a New Action",
    subTitle: "",
    method: "/actions.create",
    successRedirectPage: "/admin/read/actions",
    fields: [
      {
        label: "About this Action",
        fieldType: "Section",
        children: [
          {
            name: "title",
            label: "Title of Action (Between 4 and 40 characters)",
            placeholder: "Use Heat Pumps",
            fieldType: "TextField",
            contentType: "text",
            isRequired: true,
            defaultValue: "",
            dbName: "title",
            readOnly: false,
            maxLength: 40,
          },
          {
            name: "rank",
            label:
              "Rank (Which order should this action appear in?  Lower numbers come first)",
            placeholder: "eg. 1",
            fieldType: "TextField",
            contentType: "number",
            isRequired: true,
            defaultValue: "",
            dbName: "rank",
            readOnly: false,
          },
          is_super_admin
            ? {
                name: "is_global",
                label: "Is this Action a Template?",
                fieldType: "Radio",
                isRequired: false,
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
                    },
                  ],
                },
              }
            : {
                name: "community",
                label: "Primary Community (select one)",
                fieldType: "Dropdown",
                defaultValue: communities[0].id,    // for a cadmin default to first of their communities.  Need one.
                dbName: "community_id",
                data: [{ displayName: "--", id: "" }, ...communities],      
              },
        ],
      },
      {
        label:
          "Carbon Calculator - Link your Action to one of our Carbon Calculator Actions",
        fieldType: "Section",
        children: [
          {
            name: "calculator_action",
            label: "Calculator Action",
            placeholder: "eg. Wayland",
            fieldType: "Dropdown",
            defaultValue: null,
            dbName: "calculator_action",
            data: ccActions,
            modalTitle: "Carbon Action List & Instructions",
            modalText:
              "Check out the instructions here: https://docs.google.com/document/d/1b-tCB83hKk9yWFcB15YdHBORAFOPyh63c8jt1i15WL4",
          },
        ],
      },
      {
        name: "featured_summary",
        label: "Featured Summary",
        placeholder: "eg. This event is happening in ...",
        fieldType: "TextField",
        isMulti: true,
        isRequired: true,
        defaultValue: null,
        dbName: "featured_summary",
      },
      {
        name: "about",
        label: "Write some detailed description about this action",
        placeholder: "eg. This event is happening in ...",
        fieldType: "HTMLField",
        isRequired: true,
        defaultValue: null,
        dbName: "about",
      },
      {
        name: "steps_to_take",
        label: "Please outline steps to take for your users",
        placeholder: "eg. This event is happening in ...",
        fieldType: "HTMLField",
        isRequired: true,
        defaultValue: null,
        dbName: "steps_to_take",
      },
      {
        name: "deep_dive",
        label: "Deep dive into all the details",
        placeholder: "eg. This action ...",
        fieldType: "HTMLField",
        isRequired: true,
        defaultValue: null,
        dbName: "deep_dive",
      },
      {
        name: "vendors",
        label: "Select which vendors provide services for this action",
        placeholder: "eg. Solarize Wayland",
        fieldType: "Checkbox",
        selectMany: true,
        defaultValue: null,
        dbName: "vendors",
        data: vendors,
      },
      {
        name: "image",
        placeholder: "Select an Image",
        // fieldType: "File",
        fieldType: fieldTypes.MediaLibrary,
        dbName: "image",
        label: "Upload Files",
        isRequired: false,
        defaultValue: "",
        filesLimit: 1,
      },
      {
        name: "is_published",
        label: "Should this action go live?",
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
