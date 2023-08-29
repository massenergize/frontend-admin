import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import { Helmet } from "react-helmet";
import brand from "dan-api/dummy/brand";
import { bindActionCreators } from "redux";
import { Link, withRouter } from "react-router-dom";
import DetailsIcon from "@mui/icons-material/Details";
import { connect } from "react-redux";
import { apiCall } from "../../../utils/messenger";
import styles from "../../../components/Widget/widget-jss";
import CommunitySwitch from "../Summary/CommunitySwitch";
import {
  getHumanFriendlyDate,
  isEmpty,
  reArrangeForAdmin,
  smartString,
} from "../../../utils/common";
import { Chip, Typography, Grid, Paper } from "@mui/material";
import {
  loadTeamMessages,
  reduxLoadMetaDataAction,
  reduxLoadTableFilters,
  reduxToggleUniversalModal,
  reduxToggleUniversalToast,
} from "../../../redux/redux-actions/adminActions";
import LinearBuffer from "../../../components/Massenergize/LinearBuffer";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import METable, { FILTERS } from "../ME  Tools/table /METable";
import {
  getLimit,
  handleFilterChange,
  isTrue,
  onTableStateChange,
} from "../../../utils/helpers";
import ApplyFilterButton from "../../../utils/components/applyFilterButton/ApplyFilterButton";
import SearchBar from "../../../utils/components/searchBar/SearchBar";
import { getData, replyToMessage } from "./CommunityAdminMessages";
import Loader from "../../../utils/components/Loader";
import MEPaperBlock from "../ME  Tools/paper block/MEPaperBlock";
import Seo from "../../../components/Seo/Seo";
import CustomOptions from "../ME  Tools/table /CustomOptions";
class AllTeamAdminMessages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      columns: this.getColumns(props.classes),
      hasNoItems: false,
    };
  }

  componentWillUnmount() {
    window.history.replaceState({}, document.title);
  }

  componentDidMount() {
    const { state } = this.props.location;
    const {
      putTeamMessagesInRedux,
      meta,
      putMetaDataToRedux,
      tableFilters,
      updateTableFilters,
    } = this.props;
    const ids = state && state.ids;
    const comingFromDashboard = ids && ids.length;

    const key = PAGE_PROPERTIES.ALL_TEAM_MESSAGES.key + FILTERS;
    if (comingFromDashboard) this.setState({ comingFromDashboard, ids });
    else this.setState({ comingFromDashboard: false });
    // if (comingFromDashboard) {
    //   this.setState({ saveFilters: false });
    //   updateTableFilters({
    //     ...(tableFilters || {}),
    //     [key]: { 0: { list: ids } },
    //   });
    // }

    apiCall("/messages.listTeamAdminMessages", {
      limit: getLimit(PAGE_PROPERTIES.ALL_TEAM_MESSAGES.key),
    }).then((allMessagesResponse) => {
      if (allMessagesResponse && allMessagesResponse.success) {
        let hasItems =
          allMessagesResponse.data && allMessagesResponse.data.length > 0;
        this.setState({ hasNoItems: !hasItems });

        if (!comingFromDashboard) {
          putTeamMessagesInRedux(allMessagesResponse.data);
          putMetaDataToRedux({
            ...meta,
            teamMessages: allMessagesResponse.cursor,
          });
          return;
        }

        reArrangeForAdmin({
          apiURL: "/messages.listTeamAdminMessages",
          fieldKey: "message_ids",
          props: this.props,
          dataSource: allMessagesResponse.data,
          reduxFxn: putTeamMessagesInRedux,
        });
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
      d.have_forwarded ? "Yes" : "No",
      d.id,
    ]);
  };

  getColumns = (classes) =>{
    const {
      auth,
      communities,
    } = this.props;
   return [
    {
      name: "ID",
      key: "id",
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
              label={isTrue(d) ? "Yes" : "No"}
              className={isTrue(d) ? classes.yesLabel : classes.noLabel}
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
        sort: false,
        customBodyRender: (id) => (
          <div>
            <Link
              // to={`/admin/edit/${id}/message`}
              onClick={(e) => {
                e.preventDefault();
                replyToMessage({
                  pathname: `/admin/edit/${id}/message`,
                  transfer: { fromTeam: true },
                  props: this.props,
                });
              }}
            >
              <DetailsIcon size="small" variant="outlined" color="secondary" />
            </Link>
          </div>
        ),
      },
    },
  ];
}

  nowDelete({ idsToDelete, data }) {
    const { teamMessages, putTeamMessagesInRedux, meta,putMetaDataToRedux } = this.props;
    const itemsInRedux = teamMessages && teamMessages;
    const ids = [];
    idsToDelete.forEach((d) => {
      const found = data[d.dataIndex][0];
      ids.push(found);
      apiCall("/messages.delete", { message_id: found }).then((response) => {
        if (response.success) {
          putMetaDataToRedux({
            ...meta,
            ["teamMessages"]: {
              ...meta["teamMessages"],
              count: meta["teamMessages"].count - 1,
            },
          });
          this.props.toggleToast({
            open: true,
            message: "Team Message(s) successfully deleted",
            variant: "success",
          });
        } else {
          this.props.toggleToast({
            open: true,
            message: "An error occurred while deleting the team message(s)",
            variant: "error",
          });
        }
      });
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
    const { columns, comingFromDashboard, ids } = this.state;
    const {
      classes,
      teamMessages,
      putTeamMessagesInRedux,
      meta,
      putMetaDataToRedux,
    } = this.props;

    const content = getData({
      source: (teamMessages && teamMessages) || [],
      comingFromDashboard,
      ids,
    });
    const data = this.fashionData(content);

    const metaData = meta && meta.teamMessages;
    const options = {
      filterType: "dropdown",
      responsive: "standard",
      count: metaData && metaData.count,
      print: true,
      rowsPerPage: 25,
      rowsPerPageOptions: [10, 25, 100],
      confirmFilters: true,
      onTableChange: (action, tableState) =>
        onTableStateChange({
          action,
          tableState,
          tableData: data,
          metaData,
          updateReduxFunction: putTeamMessagesInRedux,
          reduxItems: teamMessages,
          apiUrl: "/messages.listTeamAdminMessages",
          pageProp: PAGE_PROPERTIES.ALL_TEAM_MESSAGES,
          updateMetaData: putMetaDataToRedux,
          name: "teamMessages",
          meta: meta,
        }),
      customFilterDialogFooter: (currentFilterList, applyFilters) => {
        return (
          <ApplyFilterButton
            url={"/messages.listTeamAdminMessages"}
            reduxItems={teamMessages}
            updateReduxFunction={putTeamMessagesInRedux}
            columns={columns}
            limit={getLimit(PAGE_PROPERTIES.ALL_TEAM_MESSAGES.key)}
            applyFilters={applyFilters}
            updateMetaData={putMetaDataToRedux}
            name="teamMessages"
            meta={meta}
          />
        );
      },
      customSearchRender: (searchText, handleSearch, hideSearch, options) => (
        <SearchBar
          url={"/messages.listTeamAdminMessages"}
          reduxItems={teamMessages}
          updateReduxFunction={putTeamMessagesInRedux}
          handleSearch={handleSearch}
          hideSearch={hideSearch}
          pageProp={PAGE_PROPERTIES.ALL_TEAM_MESSAGES}
          updateMetaData={putMetaDataToRedux}
          name="teamMessages"
          meta={meta}
        />
      ),
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
          page: PAGE_PROPERTIES.ALL_TEAM_MESSAGES,
          updateReduxFunction: putTeamMessagesInRedux,
          reduxItems: teamMessages,
          url: "/messages.listTeamAdminMessages",
          updateMetaData: putMetaDataToRedux,
          name: "teamMessages",
          meta: meta,
        }),
    };

    if (isEmpty(metaData)) {
      return <Loader />;
    }

    return (
      <div>
        <Seo name={"Team Admin Messages"} />
        {comingFromDashboard && (
          <MEPaperBlock icon="fa fa-bullhorn" banner>
            <Typography>
              The <b>{comingFromDashboard}</b> team message(s) you have not
              answered yet are currently pre-selected and sorted in the table
              for you. Feel free to
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
          page={PAGE_PROPERTIES.ALL_TEAM_MESSAGES}
          tableProps={{
            title: "All Team Admin Messages",
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

AllTeamAdminMessages.propTypes = {
  classes: PropTypes.object.isRequired,
};
function mapStateToProps(state) {
  return {
    auth: state.getIn(["auth"]),
    community: state.getIn(["selected_community"]),
    teamMessages: state.getIn(["teamMessages"]),
    meta: state.getIn(["paginationMetaData"]),
    tableFilters: state.getIn(["tableFilters"]),
    communities: state.getIn(["communities"]),
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      putTeamMessagesInRedux: loadTeamMessages,
      toggleDeleteConfirmation: reduxToggleUniversalModal,
      toggleToast: reduxToggleUniversalToast,
      putMetaDataToRedux: reduxLoadMetaDataAction,
      updateTableFilters: reduxLoadTableFilters,
    },
    dispatch
  );
}
const VendorsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AllTeamAdminMessages);

export default withStyles(styles)(withRouter(VendorsMapped));
