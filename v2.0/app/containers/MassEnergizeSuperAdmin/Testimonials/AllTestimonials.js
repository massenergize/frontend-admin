import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { PapperBlock } from 'dan-components';
import imgApi from 'dan-api/images/photos';

import MUIDataTable from 'mui-datatables';
// import FileCopy from '@material-ui/icons/FileCopy';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';

import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';

import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';
// import Avatar from '@material-ui/core/Avatar';
// import Icon from '@material-ui/core/Icon';
import messageStyles from 'dan-styles/Messages.scss';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { apiCall } from '../../../utils/messenger';
import styles from '../../../components/Widget/widget-jss';
import { reduxGetAllCommunityTestimonials, reduxGetAllTestimonials } from '../../../redux/redux-actions/adminActions';
import CommunitySwitch from '../Summary/CommunitySwitch';
class AllTestimonials extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: this.getColumns(),
      data: [],
      loading: true
    };
  }

  async componentDidMount() {
    const user = this.props.auth ? this.props.auth : {};
    if (user.is_super_admin) {
      await this.props.callTestimonialsForSuperAdmin();
    }
    if (user.is_community_admin) {
      const com = this.props.community ? this.props.community : user.admin_at[0];
      await this.props.callTestimonialsForNormalAdmin(com.id);
    }
    // const allTestimonialsResponse = await apiCall('/testimonials.listForSuperAdmin');

    // if (allTestimonialsResponse && allTestimonialsResponse.success) {
    //   const data = allTestimonialsResponse.data.map(d => (
    //     [
    //       {
    //         id: d.id,
    //         image: d.image,
    //         initials: `${d.title && d.title.substring(0, 2).toUpperCase()}`
    //       },
    //       `${d.title}...`.substring(0, 30), // limit to first 30 chars
    //       `${d.body}...`.substring(0, 30), // limit to first 30 chars
    //       `${d.user ? d.user.full_name : ''}...`.substring(0, 20), // limit to first 20 chars
    //       `${d.action ? d.action.title : ''} ${d.action && d.action.community ? ` -  (${d.action.community.name})` : ''}`,
    //       `${d.is_published && d.is_approved ? 'Live' : 'Not Live'}`,
    //       d.id
    //     ]
    //   ));
    //   await this.setStateAsync({ data, loading: false });
    // // await this.setStateAsync({ communities: response.data });
    // }
  }

  showCommunitySwitch = () => {
    const user = this.props.auth ? this.props.auth : {};
    if (user.is_community_admin) {
      return (
        <CommunitySwitch actionToPerform={this.handleCommunityChange} />
      );
    }
  }

  handleCommunityChange =(id) => {
    this.props.callTestimonialsForNormalAdmin(id);
  }

  fashionData = (data) => {
    data = data.map(d => (
      [
        {
          id: d.id,
          image: d.image,
          initials: `${d.title && d.title.substring(0, 2).toUpperCase()}`
        },
        `${d.title}...`.substring(0, 30), // limit to first 30 chars
        d.rank,
        (d.community && d.community.name),
        `${d.user ? d.user.full_name : ''}...`.substring(0, 20), // limit to first 20 chars
        `${d.action ? d.action.title : ''} ${d.action && d.action.community ? ` -  (${d.action.community.name})` : ''}...`.substring(0, 20),
        `${d.is_published && d.is_approved ? 'Live' : 'Not Live'}`,
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
      name: 'Title',
      key: 'title',
      options: {
        filter: true,
      }
    },
    {
      name: 'Rank',
      key: 'rank',
      options: {
        filter: false,
      }
    },
    {
      name: 'Community',
      key: 'community',
      options: {
        filter: false,
      }
    },
    {
      name: 'User',
      key: 'user',
      options: {
        filter: true,
      }
    },
    {
      name: 'Action',
      key: 'action',
      options: {
        filter: true,
      }
    },
    {
      name: 'Is it Live? (Published & Approved',
      key: 'is_published',
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
            <Link to={`/admin/edit/${id}/testimonial`}>
              <EditIcon size="small" variant="outlined" color="secondary" />
            </Link>
            &nbsp;&nbsp;
            {/* <Link
              onClick={async () => {
                const copiedActionResponse = await apiCall('/actions.copy', { action_id: id });
                if (copiedActionResponse && copiedActionResponse.success) {
                  const newAction = copiedActionResponse && copiedActionResponse.data;
                  window.location.href = `/admin/edit/${newAction.id}/action`;
                }
              }}
              to="/admin/read/actions"
            >
              <FileCopy size="small" variant="outlined" color="secondary" />
            </Link> */}
          </div>
        )
      }
    },
  ]


  renderTable = (data, classes) => (
    <PapperBlock noMargin title="All Testimonials" icon="ios-share-outline" whiteBg desc="">
      <div className={classes.root}>
        <Table className={classNames(classes.tableLong, classes.stripped)} padding="dense">
          <TableHead>
            <TableRow>
              <TableCell padding="dense">Title</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Is Approved</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(n => ([
              <TableRow key={n.id}>
                <TableCell padding="dense">
                  <div className={classes.flex}>
                    <Avatar alt={n.user.full_name} src={n.user.profile_picture ? n.user.profile_picture.url : imgApi[21]} className={classes.productPhoto} />
                    <div>
                      <Typography variant="caption">{n.id}</Typography>
                      <Typography variant="subtitle1">{n.title}</Typography>
                    </div>
                  </div>
                </TableCell>
                <TableCell padding="dense">
                  <div className={classes.flex}>
                    <div>
                      <Typography variant="subtitle1">{n.user.full_name}</Typography>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={classes.flex}>
                    <Avatar alt={n.action.image ? n.action.image.url : imgApi[21]} src={n.avatar} className={classNames(classes.avatar, classes.sm)} />
                    <div>
                      <Typography>{n.action.title}</Typography>
                    </div>
                  </div>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="caption">
                    {n.vendor ? n.vendor.name : 'None'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={n.is_approved ? 'Approved' : 'Not Approved'} className={classNames(classes.chip, this.getStatus(n.is_approved))} />
                </TableCell>
              </TableRow>
            ]))}
          </TableBody>
        </Table>
      </div>
    </PapperBlock>
  )

  render() {
    const title = brand.name + ' - All Testimonials';
    const description = brand.desc;
    const { columns, loading } = this.state;
    const { classes } = this.props;
    const data = this.fashionData(this.props.allTestimonials);
    const options = {
      filterType: 'dropdown',
      responsive: 'stacked',
      print: true,
      rowsPerPage: 10,
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        idsToDelete.forEach(d => {
          const testimonialId = data[d.index][0].id;
          apiCall('/testimonials.delete', { testimonial_id: testimonialId });
        });
      }
    };

    // if (loading) {
    //   return (
    //     <Grid container spacing={24} alignItems="flex-start" direction="row" justify="center">
    //       <Grid item xs={12} md={6}>
    //         <Paper className={classes.root}>
    //           <div className={classes.root} style={{padding:30}}>
    //             <h2>Will be deployed soon!</h2>
    //             {/* <LinearProgress />
    //             <h1>Fetching all Testimonials.  This may take a while...</h1>
    //             <br />
    //             <LinearProgress color="secondary" /> */}
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
            title="All Testimonials"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    );
  }
}

AllTestimonials.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    auth: state.getIn(['auth']),
    allTestimonials: state.getIn(['allTestimonials']),
    community: state.getIn(['selected_community'])
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    callTestimonialsForSuperAdmin: reduxGetAllTestimonials,
    callTestimonialsForNormalAdmin: reduxGetAllCommunityTestimonials
  }, dispatch);
}
const TestimonialsMapped = connect(mapStateToProps, mapDispatchToProps)(AllTestimonials);

export default withStyles(styles)(TestimonialsMapped);
