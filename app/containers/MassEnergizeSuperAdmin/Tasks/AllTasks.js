import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import { Helmet } from "react-helmet";
import brand from "dan-api/dummy/brand";

import { connect } from "react-redux";
import styles from "../../../components/Widget/widget-jss";
import { apiCall } from "../../../utils/messenger";
import { smartString } from "../../../utils/common";
import { Grid, LinearProgress, Paper, Typography } from "@material-ui/core";
import {
  reduxToggleUniversalModal,
  loadTasksAction,
} from "../../../redux/redux-actions/adminActions";
import { bindActionCreators } from "redux";
class AllTasks extends React.Component {
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

  fashionData = (data) => {
    if (!data) return [];
    const fashioned = data.map((d) => [
      smartString(d.creator),
      smartString(d.name),
      smartString(
        d.job_name
          ?.toLowerCase()
          ?.split("_")
          ?.join(" ")
      ),
      smartString(
        d.recurring_interval
          ?.toLowerCase()
          ?.split("_")
          ?.join(" ")
      ),
      smartString(d.status),

      // limit to first 30 chars
    ]);
    return fashioned;
  };

  getColumns = (classes) => [
    {
      name: "Creator",
      key: "creator",
      options: {
        filter: false,
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
      name: "Function Name",
      key: "job_name",
      options: {
        filter: false,
      },
    },
    {
      name: "Recurring",
      key: "recurring_interval",
      options: {
        filter: false,
        filterType: "textField",
      },
    },

    {
      name: "status",
      key: "status",
      options: {
        filter: false,
        filterType: "textField",
      },
    },
  ];

  nowDelete({ idsToDelete, data }) {
    const { tasks, putTasksInRedux } = this.props;
    const ids = [];
    idsToDelete.forEach((d) => {
      const found = tasks[d.dataIndex]?.id
      ids.push(found);
      apiCall("/tasks.delete", { id: found });
    });
    const rem = (tasks || []).filter((com) => !ids.includes(com.id));
    putTasksInRedux(rem);
  }

  makeDeleteUI({ idsToDelete }) {
    const len = (idsToDelete && idsToDelete.length) || 0;
    return (
      <Typography>
        Are you sure you want to delete (
        {(idsToDelete && idsToDelete.length) || ""})
        {len === 1 ? " task? " : " tasks? "}
      </Typography>
    );
  }

  render() {
    const title = brand.name + " - All Tasks";
    const description = brand.desc;
    const { columns } = this.state;
    const data = this.fashionData(this.props.tasks);
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
                <h1>Fetching all Tasks. This may take a while...</h1>
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
        <div className={classes.table}>
          <MUIDataTable
            title="All Tasks"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    );
  }
}

AllTasks.propTypes = {
  classes: PropTypes.object.isRequired,
};
function mapStateToProps(state) {
  return {
    tasks: state.getIn(["tasks"]),
    user: state.getIn(["auth"]),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      toggleDeleteConfirmation: reduxToggleUniversalModal,
      putTasksInRedux: loadTasksAction,
    },
    dispatch
  );
}
const TasksMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AllTasks);

export default withStyles(styles)(TasksMapped);
