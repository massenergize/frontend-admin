import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Helmet } from "react-helmet";
import brand from "dan-api/dummy/brand";
import MUIDataTable from "mui-datatables";
import FileCopy from "@material-ui/icons/FileCopy";
import EditIcon from "@material-ui/icons/Edit";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Icon from "@material-ui/core/Icon";
import Edit from "@material-ui/icons/Edit";
import Language from "@material-ui/icons/Language";
import PeopleIcon from "@material-ui/icons/People";
import messageStyles from "dan-styles/Messages.scss";
import { connect } from "react-redux";
import { fetchData } from "../../../utils/messenger";
import styles from "../../../components/Widget/widget-jss";
import { bindActionCreators } from "redux";
import {
  reduxGetAllTeams,
  reduxGetAllCommunityTeams,
  loadAllTeams,
  reduxToggleUniversalModal,
} from "../../../redux/redux-actions/adminActions";
import CommunitySwitch from "../Summary/CommunitySwitch";
import { apiCall } from "../../../utils/messenger";
import { smartString } from "../../../utils/common";
import {
  Chip,
  Grid,
  LinearProgress,
  Paper,
  Typography,
} from "@material-ui/core";
import LinearBuffer from "../../../components/Massenergize/LinearBuffer";

class AllTeams extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], loading: true, columns: this.getColumns() };
  }

  componentDidMount() {
    const user = this.props.auth ? this.props.auth : {};
    if (user.is_super_admin) {
      this.props.callTeamsForSuperAdmin();
    }
    if (user.is_community_admin) {
      this.props.callTeamsForNormalAdmin();
    }
  }

  getStatus = (isApproved) => {
    switch (isApproved) {
      case false:
        return messageStyles.bgError;
      case true:
        return messageStyles.bgSuccess;
      default:
        return messageStyles.bgSuccess;
    }
  };

  showCommunitySwitch = () => {
    const user = this.props.auth ? this.props.auth : {};
    if (user.is_community_admin) {
      return <CommunitySwitch actionToPerform={this.handleCommunityChange} />;
    }
  };

  handleCommunityChange = (id) => {
    this.props.callTeamsForNormalAdmin(id);
  };

  fashionData = (data) => {
    if (!data) return [];
    const fashioned = data.map((d) => [
      {
        id: d.id,
        image: d.logo,
        initials: `${d.name && d.name.substring(0, 2).toUpperCase()}`,
      },
      smartString(d.name), // limit to first 30 chars
      d.primary_community && d.primary_community.name,
      smartString(d.parent && d.parent.name, 30),
      { isLive: d.is_published, item: d },
      d.id,
      d.id,
    ]);
    return fashioned;
  };

  getColumns = () => {
    const { classes } = this.props;
    return [
      {
        name: "Team Logo",
        key: "id",
        options: {
          filter: false,
          download: false,
          customBodyRender: (d) => (
            <div>
              {d.image && (
                <Link to={`/admin/edit/${d.id}/team`} target="_blank">
                  <Avatar
                    alt={d.initials}
                    src={d.image.url}
                    style={{ margin: 10 }}
                  />
                </Link>
              )}
              {!d.image && (
                <Link to={`/admin/edit/${d.id}/team`} target="_blank">
                  <Avatar style={{ margin: 10 }}>{d.initials}</Avatar>
                </Link>
              )}
            </div>
          ),
        },
      },
      {
        name: "Name",
        key: "name",
        options: {
          filter: false,
        },
      },
      {
        name: "Community",
        key: "community",
        options: {
          filter: true,
          filterType: "multiselect",
        },
      },
      {
        name: "Parent",
        key: "parent",
        options: {
          filter: true,
          filterType: "multiselect",
        },
      },
      {
        name: "Live?",
        key: "is_published",
        options: {
          filter: true,
          customBodyRender: (d) => {
            return (
              <Chip
                onClick={() =>
                  this.props.toggleLive({
                    show: true,
                    component: this.makeLiveUI({ data: d.item }),
                    onConfirm: () => this.makeLiveOrNot(d.item),
                    closeAfterConfirmation: true,
                  })
                }
                label={d.isLive ? "Yes" : "No"}
                className={`${
                  d.isLive ? classes.yesLabel : classes.noLabel
                } touchable-opacity`}
              />
            );
          },
        },
      },
      {
        name: "Team Members",
        key: "team-members",
        options: {
          filter: false,
          download: false,
          customBodyRender: (id) => (
            <Link to={`/admin/edit/${id}/team-members`}>
              <PeopleIcon size="small" variant="outlined" color="secondary" />
            </Link>
          ),
        },
      },
      {
        name: "Edit?",
        key: "edit_or_copy",
        options: {
          filter: false,
          download: false,
          customBodyRender: (id) => (
            <Link to={`/admin/edit/${id}/team`}>
              <EditIcon size="small" variant="outlined" color="secondary" />
            </Link>
          ),
        },
      },
    ];
  };

  makeLiveOrNot(item) {
    const putInRedux = this.props.putTeamsInRedux;
    const data = this.props.allTeams || [];
    const status = item.is_published;
    const index = data.findIndex((a) => a.id === item.id);
    item.is_published = !status;
    data.splice(index, 1, item);
    putInRedux([...data]);
    apiCall("/teams.update", {
      id: item.id,
      is_published: !status,
    });
  }

  makeLiveUI({ data }) {
    const name = data && data.name;
    const isON = data.is_published;
    return (
      <div>
        <Typography>
          <b>{name}</b> is {isON ? "live, " : "not live, "}
          would you like {isON ? " to take it offline" : " to take it live"}?
        </Typography>
      </div>
    );
  }

  nowDelete({ idsToDelete, data }) {
    const { allTeams, putTeamsInRedux } = this.props;
    const itemsInRedux = allTeams;
    const ids = [];
    idsToDelete.forEach((d) => {
      const found = data[d.dataIndex][6];
      ids.push(found);
      apiCall("/teams.delete", { team_id: found });
    });
    const rem = (itemsInRedux || []).filter((com) => !ids.includes(com.id));
    putTeamsInRedux(rem);
  }

  makeDeleteUI({ idsToDelete }) {
    const len = (idsToDelete && idsToDelete.length) || 0;
    return (
      <Typography>
        Are you sure you want to delete (
        {(idsToDelete && idsToDelete.length) || ""})
        {len === 1 ? " team? " : " teams? "}
      </Typography>
    );
  }

  render() {
    const title = brand.name + " - All Teams";
    const description = brand.desc;
    const { columns } = this.state;
    const data = this.fashionData(this.props.allTeams);
    const { classes } = this.props;
    const options = {
      filterType: "dropdown",
      responsive: "stacked",
      print: true,
      rowsPerPage: 30,
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        this.props.toggleDeleteConfirmation({
          show: true,
          component: this.makeDeleteUI({ idsToDelete }),
          onConfirm: () => this.nowDelete({ idsToDelete, data }),
          closeAfterConfirmation: true,
        });
      },
    };

    if (!data || !data.length) {
      return (
        <Grid
          container
          spacing={24}
          alignItems="flex-start"
          direction="row"
          justify="center"
        >
          <Grid item xs={12} md={6}>
            <Paper className={classes.root} style={{ padding: 15 }}>
              <div className={classes.root}>
                <LinearProgress />
                <h1>Fetching all Teams. This may take a while...</h1>
                <br />
                <LinearProgress color="secondary" />
              </div>
            </Paper>
          </Grid>
        </Grid>
      );
    }

    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        {/* {this.showCommunitySwitch()} */}
        <div className={classes.table}>
          <MUIDataTable
            title="All Teams"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    );
  }
}

AllTeams.propTypes = {
  classes: PropTypes.object.isRequired,
};
function mapStateToProps(state) {
  return {
    auth: state.getIn(["auth"]),
    allTeams: state.getIn(["allTeams"]),
    community: state.getIn(["selected_community"]),
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      callTeamsForSuperAdmin: reduxGetAllTeams,
      callTeamsForNormalAdmin: reduxGetAllCommunityTeams,
      putTeamsInRedux: loadAllTeams,
      toggleDeleteConfirmation: reduxToggleUniversalModal,
      toggleLive: reduxToggleUniversalModal,
    },
    dispatch
  );
}
const TeamsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AllTeams);

export default withStyles(styles)(TeamsMapped);
