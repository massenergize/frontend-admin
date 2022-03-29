import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";

import { connect } from "react-redux";
import styles from "../../../components/Widget/widget-jss";
import { apiCall } from "../../../utils/messenger";
import { smartString } from "../../../utils/common";
import { Grid, LinearProgress, Paper, Typography } from "@material-ui/core";

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
      {
        id: d.id,
        image: d.logo,
        initials: `${d.name && d.name.substring(0, 2).toUpperCase()}`,
      },
      smartString(d.name), // limit to first 30 chars
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
      key: "task_name",
      options: {
        filter: false,
      },
    },
    {
      name: "Recurring",
      key: "recurring",
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
    const { allTeams, putTeamsInRedux } = this.props;
    const itemsInRedux = allTeams;
    const ids = [];
    idsToDelete.forEach((d) => {
      const found = data[d.dataIndex][6];
      ids.push(found);
      apiCall("/tasks.delete", { team_id: found });
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
        {len === 1 ? " task? " : " tasks? "}
      </Typography>
    );
  }

  render() {
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
const TasksMapped = connect(
  mapStateToProps,
  null
)(AllTasks);

export default withStyles(styles)(TasksMapped);
