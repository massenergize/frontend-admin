import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withStyles } from "@mui/styles";
import { apiCall } from "../../../utils/messenger";
import MassEnergizeForm from "../_FormGenerator";
import Loading from "dan-components/Loading";
import fieldTypes from "../_FormGenerator/fieldTypes";
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

export const getSelectedIds = (selected, dataToCrossCheck) => {
  const res = [];
  (selected || []).forEach((s) => {
    const isString = typeof s === "string"; // The selected tags dont always come in as array of objs, sometimes they come in as array of strings (like: when tracking progress)
    const filtered = dataToCrossCheck.filter((d) => {
      if (isString) return d.id.toString() === s;
      return d.id === s.id;
    });
    if (filtered.length > 0) {
      res.push("" + isString ? s : s.id);
    }
  });
  return res;
};

export const checkIfReadOnly = (action, user) => {
  if (!action || !user) return;
  if (action.community && action.community.id) {
    var correctCommunity = user.admin_at.filter((comm) => {
      return comm.id === action.community.id;
    });
    var readOnlyWrongCommunity =
      !user.is_super_admin && correctCommunity.length < 1;
  }
  return (action.is_global && !user.is_super_admin) || readOnlyWrongCommunity;
};
export const makeTagSection = ({ collections, action, defaults = true }) => {
  const section = {
    label: "Please select tag(s) that apply to this action",
    fieldType: "Section",
    children: [],
  };
  (collections || []).forEach((tCol) => {
    var selected = (action && action.tags) || [];
    let putDefaultsIfUpdating = {};
    if (defaults) {
      let data = selected.map((c) => c.id.toString());
      putDefaultsIfUpdating = {
        defaultValue: defaults && getSelectedIds(data || [], tCol.tags || []),
      };
    }

    selected = (selected.length && selected) || [];
    const newField = {
      isRequired: false,
      name: tCol.name,
      label: `${tCol.name} ${
        tCol.allow_multiple
          ? "(You can select multiple)"
          : "(Only one selection allowed)"
      }`,
      placeholder: "",
      fieldType: "Checkbox",
      selectMany: tCol.allow_multiple,
      ...putDefaultsIfUpdating,
      processedDefaultValue: (selected) =>
        getSelectedIds(selected || [], tCol.tags || []),

      dbName: "tags",
      data: (tCol.tags || []).map((t) => ({
        ...t,
        displayName: t.name,
        id: "" + t.id,
      })),
    };

    // want this to be the 5th field
    section.children.push(newField);
  });

  return section;
};

class EditActionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communities: [],
      action: undefined,
      vendors: [],
      ccActions: [],
      formJson: null,
      readOnly: false,
    };
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    const actionResponse = await apiCall("/actions.info", {
      id: id,
    });
    if (actionResponse && !actionResponse.success) {
      return;
    }
    await this.setStateAsync({ action: actionResponse.data });
  }

  static getDerivedStateFromProps(props, state) {
    const {
      match,
      communities,
      actions,
      tags,
      vendors,
      auth,
      ccActions,
      location,
    } = props;

    const { id } = match.params;
    const readyToRunPageFirstTime =
      actions &&
      actions.length &&
      ccActions &&
      ccActions.length &&
      tags &&
      tags.length;

    const jobsDoneDontRunWhatsBelowEverAgain =
      !readyToRunPageFirstTime || state.mounted;
    if (jobsDoneDontRunWhatsBelowEverAgain) return null;
    let action = state.action;
    if (!action) {
      action = ((actions) || []).find(
        (a) => a.id.toString() === id.toString()
      );
    }

    const readOnly = checkIfReadOnly(action, auth);
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
    const libOpen = location.state && location.state.libOpen;

    const formJson = createFormJson({
      action,
      communities: coms,
      vendors: vends,
      ccActions: modifiedCCActions,
      auth,
      autoOpenMediaLibrary: libOpen,
    });

    const section = makeTagSection({ collections: tags, action });

    if (formJson) formJson.fields.splice(1, 0, section);

    return {
      communities: coms,
      ccActions: modifiedCCActions,
      vendors: vends,
      action,
      formJson,
      readOnly,
    };
  }
  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  render() {
    const { classes } = this.props;
    const { formJson, readOnly, action } = this.state;
    if (!action || !formJson) return <Loading />;
    return (
      <div>
        <MassEnergizeForm
          classes={classes}
          formJson={formJson}
          readOnly={readOnly}
          enableCancel
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.getIn(["auth"]),
  community: state.getIn(["selected_community"]),
  tags: state.getIn(["allTags"]),
  communities: state.getIn(["communities"]),
  vendors: state.getIn(["allVendors"]),
  ccActions: state.getIn(["ccActions"]),
  actions: state.getIn(["allActions"]),
});

const EditActionMapped = connect(mapStateToProps)(EditActionForm);

EditActionForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(
  withRouter(EditActionMapped)
);

const createFormJson = ({
  action,
  communities,
  ccActions,
  vendors,
  auth,
  autoOpenMediaLibrary,
}) => {
  if (!action || !ccActions || !vendors || !communities) return;
  const is_super_admin = auth && auth.is_super_admin;
  const formJson = {
    title: "Update Action",
    subTitle: "",
    method: "/actions.update",
    // successRedirectPage: `/admin/edit/${action.id}/action`,
    successRedirectPage: `/admin/read/actions`,
    fields: [
      {
        label: "About this Action",
        fieldType: "Section",
        children: [
          {
            name: "action_id",
            label: "Action ID",
            fieldType: "TextField",
            contentType: "text",
            isRequired: false,
            defaultValue: action.id,
            dbName: "action_id",
            readOnly: true,
          },
          {
            name: "title",
            label: "Title of Action (Between 4 and 40 characters)",
            placeholder: "Use Heat Pumps",
            fieldType: "TextField",
            contentType: "text",
            isRequired: true,
            defaultValue: action.title,
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
            isRequired: false,
            defaultValue: action.rank,
            dbName: "rank",
            readOnly: false,
          },
          is_super_admin
            ? {
                name: "is_global",
                label: "Is this Action a Template?",
                fieldType: "Radio",
                isRequired: false,
                defaultValue: action.is_global ? "true" : "false",
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
                      label: "Primary Community (Select one)",
                      placeholder: "",
                      fieldType: "Dropdown",
                      defaultValue:
                        action.community && "" + action.community.id,
                      dbName: "community_id",
                      data: [{ displayName: "--", id: "" }, ...communities],
                      isRequired: true,
                    },
                  ],
                },
              }
            : {
                name: "community",
                label: "Primary Community (Select one)",
                placeholder: "",
                fieldType: "Dropdown",
                defaultValue: action.community && "" + action.community.id,
                dbName: "community_id",
                data: [{ displayName: "--", id: "" }, ...communities],
                isRequired: true,
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
            defaultValue:
              action.calculator_action && "" + action.calculator_action.id,
            dbName: "calculator_action",
            data: [{ displayName: "--", id: "" }, ...ccActions],
            modalTitle: "Carbon Action List & Instructions",
            modalText:
              "Check out the instructions here: https://docs.google.com/document/d/1RisvrGJQifCq9c62etcwR1YCUffExz_T8lR2XDGmokQ/edit",
          },
        ],
      },
      {
        name: "featured_summary",
        label: "Featured Summary",
        placeholder: "Short sentence promoting the action",
        fieldType: "TextField",
        isMulti: true,
        isRequired: false,
        defaultValue: action.featured_summary,
        dbName: "featured_summary",
        readOnly: false,
      },
      {
        name: "about",
        label: "Write some detailed description about this action",
        placeholder: "Key information people should know about the action",
        fieldType: "HTMLField",
        isRequired: true,
        defaultValue: action.about,
        dbName: "about",
        readOnly: false,
      },
      {
        name: "steps_to_take",
        label: "Please outline steps to take for your users",
        placeholder: "Easy to follow steps to accomplish the action",
        fieldType: "HTMLField",
        isRequired: false,
        defaultValue: action.steps_to_take,
        dbName: "steps_to_take",
        readOnly: false,
      },
      {
        name: "deep_dive",
        label: "Deep dive into all the details (optional)",
        placeholder: "Further information some users might want to know",
        fieldType: "HTMLField",
        isRequired: false,
        defaultValue: action.deep_dive,
        dbName: "deep_dive",
        readOnly: false,
      },
      {
        name: "vendors",
        label: "Select which vendors provide services for this action",
        fieldType: "Checkbox",
        selectMany: true,
        defaultValue: action.vendors
          ? action.vendors.map((v) => "" + v.id)
          : [],
        dbName: "vendors",
        data: vendors,
      },
      {
        name: "image",
        placeholder: "Select an Image",
        fieldType: fieldTypes.MediaLibrary,
        selected: action.image ? [action.image] : [],
        openState: autoOpenMediaLibrary,
        dbName: "image",
        label: "Upload Files",
        isRequired: false,
        defaultValue: "",
      },
      {
        name: "is_published",
        label: "Should this action go live?",
        fieldType: "Radio",
        isRequired: false,
        defaultValue: action.is_published ? "true" : "false",
        dbName: "is_published",
        readOnly: false,
        data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }],
      },
    ],
  };
  return formJson;
};
