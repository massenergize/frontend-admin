import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { bindActionCreators } from 'redux';


import MUIDataTable from 'mui-datatables';
import FileCopy from '@material-ui/icons/FileCopy';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';

import Email from '@material-ui/icons/Email';
import messageStyles from 'dan-styles/Messages.scss';
import { connect } from 'react-redux';
import { apiCall } from '../../../utils/messenger';
import styles from '../../../components/Widget/widget-jss';
import { reduxGetAllVendors, reduxGetAllCommunityVendors } from '../../../redux/redux-actions/adminActions';
import CommunitySwitch from '../Summary/CommunitySwitch';
class AllVendors extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], loading: true, columns: this.getColumns(props.classes) };
  }


  handleCommunityChange =(id) => {
    this.props.callVendorsForNormalAdmin(id);
  }

  async componentDidMount() {
    const user = this.props.auth ? this.props.auth : {};
    if (user.is_super_admin) {
      this.props.callVendorsForSuperAdmin();
    }
    if (user.is_community_admin) {
      const com = this.props.community ? this.props.community : user.admin_at[0];
      this.props.callVendorsForNormalAdmin(null);
    }
  }

  fashionData = (data) => {
    console.log(data)
    data = data.map(d => (
      [
        d.id,
        {
          id: d.id,
          image: d.logo,
          initials: `${d.name && d.name.substring(0, 2).toUpperCase()}`
        },
        `${d.name}...`.substring(0, 30), // limit to first 30 chars
        d.key_contact, // limit to first 20 chars
        d.communities && d.communities.slice(0, 5).map(c => c.name).join(', '),
        d.service_area,
        d.id
      ]
    ));
    return data;
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  getStatus = isApproved => {
    switch (isApproved) {
      case false: return messageStyles.bgError;
      case true: return messageStyles.bgSuccess;
      default: return messageStyles.bgSuccess;
    }
  };

  getColumns = (classes) => [
    {
      name: 'ID',
      key: 'id',
      options: {
        filter: true,
        filterType: 'textField'
      }
    },
    {
      name: 'Image',
      key: 'image',
      options: {
        filter: false,
        download: false,
        customBodyRender: (d) => (
          <div>
            {d.image
              && <Avatar alt={d.initials} src={d.image.url} style={{ margin: 10 }} />
            }
            {!d.image
              && <Avatar style={{ margin: 10 }}>{d.initials}</Avatar>
            }
          </div>
        )
      }
    },
    {
      name: 'Name',
      key: 'name',
      options: {
        filter: true,
        filterType: 'textField',
      }
    },
    {
      name: 'Key Contact',
      key: 'key_contact',
      options: {
        filter: false,
        customBodyRender: (n) => (
          <div className={classes.flex}>
            <div>
              <Typography>{n && n.name}</Typography>
              <Typography variant="caption">
                <a href={`mailto:${n && n.email}`} target="_blank" rel="noopener noreferrer" className={classes.downloadInvoice}>
                  <Email />
                  &nbsp;
                  {n && n.email}
                </a>
                &nbsp;
              </Typography>
            </div>
          </div>
        )
      },
    },
    {
      name: 'Communities Serviced',
      key: 'communities',
      options: {
        filter: true,
        filterType: 'textField'
      }
    },
    {
      name: 'Service Area',
      key: 'service_area',
      options: {
        filter: true,
      }
    },
    {
      name: 'Edit? Copy?',
      key: 'edit_or_copy',
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
                const copiedVendorResponse = await apiCall('/vendors.copy', { vendor_id: id });
                if (copiedVendorResponse && copiedVendorResponse.success) {
                  const newVendor = copiedVendorResponse && copiedVendorResponse.data;
                  window.location.href = `/admin/edit/${newVendor.id}/vendor`;
                }
              }}
              to="/admin/read/vendors"
            >
              <FileCopy size="small" variant="outlined" color="secondary" />
            </Link>
          </div>
        )
      }
    },
  ]

  render() {
    const title = brand.name + ' - All Vendors';
    const description = brand.desc;
    const { columns, loading } = this.state;
    const { classes } = this.props;
    const data = this.fashionData(this.props.allVendors);

    const options = {
      filterType: 'dropdown',
      responsive: 'stacked',
      print: true,
      rowsPerPage: 10,
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        idsToDelete.forEach(d => {
          const vendorId = data[d.index][0];
          apiCall('/vendors.delete', { vendor_id: vendorId });
        });
      }
    };


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
    auth: state.getIn(['auth']),
    allVendors: state.getIn(['allVendors']),
    community: state.getIn(['selected_community'])
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    callVendorsForSuperAdmin: reduxGetAllVendors,
    callVendorsForNormalAdmin: reduxGetAllCommunityVendors
  }, dispatch);
}
const VendorsMapped = connect(mapStateToProps, mapDispatchToProps)(AllVendors);

export default withStyles(styles)(VendorsMapped);
