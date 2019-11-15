import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
// import { PapperBlock } from 'dan-components';
// import imgApi from 'dan-api/images/photos';
// import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';


import MUIDataTable from 'mui-datatables';
import FileCopy from '@material-ui/icons/FileCopy';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';

// import Icon from '@material-ui/core/Icon';
// import Edit from '@material-ui/icons/Edit';
// import Language from '@material-ui/icons/Language';
import Email from '@material-ui/icons/Email';
import messageStyles from 'dan-styles/Messages.scss';
import { apiCall } from '../../../utils/messenger';
import styles from '../../../components/Widget/widget-jss';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxGetAllVendors, reduxGetAllCommunityVendors } from '../../../redux/redux-actions/adminActions';
import CommunitySwitch from './../Summary/CommunitySwitch'; 
class AllVendors extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], loading: true, columns: this.getColumns(props.classes) };
  }

  showCommunitySwitch = ()=>{
    const user= this.props.auth? this.props.auth: {}; 
    if(user.is_community_admin){
      return(
        <CommunitySwitch actionToPerform={this.handleCommunityChange}/>
      )
    }
  }
  handleCommunityChange =(id)=>{
    this.props.callVendorsForNormalAdmin(id);
  }
  async componentDidMount() {
    const user = this.props.auth ? this.props.auth : {}
    if (user.is_super_admin) {
      this.props.callVendorsForSuperAdmin();
    }
    if (user.is_community_admin) {
      var com = this.props.community ? this.props.community : user.admin_at[0]
      this.props.callVendorsForNormalAdmin(com.id)
    }
    // const allVendorsResponse = await apiCall('/vendors.listForSuperAdmin');
    // if (allVendorsResponse && allVendorsResponse.success) {
    //   const data = allVendorsResponse.data.map(d => (
    //     [
    //       {
    //         id: d.id,
    //         image: d.logo,
    //         initials: `${d.name && d.name.substring(0, 2).toUpperCase()}`
    //       },
    //       `${d.name}...`.substring(0, 30), // limit to first 30 chars
    //       d.key_contact, // limit to first 20 chars
    //       d.properties_serviced && d.properties_serviced.join(', '),
    //       d.service_area,
    //       d.communities && d.communities.slice(0, 5).map(c => c.name).join(', '),
    //       d.id
    //     ]
    //   ));
    //   await this.setStateAsync({ data, loading: false });
    // }
  }

  fashionData = (data) => {
    data = data.map(d => (
      [
        {
          id: d.id,
          image: d.logo,
          initials: `${d.name && d.name.substring(0, 2).toUpperCase()}`
        },
        `${d.name}...`.substring(0, 30), // limit to first 30 chars
        d.key_contact, // limit to first 20 chars
        d.properties_serviced && d.properties_serviced.join(', '),
        d.service_area,
        d.communities && d.communities.slice(0, 5).map(c => c.name).join(', '),
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


  // renderTable = (data, classes) => (
  //   <PapperBlock noMargin title="All Vendors" icon="ios-share-outline" whiteBg desc="">
  //     <div className={classes.root}>
  //       <Table className={classNames(classes.tableLong, classes.stripped)} padding="dense">
  //         <TableHead>
  //           <TableRow>
  //             <TableCell padding="dense">Vendor Name</TableCell>
  //             <TableCell>Key Contact</TableCell>
  //             <TableCell>Service Area</TableCell>
  //             <TableCell>Properties Serviced</TableCell>
  //           </TableRow>
  //         </TableHead>
  //         <TableBody>
  //           {data.map(n => ([
  //             <TableRow key={n.id}>
  //               <TableCell padding="dense">
  //                 <div className={classes.flex}>
  //                   <Avatar alt={n.name} src={n.logo ? n.logo.url : imgApi[21]} className={classes.productPhoto} />
  //                   <div>
  //                     <Typography variant="caption">{n.id}</Typography>
  //                     <Typography variant="subtitle1">{n.name}</Typography>
  //                     <a href={`/admin/vendor/${n.id}/edit`} className={classes.downloadInvoice}>
  //                       <Edit />
  //                       &nbsp; Edit this Vendor
  //                     </a>
  //                   </div>
  //                 </div>
  //               </TableCell>
  //               <TableCell>
  // <div className={classes.flex}>
  //   <Avatar alt={n.key_contact && n.key_contact.full_name} src={n.key_contact && n.key_contact.profile_picture ? n.key_contact.profile_picture.url : imgApi[21]} className={classNames(classes.avatar, classes.sm)} />
  //   <div>
  //     <Typography>{n.owner_name}</Typography>
  //     <Typography variant="caption">
  //       <a href={`mailto:${n.key_contact && n.key_contact.email}`} target="_blank" rel="noopener noreferrer" className={classes.downloadInvoice}>
  //         {n.key_contact && n.key_contact.full_name}
  //         <br />
  //         <Email />
  //         &nbsp;
  //         {n.key_contact && n.key_contact.email}
  //       </a>
  //       &nbsp;
  //     </Typography>
  //   </div>
  // </div>
  //               </TableCell>
  //               <TableCell align="left">
  //                 <Typography variant="caption">
  //                   { n.properties_serviced }
  //                 </Typography>
  //               </TableCell>
  //               <TableCell>
  //                 {/* <div className={classes.taskStatus}>
  //                   <Icon className={classes.taskIcon}>{n.is_geographically_focused ? 'location_on' : 'blur_on'}</Icon>
  //                   <Typography variant="caption">
  //                     {n.is_geographically_focused ? 'Geographically Focused' : 'Geographically Dispersed'}
  //                   </Typography>
  //                 </div> */}
  //               </TableCell>
  //             </TableRow>
  //           ]))}
  //         </TableBody>
  //       </Table>
  //     </div>
  //   </PapperBlock>
  // )


  getColumns = (classes) => [
    {
      name: 'Vendor',
      key: 'vendor_id',
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
      name: 'Properties Serviced',
      key: 'properties_serviced',
      options: {
        filter: false,
      }
    },
    {
      name: 'Communities Serviced',
      key: 'communities',
      options: {
        filter: false,
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
    const data = this.fashionData(this.props.allVendors)

    const options = {
      filterType: 'dropdown',
      responsive: 'stacked',
      print: true,
      rowsPerPage: 10,
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        idsToDelete.forEach(d => {
          const vendorId = data[d.index][0].id;
          apiCall('/vendors.delete', { vendor_id: vendorId });
        });
      }
    };


    // if (loading) {
    //   return (
    //     <Grid container spacing={24} alignItems="flex-start" direction="row" justify="center">
    //       <Grid item xs={12} md={6}>
    //         <Paper className={classes.root}>
    //           <div className={classes.root}>
    //             <LinearProgress />
    //             <h1>Fetching all Vendors.  This may take a while...</h1>
    //             <br />
    //             <LinearProgress color="secondary" />
    //           </div>
    //         </Paper>
    //       </Grid>
    //     </Grid>
    //   );
    // }


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
          {this.showCommunitySwitch()}
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
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    callVendorsForSuperAdmin: reduxGetAllVendors,
    callVendorsForNormalAdmin: reduxGetAllCommunityVendors
  }, dispatch);
}
const VendorsMapped = connect(mapStateToProps, mapDispatchToProps)(AllVendors);

export default withStyles(styles)(VendorsMapped);
