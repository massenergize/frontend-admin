import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { Paper, Typography } from "@mui/material";
import { withStyles } from "@mui/styles";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { apiCall } from "../../../utils/messenger";
import MassEnergizeForm from "../_FormGenerator/MassEnergizeForm";
import {
  fetchLatestNextSteps,
  reduxAddToHeap,
  reduxGetAllCommunityTeams,
  reduxUpdateHeap,
} from "../../../redux/redux-actions/adminActions";
import Loading from "dan-components/Loading";
import fieldTypes from "../_FormGenerator/fieldTypes";
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
    margin: theme.spacing(4),
    textAlign: "center",
  },
});

const makeParentOptions = ({ teams, team }) => {
  teams = teams || [];
  var parentTeamOptions = "0";
  const parentTeams =
    teams.filter((_team) => _team.parent && _team.parent.id === team.id)
      .length === 0 &&
    teams.filter((_team) => _team.id !== team.id && !_team.parent);
  if (parentTeams) {
    parentTeamOptions = parentTeams.map((_team) => ({
      id: _team.id,
      displayName: _team.name,
    }));
    parentTeamOptions = [
      { displayName: "NONE", id: "0" },
      ...parentTeamOptions,
    ];
  } else {
    parentTeamOptions = [
      {
        displayName:
          "Team cannot have a parent, because it is a parent of another team",
        id: "0",
      },
    ];
  }

  return parentTeamOptions;
};

class EditTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communities: [],
      formJson: null,
      team: null,
      parentTeamOptions: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    var { match, communities, teams, teamsInfos, location } = props;
    const { id } = match.params;
    const isSuperAdmin = auth?.is_super_admin && !auth?.is_community_admin;
    communities = (communities || []).map((c) => ({
      ...c,
      displayName: c.name,
      id: "" + c.id,
    }));
    const team = teamsInfos[id.toString()];
    const readyToRenderThePageFirstTime = team && teams && teams.length;
    const jobsDoneDontRunWhatsBelow =
      !readyToRenderThePageFirstTime || state.mounted;

    if (jobsDoneDontRunWhatsBelow) return null;

    if (team)
      teams = teams && teams.filter(
        (t) => t.primary_community.id === team.primary_community.id
      );
    const parentTeamOptions = makeParentOptions({ teams, team });
    const libOpen = location.state && location.state.libOpen;
    const formJson = createFormJson({
      team,
      parentTeamOptions,
      communities,
      autoOpenMediaLibrary: libOpen,
      isSuperAdmin,
    });
    return { team, formJson, parentTeamOptions, mounted: true };
  }
  async componentDidMount() {
    const { id } = this.props.match.params;
    const { addTeamInfoToHeap, teamsInfos,heap } = this.props;
    const teamResponse = await apiCall("/teams.info", { team_id: id });
    addTeamInfoToHeap({
      teamsInfos: { ...teamsInfos, [id.toString()]: teamResponse.data },
    },heap);
  }

  onComplete(_, __, resetForm) {
    const pathname = "/admin/read/teams";
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
      state: { ids },
    });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  render() {
    const { classes } = this.props;
    const { formJson, team } = this.state;
    const { id } = this.props.match.params;
    if (!formJson) return <Loading />;
    return (
      <div>
        <Paper style={{ padding: 15 }}>
          <Typography>
            Want to see a list of all members and admins in this team?
          </Typography>
          <Link to={`/admin/edit/${team && team.id}/team-members`}>
            Team Members and Admins
          </Link>
        </Paper>

        <br />
        
        <MassEnergizeForm
          classes={classes}
          formJson={formJson}
          pageKey={`${PAGE_KEYS.EDIT_TEAM.key}-${id}`}
          enableCancel
          onComplete={this.onComplete.bind(this)}
        />
      </div>
    );
  }
}

EditTeam.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const heap = state.getIn(["heap"]) || {};
  return {
    communities: state.getIn(["communities"]),
    teams: state.getIn(["allTeams"]),
    teamsInfos: heap.teamsInfos || {},
    heap,
    auth: state.getIn(["auth"]),
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      callTeamsForNormalAdmin: reduxGetAllCommunityTeams,
      addTeamsToHeap: reduxUpdateHeap,
      addTeamInfoToHeap: reduxAddToHeap,
      updateNextSteps: fetchLatestNextSteps,
    },
    dispatch
  );
}
const EditTeamMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(EditTeam));

export default withStyles(styles, { withTheme: true })(
  withRouter(EditTeamMapped)
);
const createFormJson = ({ communities, team, parentTeamOptions,  autoOpenMediaLibrary,isSuperAdmin}) => {
  // const { communities, team, parentTeamOptions } = this.state;
  const selectedCommunities = team.communities
    ? team.communities.map((e) => "" + e.id)
    : [];

  const formJson = {
    title: "Edit Team Information",
    subTitle: "",
    method: "/teams.update",
    successRedirectPage: "/admin/read/teams",
    fields: [
      {
        label: "About this Team",
        fieldType: "Section",
        children: [
          {
            name: "id",
            label: "ID",
            placeholder: "eg. id",
            fieldType: "TextField",
            contentType: "text",
            defaultValue: team.id,
            dbName: "id",
            readOnly: true,
          },
          {
            name: "name",
            label: "Name of Team",
            placeholder: "eg. Cool Rangers",
            fieldType: "TextField",
            contentType: "text",
            isRequired: true,
            defaultValue: team.name,
            dbName: "name",
            readOnly: false,
          },
          {
            name: "primary_community",
            label: "Primary Community",
            placeholder: "",
            fieldType: "Dropdown",
            defaultValue:
              (team.primary_community && team.primary_community.id) || "0",
            dbName: "primary_community_id",
            data: [{ displayName: "--", id: "0" }, ...communities],
            readOnly: false,
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
            defaultValue: selectedCommunities,
            dbName: "communities",
            data: communities,
            isAsync: true,
            endpoint: isSuperAdmin
              ? "/communities.listForSuperAdmin"
              : "/communities.listForCommunityAdmin",
          },
          {
            name: "parent",
            label:
              parentTeamOptions &&
              "Choose a Parent Team, if this team is part of a larger group (not the usual case)",
            fieldType: "Dropdown",
            defaultValue: (team.parent && team.parent.id) || "0",
            dbName: "parent_id",
            data: parentTeamOptions,
            readOnly: (parentTeamOptions && false) || true,
          },
          {
            name: "tagline",
            label: "Team Tagline",
            placeholder: "eg. A catchy slogan for your team...",
            fieldType: "TextField",
            contentType: "text",
            isRequired: true,
            isMultiline: false,
            defaultValue: team.tagline && team.tagline,
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
            defaultValue: team.description,
            dbName: "description",
            readOnly: false,
          },
        ],
      },
      {
        name: "logo",
        placeholder: "Select a Logo for this team",
        fieldType: fieldTypes.MediaLibrary,
        openState: autoOpenMediaLibrary,
        selected: team.logo ? [team.logo] : [],
        dbName: "logo",
        label: "Select a Logo for this team",
        isRequired: false,
      },
      {
        name: "is_published",
        label: "Should this team go live?",
        fieldType: "Radio",
        isRequired: false,
        defaultValue: "" + team.is_published,
        dbName: "is_published",
        readOnly: false,
        data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }],
      },
    ],
  };
  return formJson;
};
