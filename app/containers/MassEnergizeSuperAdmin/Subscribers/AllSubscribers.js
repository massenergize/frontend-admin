import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Helmet } from "react-helmet";
import brand from "dan-api/dummy/brand";
import Typography from "@material-ui/core/Typography";
import { bindActionCreators } from "redux";
import messageStyles from "dan-styles/Messages.scss";
import { connect } from "react-redux";
import { apiCall } from "../../../utils/messenger";
import styles from "../../../components/Widget/widget-jss";
import CommunitySwitch from "../Summary/CommunitySwitch";
import {
  loadAllSubscribers,
  reduxToggleUniversalModal,
} from "../../../redux/redux-actions/adminActions";
import LinearBuffer from "../../../components/Massenergize/LinearBuffer";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import METable from "../ME  Tools/table /METable";
import { getAdminApiEndpoint, onTableStateChange } from "../../../utils/helpers";
import ApplyFilterButton from "../../../utils/components/applyFilterButton/ApplyFilterButton";
import SearchBar from "../../../utils/components/searchBar/SearchBar";

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
      apiCall("/subscribers.delete", { subscriber_id: found });
    });
    const rem = ((itemsInRedux && itemsInRedux.items) || []).filter(
      (com) => !ids.includes(com.id)
    );
    putSubscribersInRedux({
      items: rem,
      meta: itemsInRedux.meta,
    });
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
    const { classes, subscribers, putSubscribersInRedux, auth } = this.props;
    const data = this.fashionData((subscribers && subscribers.items) || []);
    let metaData = subscribers && subscribers.meta;

    const options = {
      filterType: "dropdown",
      responsive: "stacked",
      print: true,
      count: metaData && metaData.count,
      rowsPerPage: 25,
      rowsPerPageOptions: [10, 25, 100],
      customSearchRender: (
        searchText,
        handleSearch,
        hideSearch,
        options
      ) => (
        <SearchBar
          url={getAdminApiEndpoint(auth, "/subscribers")}
          reduxItems={subscribers}
          updateReduxFunction={putSubscribersInRedux}
          handleSearch={handleSearch}
          hideSearch={hideSearch}
          pageProp={PAGE_PROPERTIES.ALL_SUBSCRIBERS}
        />
      ),
      customFilterDialogFooter: (currentFilterList) => {
        return (
          <ApplyFilterButton
            url={getAdminApiEndpoint(auth, "/subscribers")}
            reduxItems={subscribers}
            updateReduxFunction={putSubscribersInRedux}
            columns={columns}
            filters={currentFilterList}
          />
        );
      },
      onTableChange: (action, tableState) =>
        onTableStateChange({
          action,
          tableState,
          tableData: data,
          metaData,
          updateReduxFunction: putSubscribersInRedux,
          reduxItems: subscribers,
          apiUrl: getAdminApiEndpoint(auth, "/subscribers"),
          pageProp: PAGE_PROPERTIES.ALL_SUBSCRIBERS,
        }),
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
    },
    dispatch
  );
}
const VendorsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AllSubscribers);

export default withStyles(styles)(VendorsMapped);
