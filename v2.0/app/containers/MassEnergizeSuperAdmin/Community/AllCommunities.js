import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';

import MUIDataTable from 'mui-datatables';
import CallMadeIcon from '@material-ui/icons/CallMade';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';

// import { PapperBlock } from 'dan-components';
// import imgApi from 'dan-api/images/photos';
// import classNames from 'classnames';
// import Typography from '@material-ui/core/Typography';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import Chip from '@material-ui/core/Chip';
// import Avatar from '@material-ui/core/Avatar';
// import Icon from '@material-ui/core/Icon';
// import Edit from '@material-ui/icons/Edit';
// import Language from '@material-ui/icons/Language';
// import Email from '@material-ui/icons/Email';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
// import messageStyles from 'dan-styles/Messages.scss';
import { apiCall } from '../../../utils/messenger';
import styles from '../../../components/Widget/widget-jss';


class AllCommunities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: this.getColumns(),
      data: [],
      loading: true
    };
  }

  async componentDidMount() {
    const allCommunitiesResponse = await apiCall('/communities.listForSuperAdmin');

    if (allCommunitiesResponse && allCommunitiesResponse.success) {
      const data = allCommunitiesResponse.data.map(d => (
        [
          {
            id: d.id,
            image: d.logo,
            initials: `${d.name && d.name.substring(0, 2).toUpperCase()}`
          },
          `${d.name}...`.substring(0, 30), // limit to first 30 chars
          `${d.owner_name}(${d.owner_email})...`.substring(0, 20), // limit to first 20 chars
          `${d.is_approved ? 'Verified' : 'Not Verified'}`,
          `${d.is_published && d.is_approved ? 'Live' : 'Not Live'}`,
          `${d.is_geographically_focused ? 'Geographically Focused' : 'Geographically Dispersed'}`,
          d.id
        ]
      ));
      await this.setStateAsync({ data, loading: false });
    // await this.setStateAsync({ communities: response.data });
    }
    else{
      console.log("THERE IS NOTHING HERE MR");
    }
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  // getStatus = isApproved => {
  //   switch (isApproved) {
  //     case false: return messageStyles.bgError;
  //     case true: return messageStyles.bgSuccess;
  //     default: return messageStyles.bgSuccess;
  //   }
  // };


  // renderTable = (data, classes) => (
  //   <PapperBlock noMargin title="All Communities" icon="ios-share-outline" whiteBg desc="">
  //     <div className={classes.root}>
  //       <Table className={classNames(classes.tableLong, classes.stripped)} padding="dense">
  //         <TableHead>
  //           <TableRow>
  //             <TableCell padding="dense">Community Name</TableCell>
  //             <TableCell>Admin</TableCell>
  //             <TableCell>Subdomain</TableCell>
  //             <TableCell>Status</TableCell>
  //             <TableCell>Is Dispersed?</TableCell>
  //           </TableRow>
  //         </TableHead>
  //         <TableBody>
  //           {data.map(n => ([
  //             <TableRow key={n.id}>
  //               <TableCell padding="dense">
  //                 <div className={classes.flex}>
  //                   <a href={`/admin/community/${n.id}/profile`} className={classes.downloadInvoice}>
  //                     <Avatar alt={n.name} src={n.logo ? n.logo.url : imgApi[21]} className={classes.productPhoto} />
  //                   </a>
  //                   <div>
  //                     <Typography variant="caption">{n.id}</Typography>
  //                     <Typography variant="subtitle1">
  //                       <a href={`/admin/community/${n.id}/profile`} className={classes.downloadInvoice}>
  //                         {n.name}
  //                       </a>
  //                     </Typography>
  //                     <a href={`/admin/community/${n.id}/edit`} className={classes.downloadInvoice}>
  //                       <Edit />
  //                       &nbsp; Edit this Community
  //                     </a>
  //                   </div>
  //                 </div>
  //               </TableCell>
  //               <TableCell>
  //                 <div className={classes.flex}>
  //                   {/* <Avatar alt={n.owner_name} src={n.avatar} className={classNames(classes.avatar, classes.sm)} /> */}
  //                   <div>
  //                     <Typography>{n.owner_name}</Typography>
  //                     <Typography variant="caption">
  //                       <a href={`mailto:${n.owner_email}`} target="_blank" rel="noopener noreferrer" className={classes.downloadInvoice}>
  //                         <Email />
  //                         &nbsp;
  //                         {n.owner_email}
  //                       </a>
  //                       &nbsp;
  //                     </Typography>
  //                   </div>
  //                 </div>
  //               </TableCell>
  //               <TableCell align="left">
  //                 <Typography variant="caption">
  //                   { n.subdomain }
  //                   <br />
  //                   <a href={`http://${n.subdomain}.massenergize.org`} target="_blank" rel="noopener noreferrer" className={classes.downloadInvoice}>
  //                     <Language />
  //                     &nbsp;Visit Site
  //                   </a>
  //                 </Typography>
  //               </TableCell>
  //               <TableCell>
  //                 <Chip label={n.is_approved ? 'Verified' : 'Not Verified'} className={classNames(classes.chip, this.getStatus(n.is_approved))} />
  //               </TableCell>
  //               <TableCell>
  //                 <div className={classes.taskStatus}>
  //                   <Icon className={classes.taskIcon}>{n.is_geographically_focused ? 'location_on' : 'blur_on'}</Icon>
  //                   <Typography variant="caption">
  //                     {n.is_geographically_focused ? 'Geographically Focused' : 'Geographically Dispersed'}
  //                   </Typography>
  //                 </div>
  //               </TableCell>
  //             </TableRow>
  //           ]))}
  //         </TableBody>
  //       </Table>
  //     </div>
  //   </PapperBlock>
  // )

  getColumns = () => [
    {
      name: 'id',
      key: 'id',
      options: {
        filter: false,
        download: false,
        customBodyRender: (d) => (
          <div>
            {d.image
              && <Link to={`/admin/community/${d.id}/profile`}><Avatar alt={d.initials} src={d.image.url} style={{ margin: 10 }} /></Link>
            }
            {!d.image
              && <Link to={`/admin/community/${d.id}/profile`}><Avatar style={{ margin: 10 }}>{d.initials}</Avatar></Link>
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
      name: 'Admin Name & Email',
      key: 'admin_name_and_email',
      options: {
        filter: false,
      }
    },
    {
      name: 'Verification',
      key: 'verification',
      options: {
        filter: true,
      }
    },
    {
      name: 'Is it Live? (Published & Approved)',
      key: 'is_published',
      options: {
        filter: true,
      }
    },
    {
      name: 'Geography',
      key: 'is_published',
      options: {
        filter: true,
      }
    },
    {
      name: 'Edit? Profile?',
      key: 'edit_or_copy',
      options: {
        filter: false,
        download: false,
        customBodyRender: (id) => (
          <div>
            <Link to={`/admin/community/${id}/edit`}>
              <EditIcon size="small" variant="outlined" color="secondary" />
            </Link>
            <Link to={`/admin/community/${id}/profile`}>
              <CallMadeIcon size="small" variant="outlined" color="secondary" />
            </Link>
            &nbsp;&nbsp;
          </div>
        )
      }
    },
  ]


  render() {
    const title = brand.name + ' - All Communities';
    const description = brand.desc;
    const { data, columns, loading } = this.state;
    const { classes } = this.props;

    const options = {
      filterType: 'dropdown',
      responsive: 'stacked',
      print: true,
      rowsPerPage: 10,
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        idsToDelete.forEach(d => {
          const communityId = data[d.index][0].id;
          apiCall('/communities.delete', { community_id: communityId });
        });
      }
    };

    if (loading) {
      return (
        <Grid container spacing={24} alignItems="flex-start" direction="row" justify="center">
          <Grid item xs={12} md={6}>
            <Paper className={classes.root}>
              <div className={classes.root}>
                <LinearProgress />
                <h1>Fetching all Communities.  This may take a while...</h1>
                <br />
                <LinearProgress color="secondary" />
              </div>
            </Paper>
          </Grid>
        </Grid>
      );
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
        {/* {this.renderTable(communities, classes)} */}

        <div className={classes.table}>
          <MUIDataTable
            title="All Communities"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    );
  }
}

AllCommunities.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AllCommunities);
