/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";

import brand from "dan-api/dummy/brand";
import { Helmet } from "react-helmet";
import { withStyles } from "@material-ui/core/styles";

import MUIDataTable from "mui-datatables";
import FileCopy from "@material-ui/icons/FileCopy";
import EditIcon from "@material-ui/icons/Edit";
import { Link, withRouter } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { apiCall } from "../../../utils/messenger";
import styles from "../../../components/Widget/widget-jss";
import {
  reduxGetAllActions,
  reduxGetAllCommunityActions,
  loadAllActions,
  reduxToggleUniversalModal,
} from "../../../redux/redux-actions/adminActions";

import { isNotEmpty, smartString } from "../../../utils/common";
import { Grid, LinearProgress, Paper, Typography } from "@material-ui/core";
import MEChip from "../../../components/MECustom/MEChip";
import METable from "../ME  Tools/table /METable";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";

class AllActions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: this.getColumns(),
      loading: true,
      allActions: [],
      data: [],
      error: null,
    };
  }

  async componentDidMount() {
    const { putActionsInRedux, auth } = this.props;
    var url;
    if (auth.is_super_admin) url = "/actions.listForSuperAdmin";
    else if (auth.is_community_admin) url = "/actions.listForCommunityAdmin";
    const allActionsResponse = await apiCall(url);
    if (allActionsResponse && allActionsResponse.success) {
      putActionsInRedux(allActionsResponse.data);
    } else if (allActionsResponse && !allActionsResponse.success) {
      await this.setStateAsync({
        error: allActionsResponse.error,
      });
    }
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  changeActions = async (id) => {
    const { allActions } = this.state;
    const newData = allActions.filter(
      (a) => (a.community && a.community.id === id) || a.is_global
    );
    await this.setStateAsync({ data: fashionData(newData) });
  };

  getColumns = () => {
    const { classes } = this.props;
    return [
        {
          name: 'ID',
          key: 'id',
          options: {
            filter: false,
          },
        },
        {
        name: "Image",
        key: "image",
        options: {
          filter: false,
          download: false,
          customBodyRender: (d) => (
            <div>
              {d.image && (
                <Avatar
                  alt={d.initials}
                  src={d.image.url}
                  style={{ margin: 10 }}
                />
              )}
              {!d.image && <Avatar style={{ margin: 10 }}>{d.initials}</Avatar>}
            </div>
          ),
        },
      },
      {
        name: "Title",
        key: "title",
        options: {
          filter: false,
          filterType: "textField",
        },
      },
      {
        name: "Rank",
        key: "rank",
        options: {
          filter: false,
          customBodyRender: (d) => {
            return (
              d && (
                <TextField
                  style={{ width: 50, textAlign: "center" }}
                  key={d.id}
                  required
                  name="rank"
                  variant="outlined"
                  onChange={async (event) => {
                    const { target } = event;
                    if (!target) return;
                    const { name, value } = target;
                    if (isNotEmpty(value) && value !== String(d.rank)) {
                      await apiCall("/actions.rank", {
                        action_id: d && d.id,
                        [name]: value,
                      });
                    }
                  }}
                  label="Rank"
                  InputLabelProps={{
                    shrink: true,
                    maxwidth: "10px",
                  }}
                  defaultValue={d.rank}
                />
              )
            );
          },
        },
      },
      {
        name: "Tags",
        key: "tags",
        options: {
          filter: true,
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
        name: "Live?",
        key: "is_live",
        options: {
          filter: false,
          customBodyRender: (d) => {
            return (
              <MEChip
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
        name: "Edit",
        key: "edit_or_copy",
        options: {
          filter: false,
          download: false,
          customBodyRender: (id) => (
            <div>
              <Link to={`/admin/edit/${id}/action`}>
                <EditIcon size="small" variant="outlined" color="secondary" />
              </Link>
              &nbsp;&nbsp;
              <Link
                onClick={async () => {
                  const copiedActionResponse = await apiCall("/actions.copy", {
                    action_id: id,
                  });
                  if (copiedActionResponse && copiedActionResponse.success) {
                    const newAction =
                      copiedActionResponse && copiedActionResponse.data;
                    this.props.history.push(
                      `/admin/edit/${newAction.id}/action`
                    );
                  }
                }}
                to="/admin/read/actions"
              >
                <FileCopy size="small" variant="outlined" color="secondary" />
              </Link>
            </div>
          ),
        },
      },
    ];
  };
  fashionData = (data) => {
    const fashioned = data.map((d) => [
      d.id,
      {
        id: d.id,
        image: d.image,
        initials: `${d.title && d.title.substring(0, 2).toUpperCase()}`,
      },
      smartString(d.title), // limit to first 30 chars
      { rank: d.rank, id: d.id },
      `${smartString(d.tags.map((t) => t.name).join(", "), 30)} `,
      d.is_global ? "Template" : d.community && d.community.name,
      { isLive: d.is_published, item: d },
      d.id,
    ]);
    return fashioned;
  };

  makeLiveOrNot(item) {
    const putInRedux = this.props.putActionsInRedux;
    const data = this.props.allActions || [];
    const status = item.is_published;
    const index = data.findIndex((a) => a.id === item.id);
    item.is_published = !status;
    data.splice(index, 1, item);
    putInRedux([...data]);
    apiCall("/actions.update", {
      action_id: item.id,
      is_published: !status,
    });
  }

  makeLiveUI({ data }) {
    const name = data && data.title;
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
    const { allActions, putActionsInRedux } = this.props;
    const itemsInRedux = allActions;
    const ids = [];
    idsToDelete.forEach((d) => {
      const found = data[d.dataIndex][6];
      ids.push(found);
      apiCall("/actions.delete", { action_id: found });
    });
    const rem = (itemsInRedux || []).filter((com) => !ids.includes(com.id));
    putActionsInRedux(rem);
  }

  makeDeleteUI({ idsToDelete }) {
    const len = (idsToDelete && idsToDelete.length) || 0;
    return (
      <Typography>
        Are you sure you want to delete (
        {(idsToDelete && idsToDelete.length) || ""})
        {len === 1 ? " action? " : " actions? "}
      </Typography>
    );
  }

  render() {
    const title = brand.name + " - All Actions";
    const description = brand.desc;
    const { classes } = this.props;
    const { columns, error } = this.state;
    const data = this.fashionData(this.props.allActions || []);
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
                <h1>Fetching all Actions. This may take a while...</h1>
                <br />
                <LinearProgress color="secondary" />
              </div>
            </Paper>
          </Grid>
        </Grid>
      );
    }

    if (error) {
      return (
        <Paper style={{ padding: 15 }}>
          <h2>Error</h2>
        </Paper>
      );
    }

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
          page={PAGE_PROPERTIES.ALL_ACTIONS}
          tableProps={{
            title: "All Actions",
            data: data,
            columns: columns,
            options: options,
          }}
        />
      </div>
    );
  }
}

AllActions.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.getIn(["auth"]),
  allActions: state.getIn(["allActions"]),
  community: state.getIn(["selected_community"]),
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      callAllActions: reduxGetAllActions,
      callCommunityActions: reduxGetAllCommunityActions,
      putActionsInRedux: loadAllActions,
      toggleDeleteConfirmation: reduxToggleUniversalModal,
      toggleLive: reduxToggleUniversalModal,
    },
    dispatch
  );
const ActionsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AllActions);
export default withStyles(styles)(withRouter(ActionsMapped));
