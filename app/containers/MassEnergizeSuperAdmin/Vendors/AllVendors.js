import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import { Helmet } from "react-helmet";
import brand from "dan-api/dummy/brand";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { bindActionCreators } from "redux";

import FileCopy from "@mui/icons-material/FileCopy";
import EditIcon from "@mui/icons-material/Edit";
import { Link, withRouter } from "react-router-dom";
import messageStyles from "dan-styles/Messages.scss";
import { connect } from "react-redux";
import { apiCall } from "../../../utils/messenger";
import styles from "../../../components/Widget/widget-jss";
import {
  reduxGetAllVendors,
  reduxGetAllCommunityVendors,
  reduxToggleUniversalModal,
  loadAllVendors,
  reduxToggleUniversalToast,
  reduxLoadMetaDataAction,
} from "../../../redux/redux-actions/adminActions";
import { smartString } from "../../../utils/common";
import LinearBuffer from "../../../components/Massenergize/LinearBuffer";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import METable from "../ME  Tools/table /METable";
import {
  getAdminApiEndpoint,
  getLimit,
  handleFilterChange,
  onTableStateChange,
} from "../../../utils/helpers";
import ApplyFilterButton from "../../../utils/components/applyFilterButton/ApplyFilterButton";
import SearchBar from "../../../utils/components/searchBar/SearchBar";

class AllVendors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: this.getColumns(props.classes),
    };
  }

  handleCommunityChange = (id) => {
    this.props.callVendorsForNormalAdmin(id);
  };

  componentDidMount() {
    const user = this.props.auth ? this.props.auth : {};
    if (user.is_super_admin) {
      this.props.callVendorsForSuperAdmin();
    }
    if (user.is_community_admin) {
      this.props.callVendorsForNormalAdmin(0);
    }
  }

  fashionData = (data) => {
    data = data.map((d) => [
      d.id,
      {
        id: d.id,
        image: d.logo,
        initials: `${d.name && d.name.substring(0, 2).toUpperCase()}`,
      },
      smartString(d.name), // limit to first 30 chars
      smartString(
        `${(d.key_contact && d.key_contact.name) || ""} (${(d.key_contact &&
          d.key_contact.email) ||
          ""})`,
        40
      ), // limit to first 20 chars
      smartString(
        d.communities &&
          d.communities
            .slice(0, 5)
            .map((c) => c.name)
            .join(", "),
        30
      ),
      d.service_area,
      d.id,
      d.id,
    ]);
    return data;
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

  getColumns = (classes) => [
    {
      name: "ID",
      key: "id",
      options: {
        filter: false,
      },
    },
    {
      name: "Image",
      key: "image",
      options: {
        sort: false,
        filter: false,
        download: false,
        customBodyRender: (d) => (
          <div>
            {d.image && (
              <Avatar
                alt={d.initials}
                src={d.image.url}
                style={{ margin: 10 }}
              />
            )}
            {!d.image && <Avatar style={{ margin: 10 }}>{d.initials}</Avatar>}
          </div>
        ),
      },
    },
    {
      name: "Name",
      key: "name",
      options: {
        filter: false,
        filterType: "textField",
      },
    },
    {
      name: "Key Contact",
      key: "key_contact",
      options: {
        filter: false,
      },
    },
    {
      name: "Communities Serviced",
      key: "communities",
      options: {
        filter: true,
        filterType: "dropdown",
      },
    },
    {
      name: "Service Area",
      key: "service_area",
      options: {
        filter: true,
      },
    },
    {
      name: "Edit? Copy?",
      key: "edit_or_copy",
      options: {
        filter: false,
        download: false,
        sort: false,
        customBodyRender: (id) => (
          <div>
            <Link to={`/admin/edit/${id}/vendor`}>
              <EditIcon size="small" variant="outlined" color="secondary" />
            </Link>
            &nbsp;&nbsp;
            <Link
              onClick={async () => {
                const copiedVendorResponse = await apiCall("/vendors.copy", {
                  vendor_id: id,
                });
                if (copiedVendorResponse && copiedVendorResponse.success) {
                  const newVendor =
                    copiedVendorResponse && copiedVendorResponse.data;
                  this.props.history.push(`/admin/edit/${newVendor.id}/vendor`);
                }
              }}
              to="/admin/read/vendors"
            >
              <FileCopy size="small" variant="outlined" color="secondary" />
            </Link>
          </div>
        ),
      },
    },
  ];

  nowDelete({ idsToDelete, data }) {
    const { allVendors, putVendorsInRedux } = this.props;
    const itemsInRedux = allVendors || [];
    const ids = [];
    idsToDelete.forEach((d) => {
      const found = data[d.dataIndex][0];
      ids.push(found);
      apiCall("/vendors.delete", { vendor_id: found }).then((response) => {
        if (response.success) {
          this.props.toggleToast({
            open: true,
            message: "Vendor(s) successfully deleted",
            variant: "success",
          });
        } else {
          this.props.toggleToast({
            open: true,
            message: "An error occurred while deleting the vendor(s)",
            variant: "error",
          });
        }
      });
    });
    const rem = (itemsInRedux || []).filter((com) => !ids.includes(com.id));
    putVendorsInRedux(rem);
  }

  makeDeleteUI({ idsToDelete }) {
    const len = (idsToDelete && idsToDelete.length) || 0;
    return (
      <Typography>
        Are you sure you want to delete (
        {(idsToDelete && idsToDelete.length) || ""})
        {len === 1 ? " vendor? " : " vendors? "}
      </Typography>
    );
  }
  render() {
    const title = brand.name + " - All Vendors";
    const description = brand.desc;
    const { columns } = this.state;
    const { classes, allVendors, putVendorsInRedux, auth, meta, putMetaDataToRedux } = this.props;
    const data = this.fashionData((allVendors) || []);
    const metaData = meta && meta.vendors;

    const options = {
      filterType: "dropdown",
      responsive: "standard",
      print: true,
      rowsPerPage: 25,
      count: metaData && metaData.count,
      rowsPerPageOptions: [10, 25, 100],
      confirmFilters: true,
      onTableChange: (action, tableState) =>
        onTableStateChange({
          action,
          tableState,
          tableData: data,
          metaData,
          updateReduxFunction: putVendorsInRedux,
          reduxItems: allVendors,
          apiUrl: getAdminApiEndpoint(auth, "/vendors"),
          pageProp: PAGE_PROPERTIES.ALL_VENDORS,
          updateMetaData: putMetaDataToRedux,
          name: "vendors",
          meta: meta,
        }),
      customSearchRender: (
        searchText,
        handleSearch,
        hideSearch,
        options
      ) => (
        <SearchBar
          url={getAdminApiEndpoint(auth, "/vendors")}
          reduxItems={allVendors}
          updateReduxFunction={putVendorsInRedux}
          handleSearch={handleSearch}
          hideSearch={hideSearch}
          pageProp={PAGE_PROPERTIES.ALL_VENDORS}
          updateMetaData={putMetaDataToRedux}
          name="vendors"
          meta={meta}
        />
      ),
      customFilterDialogFooter: (currentFilterList, applyFilters) => {
        return (
          <ApplyFilterButton
            url={getAdminApiEndpoint(auth, "/vendors")}
            reduxItems={allVendors}
            updateReduxFunction={putVendorsInRedux}
            columns={columns}
            limit={getLimit(PAGE_PROPERTIES.ALL_VENDORS.key)}
            applyFilters={applyFilters}
            updateMetaData={putMetaDataToRedux}
            name="vendors"
            meta={meta}
          />
        );
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
          page: PAGE_PROPERTIES.ALL_VENDORS,
          updateReduxFunction: putVendorsInRedux,
          reduxItems: allVendors,
          url: getAdminApiEndpoint(auth, "/vendors"),
          updateMetaData: putMetaDataToRedux,
          name: "vendors",
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
        return false;
      },
    };

    if (!data || data == undefined) {
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
          page={PAGE_PROPERTIES.ALL_VENDORS}
          tableProps={{
            title: "All Vendors",
            data: data,
            columns: columns,
            options: options,
          }}
        />
      </div>
    );
  }
}

AllVendors.propTypes = {
  classes: PropTypes.object.isRequired,
};
function mapStateToProps(state) {
  return {
    auth: state.getIn(["auth"]),
    allVendors: state.getIn(["allVendors"]),
    community: state.getIn(["selected_community"]),
    meta: state.getIn(["paginationMetaData"]),
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      callVendorsForSuperAdmin: reduxGetAllVendors,
      callVendorsForNormalAdmin: reduxGetAllCommunityVendors,
      putVendorsInRedux: loadAllVendors,
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
)(AllVendors);

export default withStyles(styles)(withRouter(VendorsMapped));
