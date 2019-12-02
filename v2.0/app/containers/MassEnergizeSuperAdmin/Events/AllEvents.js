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
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { apiCall } from '../../../utils/messenger';
import styles from '../../../components/Widget/widget-jss';
import { reduxGetAllEvents, reduxGetAllCommunityEvents } from '../../../redux/redux-actions/adminActions';
import CommunitySwitch from '../Summary/CommunitySwitch';

class AllEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], loading: true, columns: this.getColumns() };
  }

  async componentDidMount() {
    const user = this.props.auth ? this.props.auth : {};
    const community = this.props.community ? this.props.community :{};
    if (user.is_super_admin) {
      this.props.callForSuperAdminEvents();
    }
    if (user.is_community_admin) {
      let com = community || user.admin_at[0];
      this.props.callForNormalAdminEvents(com.id);
    }
    await this.setStateAsync({ loading: false });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
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
    this.props.callForNormalAdminEvents(id);
  }

  fashionData = (data) => {
    const fashioned = data.map(d => (
      [
        {
          id: d.id,
          image: d.image,
          initials: `${d.name && d.name.substring(0, 2).toUpperCase()}`
        },
        `${d.name}...`.substring(0, 30), // limit to first 30 chars
        d.rank,
        `${d.description}...`.substring(0, 20), // limit to first 20 chars
        `${d.tags.map(t => t.name).join(', ')}`,
        (d.is_global ? 'Global' : (d.community && d.community.name)),
        d.id
      ]
    ));
    return fashioned;
  }


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
      name: 'Rank',
      key: 'rank',
      options: {
        filter: true,
      }
    },
    {
      name: 'About',
      key: 'about',
      options: {
        filter: false,
        customBodyRender: (d) => (
          <div dangerouslySetInnerHTML={{ __html: d }} />
        )
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
      name: 'Edit?',
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

    if (loading) {
      return (
        <Grid container spacing={24} alignItems="flex-start" direction="row" justify="center">
          <Grid item xs={12} md={6}>
            <Paper className={classes.root}>
              <div className={classes.root}>
                <LinearProgress />
                <h1>Fetching all Events.  This may take a while...</h1>
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

function mapStateToProps(state) {
  return {
    auth: state.getIn(['auth']),
    allEvents: state.getIn(['allEvents']),
    community: state.getIn(['selected_community'])
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    callForSuperAdminEvents: reduxGetAllEvents,
    callForNormalAdminEvents: reduxGetAllCommunityEvents

  }, dispatch);
}

const EventsMapped = connect(mapStateToProps, mapDispatchToProps)(AllEvents);
export default withStyles(styles)(EventsMapped);
