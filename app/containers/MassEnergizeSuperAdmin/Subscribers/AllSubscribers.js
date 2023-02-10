import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import { Helmet } from "react-helmet";
import brand from "dan-api/dummy/brand";
import Typography from "@mui/material/Typography";
import { bindActionCreators } from "redux";
import messageStyles from "dan-styles/Messages.scss";
import { connect } from "react-redux";
import { apiCall } from "../../../utils/messenger";
import styles from "../../../components/Widget/widget-jss";
import CommunitySwitch from "../Summary/CommunitySwitch";
import {
  loadAllSubscribers,
  reduxToggleUniversalModal,
  reduxToggleUniversalToast,
} from "../../../redux/redux-actions/adminActions";
import LinearBuffer from "../../../components/Massenergize/LinearBuffer";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import METable from "../ME  Tools/table /METable";

class AllSubscribers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dataFiltered: [],
      loading: true,
      columns: this.getColumns(props.classes),
    };
  }

  async componentDidMount() {
    const user = this.props.auth ? this.props.auth : {};
    let allSubscribersResponse = null;
    if (user.is_super_admin) {
      allSubscribersResponse = await apiCall("/subscribers.listForSuperAdmin");
    } else if (user.is_community_admin) {
      allSubscribersResponse = await apiCall(
        "/subscribers.listForCommunityAdmin",
        { community_id: null }
      );
    }

    if (allSubscribersResponse && allSubscribersResponse.data) {
      this.props.putSubscribersInRedux(allSubscribersResponse.data);
    }
  }

  showCommunitySwitch = () => {
    const user = this.props.auth ? this.props.auth : {};
    if (user.is_community_admin) {
      return <CommunitySwitch actionToPerform={this.handleCommunityChange} />;
    }
    return <div />;
  };

  handleCommunityChange = async (id) => {
    const { data } = this.state;
    if (!id) {
      await this.setStateAsync({ dataFiltered: data });
      return;
    }
    const filteredData =
      (data || []) && data.filter((d) => d.community && d.community.id === id);
    console.log(data, filteredData, id);
    await this.setStateAsync({ dataFiltered: filteredData });
  };

  fashionData = (data) =>
    data.map((d) => [d.id, d.name, d.email, d.community && d.community.name]);

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

  getColumns = (classes) => [
    {
      name: "ID",
      key: "id",
      options: {
        filter: false,
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
      name: "Email",
      key: "email",
      options: {
        filter: false,
      },
    },
    {
      name: "Community",
      key: "community",
      options: {
        filter: true,
      },
    },
  ];

  nowDelete({ idsToDelete, data }) {
    const { subscribers, putSubscribersInRedux } = this.props;
    const itemsInRedux = subscribers;
    const ids = [];
    idsToDelete.forEach((d) => {
      const found = data[d.dataIndex][0];
      ids.push(found);
      apiCall("/subscribers.delete", { subscriber_id: found }).then(
        (response) => {
          if (response.success) {
            this.props.toggleToast({
              open: true,
              message: "Subscriber(s) successfully deleted",
              variant: "success",
            });
          } else {
            this.props.toggleToast({
              open: true,
              message: "An error occurred while deleting the subscriber(s)",
              variant: "error",
            });
          }
        }
      );
    });
    const rem = (itemsInRedux || []).filter((com) => !ids.includes(com.id));
    putSubscribersInRedux(rem);
  }

  makeDeleteUI({ idsToDelete }) {
    const len = (idsToDelete && idsToDelete.length) || 0;
    return (
      <Typography>
        Are you sure you want to delete (
        {(idsToDelete && idsToDelete.length) || ""})
        {len === 1 ? " subscriber? " : " subscribers? "}
      </Typography>
    );
  }

  render() {
    const title = brand.name + " - All Subscribers";
    const description = brand.desc;
    const { columns, dataFiltered } = this.state;
    const { classes } = this.props;
    const data = this.fashionData(this.props.subscribers);

    const options = {
      filterType: "dropdown",
      responsive: "standard",
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
          page={PAGE_PROPERTIES.ALL_SUBSCRIBERS}
          tableProps={{
            title: "All Team Admin Messages Pro",
            data: data,
            columns: columns,
            options: options,
          }}
        />
      </div>
    );
  }
}

AllSubscribers.propTypes = {
  classes: PropTypes.object.isRequired,
};
function mapStateToProps(state) {
  return {
    auth: state.getIn(["auth"]),
    allVendors: state.getIn(["allVendors"]),
    community: state.getIn(["selected_community"]),
    subscribers: state.getIn(["subscribers"]),
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      putSubscribersInRedux: loadAllSubscribers,
      toggleDeleteConfirmation: reduxToggleUniversalModal,
      toggleToast:reduxToggleUniversalToast
    },
    dispatch
  );
}
const VendorsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AllSubscribers);

export default withStyles(styles)(VendorsMapped);
