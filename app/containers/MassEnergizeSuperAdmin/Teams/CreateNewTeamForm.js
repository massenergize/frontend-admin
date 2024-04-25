import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import { apiCall } from "../../../utils/messenger";
// import MassEnergizeForm from "../_FormGenerator";
import { PAGE_KEYS } from "../ME  Tools/MEConstants";
import MassEnergizeForm from "../_FormGenerator/MassEnergizeForm";
import Loading from "dan-components/Loading";
import { connect } from "react-redux";
import fieldTypes from "../_FormGenerator/fieldTypes";
import { bindActionCreators } from "redux";
import { reduxKeepFormContent } from "../../../redux/redux-actions/adminActions";

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

 function CreateNewTeamForm({
  classes,
  communities,
  location,
   auth
 }) {
  const [parents, setParents] = React.useState([]);

  const isSuperAdmin = auth?.is_super_admin;

  const formJson = createFormJson({
    communities,
    autoOpenMediaLibrary: location?.state?.libOpen,
    parents: parents,
    setParents: setParents,
    isSuperAdmin,
  });

  if(!formJson || !communities?.length) return <Loading />

  return (
    <div>
      <MassEnergizeForm
        pageKey={PAGE_KEYS.CREATE_TEAM.key}
        classes={classes}
        formJson={formJson}
        enableCancel
      />
    </div>
  );
}

CreateNewTeamForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    communities: state.getIn(["communities"]),
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

const NewTeamMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateNewTeamForm);
export default withStyles(styles, { withTheme: true })(
  withRouter(NewTeamMapped)
);

const createFormJson = ({ communities, autoOpenMediaLibrary, parents, setParents, isSuperAdmin }) => {
  communities = (communities || []).map((c) => ({
    ...c,
    displayName: c.name,
    id: "" + c.id,
  }));
  console.log("Lets see communities", communities)

  const fetchAllTeamsInSelectedCommunities = (communityID) => {
    const args = communityID ? { community_id: communityID, } : {};
    apiCall("/teams.listForCommunityAdmin", args).then(({ data }) => {
     setParents(data || []);
    });
  };

  const updateParentWhenComIdsChange = (value) => {
    if (!value) return;
    fetchAllTeamsInSelectedCommunities(value);
  };

  parents = (parents || []).map((p) => ({
    displayName: p.name,
    id:p.id,
  }))

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
            // defaultValue: progress.name || "",
            dbName: "name",
            readOnly: false,
          },
          {
            onClose: updateParentWhenComIdsChange,
            name: "primary_community",
            label: "Primary Community",
            placeholder: "",
            fieldType: "Dropdown",
            defaultValue: null,
            dbName: "primary_community_id",
            data: [{ displayName: "--", id: "" }, ...communities],
            isAsync: true,
            endpoint: isSuperAdmin
              ? "/communities.listForSuperAdmin"
              : "/communities.listForCommunityAdmin",
          },
          {
            name: "communities",
            label: "Communities which share this team",
            placeholder: "",
            fieldType: "Checkbox",
            selectMany: true,
            defaultValue: null,
            dbName: "communities",
            data: communities,
            isAsync: true,
            // isAsync: isSuperAdmin,
            endpoint: isSuperAdmin
              ? "/communities.listForSuperAdmin"
              : "/communities.listForCommunityAdmin",
          },
          {
            name: "parent",
            label: "Parent Team (must be in the same primary community)",
            fieldType: "Dropdown",
            defaultValue: null,
            dbName: "parent_id",
            data: parents,
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
            defaultValue: null,
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
            // defaultValue: progress.tagline || "",
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
            // defaultValue: progress.description || "",
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
        // defaultValue: progress.logo || [],
        selected: [],
        openState: autoOpenMediaLibrary,
        isRequired: false,
      },
      {
        name: "is_published",
        label: "Should this team go live?",
        fieldType: "Radio",
        isRequired: false,
        defaultValue: false,
        dbName: "is_published",
        readOnly: false,
        data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }],
      },
    ],
  };
  return formJson;
};
