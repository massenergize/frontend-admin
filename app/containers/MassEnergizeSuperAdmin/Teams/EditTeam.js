import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Paper, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { apiCall } from "../../../utils/messenger";
import MassEnergizeForm from "../_FormGenerator";
import {
  reduxAddToHeap,
  reduxGetAllCommunityTeams,
  reduxUpdateHeap,
} from "../../../redux/redux-actions/adminActions";
import Loading from "dan-components/Loading";
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

const makeParentOptions = ({ teams, team }) => {
  teams = teams.items || [];
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
    var { match, communities, teams, teamsInfos } = props;
    const { id } = match.params;
    communities = (communities.items || []).map((c) => ({
      ...c,
      displayName: c.name,
      id: "" + c.id,
    }));
    const team = teamsInfos[id.toString()];
    const readyToRenderThePageFirstTime = team && teams && teams.items && teams.items.length;
    const jobsDoneDontRunWhatsBelow =
      !readyToRenderThePageFirstTime || state.mounted;

    if (jobsDoneDontRunWhatsBelow) return null;

    if (team)
      teams = teams && teams.items.filter(
        (t) => t.primary_community.id === team.primary_community.id
      );
    const parentTeamOptions = makeParentOptions({ teams, team });
    const formJson = createFormJson({ team, parentTeamOptions, communities });
    return { team, formJson, parentTeamOptions, mounted: true };
  }
  async componentDidMount() {
    const { id } = this.props.match.params;
    const { addTeamInfoToHeap, teamsInfos } = this.props;
    const teamResponse = await apiCall("/teams.info", { team_id: id });
    addTeamInfoToHeap({
      teamsInfos: { ...teamsInfos, [id.toString()]: teamResponse.data },
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
        <MassEnergizeForm classes={classes} formJson={formJson} enableCancel />
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
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      callTeamsForNormalAdmin: reduxGetAllCommunityTeams,
      addTeamsToHeap: reduxUpdateHeap,
      addTeamInfoToHeap: reduxAddToHeap,
    },
    dispatch
  );
}
const EditTeamMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditTeam);

export default withStyles(styles, { withTheme: true })(EditTeamMapped);
const createFormJson = ({ communities, team, parentTeamOptions }) => {
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
