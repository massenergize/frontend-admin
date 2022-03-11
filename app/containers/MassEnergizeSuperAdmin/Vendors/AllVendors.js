import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Helmet } from "react-helmet";
import brand from "dan-api/dummy/brand";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import { bindActionCreators } from "redux";

import MUIDataTable from "mui-datatables";
import FileCopy from "@material-ui/icons/FileCopy";
import EditIcon from "@material-ui/icons/Edit";
import { Link, withRouter } from "react-router-dom";

import Email from "@material-ui/icons/Email";
import messageStyles from "dan-styles/Messages.scss";
import { connect } from "react-redux";
import { apiCall } from "../../../utils/messenger";
import styles from "../../../components/Widget/widget-jss";
import {
  reduxGetAllVendors,
  reduxGetAllCommunityVendors,
} from "../../../redux/redux-actions/adminActions";
import { smartString } from "../../../utils/common";
import LinearBuffer from "../../../components/Massenergize/LinearBuffer";

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
      name: "Image",
      key: "image",
      options: {
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
        filter: true,
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

  render() {
    const title = brand.name + " - All Vendors";
    const description = brand.desc;
    const { columns } = this.state;
    const { classes } = this.props;
    const data = this.fashionData(this.props.allVendors ||[]);

    const options = {
      filterType: "dropdown",
      responsive: "stacked",
      print: true,
      rowsPerPage: 30,
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        idsToDelete.forEach((d) => {
          const vendorId = data[d.dataIndex][0];
          apiCall("/vendors.delete", { vendor_id: vendorId });
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
        <div className={classes.table}>
          <MUIDataTable
            title="All Vendors"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
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
    },
    dispatch
  );
}
const VendorsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AllVendors);

export default withStyles(styles)(withRouter(VendorsMapped));
