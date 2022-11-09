import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { apiCall } from "../../../utils/messenger";
import MassEnergizeForm from "../_FormGenerator";
import Loading from "dan-components/Loading";
import { connect } from "react-redux";
import { getRandomStringKey } from "../ME  Tools/media library/shared/utils/utils";
import fieldTypes from "../_FormGenerator/fieldTypes";
import { bindActionCreators } from "redux";
import { reduxKeepFormContent } from "../../../redux/redux-actions/adminActions";
import { PAGE_KEYS } from "../ME  Tools/MEConstants";
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

class CreateNewTeamForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communities: [],
      formJson: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    var { communities, formState } = props;
    communities = (communities || []).map((c) => ({
      ...c,
      displayName: c.name,
      id: "" + c.id,
    }));

    const progress = (formState || {})[PAGE_KEYS.CREATE_TEAM.key] || {};
    const formJson = createFormJson({ communities, progress });
    const jobsDoneDontRunWhatsBelowEverAgain =
      !(communities && communities.length) || state.mounted;
    if (jobsDoneDontRunWhatsBelowEverAgain) return null;

    return {
      communities,
      formJson,
      mounted: true,
    };
  }

  preserveFormData(formState) {
    const { saveFormTemporarily } = this.props;
    const { formData } = formState || {};
    const oldFormState = this.props.formState;
    saveFormTemporarily({
      key: PAGE_KEYS.CREATE_TEAM.key,
      data: formData,
      whole: oldFormState,
    });
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
          enableCancel
        />
      </div>
    );
  }
}

CreateNewTeamForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    communities: state.getIn(["communities"]),
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

const NewTeamMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateNewTeamForm);
export default withStyles(styles, { withTheme: true })(NewTeamMapped);

const createFormJson = ({ communities, progress }) => {
  // const { communities } = this.state;
  const formJson = {
    title: "Create New Team",
    subTitle: "",
    method: "/teams.create",
    successRedirectPage: "/admin/read/teams",
    fields: [
      {
        label: "About this Team",
        fieldType: "Section",
        children: [
          {
            name: "name",
            label: "Name of Team",
            placeholder: "eg. Cool Rangers",
            fieldType: "TextField",
            contentType: "text",
            isRequired: true,
            defaultValue: progress.name || "",
            dbName: "name",
            readOnly: false,
          },
          {
            name: "primary_community",
            label: "Primary Community",
            placeholder: "",
            fieldType: "Dropdown",
            defaultValue: progress.primary_community || null,
            dbName: "primary_community_id",
            data: [{ displayName: "--", id: "" }, ...communities],
          },
          {
            name: "communities",
            label: "Communities which share this team",
            placeholder: "",
            fieldType: "Checkbox",
            selectMany: true,
            defaultValue: progress.communities || null,
            dbName: "communities",
            data: communities,
          },
          {
            name: "parent",
            label: "Parent Team (must be in the same primary community)",
            fieldType: "Dropdown",
            defaultValue: progress.parent || null,
            dbName: "parent_id",
            data: [
              {
                id: null,
                displayName:
                  "Please choose a community and save the team.  Then edit it to set a parent team",
              },
            ],
            readOnly: true,
          },
          {
            name: "admin_emails",
            label:
              "Team Admin Email: separated by commas.  Emails must be of registered users only",
            placeholder:
              "eg. Provide email of valid registered users eg. teamadmin1@gmail.com, teamadmin2@gmail.com",
            fieldType: "TextField",
            isRequired: true,
            defaultValue: progress.admin_emails || null,
            dbName: "admin_emails",
          },
          {
            name: "tagline",
            label: "Team Tagline",
            placeholder: "eg. A catchy slogan for your team...",
            fieldType: "TextField",
            contentType: "text",
            isRequired: true,
            isMultiline: false,
            defaultValue: progress.tagline || "",
            dbName: "tagline",
            readOnly: false,
          },
          {
            name: "description",
            label: "Team Description",
            placeholder: "eg. Tell us more about this Team ...",
            fieldType: "HTMLField",
            contentType: "text",
            isRequired: true,
            isMultiline: true,
            defaultValue: progress.description || "",
            dbName: "description",
            readOnly: false,
          },
        ],
      },

      {
        name: "logo",
        placeholder: "Select a Logo for this team",
        fieldType: fieldTypes.MediaLibrary,
        dbName: "logo",
        label: "Select a Logo for this team",
        defaultValue: progress.logo || [],
        selected: progress.logo || [],
        isRequired: false,
      },
      {
        name: "is_published",
        label: "Should this team go live?",
        fieldType: "Radio",
        isRequired: false,
        defaultValue: progress.is_published || false,
        dbName: "is_published",
        readOnly: false,
        data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }],
      },
    ],
  };
  return formJson;
};
