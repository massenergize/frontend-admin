import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import { Helmet } from "react-helmet";
import brand from "dan-api/dummy/brand";
import Typography from "@mui/material/Typography";
import { bindActionCreators } from "redux";
import { Link, withRouter } from "react-router-dom";
import DetailsIcon from "@mui/icons-material/Details";
import { connect } from "react-redux";
import { apiCall } from "../../../utils/messenger";
import styles from "../../../components/Widget/widget-jss";
import {
  loadAllAdminMessages,
  reduxLoadMetaDataAction,
  reduxLoadTableFilters,
  reduxToggleUniversalModal,
  reduxToggleUniversalToast,
} from "../../../redux/redux-actions/adminActions";
import CommunitySwitch from "../Summary/CommunitySwitch";
import {
  getHumanFriendlyDate,
  smartString,
  separate,
  isEmpty,
} from "../../../utils/common";
import { Chip } from "@mui/material";
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
import Loader from "../../../utils/components/Loader";

export const replyToMessage = ({ pathname, props, transfer }) => {
  // const pathname = `/admin/edit/${id}/message`;
  const { history, location } = props;
  const ids = location.state && location.state.ids;
  if (!ids || !ids.length) return history.push(pathname);
  history.push({
    pathname,
    state: { ids, ...(transfer || {}) }, // pass the id list on so that when a message is replied, we can remove from the list
  });
};

class AllCommunityAdminMessages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      columns: this.getColumns(props.classes),
    };
  }

  /**
   * Here, we take the ids of all the messages that have not been attended to yet (If a user visits the mesages page by clicking on the "... unanswered message" on dashboard, the list of ids of unanswered messages will be passed into this page via location state ).
   * Then with the list of IDs we have, we run through list of messages that's loaded in from the Backend,
   * then note down all the messages that have not been attended to, and are not in the batch of messages 
   * that were loaded from the backend.  
   * With that list, we go back to the backend to retrieve the specific items. 
   * 
   * The whole point of this process is to make sure that  if a user clicks through the "15 unanswered messages" on the dashboard
   * The table is able to identify and only show the "15" messages 
   * 
   * NB: This has nothing to do with how the table actually does the filtering
   
   */
  reArrangeForAdmin(messages, meta) {
    const _sort = (a, b) => (b.id < a.id ? -1 : 1);
    const { location, putMessagesInRedux } = this.props;
    const { state } = location || {};
    const ids = (state && state.ids) || [];
    const result = separate(ids, messages);
    const { notFound, itemObjects, remainder } = result;
    var data = [...itemObjects, ...remainder];
    data.sort(_sort);

    putMessagesInRedux(data);
    if (!notFound.length) return; // If all items are found locally, dont go to the B.E

    apiCall("/messages.listForCommunityAdmin", {
      message_ids: notFound,
    }).then((response) => {
      if (response.success) data = [...response.data, ...data];
      //-- Messages that were not found, have now been loaded from the B.E!
      data.sort(_sort);
      putMessagesInRedux(data);
    });
  }

  componentWillUnmount() {
    // Clears location state when this component is unmounting
    window.history.replaceState({}, document.title);
  }
  componentDidMount() {
    const { state } = this.props.location;
    const {
      putMessagesInRedux,
      meta,
      putMetaDataToRedux,
      updateTableFilters,
      tableFilters,
    } = this.props;
    const ids = state && state.ids;
    const comingFromDashboard = ids?.length;
    if (comingFromDashboard) {
      this.setState({ saveFilters: false });
      const key = PAGE_PROPERTIES.ALL_ADMIN_MESSAGES.key + FILTERS;
      updateTableFilters({
        ...(tableFilters || {}),
        [key]: { 0: { list: ids } },
      });
    }
    
    apiCall("/messages.listForCommunityAdmin", {
      limit: getLimit(PAGE_PROPERTIES.ALL_ADMIN_MESSAGES.key),
    }).then((allMessagesResponse) => {
      if (allMessagesResponse && allMessagesResponse.success) {
        const data = allMessagesResponse.data;

        if (comingFromDashboard) {
          this.setState({ updating: true });
          this.reArrangeForAdmin(data, meta);
        } else {
          putMessagesInRedux(data);
          putMetaDataToRedux({
            ...meta,
            adminMessages: allMessagesResponse.cursor,
          });
        }
      } else
        console.log(
          "Sorry, something happened while loading messages...",
          allMessagesResponse
        );
    });
  }

  showCommunitySwitch = () => {
    const user = this.props.auth ? this.props.auth : {};
    if (user.is_community_admin) {
      return <CommunitySwitch actionToPerform={this.handleCommunityChange} />;
    }
  };

  fashionData = (data = []) => {
    return data.map((d) => [
      d.id,
      getHumanFriendlyDate(d.created_at, true),
      smartString(d.title, 30),
      d.user_name || (d.user && d.user.full_name) || "",
      d.email || (d.user && d.user.email) || "",
      d.community && d.community.name,
      d.have_replied ? "Yes" : "No",
      d.id,
    ]);
  };

  getColumns = (classes) => [
    {
      name: "ID",
      key: "id",
      options: {
        filter: false,
        filterType: "multiselect",
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
      name: "User Name",
      key: "user_name",
      options: {
        filter: false,
        filterType: "textField",
      },
    },
    {
      name: "Email",
      key: "email",
      options: {
        filter: false,
        filterType: "textField",
      },
    },
    {
      name: "Community",
      key: "community",
      options: {
        filter: true,
        filterType: "multiSelect",
      },
    },
    {
      name: "Replied?",
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
      name: "See Details",
      key: "edit_or_copy",
      options: {
        filter: false,
        download: false,
        sort: false,
        customBodyRender: (id) => (
          <div>
            {/* <Link to={`/admin/edit/${id}/message`}>
              <DetailsIcon size="small" variant="outlined" color="secondary" />
            </Link> */}
            <Link
              onClick={(e) => {
                e.preventDefault();
                replyToMessage({
                  pathname: `/admin/edit/${id}/message`,
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

  nowDelete({ idsToDelete, data }) {
    const { messages, putMessagesInRedux } = this.props;
    const itemsInRedux = messages;
    const ids = [];
    idsToDelete.forEach((d) => {
      const found = data[d.dataIndex][0];
      ids.push(found);
      apiCall("/messages.delete", { message_id: found }).then((response) => {
        if (response.success) {
          this.props.toggleToast({
            open: true,
            message: "Message(s) successfully deleted",
            variant: "success",
          });
        } else {
          this.props.toggleToast({
            open: true,
            message: "An error occurred while deleting the message(s)",
            variant: "error",
          });
        }
      });
    });
    const rem = (itemsInRedux || []).filter((com) => !ids.includes(com.id));
    putMessagesInRedux(rem);
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
    const title = brand.name + " - Community Admin Messages";
    const description = brand.desc;
    const { columns } = this.state;
    const {
      classes,
      messages,
      putMessagesInRedux,
      meta,
      putMetaDataToRedux,
    } = this.props;
    const data = this.fashionData(messages); // not ready for this yet: && this.props.messages.filter(item=>item.parent===null));
    const metaData = meta && meta.adminMessages;
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
          updateReduxFunction: putMessagesInRedux,
          reduxItems: messages,
          apiUrl: "/messages.listForCommunityAdmin",
          pageProp: PAGE_PROPERTIES.ALL_ADMIN_MESSAGES,
          updateMetaData: putMetaDataToRedux,
          name: "adminMessages",
          meta: meta,
        }),
      customFilterDialogFooter: (currentFilterList, applyFilters) => {
        return (
          <ApplyFilterButton
            url={"/messages.listForCommunityAdmin"}
            reduxItems={messages}
            updateReduxFunction={putMessagesInRedux}
            columns={columns}
            limit={getLimit(PAGE_PROPERTIES.ALL_ADMIN_MESSAGES.key)}
            applyFilters={applyFilters}
            updateMetaData={putMetaDataToRedux}
            name="adminMessages"
            meta={meta}
          />
        );
      },
      customSearchRender: (searchText, handleSearch, hideSearch, options) => (
        <SearchBar
          url={"/messages.listForCommunityAdmin"}
          reduxItems={messages}
          updateReduxFunction={putMessagesInRedux}
          handleSearch={handleSearch}
          hideSearch={hideSearch}
          pageProp={PAGE_PROPERTIES.ALL_ADMIN_MESSAGES}
          updateMetaData={putMetaDataToRedux}
          name="adminMessages"
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
          page: PAGE_PROPERTIES.ALL_ADMIN_MESSAGES,
          updateReduxFunction: putMessagesInRedux,
          reduxItems: messages,
          url: "/messages.listForCommunityAdmin",
          updateMetaData: putMetaDataToRedux,
          name: "adminMessages",
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
        <METable
          classes={classes}
          page={PAGE_PROPERTIES.ALL_ADMIN_MESSAGES}
          tableProps={{
            title: "All Community Admin Messages",
            data: data,
            columns: columns,
            options: options,
          }}
          customFilterObject={{
            0: {
              list: this.state.ids,
            },
          }} // "0" here is the index of the "ID" column in the table
          ignoreSavedFilters={this.state.ignoreSavedFilters}
          saveFilters={this.state.saveFilters}
        />
      </div>
    );
  }
}

AllCommunityAdminMessages.propTypes = {
  classes: PropTypes.object.isRequired,
};
function mapStateToProps(state) {
  return {
    auth: state.getIn(["auth"]),
    community: state.getIn(["selected_community"]),
    messages: state.getIn(["messages"]),
    meta: state.getIn(["paginationMetaData"]),
    tableFilters: state.getIn(["tableFilters"]),
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      putMessagesInRedux: loadAllAdminMessages,
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
)(AllCommunityAdminMessages);

export default withStyles(styles)(withRouter(VendorsMapped));
