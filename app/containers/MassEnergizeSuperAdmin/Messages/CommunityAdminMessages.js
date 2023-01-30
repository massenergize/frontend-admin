import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import { Helmet } from "react-helmet";
import brand from "dan-api/dummy/brand";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { bindActionCreators } from "redux";
import MUIDataTable from "mui-datatables";
import FileCopy from "@mui/icons-material/FileCopy";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import DetailsIcon from "@mui/icons-material/Details";
import messageStyles from "dan-styles/Messages.scss";
import { connect } from "react-redux";
import { apiCall } from "../../../utils/messenger";
import styles from "../../../components/Widget/widget-jss";
import {
  loadAllAdminMessages,
  reduxToggleUniversalModal,
} from "../../../redux/redux-actions/adminActions";
import CommunitySwitch from "../Summary/CommunitySwitch";
import {
  getHumanFriendlyDate,
  smartString,
  separate,
} from "../../../utils/common";
import { Chip } from "@mui/material";
import LinearBuffer from "../../../components/Massenergize/LinearBuffer";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import METable from "../ME  Tools/table /METable";

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
  reArrangeForAdmin(messages) {
    const _sort = (a, b) => (b.id < a.id ? -1 : 1);
    const { location, putMessagesInRedux } = this.props;
    const { state } = location || {};
    const ids = (state && state.ids) || [];
    const result = separate(ids, messages);
    const { notFound, itemObjects, remainder } = result;
    var data = [...itemObjects, ...remainder];
    console.log("INFORMATION", result);
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
    const { messages, putMessagesInRedux, history } = this.props;
    const ids = state && state.ids;
    // console.log("IS IT FROM ids", ids);
    // if (messages && messages.length) {
    //   if (ids) {
    //     this.setState({ ignoreSavedFilters: true, saveFilters: false }); //--- When an admin enters here through the summary page, we need old filters to be turned off, so that the table will only select the unattended items
    //     this.reArrangeForAdmin(messages);
    //   }
    //   return;
    // }

    //--- Should only run if "messages" is empty. ie. This page is loading for the first time...
    apiCall("/messages.listForCommunityAdmin").then((allMessagesResponse) => {
      if (allMessagesResponse && allMessagesResponse.success) {
        const data = allMessagesResponse.data;
        if (ids) {
          this.setState({ ignoreSavedFilters: true, saveFilters: false });
          this.reArrangeForAdmin(data);
        } else putMessagesInRedux(data);
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

  fashionData = (data) => {
    return data.map((d) => [
      d.id,
      getHumanFriendlyDate(d.created_at, true),
      smartString(d.title, 30),
      d.user_name || (d.user && d.user.full_name) || "",
      d.email || (d.user && d.user.email) || "",
      d.community && d.community.name,
      d.have_replied,
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
              label={d ? "Yes" : "No"}
              className={d ? classes.yesLabel : classes.noLabel}
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
      apiCall("/messages.delete", { message_id: found });
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
    const { classes, location } = this.props;
    const data = this.fashionData(this.props.messages); // not ready for this yet: && this.props.messages.filter(item=>item.parent===null));
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
          page={PAGE_PROPERTIES.ALL_ADMIN_MESSAGES}
          tableProps={{
            title: "All Community Admin Messages",
            data: data,
            columns: columns,
            options: options,
          }}
          customFilterObject={{
            0: {
              list: location.state && location.state.ids,
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
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      putMessagesInRedux: loadAllAdminMessages,
      toggleDeleteConfirmation: reduxToggleUniversalModal,
    },
    dispatch
  );
}
const VendorsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AllCommunityAdminMessages);

export default withStyles(styles)(withRouter(VendorsMapped));
