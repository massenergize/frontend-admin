import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Helmet } from "react-helmet";
import brand from "dan-api/dummy/brand";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import { bindActionCreators } from "redux";

import FileCopy from "@material-ui/icons/FileCopy";
import EditIcon from "@material-ui/icons/Edit";
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
} from "../../../redux/redux-actions/adminActions";
import { smartString } from "../../../utils/common";
import LinearBuffer from "../../../components/Massenergize/LinearBuffer";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import METable from "../ME  Tools/table /METable";
import { makeAPICallForMoreData } from "../../../utils/helpers";

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
        sort:false,
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
        filterType: "textField",
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
    const itemsInRedux = allVendors.items || [];
    const ids = [];
    idsToDelete.forEach((d) => {
      const found = data[d.dataIndex][0];
      ids.push(found);
      apiCall("/vendors.delete", { vendor_id: found });
    });
    const rem = (itemsInRedux || []).filter((com) => !ids.includes(com.id));
    putVendorsInRedux({
      items: rem,
      meta: allVendors.meta,
    });
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
  callMoreData = (page) => {
    let { auth, putVendorsInRedux, allVendors} = this.props;
    var url;
    if (auth.is_super_admin) url = "/vendors.listForSuperAdmin";
    else if (auth.is_community_admin) url = "/vendors.listForCommunityAdmin";
    makeAPICallForMoreData({
      url,
      existing: allVendors && allVendors.items,
      updateRedux: putVendorsInRedux,
      page,
    });
  };

  render() {
    const title = brand.name + " - All Vendors";
    const description = brand.desc;
    const { columns } = this.state;
    const { classes, allVendors } = this.props;
    const data = this.fashionData((allVendors && allVendors.items) || []);
    const metaData = allVendors && allVendors.meta;

    const options = {
      filterType: "dropdown",
      responsive: "stacked",
      print: true,
      rowsPerPage: 25,
      count: metaData && metaData.count,
      rowsPerPageOptions: [10, 25, 100],
      onTableChange: (action, tableState) => {
        if (action === "changePage") {
          if (tableState.rowsPerPage * tableState.page === data.length) {
            this.callMoreData(metaData.next);
          }
        }
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
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      callVendorsForSuperAdmin: reduxGetAllVendors,
      callVendorsForNormalAdmin: reduxGetAllCommunityVendors,
      putVendorsInRedux: loadAllVendors,
      toggleDeleteConfirmation: reduxToggleUniversalModal,
    },
    dispatch
  );
}
const VendorsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AllVendors);

export default withStyles(styles)(withRouter(VendorsMapped));
