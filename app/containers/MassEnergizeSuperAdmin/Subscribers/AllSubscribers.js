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
  reduxLoadMetaDataAction,
  reduxToggleUniversalModal,
  reduxToggleUniversalToast,
} from "../../../redux/redux-actions/adminActions";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import METable from "../ME  Tools/table /METable";
import { getAdminApiEndpoint, getLimit, handleFilterChange, onTableStateChange } from "../../../utils/helpers";
import ApplyFilterButton from "../../../utils/components/applyFilterButton/ApplyFilterButton";
import SearchBar from "../../../utils/components/searchBar/SearchBar";
import { isEmpty } from "../../../utils/common";
import Loader from "../../../utils/components/Loader";
import Seo from "../../../components/Seo/Seo";
import CustomOptions from "../ME  Tools/table /CustomOptions";
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_ITEMS_PER_PAGE_OPTIONS } from '../../../utils/constants';

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
    let { auth, meta, putMetaDataToRedux, putSubscribersInRedux } = this.props;
    const user = auth ? auth : {};
    let allSubscribersResponse = null;
    if (user.is_super_admin) {
      allSubscribersResponse = await apiCall("/subscribers.listForSuperAdmin", {
        limit: getLimit(PAGE_PROPERTIES.ALL_SUBSCRIBERS.key),
      });
    } else if (user.is_community_admin) {
      allSubscribersResponse = await apiCall(
        "/subscribers.listForCommunityAdmin",
        {
          community_id: null,
          limit: getLimit(PAGE_PROPERTIES.ALL_SUBSCRIBERS.key),
        }
      );
    }

    if (allSubscribersResponse?.data) {
      putSubscribersInRedux(allSubscribersResponse.data);
      putMetaDataToRedux({
        ...meta,
        subscribers: allSubscribersResponse.cursor,
      });
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

  fashionData = (data) => {
    return data.map((d) => [
      d.id,
      d.name,
      d.email,
      d.community && d.community.name,
    ]);
  };

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

  getColumns = (classes) => {
    const { communities, auth} = this.props;
    return [
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
  ]
}

  nowDelete({ idsToDelete, data }) {
    const { subscribers, putSubscribersInRedux, meta,putMetaDataToRedux } = this.props;
    const itemsInRedux = subscribers;
    const ids = [];
    idsToDelete.forEach((d) => {
      const found = data[d.dataIndex][0];
      ids.push(found);
      apiCall("/subscribers.delete", { subscriber_id: found }).then(
        (response) => {
          if (response.success) {
            putMetaDataToRedux({
              ...meta,
              ["subscribers"]: {
                ...meta["subscribers"],
                count: meta["subscribers"].count - 1,
              },
            });
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
    const {
      classes,
      subscribers,
      putSubscribersInRedux,
      auth,
      meta,
      putMetaDataToRedux,
    } = this.props;
    const data = this.fashionData(subscribers || []);
    let metaData = meta && meta.subscribers;

    const options = {
      filterType: "dropdown",
      responsive: "standard",
      print: true,
      count: metaData && metaData.count,
      rowsPerPage: DEFAULT_ITEMS_PER_PAGE,
      rowsPerPageOptions: DEFAULT_ITEMS_PER_PAGE_OPTIONS,
      confirmFilters: true,
      customSearchRender: (searchText, handleSearch, hideSearch, options) => (
        <SearchBar
          url={getAdminApiEndpoint(auth, "/subscribers")}
          reduxItems={subscribers}
          updateReduxFunction={putSubscribersInRedux}
          handleSearch={handleSearch}
          hideSearch={hideSearch}
          pageProp={PAGE_PROPERTIES.ALL_SUBSCRIBERS}
          updateMetaData={putMetaDataToRedux}
          name="subscribers"
          meta={meta}
        />
      ),
      customFilterDialogFooter: (currentFilterList, applyFilters) => {
        return (
          <ApplyFilterButton
            url={getAdminApiEndpoint(auth, "/subscribers")}
            reduxItems={subscribers}
            updateReduxFunction={putSubscribersInRedux}
            columns={columns}
            limit={getLimit(PAGE_PROPERTIES.ALL_SUBSCRIBERS.key)}
            applyFilters={applyFilters}
            updateMetaData={putMetaDataToRedux}
            name="subscribers"
            meta={meta}
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
          updateMetaData: putMetaDataToRedux,
          name: "subscribers",
          meta: meta,
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
          page: PAGE_PROPERTIES.ALL_SUBSCRIBERS,
          updateReduxFunction: putSubscribersInRedux,
          reduxItems: subscribers,
          url: getAdminApiEndpoint(auth, "/subscribers"),
          updateMetaData: putMetaDataToRedux,
          name: "subscribers",
          meta: meta,
        }),
    };
    if (isEmpty(metaData)) {
      return <Loader />;
    }

    return (
      <div>
        <Seo name={"All Subscribers"} />
        <METable
          classes={classes}
          page={PAGE_PROPERTIES.ALL_SUBSCRIBERS}
          tableProps={{
            title: "All Subscribers",
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
    meta: state.getIn(["paginationMetaData"]),
    communities: state.getIn(["communities"]),
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      putSubscribersInRedux: loadAllSubscribers,
      toggleDeleteConfirmation: reduxToggleUniversalModal,
      toggleToast: reduxToggleUniversalToast,
      putMetaDataToRedux: reduxLoadMetaDataAction,
    },
    dispatch
  );
}
const VendorsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AllSubscribers);

export default withStyles(styles)(VendorsMapped);
