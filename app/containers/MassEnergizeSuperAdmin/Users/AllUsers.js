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
import { withRouter } from "react-router-dom";
import Loader from "../../../utils/components/Loader";

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

    this.setState({ updating: true, saveFilters: false });
    const key = PAGE_PROPERTIES.ALL_USERS.key + FILTERS;

    updateTableFilters({
      ...(tableFilters || {}),
      [key]: { 3: { list: ids } },
    });

    var content = {
      fieldKey: "user_emails",
      apiURL: "/users.listForCommunityAdmin",
      props: this.props,
      dataSource: [],
      valueExtractor: (user) => user.email,
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
      getHumanFriendlyDate(d.joined),
      d.preferred_name,
      d.email,
      smartString(d.communities.join(", "), 30),
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

  getColumns = (classes) => [
    {
      name: "Full Name",
      key: "full_name",
      options: {
        filter: false,
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
      options: {
        filter: true,
        filterType: "multiselect",
      },
    },
    {
      name: "Membership",
      key: "status",
      options: {
        filter: true,
      },
    },
  ];

  nowDelete({ idsToDelete, data }) {
    const { allUsers, putUsersInRedux } = this.props;
    const itemsInRedux = allUsers || [];
    idsToDelete.forEach((d) => {
      const found = data[d.dataIndex][6];
      apiCall("/users.delete", { id: found }).then((response) => {
        if (response.success) {
          this.props.toggleToast({
            open: true,
            message: "User(s) successfully deleted",
            variant: "success",
          });
          const rem = (itemsInRedux || []).filter((com) => com?.id !== found);
          putUsersInRedux(rem);
        } else {
          this.props.toggleToast({
            open: true,
            message: "An error occurred while deleting the user(s)",
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
  render() {
    const title = brand.name + " - Users";
    const description = brand.desc;
    const { columns } = this.state;
    const {
      classes,
      allUsers,
      putUsersInRedux,
      auth,
      meta,
      putMetaDataToRedux,
    } = this.props;
    const data = this.fashionData(allUsers || []);
    const metaData = meta && meta.users;

    const options = {
      filterType: "dropdown",
      responsive: "standard",
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
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>

        {this.state.updating && (
          <LinearBuffer asCard message="Checking for updates..." lines={1} />
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
          saveFilters={this.state.saveFilters}
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
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchUsers: fetchUsersFromBackend,
      putUsersInRedux: loadAllUsers,
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
)(AllUsers);

export default withStyles(styles)(withRouter(VendorsMapped));
