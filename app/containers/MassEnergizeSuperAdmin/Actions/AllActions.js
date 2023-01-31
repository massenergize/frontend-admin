/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";

import brand from "dan-api/dummy/brand";
import { Helmet } from "react-helmet";
import { withStyles } from "@material-ui/core/styles";

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

import {
  findMatchesAndRest,
  getHumanFriendlyDate,
  getTimeStamp,
  isNotEmpty,
  makeDeleteUI,
  ourCustomSort,
  smartString,
} from "../../../utils/common";
import {
  Grid,
  LinearProgress,
  Paper,
  Typography,
} from "@material-ui/core";
import MEChip from "../../../components/MECustom/MEChip";
import METable from "../ME  Tools/table /METable";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import { getAdminApiEndpoint, getLimit, onTableStateChange } from "../../../utils/helpers";
import ApplyFilterButton from "../../../utils/components/applyFilterButton/ApplyFilterButton";
import SearchBar from "../../../utils/components/searchBar/SearchBar";

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
    if (auth &&auth.is_super_admin) url = "/actions.listForSuperAdmin";
    else if (auth && auth.is_community_admin) url = "/actions.listForCommunityAdmin";
    const allActionsResponse = await apiCall(url, {
      limit: getLimit(PAGE_PROPERTIES.ALL_ACTIONS.key),
    });
    if (allActionsResponse && allActionsResponse.success) {
      putActionsInRedux(allActionsResponse.data, allActionsResponse.meta);
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

  updateRedux = (data) => {
    const { putActionsInRedux, allActions } = this.props;
    const index = allActions.items.findIndex((a) => a.id === data.id);
    const updateItems = allActions.items.filter((a) => a.id !== data.id);
    updateItems.splice(index, 0, data);
    putActionsInRedux(updateItems,allActions.meta);
  };

  changeActions = async (id) => {
    const { allActions } = this.state;
    const newData = allActions.items.filter(
      (a) => (a.community && a.community.id === id) || a.is_global
    );
    await this.setStateAsync({ data: fashionData(newData) });
  };

  getColumns() {
    const { classes, putActionsInRedux, allActions } = this.props;
    return [
      {
        name: "ID",
        key: "id",
        options: {
          filter: false,
        },
      },
      {
        name: "Image",
        key: "image",
        options: {
          sort: false,
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
                  onBlur={async (event) => {
                    const { target } = event;
                    if (!target) return;
                    const { name, value } = target;
                    if (isNotEmpty(value) && value !== String(d.rank)) {
                      await apiCall("/actions.rank", {
                        action_id: d && d.id,
                        [name]: value,
                      }).then((res) => {
                        if (res && res.success) {
                          this.updateRedux(res && res.data);
                        }
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
          download: false,
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
                    putActionsInRedux([newAction, ...(allActions.items || [])],allActions.meta);
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
      {
        name: "Live",
        key: "hidden_live_or_not",
        options: {
          display: false,
          filter: true,
          searchable: false,
          download: true,
        },
      },
      {
        name: "Live",
        key: "is_a_template",
        options: {
          display: false,
          filter: false,
          searchable: false,
          download: false,
        },
      },
      {
        name: "Created At",
        key: "hidden_created_at",
        options: {
          display: false,
          filter: false,
          searchable: false,
          download: true,
        },
      },
      {
        name: "Last Update",
        key: "hidden_updated_at",
        options: {
          display: false,
          filter: false,
          searchable: false,
          download: true,
        },
      },
    ];
  }
  /**
   * NOTE: If you add or remove a field in here, make sure your changes reflect in nowDelete.
   * Deleting heavily relies on the index arrangement of the items in here. Merci!
   * @param {*} data
   * @returns
   */
  fashionData(data) {
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
      d.is_published ? "Yes" : "No",
      d.is_global,
      getHumanFriendlyDate(d.created_at, true, false),
      getHumanFriendlyDate(d.updated_at, true, false),
    ]);
    return fashioned;
  }

  makeLiveOrNot(item) {
    const putInRedux = this.props.putActionsInRedux;
    const data = this.props.allActions.items || [];
    const status = item.is_published;
    const index = data.findIndex((a) => a.id === item.id);
    item.is_published = !status;
    data.splice(index, 1, item);
    const community = item.community;
    putInRedux([...data],this.props.allActions.meta);
    apiCall("/actions.update", {
      action_id: item.id,
      is_published: !status,
      community_id: (community && community.id) || null,
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
    const itemsInRedux = allActions.items;
    const ids = [];
    idsToDelete.forEach((d) => {
      const found = data[d.dataIndex][0];
      ids.push(found);
      apiCall("/actions.delete", { action_id: found }).catch((e) =>
        console.log("ACTION_DELETE_ERRO:", e)
      );
    });
    const rem = (itemsInRedux || []).filter((com) => !ids.includes(com.id));
    putActionsInRedux(rem, allActions.meta);
  }
  // getTimeStamp = () => {
  //   const today = new Date();
  //   let newDate = today;
  //   let options = {
  //     year: "numeric",
  //     month: "short",
  //     day: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     second: "2-digit",
  //   };

  //   return Intl.DateTimeFormat("en-US", options).format(newDate);
  // };

  customSort(data, colIndex, order) {
    const isComparingLive = colIndex === 6;
    const isComparingRank = colIndex === 3;
    const sortForLive = ({ a, b }) => (a.isLive && !b.isLive ? 1 : -1);
    const sortForRank = ({ a, b }) => (a.rank < b.rank ? -1 : 1);
    var params = {
      colIndex,
      order,
    };

    if (isComparingLive) params = { ...params, compare: sortForLive };
    else if (isComparingRank) params = { ...params, compare: sortForRank };
    return data.sort((a, b) => ourCustomSort({ ...params, a, b }));
  }

  render() {
    const title = brand.name + " - All Actions";
    const description = brand.desc;
    const { classes, auth, allActions, putActionsInRedux} = this.props;
    const { columns, error } = this.state;
    const data = this.fashionData(allActions && allActions.items || []);
    const metaData = allActions && allActions.meta;
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
      count: metaData.count,
      rowsPerPageOptions: [10, 25, 100],
      onTableChange: (action, tableState) =>
        onTableStateChange({
          action,
          tableState,
          tableData: data,
          metaData,
          updateReduxFunction: putActionsInRedux,
          reduxItems: allActions,
          apiUrl: getAdminApiEndpoint(auth, "/actions"),
          pageProp: PAGE_PROPERTIES.ALL_ACTIONS,
        }),
      customSearchRender: (
        searchText,
        handleSearch,
        hideSearch,
        options
      ) => (
        <SearchBar
          url={getAdminApiEndpoint(auth, "/actions")}
          reduxItems={allActions}
          updateReduxFunction={putActionsInRedux}
          handleSearch={handleSearch}
          hideSearch={hideSearch}
          pageProp={PAGE_PROPERTIES.ALL_ACTIONS}
        />
      ),
      customFilterDialogFooter: (currentFilterList) => {
        return (
          <ApplyFilterButton
            url={getAdminApiEndpoint(auth, "/actions")}
            reduxItems={allActions}
            updateReduxFunction={putActionsInRedux}
            columns={columns}
            filters={currentFilterList}
          />
        );
      },
      customSort: this.customSort,
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        const [found] = findMatchesAndRest(idsToDelete, (it) => {
          const f = data[it.dataIndex];
          return f[9]; // this index should be changed if anyone modifies (adds/removes) an item in fashionData()
        });
        const noTemplatesSelectedGoAhead = !found || !found.length;
        this.props.toggleDeleteConfirmation({
          show: true,
          component: makeDeleteUI({
            idsToDelete,
            templates: found,
            noTemplates: noTemplatesSelectedGoAhead,
          }),
          onConfirm: () =>
            noTemplatesSelectedGoAhead &&
            this.nowDelete({ idsToDelete, data }),
          closeAfterConfirmation: true,
          cancelText: noTemplatesSelectedGoAhead
            ? "No"
            : "Go Back and Remove Templates",
          noOk: !noTemplatesSelectedGoAhead,
        });
        return false;
      },
      downloadOptions: {
        filename: `All Actions (${getTimeStamp()}).csv`,
        separator: ",",
      },
      onDownload: (buildHead, buildBody, columns, data) => {
        let alteredData = data.map((d) => {
          let content = [...d.data];
          content[3] = d.data[3].rank;
          return {
            data: content,
            index: d.index,
          };
        });
        let csv = buildHead(columns) + buildBody(alteredData);
        return csv;
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
