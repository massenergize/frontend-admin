/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";

import brand from "dan-api/dummy/brand";
import { withStyles } from "@mui/styles";

import FileCopy from "@mui/icons-material/FileCopy";
import EditIcon from "@mui/icons-material/Edit";
import { Link, withRouter } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { apiCall } from "../../../utils/messenger";
import styles from "../../../components/Widget/widget-jss";
import {
  reduxGetAllCommunityActions,
  loadAllActions,
  reduxToggleUniversalModal,
  reduxToggleUniversalToast,
  reduxLoadMetaDataAction,
  reduxLoadTableFilters,
} from "../../../redux/redux-actions/adminActions";

import {
  findMatchesAndRest,
  getHumanFriendlyDate,
  getTimeStamp,
  isEmpty,
  isNotEmpty,
  ourCustomSort,
  reArrangeForAdmin,
  smartString,
} from "../../../utils/common";
import { Badge, Paper, Typography } from "@mui/material";
import MEChip from "../../../components/MECustom/MEChip";
import METable, { FILTERS } from "../ME  Tools/table /METable";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import {
  getAdminApiEndpoint,
  getLimit,
  handleFilterChange,
  onTableStateChange,
} from "../../../utils/helpers";
import ApplyFilterButton from "../../../utils/components/applyFilterButton/ApplyFilterButton";
import SearchBar from "../../../utils/components/searchBar/SearchBar";
import Loader from "../../../utils/components/Loader";
import PeopleIcon from "@mui/icons-material/People";
import Seo from '../../../../app/components/Seo/Seo'
import CustomOptions from "../ME  Tools/table /CustomOptions";
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_ITEMS_PER_PAGE_OPTIONS } from '../../../utils/constants';

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
    const {
      putActionsInRedux,
      fetchActions,
      location,
      tableFilters,
      updateTableFilters,
    } = this.props;

    const { state } = location;
    const ids = state && state.ids;
    const comingFromDashboard = ids && ids.length;
    if (!comingFromDashboard) return fetchActions();

    this.setState({ saveFilters: false });
    const key = PAGE_PROPERTIES.ALL_ACTIONS.key + FILTERS;
    updateTableFilters({
      ...(tableFilters || {}),
      [key]: { 0: { list: ids } },
    });
    var content = {
      fieldKey: "action_ids",
      apiURL: "/actions.listForCommunityAdmin",
      props: this.props,
      dataSource: [],
      reduxFxn: putActionsInRedux,
      args: {
        limit: getLimit(PAGE_PROPERTIES.ALL_ACTIONS.key),
      },
    };
    fetchActions(null, (data, failed, error) => {
      if (failed) return this.setState({ error });
      reArrangeForAdmin({ ...content, dataSource: data });
    });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  updateRedux = (data) => {
    const { putActionsInRedux, allActions } = this.props;
    const index = allActions.findIndex((a) => a.id === data.id);
    const updateItems = allActions.filter((a) => a.id !== data.id);
    updateItems.splice(index, 0, data);
    putActionsInRedux(updateItems);
  };

  changeActions = async (id) => {
    const { allActions } = this.state;
    const newData = allActions.filter(
      (a) => (a.community && a.community.id === id) || a.is_global
    );
    await this.setStateAsync({ data: fashionData(newData) });
  };

  getColumns() {
    const { classes, putActionsInRedux, allActions, auth, communities } = this.props;
    return [
      {
        name: "ID",
        key: "id",
        options: {
          filter: false,
          filterType: "multiselect",
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
              {!d.image && (
                <Avatar style={{ margin: 10 }}>{d.initials}</Avatar>
              )}
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
      // {
      //   name: "Tags",
      //   key: "tags",
      //   options: {
      //     filter: true,
      //     filterType: "textField",
      //   },
      // },
      {
        name: "Community",
        key: "community",
        options:
        auth?.is_super_admin
          ? CustomOptions({
              data:communities,
              label:"community",
              endpoint:"/communities.listForSuperAdmin"
            })
          :
          {
              filter: true,
              filterType: "multiselect",
            },
      },
      {
        name: "Users list",
        key: "users-list",
        options: {
          filter: false,
          download: false,
          customBodyRender: ({ id, count }) =>
            count ? (
              <Link to={`/admin/read/${id}/action-users`}>
                <Badge badgeContent={count || 0} max={99} showZero>
                  <PeopleIcon
                    size="small"
                    variant="outlined"
                    color="secondary"
                  />
                </Badge>
              </Link>
            ) : (
              <Badge badgeContent={count || 0} max={99} showZero>
                <PeopleIcon
                  size="small"
                  variant="outlined"
                  color="secondary"
                />
              </Badge>
            ),
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
          sort: false,
          customBodyRender: (id) => (
            <div>
              <Link to={`/admin/edit/${id}/action`}>
                <EditIcon
                  size="small"
                  variant="outlined"
                  color="secondary"
                />
              </Link>
              &nbsp;&nbsp;
              <Link
                onClick={async () => {
                  const copiedActionResponse = await apiCall(
                    "/actions.copy",
                    {
                      action_id: id,
                    }
                  );

                  if (
                    copiedActionResponse &&
                    copiedActionResponse.success
                  ) {
                    const newAction =
                      copiedActionResponse && copiedActionResponse.data;
                    putActionsInRedux([newAction, ...(allActions || [])]);
                    this.props.history.push(
                      `/admin/edit/${newAction.id}/action`
                    );
                  }
                }}
                to="/admin/read/actions"
              >
                <FileCopy
                  size="small"
                  variant="outlined"
                  color="secondary"
                />
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
      // `${smartString(d.tags.map((t) => t.name).join(", "), 30)} `,
      d.is_global ? "Template" : d.community && d.community.name,
      {id:d.id, count:d?.action_users},
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
    const data = this.props.allActions || [];
    const status = item.is_published;
    const index = data.findIndex((a) => a.id === item.id);
    item.is_published = !status;
    data.splice(index, 1, item);
    const community = item.community;
    putInRedux([...data]);
    apiCall("/actions.update", {
      action_id: item.id,
      is_published: !status,
      community_id: (community && community.id) || null,
    });
  }

  makeDeleteUI({ idsToDelete, templates }) {
  const len = (idsToDelete && idsToDelete.length) || 0;
  var text = `Are you sure you want to delete (
    ${(idsToDelete && idsToDelete.length) || ""})
    ${len === 1 ? " action? " : " actions? "}`;

  if (templates && templates.length)
    text = `Sorry, (${templates.length}) template${
      templates.length === 1 ? "" : "s"
    } selected. You can't delete templates. `;
  return <Typography>{text}</Typography>;
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
    const { allActions, putActionsInRedux, putMetaDataToRedux, meta } = this.props;
    const itemsInRedux = allActions;
    const ids = [];
    idsToDelete.forEach((d) => {
      const found = data[d.dataIndex][0];
      ids.push(found);
      apiCall("/actions.delete", { action_id: found })
        .then((res) => {
          if (res.success) {
               putMetaDataToRedux({
                 ...meta,
                 ["actions"]: {
                   ...meta["actions"],
                   count: meta["actions"].count - 1,
                 },
               });
            this.props.toggleToast({
              open: true,
              message: "Action(s) successfully deleted",
              variant: "success",
            });
          } else {
            this.props.toggleToast({
              open: true,
              message:
                "An error occurred while deleting the action(s), please try again",
              variant: "error",
            });
          }
        })
        .catch((e) => console.log("ACTION_DELETE_ERRO:", e));
    });
    const rem = (itemsInRedux || []).filter((com) => !ids.includes(com.id));
    putActionsInRedux(rem);
  }

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
    const {
      classes,
      auth,
      allActions,
      putActionsInRedux,
      putMetaDataToRedux,
      meta,
    } = this.props;
    const { columns, error } = this.state;
    const data = this.fashionData(allActions || []);
    const metaData = meta && meta.actions;

    if (isEmpty(metaData)) {
      return <Loader />;
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
      responsive: "standard",
      print: true,
      rowsPerPage: DEFAULT_ITEMS_PER_PAGE,
      count: metaData && metaData.count,
      rowsPerPageOptions: DEFAULT_ITEMS_PER_PAGE_OPTIONS,
      confirmFilters: true,
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
          updateMetaData: putMetaDataToRedux,
          name: "actions",
          meta: meta,
        }),
      customSearchRender: (searchText, handleSearch, hideSearch, options) => (
        <SearchBar
          url={getAdminApiEndpoint(auth, "/actions")}
          reduxItems={allActions}
          updateReduxFunction={putActionsInRedux}
          handleSearch={handleSearch}
          hideSearch={hideSearch}
          pageProp={PAGE_PROPERTIES.ALL_ACTIONS}
          updateMetaData={putMetaDataToRedux}
          name="actions"
          meta={meta}
        />
      ),
      customFilterDialogFooter: (currentFilterList, applyFilters) => {
        return (
          <ApplyFilterButton
            url={getAdminApiEndpoint(auth, "/actions")}
            reduxItems={allActions}
            updateReduxFunction={putActionsInRedux}
            columns={columns}
            limit={getLimit(PAGE_PROPERTIES.ALL_ACTIONS.key)}
            applyFilters={applyFilters}
            updateMetaData={putMetaDataToRedux}
            name="actions"
            meta={meta}
          />
        );
      },

      whenFilterChanges: (
        changedColumn,
        filterList,
        type,
        changedColumnIndex,
        displayData
      ) =>
        handleFilterChange({
          filterList,
          type,
          columns,
          page: PAGE_PROPERTIES.ALL_ACTIONS,
          updateReduxFunction: putActionsInRedux,
          reduxItems: allActions,
          url: getAdminApiEndpoint(auth, "/actions"),
          updateMetaData: putMetaDataToRedux,
          name: "actions",
          meta: meta,
        }),
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
          component: this.makeDeleteUI({
            idsToDelete,
            templates: found,
            noTemplates: noTemplatesSelectedGoAhead,
          }),
          onConfirm: () =>
            noTemplatesSelectedGoAhead && this.nowDelete({ idsToDelete, data }),
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
        <Seo name={`All Actions`} />
        <METable
          classes={classes}
          page={PAGE_PROPERTIES.ALL_ACTIONS}
          tableProps={{
            title: "All Actions",
            data: data,
            columns: columns,
            options: options,
          }}
          saveFilters={this.state.saveFilters}
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
  meta: state.getIn(["paginationMetaData"]),
  tableFilters: state.getIn(["tableFilters"]),
  communities: state.getIn(["communities"]),
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchActions: reduxGetAllCommunityActions,
      // callAllActions: reduxGetAllActions,
      // callCommunityActions: reduxGetAllCommunityActions,
      putActionsInRedux: loadAllActions,
      toggleDeleteConfirmation: reduxToggleUniversalModal,
      toggleLive: reduxToggleUniversalModal,
      toggleToast: reduxToggleUniversalToast,
      putMetaDataToRedux: reduxLoadMetaDataAction,
      updateTableFilters: reduxLoadTableFilters,
    },
    dispatch
  );
const ActionsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AllActions);
export default withStyles(styles)(withRouter(ActionsMapped));

