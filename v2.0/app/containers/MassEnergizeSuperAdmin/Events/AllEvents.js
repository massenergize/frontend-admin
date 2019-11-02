import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';

import MUIDataTable from 'mui-datatables';
import FileCopy from '@material-ui/icons/FileCopy';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';

import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import { apiCall } from '../../../utils/messenger';
import styles from '../../../components/Widget/widget-jss';
import {connect} from 'react-redux'; 
import {bindActionCreators} from 'redux';
import { reduxGetAllActions, reduxGetAllEvents, reduxGetAllCommunityEvents } from '../../../redux/redux-actions/adminActions';
import CommunitySwitch from './../Summary/CommunitySwitch'; 

class AllEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], loading: true, columns: this.getColumns() };
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
    this.props.callForNormalEvents(id);
  }
  async componentDidMount() {
    const user = this.props.auth ? this.props.auth: {};
    
    if(user.is_super_admin){
      this.props.callForSuperAdminEvents();
    }
    if(user.is_community_admin){
      this.props.callForNormalAdminEvents(user.communities[0].id);

    }
   // await this.setStateAsync({ loading: false });
    //await this.setStateAsync({ data, loading: false });
    // const allEventsResponse = this.props.allEvents;
    // if (allEventsResponse) {
    //   const data = allEventsResponse.map(d => (
    //     [
    //       {
    //         id: d.id,
    //         image: d.image,
    //         initials: `${d.name && d.name.substring(0, 2).toUpperCase()}`
    //       },
    //       `${d.name}...`.substring(0, 30), // limit to first 30 chars
    //       `${d.description}...`.substring(0, 20), // limit to first 20 chars
    //       `${d.tags.map(t => t.name).join(', ')}`,
    //       d.community && d.community.name,
    //       d.id
    //     ]
    //   ));
    //   await this.setStateAsync({ data, loading: false });
    // }
   
  }
  fashionData = (data)=>{
    const fashioned =data.map(d => (
      [
        {
          id: d.id,
          image: d.image,
          initials: `${d.name && d.name.substring(0, 2).toUpperCase()}`
        },
        `${d.name}...`.substring(0, 30), // limit to first 30 chars
        `${d.description}...`.substring(0, 20), // limit to first 20 chars
        `${d.tags.map(t => t.name).join(', ')}`,
        d.community && d.community.name,
        d.id
      ]
    ));
    return fashioned
  }

  // setStateAsync(state) {
  //   return new Promise((resolve) => {
  //     this.setState(state, resolve);
  //   });
  // }

  // getLocation = location => {
  //   if (location) {
  //     const {
  //       address1, address2, state, zip, country
  //     } = location;
  //     return `${address1 ? address1 + ',' : ''} 
  //       ${address2 ? address2 + ', ' : ''} 
  //       ${state ? state + ', ' : ''} 
  //       ${zip || ''}
  //       ${country || ''}`;
  //   }
  //   return '';
  // };

  // getStatus = isApproved => {
  //   switch (isApproved) {
  //     case false: return messageStyles.bgError;
  //     case true: return messageStyles.bgSuccess;
  //     default: return messageStyles.bgSuccess;
  //   }
  // };


  // renderTable = (data, classes) => (
  //   <PapperBlock noMargin title="All Events" icon="ios-share-outline" whiteBg desc="">
  //     <div className={classes.root}>
  //       <Table className={classNames(classes.tableLong, classes.stripped)} padding="dense">
  //         <TableHead>
  //           <TableRow>
  //             <TableCell padding="dense">Event Name</TableCell>
  //             <TableCell>Community</TableCell>
  //             <TableCell>Date</TableCell>
  //             <TableCell>Is Archived</TableCell>
  //             <TableCell>Location</TableCell>
  //           </TableRow>
  //         </TableHead>
  //         <TableBody>
  //           {data.map(n => ([
  //             <TableRow key={n.id}>
  //               <TableCell padding="dense">
  //                 <div className={classes.flex}>
  //                   <Avatar alt={n.name} src={n.image ? n.image.url : imgApi[21]} className={classes.productPhoto} />
  //                   <div>
  //                     <Typography variant="caption">{n.id}</Typography>
  //                     <Typography variant="subtitle1">{n.name}</Typography>
  //                     <a href={`/admin/event/${n.id}/edit`} className={classes.downloadInvoice}>
  //                       <Edit />
  //                       &nbsp; Edit this Event
  //                     </a>
  //                   </div>
  //                 </div>
  //               </TableCell>
  //               <TableCell>
  //                 <div className={classes.flex}>
  //                   <Avatar alt={n.community && n.community.name} src={n.community.logo ? n.community.logo : imgApi[21]} className={classNames(classes.avatar, classes.sm)} />
  //                   <div>
  //                     <Typography>{n.community && n.community.name}</Typography>
  //                     <Typography variant="caption">
  //                       <a href={`http:${n.community.subdomain}.massenergize.org`} target="_blank" rel="noopener noreferrer" className={classes.downloadInvoice}>
  //                         <Language />
  //                         &nbsp;
  //                         Visit site
  //                       </a>
  //                       &nbsp;
  //                     </Typography>
  //                   </div>
  //                 </div>
  //               </TableCell>
  //               <TableCell align="left">
  //                 <Typography variant="caption">
  //                   { Date.parse(n.start_date_and_time) }
  //                 </Typography>
  //               </TableCell>
  //               <TableCell>
  //                 <Chip label={n.is_archived ? 'Yes' : 'No'} className={classNames(classes.chip, this.getStatus(n.is_archived))} />
  //               </TableCell>
  //               <TableCell>
  //                 <div className={classes.taskStatus}>
  //                   <Icon className={classes.taskIcon}>{n.is_geographically_focused ? 'location_on' : 'blur_on'}</Icon>
  //                   <Typography variant="caption">
  //                     {this.getLocation(n.location)}
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
      name: 'Event',
      key: 'event',
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
      name: 'About',
      key: 'about',
      options: {
        filter: false,
      }
    },
    {
      name: 'Tags',
      key: 'tags',
      options: {
        filter: true,
      }
    },
    {
      name: 'Community',
      key: 'community',
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
            <Link to={`/admin/edit/${id}/event`}>
              <EditIcon size="small" variant="outlined" color="secondary" />
            </Link>
            &nbsp;&nbsp;
            <Link
              onClick={async () => {
                const copiedEventResponse = await apiCall('/events.copy', { event_id: id });
                if (copiedEventResponse && copiedEventResponse.success) {
                  const newEvent = copiedEventResponse && copiedEventResponse.data;
                  window.location.href = `/admin/edit/${newEvent.id}/event`;
                }
              }}
              to="/admin/read/events"
            >
              <FileCopy size="small" variant="outlined" color="secondary" />
            </Link>
          </div>
        )
      }
    },
  ]


  render() {
    const title = brand.name + ' - All Events';
    const description = brand.desc;
    const { columns, loading } = this.state;
    const { classes } = this.props;
    const data = this.fashionData(this.props.allEvents);
    console.log("I AM THE DATA IN EVENTS", this.props.allEvents);
    const options = {
      filterType: 'dropdown',
      responsive: 'stacked',
      print: true,
      rowsPerPage: 10,
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        idsToDelete.forEach(d => {
          const eventId = data[d.index][0].id;
          apiCall('/events.delete', { event_id: eventId });
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
    //             <h1>Fetching all Events.  This may take a while...</h1>
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
            title="All Events"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    );
  }
}

AllEvents.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state){
  return{
    auth: state.getIn(['auth']), 
    allEvents: state.getIn(['allEvents'])
  }
}
function mapDispatchToProps(dispatch){
  return bindActionCreators({
    callForSuperAdminEvents: reduxGetAllEvents, 
    callForNormalAdminEvents: reduxGetAllCommunityEvents

  },dispatch)
}

const EventsMapped =  connect (mapStateToProps,mapDispatchToProps)(AllEvents);
export default withStyles(styles)(EventsMapped);
