import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import { Helmet } from "react-helmet";
import brand from "dan-api/dummy/brand";
import MUIDataTable from "mui-datatables";
import FileCopy from "@mui/icons-material/FileCopy";
import EditIcon from "@mui/icons-material/Edit";
import { Link, withRouter } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Icon from "@mui/material/Icon";
import Edit from "@mui/icons-material/Edit";
import Language from "@mui/icons-material/Language";
import PeopleIcon from "@mui/icons-material/People";
import messageStyles from "dan-styles/Messages.scss";
import { connect } from "react-redux";
import styles from "../../../components/Widget/widget-jss";
import { bindActionCreators } from "redux";
import {
  reduxGetAllTeams,
  reduxGetAllCommunityTeams,
  loadAllTeams,
  reduxToggleUniversalModal,
  reduxToggleUniversalToast,
  reduxLoadMetaDataAction,
  reduxLoadTableFilters,
} from "../../../redux/redux-actions/adminActions";
import CommunitySwitch from "../Summary/CommunitySwitch";
import { apiCall } from "../../../utils/messenger";
import {
  isEmpty,
  objArrayToString,
  ourCustomSort,
  reArrangeForAdmin,
  smartString,
} from "../../../utils/common";
import { Grid, LinearProgress, Paper, Typography } from "@mui/material";
import MEChip from "../../../components/MECustom/MEChip";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import METable, { FILTERS } from "../ME  Tools/table /METable";
import {
  getAdminApiEndpoint,
  getLimit,
  handleFilterChange,
  onTableStateChange,
} from "../../../utils/helpers";
import ApplyFilterButton from "../../../utils/components/applyFilterButton/ApplyFilterButton";
import SearchBar from "../../../utils/components/searchBar/SearchBar";
import Loader from "../../../utils/components/Loader";
import { getData } from "../Messages/CommunityAdminMessages";
import MEPaperBlock from "../ME  Tools/paper block/MEPaperBlock";
import Seo from "../../../../app/components/Seo/Seo";
import CustomOptions from "../ME  Tools/table /CustomOptions";
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_ITEMS_PER_PAGE_OPTIONS } from '../../../utils/constants';

class AllTeams extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], loading: true, columns: this.getColumns() };
  }

  componentWillUnmount() {
    window.history.replaceState({}, document.title);
  }

  componentDidMount() {
    const {
      putTeamsInRedux,
      fetchTeams,
      location,
      updateTableFilters,
      tableFilters,
    } = this.props;
    const { state } = location;
    const ids = state && state.ids;
    const comingFromDashboard = ids && ids.length;

    if (!comingFromDashboard) return fetchTeams();
    this.setState({ saveFilters: false, comingFromDashboard, ids });

    // const key = PAGE_PROPERTIES.ALL_TEAMS.key + FILTERS;

    // updateTableFilters({
    //   ...(tableFilters || {}),
    //   [key]: { 0: { list: ids } },
    // });

    var content = {
      fieldKey: "team_ids",
      apiURL: "/teams.listForCommunityAdmin",
      props: this.props,
      dataSource: [],
      reduxFxn: putTeamsInRedux,
    };
    fetchTeams((data, failed) => {
      if (failed) return console.log("Could not fetch team list from B.E...");
      reArrangeForAdmin({ ...content, dataSource: data });
    });
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

  fashionData(data) {
    if (!data) return [];
    const fashioned = data.map((d) => [
      d.id,
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
      d.is_published ? "Yes" : "No", // Its not a duplicate, its formatted for CSV download
      objArrayToString(
        d.admins,
        (admin) =>
          ` ${admin.user && admin.user.full_name} (${admin.user.email}) `
      ),
    ]);
    return fashioned;
  }

  getColumns() {
    const { classes, auth, communities} = this.props;
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
        name: "Team Logo",
        key: "id",
        options: {
          sort: false,
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
        options: auth?.is_super_admin
          ? CustomOptions({
              data: communities,
              label: "community",
              endpoint: "/communities.listForSuperAdmin",
            })
          : {
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
        name: "Team Members",
        key: "team-members",
        options: {
          filter: false,
          download: false,
          customBodyRender: (id) => (
            <Link to={`/admin/edit/${id}/team-members`}>
              <PeopleIcon
                size="small"
                variant="outlined"
                color="secondary"
              />
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
          sort: false,
          customBodyRender: (id) => (
            <Link
              onClick={(e) => {
                e.preventDefault();
                this.props.history.push({
                  pathname: `/admin/edit/${id}/team`,
                  state: { ids: this.state.ids },
                });
              }}
            >
              <EditIcon size="small" variant="outlined" color="secondary" />
            </Link>
          ),
        },
      },
      {
        //Do not remove, "Live" is meant to appear twice. This formatted to show appropriately in CSVs
        name: "Live",
        key: "live_or_not_for_download",
        options: {
          display: false,
          filter: true,
          searchable: false,
          download: true,
        },
      },
      {
        // For CSV
        name: "Team Admins",
        key: "team_admins_and_emails",
        options: {
          display: false,
          filter: false,
          searchable: false,
          download: true,
        },
      },
    ];
  }

  makeLiveOrNot(item) {
    let { putTeamsInRedux, allTeams } = this.props;
    const data = allTeams || [];
    const status = item.is_published;
    const index = data.findIndex((a) => a.id === item.id);
    item.is_published = !status;
    data.splice(index, 1, item);
    putTeamsInRedux([...data]);
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
    const { allTeams, putTeamsInRedux,meta, putMetaDataToRedux } = this.props;
    const itemsInRedux = allTeams;
    const ids = [];
    idsToDelete.forEach((d) => {
      const found = data[d.dataIndex][1];
      ids.push(found && found.id);
      apiCall("/teams.delete", { team_id: found && found.id }).then(
        (response) => {
          if (response.success) {
            putMetaDataToRedux({
              ...meta,
              ["teams"]: {
                ...meta["teams"],
                count: meta["teams"].count - 1,
              },
            });
            this.props.toggleToast({
              open: true,
              message: "Team(s) successfully deleted",
              variant: "success",
            });
          } else {
            this.props.toggleToast({
              open: true,
              message: "An error occurred while deleting the Team(s)",
              variant: "error",
            });
          }
        }
      );
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
  customSort(data, colIndex, order) {
    const isComparingLive = colIndex === 5;
    const sortForLive = ({ a, b }) => (a.isLive && !b.isLive ? -1 : 1);
    var params = {
      colIndex,
      order,
      compare: isComparingLive && sortForLive,
    };
    return data.sort((a, b) => ourCustomSort({ ...params, a, b }));
  }

  render() {
    const title = brand.name + " - All Teams";
    const description = brand.desc;
    const { columns, comingFromDashboard, ids } = this.state;
    const {
      classes,
      allTeams,
      putTeamsInRedux,
      auth,
      meta,
      putMetaDataToRedux,
    } = this.props;

    const content = getData({ source: allTeams, comingFromDashboard, ids });
    const data = this.fashionData(content);
    const metaData = meta && meta.teams;
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
          updateReduxFunction: putTeamsInRedux,
          reduxItems: allTeams,
          apiUrl: getAdminApiEndpoint(auth, "/teams"),
          pageProp: PAGE_PROPERTIES.ALL_TEAMS,
          updateMetaData: putMetaDataToRedux,
          name: "teams",
          meta: meta,
        }),
      customFilterDialogFooter: (currentFilterList, applyFilters) => {
        return (
          <ApplyFilterButton
            url={getAdminApiEndpoint(auth, "/teams")}
            reduxItems={allTeams}
            updateReduxFunction={putTeamsInRedux}
            columns={columns}
            limit={getLimit(PAGE_PROPERTIES.ALL_TEAMS.key)}
            applyFilters={applyFilters}
            updateMetaData={putMetaDataToRedux}
            name="teams"
            meta={meta}
          />
        );
      },
      customSearchRender: (searchText, handleSearch, hideSearch, options) => (
        <SearchBar
          url={getAdminApiEndpoint(auth, "/teams")}
          reduxItems={allTeams}
          updateReduxFunction={putTeamsInRedux}
          handleSearch={handleSearch}
          hideSearch={hideSearch}
          pageProp={PAGE_PROPERTIES.ALL_TEAMS}
          updateMetaData={putMetaDataToRedux}
          name="teams"
          meta={meta}
        />
      ),
      customSort: this.customSort,
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        this.props.toggleDeleteConfirmation({
          show: true,
          component: this.makeDeleteUI({ idsToDelete }),
          onConfirm: () => this.nowDelete({ idsToDelete, data }),
          closeAfterConfirmation: true,
        });
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
          page: PAGE_PROPERTIES.ALL_TEAMS,
          updateReduxFunction: putTeamsInRedux,
          reduxItems: allTeams,
          url: getAdminApiEndpoint(auth, "/teams"),
          updateMetaData: putMetaDataToRedux,
          name: "teams",
          meta: meta,
        }),
    };

    if (isEmpty(metaData)) {
      return <Loader />;
    }

    return (
      <div>
        <Seo name={"All Teams"} />

        {comingFromDashboard && (
          <MEPaperBlock icon="fa fa-bullhorn" banner>
            <Typography>
              The <b>{comingFromDashboard}</b> team(s) you have not approved yet
              are currently pre-selected and sorted in the table for you. Feel
              free to
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({ comingFromDashboard: false });
                }}
              >
                {" "}
                clear all selections.
              </Link>
            </Typography>
          </MEPaperBlock>
        )}
        <METable
          classes={classes}
          page={PAGE_PROPERTIES.ALL_TEAMS}
          tableProps={{
            title: "All Teams",
            data: data,
            columns: columns,
            options: options,
          }}
          ignoreSavedFilters={comingFromDashboard}
          saveFilters={!comingFromDashboard}
        />
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
    meta: state.getIn(["paginationMetaData"]),
    tableFilters: state.getIn(["tableFilters"]),
    communities: state.getIn(["communities"]),
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchTeams: reduxGetAllTeams, // B.E already knows whether user is cadmin, or sadmin
      // callTeamsForSuperAdmin: reduxGetAllTeams,
      callTeamsForNormalAdmin: reduxGetAllCommunityTeams,
      putTeamsInRedux: loadAllTeams,
      toggleDeleteConfirmation: reduxToggleUniversalModal,
      toggleLive: reduxToggleUniversalModal,
      toggleToast: reduxToggleUniversalToast,
      putMetaDataToRedux: reduxLoadMetaDataAction,
      updateTableFilters: reduxLoadTableFilters,
    },
    dispatch
  );
}
const TeamsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AllTeams);

export default withStyles(styles)(withRouter(TeamsMapped));
