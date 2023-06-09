import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import {Paper, Alert} from "@mui/material";
import { Helmet } from "react-helmet";
import { bindActionCreators } from "redux";
import brand from "dan-api/dummy/brand";
import Typography from "@mui/material/Typography";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PeopleIcon from "@mui/icons-material/People";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Loading from "dan-components/Loading";
import styles from "../../../components/Widget/widget-jss";
import Snackbar from '@mui/material/Snackbar';
import {
  reduxGetAllTeams,
  reduxGetAllCommunityTeams,
  reduxUpdateHeap,
  reduxLoadMetaDataAction,
} from "../../../redux/redux-actions/adminActions";
import { apiCall, apiCallFile } from "../../../utils/messenger";
import MassEnergizeForm from "../_FormGenerator";
import LinearBuffer from "../../../components/Massenergize/LinearBuffer";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import METable from "../ME  Tools/table /METable";
import SearchBar from "../../../utils/components/searchBar/SearchBar";
import { getLimit } from "../../../utils/helpers";
import Seo from "../../../components/Seo/Seo";

function TabContainer(props) {
  const { children } = props;
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

class TeamMembers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      team: undefined,
      columns: this.getColumns(),
      value: 0,
      error: null,
      loadingCSVs: [],
      success: false,
      meta:{}
    };
  }

  // from About.js
  async getCSV(endpoint) {
    const { team } = this.state;
    if (!team) {
      return;
    }
    let oldLoadingCSVs = this.state.loadingCSVs;
    this.setState({ loadingCSVs: oldLoadingCSVs.concat(endpoint) });

    const csvResponse = await apiCallFile("/downloads." + endpoint, {
      team_id: team.id,
    });

    oldLoadingCSVs = this.state.loadingCSVs;
    oldLoadingCSVs.splice(oldLoadingCSVs.indexOf(endpoint), 1);
    if (csvResponse.success) {
      this.setState({success: true});
    } else {
      this.setState({ error: csvResponse.error });
    }
    this.setState({ loadingCSVs: oldLoadingCSVs });
  }

  static getDerivedStateFromProps(props, state) {
    const { teams, match, members } = props;
    const { id } = match.params;
    if (state.team === undefined) {
      const team = (teams || []).find((t) => t.id === id);
      return { team, allTeamMembers: (members || {})[id] };
    }

    return null;
  }
  async componentDidMount() {
    const { id } = this.props.match.params;
    const { heap, addToHeap, meta, putMetaDataToRedux} = this.props;
    const teamResponse = await apiCall("/teams.info", { team_id: id });
    if (teamResponse && teamResponse.data) {
      const team = teamResponse.data;
      await this.setStateAsync({ team });
    }

    const allTeamMembersResponse = await apiCall("/teams.members", {
      team_id: id,
      limit:getLimit(PAGE_PROPERTIES.ALL_TEAM_MEMBERS.key)
    });

    if (allTeamMembersResponse && allTeamMembersResponse.success) {
      await this.setStateAsync({
        loading: false,
        allTeamMembers: allTeamMembersResponse.data,
        data: this.fashionData(allTeamMembersResponse.data),
      });
      putMetaDataToRedux({...meta, teamMembers: allTeamMembersResponse.cursor})

      addToHeap({
        ...heap,
        teamMembers: { [id]: allTeamMembersResponse.data },
      });
    }

    const formJson = await this.createFormAddTeamAdminJson();
    await this.setStateAsync({ formJson, loading: false });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  fashionData = (data) => {
    if (!data) return [];
    const fashioned = data.map((d) => [
      d.id,
      d.user && d.user.full_name,
      d.user && d.user.email,
      d.is_admin ? "Admin" : "Member",
      d.id,
    ]);
    return fashioned;
  };

  getColumns = () => [
    {
      name: "ID",
      key: "id",
      options: {
        filter: false,
        filterType: "textField",
      },
    },
    {
      name: "User Name",
      key: "user",
      options: {
        filter: false,
        filterType: "textField",
      },
    },
    {
      name: "User Email",
      key: "user",
      options: {
        filter: false,
        filterType: "textField",
      },
    },
    {
      name: "Status",
      key: "status",
      options: {
        filter: true,
      },
    },
  ];

  createFormAddTeamAdminJson = async () => {
    const { team } = this.state;
    const formJson = {
      title: "Add Team Member / Change their Membership Status",
      subTitle: "",
      method: "/teams.addMember",
      successRedirectPage: "/admin/read/teams",
      fields: [
        {
          label: "About this User",
          fieldType: "Section",
          children: [
            {
              name: "team_id",
              label: "Team ID",
              placeholder: "eg. id",
              fieldType: "TextField",
              contentType: "text",
              defaultValue: team.id,
              dbName: "team_id",
              readOnly: true,
            },
            {
              name: "email",
              label: "Email",
              placeholder: "eg. john.kofi.mensah@gmail.com",
              fieldType: "TextField",
              contentType: "text",
              isRequired: true,
              dbName: "email",
              readOnly: false,
            },
            {
              name: "is_admin",
              label: "New status for the user with this email",
              fieldType: "Radio",
              isRequired: false,
              defaultValue: "false",
              dbName: "is_admin",
              readOnly: false,
              data: [
                { id: "false", value: "Member" },
                { id: "true", value: "Admin" },
              ],
            },
          ],
        },
      ],
    };
    return formJson;
  };

  handleTabChange = (event, value) => {
    this.setState({ value });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ success: false });
  };

  handleCloseStyle = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ error: null });
  };
  

  render() {
    const title = brand.name + " - All Teams";
    const description = brand.desc;
    const { columns, data, team, formJson, value, loading } = this.state;
    const { classes, meta, putMetaDataToRedux, members} = this.props;
    const { error, loadingCSVs, success } = this.state;
    const metaData = meta && meta.teamMembers
    const { id } = this.props.match.params;

    const options = {
      filterType: "dropdown",
      responsive: "standard",
      print: true,
      rowsPerPage: 25,
      rowsPerPageOptions: [10, 25, 100],
      // count: metaData && metaData.count,
      // confirmFilters: true,
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        idsToDelete.forEach((d) => {
          const email = data[d.dataIndex][2];
          apiCall("/teams.removeMember", { team_id: team.id, email });
        });
      },
      // customSearchRender: (
      //   searchText,
      //   handleSearch,
      //   hideSearch,
      //   options
      // ) => (
      //   <SearchBar
      //     url={"/teams.members"}
      //     reduxItems={members[id]}
      //     updateReduxFunction={(data) => console.log("=== data ===", data)}
      //     handleSearch={handleSearch}
      //     hideSearch={hideSearch}
      //     pageProp={PAGE_PROPERTIES.ALL_TEAM_MEMBERS}
      //     updateMetaData={putMetaDataToRedux}
      //     name="teamMembers"
      //     meta={meta}
      //     otherArgs={{ team_id:id}}
      //   />
      // ),
    };

    const nowLoadingMembers = loading && (!data || !data.length);
    if (loading && !team)
      return (
        <Paper style={{ padding: 20 }}>
          <LinearBuffer />
        </Paper>
      );
    return (
      <div>
        {error && (
          <div>
            <Snackbar
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              open={error != null}
              autoHideDuration={6000}
              onClose={this.handleCloseStyle}
            >
              <Alert
                onClose={this.handleCloseStyle}
                severity={"error"}
                sx={{ width: "100%" }}
              >
                <small style={{ marginLeft: 15, fontSize: 15 }}>
                  {`Unable to download: ${error}`}
                </small>
              </Alert>
            </Snackbar>
          </div>
        )}
        {success && (
          <div style={{ marginBottom: 20 }}>
            <Snackbar
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              open={success}
              autoHideDuration={3000}
              onClose={this.handleClose}
            >
              <Alert
                onClose={this.handleClose}
                severity={"success"}
                sx={{ width: "100%" }}
              >
                <small style={{ marginLeft: 15, fontSize: 15 }}>
                  Your request has been received. Please check your email
                  for the file.
                </small>
              </Alert>
            </Snackbar>
          </div>
        )}

        <Seo name={`Team Members - ${team?.name || ""}`} />

        <Paper style={{ padding: 20, marginBottom: 15 }}>
          <Typography variant="h5" style={{ marginBottom: 10 }}>
            {team && team.name}
          </Typography>

          <Typography variant="p" style={{ marginBottom: 5 }}>
            <b>NOTE:</b> This page{" "}
            <b style={{ color: "#c74545" }}>does not</b> list members of
            sub-teams. On the community portal, parent team pages{" "}
            <b style={{ color: "#c74545" }}>do</b> list members of
            sub-teams.
          </Typography>

          <Link
            onClick={(e) => {
              e.preventDefault();
              this.props.history.goBack();
            }}
            style={{ marginRight: 20 }}
          >
            Go back
          </Link>
          <Link
            onClick={() => this.props.history.push("/admin/read/teams")}
          >
            Go to all teams
          </Link>
          <Link
            onClick={(e) => {
              e.preventDefault();
              !loadingCSVs.includes("users") && this.getCSV("users");
            }}
            style={{ marginLeft: 20 }}
          >
            Request Users and Actions CSV
          </Link>
        </Paper>

        <Paper className={classes.root}>
          <AppBar position="static" color="default">
            <Tabs
              style={{ background: "white" }}
              value={value}
              onChange={this.handleTabChange}
              variant="scrollable"
              scrollButtons="on"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Team Members & Admins" icon={<PeopleIcon />} />
              <Tab
                label="Change Team Member Status"
                icon={<AddBoxIcon />}
              />
            </Tabs>
          </AppBar>
          {value === 0 &&
            (nowLoadingMembers ? (
              <Loading />
            ) : (
              <TabContainer>
                <div className={classes.table}>
                  <METable
                    classes={classes}
                    page={PAGE_PROPERTIES.ALL_TEAM_MEMBERS}
                    tableProps={{
                      title: "Team Members",
                      data: data,
                      columns: columns,
                      options: options,
                    }}
                  />
                </div>
              </TabContainer>
            ))}
          {value === 1 && (
            <TabContainer>
              {formJson && (
                <MassEnergizeForm classes={classes} formJson={formJson} />
              )}
            </TabContainer>
          )}
        </Paper>
      </div>
    );
  }
}

TeamMembers.propTypes = {
  classes: PropTypes.object.isRequired,
};
function mapStateToProps(state) {
  const heap = state.getIn(["heap"]);
  return {
    teams: state.getIn(["allTeams"]),
    auth: state.getIn(["auth"]),
    community: state.getIn(["selected_community"]),
    members: (heap && heap.teamMembers) || {},
    heap,
    meta: state.getIn(["paginationMetaData"]),
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      callTeamsForSuperAdmin: reduxGetAllTeams,
      callTeamsForNormalAdmin: reduxGetAllCommunityTeams,
      addToHeap: reduxUpdateHeap,
      putMetaDataToRedux: reduxLoadMetaDataAction,
    },
    dispatch
  );
}
const TeamsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamMembers);

export default withStyles(styles)(withRouter(TeamsMapped));
