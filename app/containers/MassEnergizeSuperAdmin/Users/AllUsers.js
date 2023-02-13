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
  reduxToggleUniversalModal,
  reduxToggleUniversalToast,
} from "../../../redux/redux-actions/adminActions";
import {
  getHumanFriendlyDate,
  reArrangeForAdmin,
  smartString,
} from "../../../utils/common";
import LinearBuffer from "../../../components/Massenergize/LinearBuffer";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import METable from "../ME  Tools/table /METable";
import { getAdminApiEndpoint, handleFilterChange, onTableStateChange } from "../../../utils/helpers";
import ApplyFilterButton from "../../../utils/components/applyFilterButton/ApplyFilterButton";
import SearchBar from "../../../utils/components/searchBar/SearchBar";
import { withRouter } from "react-router-dom";

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
    // const { auth } = this.props;
    // var url;
    // if (!auth) return;

    // if (auth.is_super_admin) url = "/users.listForSuperAdmin";
    // else if (auth.is_community_admin) url = "/users.listForCommunityAdmin";
    // apiCall(url, { limit: getLimit(PAGE_PROPERTIES.ALL_USERS.key) }).then(
    //   (allUsersResponse) => {
    //     if (allUsersResponse && allUsersResponse.success) {
    //       this.props.putUsersInRedux(
    //         allUsersResponse.data,
    //         allUsersResponse.meta
    //       );
    //     }
    //   }
    // );
    const { auth, putUsersInRedux, location, fetchUsers } = this.props;
    const { state } = location;
    const ids = state && state.ids;
    const comingFromDashboard = ids && ids.length;

    if (!comingFromDashboard) return fetchUsers();

    this.setState({ ignoreSavedFilters: true, saveFilters: false, ids });

    var content = {
      fieldKey: "user_emails",
      apiURL: "/users.listForCommunityAdmin",
      props: this.props,
      dataSource: [],
      valueExtractor: (user) => user.email,
      reduxFxn: putUsersInRedux,
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
    const itemsInRedux = allUsers.items || [];
    const ids = [];
    idsToDelete.forEach((d) => {
      const found = data[d.dataIndex][6];
      ids.push(found);
      apiCall("/users.delete", { id: found }).then((response) => {
        if (response.success) {
          this.props.toggleToast({
            open: true,
            message: "User(s) successfully deleted",
            variant: "success",
          });
        } else {
          this.props.toggleToast({
            open: true,
            message: "An error occurred while deleting the user(s)",
            variant: "error",
          });
        }
      });
    });
    const rem = (itemsInRedux || []).filter((com) => !ids.includes(com.id));
    putUsersInRedux(rem, allUsers.meta);
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
    const { classes, allUsers, putUsersInRedux, auth } = this.props;
    const data = this.fashionData((allUsers && allUsers.items) || []);
    const metaData = allUsers && allUsers.meta;
    const options = {
      filterType: "dropdown",
      responsive: "standard",
      print: true,
      count: metaData && metaData.count,
      rowsPerPage: 25,
      rowsPerPageOptions: [10, 25, 100],
      confirmFilters: true,
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
        }),
      customSearchRender: (
        searchText,
        handleSearch,
        hideSearch,
        options
      ) => (
        <SearchBar
          url={getAdminApiEndpoint(auth, "/users")}
          reduxItems={allUsers}
          updateReduxFunction={putUsersInRedux}
          handleSearch={handleSearch}
          hideSearch={hideSearch}
          pageProp={PAGE_PROPERTIES.ALL_USERS}
        />
      ),
      customFilterDialogFooter: (currentFilterList, applyFilters) => {
        return (
          <ApplyFilterButton
            url={getAdminApiEndpoint(auth, "/users")}
            reduxItems={allUsers}
            updateReduxFunction={putUsersInRedux}
            columns={columns}
            filters={currentFilterList}
            applyFilters={applyFilters}
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
      onFilterChange: (
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
        }),
    };

    if (!data || !data.length) {
      return <LinearBuffer />;
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
        <METable
          classes={classes}
          page={PAGE_PROPERTIES.ALL_USERS}
          tableProps={{
            title: "All Users",
            data: data,
            columns: columns,
            options: options,
          }}
          customFilterObject={{
            3: {
              list: this.state.ids,
            },
          }}
          ignoreSavedFilters={this.state.ignoreSavedFilters}
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
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchUsers: fetchUsersFromBackend,
      putUsersInRedux: loadAllUsers,
      toggleDeleteConfirmation: reduxToggleUniversalModal,
      toggleToast:reduxToggleUniversalToast
    },
    dispatch
  );
}
const VendorsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AllUsers);

export default withStyles(styles)(withRouter(VendorsMapped));
