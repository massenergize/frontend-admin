import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Helmet } from "react-helmet";
import brand from "dan-api/dummy/brand";
import { bindActionCreators } from "redux";
import MUIDataTable from "mui-datatables";
import { Link } from "react-router-dom";
import DetailsIcon from "@material-ui/icons/Details";
import { connect } from "react-redux";
import { apiCall } from "../../../utils/messenger";
import styles from "../../../components/Widget/widget-jss";
import CommunitySwitch from "../Summary/CommunitySwitch";
import { getHumanFriendlyDate, smartString } from "../../../utils/common";
import { Chip, Typography, Grid, Paper} from "@material-ui/core";
import {
  loadTeamMessages,
  reduxToggleUniversalModal,
} from "../../../redux/redux-actions/adminActions";
import LinearBuffer from "../../../components/Massenergize/LinearBuffer";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import METable from "../ME  Tools/table /METable";
class AllTeamAdminMessages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      columns: this.getColumns(props.classes),
      hasNoItems: false,
    };
  }

  componentDidMount() {
    apiCall("/messages.listTeamAdminMessages").then((allMessagesResponse) => {
      if (allMessagesResponse && allMessagesResponse.success) {
        this.props.putTeamMessagesInRedux(allMessagesResponse.data);
        let hasItems = allMessagesResponse.data && allMessagesResponse.data.length>0;
        this.setState({ hasNoItems: !hasItems });
      }
    });
  }

  showCommunitySwitch = () => {
    const user = this.props.auth ? this.props.auth : {};
    if (user.is_community_admin) {
      return <CommunitySwitch actionToPerform={this.handleCommunityChange} />;
    }
  };

  fashionData = (data) => {
    return data.map((d) => [
      d.id,
      getHumanFriendlyDate(d.created_at, true),
      smartString(d.title),
      d.user_name || (d.user && d.user.full_name) || "",
      d.email || (d.user && d.user.email),
      d.community && d.community.name,
      d.team && d.team.name,
      d.have_forwarded,
      d.id,
    ]);
  };

  getColumns = (classes) => [
    {
      name: 'ID',
      key: 'id',
      options: {
        filter: false,
      },
    },
    {
      name: "Date",
      key: "date",
      options: {
        filter: false,
      },
    },
    {
      name: "Title",
      key: "title",
      options: {
        filter: false,
      },
    },
    {
      name: "Provided Name",
      key: "user_name",
      options: {
        filter: false,
        filterType: "textField",
      },
    },
    {
      name: "Provided Email",
      key: "email",
      options: {
        filter: false,
        filterType: "textField",
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
      name: "Team",
      key: "team",
      options: {
        filter: true,
        filterType: "multiselect",
      },
    },
    {
      name: "Forwarded to Team Admin?",
      key: "replied?",
      options: {
        filter: true,
        customBodyRender: (d) => {
          return (
            <Chip
              label={d ? "Yes" : "No"}
              className={d ? classes.yesLabel : classes.noLabel}
            />
          );
        },
      },
    },
    {
      name: "Details",
      key: "edit_or_copy",
      options: {
        filter: false,
        download: false,
        customBodyRender: (id) => (
          <div>
            <Link to={`/admin/edit/${id}/message`}>
              <DetailsIcon size="small" variant="outlined" color="secondary" />
            </Link>
          </div>
        ),
      },
    },
  ];

  nowDelete({ idsToDelete, data }) {
    const { teamMessages, putTeamMessagesInRedux } = this.props;
    const itemsInRedux = teamMessages;
    const ids = [];
    idsToDelete.forEach((d) => {
      const found = data[d.dataIndex][1];
      ids.push(found);
      apiCall("/messages.delete", { message_id: found });
    });
    const rem = (itemsInRedux || []).filter((com) => !ids.includes(com.id));
    putTeamMessagesInRedux(rem);
  }

  makeDeleteUI({ idsToDelete }) {
    const len = (idsToDelete && idsToDelete.length) || 0;
    return (
      <Typography>
        Are you sure you want to delete (
        {(idsToDelete && idsToDelete.length) || ""})
        {len === 1 ? " message? " : " messages? "}
      </Typography>
    );
  }
  render() {
    const title = brand.name + " - Team Admin Messages";
    const description = brand.desc;
    const { columns } = this.state;
    const { classes } = this.props;
    const data = this.fashionData(this.props.teamMessages);
    const options = {
      filterType: "dropdown",
      responsive: "stacked",
      print: true,
      rowsPerPage: 25,
      rowsPerPageOptions: [10, 25, 100],
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        this.props.toggleDeleteConfirmation({
          show: true,
          component: this.makeDeleteUI({ idsToDelete }),
          onConfirm: () => this.nowDelete({ idsToDelete, data }),
          closeAfterConfirmation: true,
        });
        return false;
      },
    };

    if (!data || !data.length) {
      if(this.state.hasNoItems){
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
                  <h1>No messages currently to display</h1>
                  <br />
                </div>
              </Paper>
            </Grid>
          </Grid>
        );
      }
      return <LinearBuffer />;
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
        <METable
          classes={classes}
          page={PAGE_PROPERTIES.ALL_TEAM_MESSAGES}
          tableProps={{
            title: "All Team Admin Messages",
            data: data,
            columns: columns,
            options: options,
          }}
        />
      </div>
    );
  }
}

AllTeamAdminMessages.propTypes = {
  classes: PropTypes.object.isRequired,
};
function mapStateToProps(state) {
  return {
    auth: state.getIn(["auth"]),
    community: state.getIn(["selected_community"]),
    teamMessages: state.getIn(["teamMessages"]),
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      putTeamMessagesInRedux: loadTeamMessages,
      toggleDeleteConfirmation: reduxToggleUniversalModal,
    },
    dispatch
  );
}
const VendorsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AllTeamAdminMessages);

export default withStyles(styles)(VendorsMapped);
