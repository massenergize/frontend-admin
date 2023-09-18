import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import { Helmet } from "react-helmet";
import brand from "dan-api/dummy/brand";
import Typography from "@mui/material/Typography";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { apiCall } from "../../../utils/messenger";
import styles from "../../../components/Widget/widget-jss";
import {
  fetchUsersFromBackend,
  loadAllUsers,
  reduxLoadMetaDataAction,
  reduxLoadTableFilters,
  reduxToggleUniversalModal,
  reduxToggleUniversalToast,
} from "../../../redux/redux-actions/adminActions";
import {
  getHumanFriendlyDate,
  isEmpty,
  ourCustomSort,
  reArrangeForAdmin,
  smartString,
} from "../../../utils/common";
import LinearBuffer from "../../../components/Massenergize/LinearBuffer";
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
import { Link, withRouter } from "react-router-dom";
import Loader from "../../../utils/components/Loader";
import {
  ArrowRight,
  ArrowRightTwoTone,
  KeyboardArrowRight,
} from "@mui/icons-material";
import RenderVisitLogs from "./RenderVisitLogs";
import { getData } from "../Messages/CommunityAdminMessages";
import MEPaperBlock from "../ME  Tools/paper block/MEPaperBlock";
import Seo from "../../../components/Seo/Seo";
import CustomOptions from "../ME  Tools/table /CustomOptions";

class AllUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      columns: this.getColumns(props.classes),
    };
  }

  componentWillUnmount() {
    window.history.replaceState({}, document.title);
  }

  componentDidMount() {
    const {
      auth,
      putUsersInRedux,
      location,
      fetchUsers,
      updateTableFilters,
      tableFilters,
    } = this.props;
    const { state } = location;
    const ids = state && state.ids;
    const comingFromDashboard = ids && ids.length;

    if (!comingFromDashboard) return fetchUsers();

    this.setState({ updating: true, comingFromDashboard, ids });
    // const key = PAGE_PROPERTIES.ALL_USERS.key + FILTERS;

    // updateTableFilters({
    //   ...(tableFilters || {}),
    //   [key]: { 3: { list: ids } },
    // });

    var content = {
      fieldKey: "user_emails",
      apiURL: "/users.listForCommunityAdmin",
      props: this.props,
      dataSource: [],
      separationOptions: { valueExtractor: (user) => user.email },
      reduxFxn: putUsersInRedux,
      args: {
        limit: getLimit(PAGE_PROPERTIES.ALL_USERS.key),
      },
      cb: () => this.setState({ updating: false }),
    };
    fetchUsers((data, failed) => {
      if (failed) return console.log("Could not fetch user list from B.E...");
      reArrangeForAdmin({ ...content, dataSource: data });
    });
  }

  fashionData = (data) => {
    return data.map((d) => [
      d.full_name,
      d,
      getHumanFriendlyDate(d.joined),
      d.preferred_name,
      d.email,
      d.communities,
      d.is_super_admin
        ? "Super Admin"
        : d.is_community_admin
        ? "Community Admin"
        : d.is_guest
        ? "Guest"
        : "Member",
      d.id,
    ]);
  };

  getColumns = (classes) => {
    const { auth, communities } = this.props;
    return [
      {
        name: "Full Name",
        key: "full_name",
        options: {
          filter: false,
        },
      },
      {
        name: "Last Visited",
        key: "last-visited",
        options: {
          filter: false,
          download: false,
          customBodyRender: (d) => {
            const { id, user_portal_visits } = d || {};
            const isOneRecord = user_portal_visits?.length === 1;
            const isEmpty = !user_portal_visits?.length;

            if (isEmpty) return <span>-</span>;

            const log = getHumanFriendlyDate(
              user_portal_visits[0],
              false,
              true
            );

            if (isOneRecord) return <span>{log}</span>;

            return (
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  this.showVisitRecords(id);
                }}
              >
                <span>{log}...</span>
              </Link>
            );
          },
        },
      },
      {
        name: "Joined",
        key: "joined",
        options: {
          filter: false,
          filterType: "textField",
        },
      },
      {
        name: "Preferred Name",
        key: "preferred_name",
        options: {
          filter: false,
        },
      },
      {
        name: "Email",
        key: "email",
        options: {
          filter: false,
          filterType: "multiselect",
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
              customBodyRender: (d) => {
                if (d?.length > 1) {
                  return (
                    <span
                      className="user-community-item"
                      onClick={() => this.showAllCommunities(d)}
                    >
                      {smartString(d.join(", "), 30)}
                    </span>
                  );
                }
                return <span>{smartString(d.join(", "), 30)}</span>;
              },
            })
          : {
              filter: true,
              filterType: "multiselect",
              customBodyRender: (d) => {
                if (d?.length > 1) {
                  return (
                    <span
                      className="user-community-item"
                      onClick={() => this.showAllCommunities(d)}
                    >
                      {smartString(d.join(", "), 30)}
                    </span>
                  );
                }
                return <span>{smartString(d.join(", "), 30)}</span>;
              },
            },
      },
      {
        name: "Membership",
        key: "status",
        options: {
          filter: true,
        },
      },

      {
        name: "id",
        key: "id",
        options: {
          filter: false,
          display: false,
          download: false,
        },
      },
    ];
  };

  nowDelete({ idsToDelete, data }) {
    const { allUsers, putUsersInRedux, putMetaDataToRedux, meta } = this.props;
    const itemsInRedux = allUsers || [];
    idsToDelete.forEach((d) => {
      const found = data[d.dataIndex][7];
      apiCall("/users.delete", { id: found }).then((response) => {
        if (response.success) {
          this.props.toggleToast({
            open: true,
            message: "User(s) successfully deleted",
            variant: "success",
          });
          const rem = (itemsInRedux || []).filter((com) => com?.id !== found);
          putUsersInRedux(rem);
          putMetaDataToRedux({
            ...meta,
            ["users"]: {
              ...meta["users"],
              count: meta["users"].count - 1,
            },
          });
        } else {
          this.props.toggleToast({
            open: true,
            message:
              "Unable to delete users who are admins or members of multiple communities",
            variant: "error",
          });
        }
      });
    });
  }

  makeDeleteUI({ idsToDelete }) {
    const len = (idsToDelete && idsToDelete.length) || 0;
    return (
      <Typography>
        Are you sure you want to delete (
        {(idsToDelete && idsToDelete.length) || ""})
        {len === 1 ? " user? " : " users? "}
      </Typography>
    );
  }

  showAllCommunities(communities) {
    const { toggleModal } = this.props;
    toggleModal({
      show: true,
      component: this.renderFullCommunitiesList(communities),
      onConfirm: () => toggleModal({ show: false, component: null }),
      closeAfterConfirmation: true,
      title: "Full Communities List",
      noTitle: false,
      noCancel: true,
      okText: "Close",
    });
  }

  renderFullCommunitiesList = (communities)=>{
    return communities.map((d, index)=>{
      return <p>{index+1}. {d}</p>
    })
  }

  showVisitRecords(id) {
    const { toggleModal } = this.props;
    toggleModal({
      show: true,
      component: <RenderVisitLogs id={id} />,
      onConfirm: () => toggleModal({ show: false, component: null }),
      closeAfterConfirmation: true,
      // title: "Visit Records",
      noTitle: true,
      noCancel: true,
      okText: "Close",
    });
  }

  customSort(data, colIndex, order) {
    const isSortingDate = colIndex === 1;
    const sortDate = ({ a, b }) => {
      if (a.user_portal_visits.length === 0) return 1;
      if (b.user_portal_visits.length === 0) return -1;
      const aFirstVisit = (a.user_portal_visits || [])[0];
      const bFirstVisit = (b.user_portal_visits || [])[0];
      return new Date(aFirstVisit) < new Date(bFirstVisit) ? 1 : -1;
    };
    var params = {
      colIndex,
      order,
      compare: isSortingDate && sortDate,
    };
    return data.sort((a, b) => ourCustomSort({ ...params, a, b }));
  }

  render() {
    // const title = brand.name + " - Users";
    // const description = brand.desc;
    const { columns, comingFromDashboard, ids, updating } = this.state;

    const {
      classes,
      allUsers,
      putUsersInRedux,
      auth,
      meta,
      putMetaDataToRedux,
    } = this.props;

    const content = getData({
      source: allUsers || [],
      comingFromDashboard,
      ids,
      valueExtractor: (item) => item.email,
    });
    const data = this.fashionData(content);
    const metaData = meta && meta.users;

    const options = {
      filterType: "dropdown",
      responsive: "standard",
      customSort: this.customSort,
      print: true,
      count: metaData && metaData.count,
      rowsPerPage: 25,
      rowsPerPageOptions: [10, 25, 100],
      confirmFilters: true,
      // When there is time, we need to think of a way to implement this in MEDatatable itself, so we dont have to repeat this
      onTableChange: (action, tableState) =>
        onTableStateChange({
          action,
          tableState,
          tableData: data,
          metaData,
          updateReduxFunction: putUsersInRedux,
          reduxItems: allUsers,
          apiUrl: getAdminApiEndpoint(auth, "/users"),
          pageProp: PAGE_PROPERTIES.ALL_USERS,
          updateMetaData: putMetaDataToRedux,
          name: "users",
          meta: meta,
        }),
      customSearchRender: (searchText, handleSearch, hideSearch, options) => (
        <SearchBar
          url={getAdminApiEndpoint(auth, "/users")}
          reduxItems={allUsers}
          updateReduxFunction={putUsersInRedux}
          handleSearch={handleSearch}
          hideSearch={hideSearch}
          pageProp={PAGE_PROPERTIES.ALL_USERS}
          updateMetaData={putMetaDataToRedux}
          name="users"
          meta={meta}
        />
      ),
      customFilterDialogFooter: (currentFilterList, applyFilters) => {
        return (
          <ApplyFilterButton
            url={getAdminApiEndpoint(auth, "/users")}
            reduxItems={allUsers}
            updateReduxFunction={putUsersInRedux}
            columns={columns}
            limit={getLimit(PAGE_PROPERTIES.ALL_USERS.key)}
            applyFilters={applyFilters}
            updateMetaData={putMetaDataToRedux}
            name="users"
            meta={meta}
          />
        );
      },
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
          page: PAGE_PROPERTIES.ALL_USERS,
          updateReduxFunction: putUsersInRedux,
          reduxItems: allUsers,
          url: getAdminApiEndpoint(auth, "/users"),
          updateMetaData: putMetaDataToRedux,
          name: "users",
          meta: meta,
        }),
    };

    if (isEmpty(metaData)) {
      return <Loader />;
    }
    return (
      <div>
        <Seo name={"All Users"} />

        {updating && (
          <LinearBuffer asCard message="Checking for updates..." lines={1} />
        )}

        {comingFromDashboard && !updating && (
          <MEPaperBlock icon="fa fa-bullhorn" banner>
            <Typography>
              The users involved in the interactions are currently pre-selected
              and sorted in the table for you. Feel free to
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
          page={PAGE_PROPERTIES.ALL_USERS}
          tableProps={{
            title: "All Users",
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

AllUsers.propTypes = {
  classes: PropTypes.object.isRequired,
};
function mapStateToProps(state) {
  return {
    auth: state.getIn(["auth"]),
    community: state.getIn(["selected_community"]),
    allUsers: state.getIn(["allUsers"]),
    meta: state.getIn(["paginationMetaData"]),
    tableFilters: state.getIn(["tableFilters"]),
    communities: state.getIn(["communities"]),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchUsers: fetchUsersFromBackend,
      putUsersInRedux: loadAllUsers,
      toggleDeleteConfirmation: reduxToggleUniversalModal,
      toggleModal: reduxToggleUniversalModal,
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
)(AllUsers);

export default withStyles(styles)(withRouter(VendorsMapped));
