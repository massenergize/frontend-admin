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
  reduxGetAllVendors,
  reduxGetAllCommunityVendors,
  loadAllAdminMessages,
  reduxToggleUniversalModal,
} from "../../../redux/redux-actions/adminActions";
import CommunitySwitch from "../Summary/CommunitySwitch";
import { getHumanFriendlyDate, smartString } from "../../../utils/common";
import { Chip } from "@mui/material";
import LinearBuffer from "../../../components/Massenergize/LinearBuffer";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import METable from "../ME  Tools/table /METable";
class AllCommunityAdminMessages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      columns: this.getColumns(props.classes),
    };
  }

  componentDidMount() {
    apiCall("/messages.listForCommunityAdmin").then((allMessagesResponse) => {
      if (allMessagesResponse && allMessagesResponse.success) {
        this.props.putMessagesInRedux(allMessagesResponse.data);
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
      name: 'ID',
      key: 'id',
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
            <Link to={`/admin/edit/${id}/message`}>
              <DetailsIcon size="small" variant="outlined" color="secondary" />
            </Link>
          </div>
        ),
      },
    },
  ];

  nowDelete({ idsToDelete, data }) {
    const { messages, putMessagesInRedux } = this.props;
    // return
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
    const { classes } = this.props;
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

export default withStyles(styles)(VendorsMapped);
