import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import MUIDataTable from "mui-datatables";
import { Helmet } from "react-helmet";
import brand from "dan-api/dummy/brand";

import { connect } from "react-redux";
import styles from "../../../components/Widget/widget-jss";
import { apiCall } from "../../../utils/messenger";
import { smartString } from "../../../utils/common";
import { Grid, LinearProgress, Paper, Typography } from "@mui/material";
import {
  reduxToggleUniversalModal,
  loadTasksAction,
  reduxToggleUniversalToast,
} from "../../../redux/redux-actions/adminActions";
import { bindActionCreators } from "redux";
import EditIcon from "@mui/icons-material/Edit";
import PauseOutlinedIcon from "@mui/icons-material/PauseOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import { Link } from "react-router-dom";
import Seo from "../../../components/Seo/Seo";
class AllTasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], loading: true, columns: this.getColumns() };
  }

  pauseTask = (id) => {
    let { tasks, putTasksInRedux } = this.props;
    apiCall("/tasks.deactivate", { id: id }).then((res) => {
      if (res && res.success) {
        let index = tasks.findIndex((x) => x.id === id);
        const filteredTasks = (tasks || []).filter((task) => task.id !== id);
        filteredTasks.splice(index, 0, res.data);
        putTasksInRedux(filteredTasks);
      }
    });
  };

  resumeTask = (id) => {
    let { tasks, putTasksInRedux } = this.props;
    apiCall("/tasks.activate", { id: id }).then((res) => {
      if (res && res.success) {
        let index = tasks.findIndex((x) => x.id === id);
        const filteredTasks = (tasks || []).filter((task) => task.id !== id);
        filteredTasks.splice(index, 0, res.data);
        putTasksInRedux(filteredTasks);
      }
    });
  };

  getTaskWithID = (id) => {
    const { tasks } = this.props;
    const task = tasks.find((task) => task.id === id);
    return task;
  };

  pauseAndResumeTaskModal = (type, id) => {
    this.props.toggleDeleteConfirmation({
      show: true,
      component: (
        <Typography>
          Are you sure you want to
          {type === "pause" ? " pause " : " resume "} this task?
        </Typography>
      ),
      onConfirm: () =>
        type === "pause" ? this.pauseTask(id) : this.resumeTask(id),
      closeAfterConfirmation: true,
    });
  };

  fashionData = (data) => {
    if (!data) return [];
    const fashioned = data.map((d) => [
      smartString(d.creator),

      smartString(d.name),
      smartString(
        new Date(
          JSON.parse(d && d.recurring_details).actual
        ).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
        })
      ),
      d && d.last_run_at
        ? smartString(
            new Date(d.last_run_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
            })
          )
        : "-",
      smartString(
        d.job_name &&
          d.job_name
            .toLowerCase()
            .split("_")
            .join(" ")
      ),
      smartString(
        d.frequency &&
          d.frequency
            .toLowerCase()
            .split("_")
            .join(" ")
      ),
      smartString(d.status),
      { id: d.id },
    ]);
    return fashioned;
  };

  getColumns = () => [
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
        filter: true,
      },
    },
    {
      name: "Started At",
      key: "recurring_interval",
      options: {
        filter: false,
        filterType: "textField",
      },
    },
    {
      name: "Last Run",
      key: "last_run_at",
      options: {
        filter: false,
        filterType: "textField",
      },
    },
    {
      name: "Function",
      key: "job_name",
      options: {
        filter: false,
      },
    },
    {
      name: "Frequency",
      key: "frequency",
      options: {
        filter: false,
        filterType: "textField",
      },
    },
    {
      name: "Status",
      key: "status",
      options: {
        filter: false,
        filterType: "textField",
      },
    },
    {
      name: "Actions",
      key: "task_actions",
      options: {
        filter: false,
        download: false,
        customBodyRender: ({ id }) => {
          return (
            <div style={{ display: "flex" }}>
              <div>
                <Link to={`/admin/edit/${id}/task`}>
                  <EditIcon size="small" variant="outlined" />
                </Link>
              </div>

              {this.getTaskWithID(id).is_active ? (
                <div
                  style={{
                    marginLeft: 10,
                    color: "#2196f3",
                    cursor: "pointer",
                  }}
                >
                  <div
                    onClick={() => this.pauseAndResumeTaskModal("pause", id)}
                  >
                    <PauseOutlinedIcon size="small" variant="outlined" />
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    marginLeft: 10,
                    color: "#2196f3",
                    cursor: "pointer",
                  }}
                >
                  <div
                    onClick={() => this.pauseAndResumeTaskModal("resume", id)}
                  >
                    <PlayArrowOutlinedIcon size="small" variant="outlined" />
                  </div>
                </div>
              )}
            </div>
          );
        },
      },
    },
  ];

  nowDelete({ idsToDelete, data }) {
    const { tasks, putTasksInRedux } = this.props;
    const ids = [];
    idsToDelete.forEach((d) => {
      const found = tasks[d.dataIndex].id;
      ids.push(found);
      apiCall("/tasks.delete", { id: found }).then((response) => {
        if (response.success) {
          this.props.toggleToast({
            open: true,
            message: "Task successfully deleted",
            variant: "success",
          });
        } else {
          this.props.toggleToast({
            open: true,
            message: "An error occurred while deleting the task",
            variant: "error",
          });
        }
      });
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
      responsive: "standard",
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

    if (!data) {
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
    
    if (!data.length) {
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
                <h1>No tasks currently to display</h1>
                <br />
              </div>
            </Paper>
          </Grid>
        </Grid>
      );
    }

    return (
      <div>
        <Seo name={"All Tasks"} />
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
      toggleToast:reduxToggleUniversalToast
    },
    dispatch
  );
}
const TasksMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AllTasks);

export default withStyles(styles)(TasksMapped);
