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

import { connect } from 'react-redux';
import { apiCall } from '../../../utils/messenger';
import styles from '../../../components/Widget/widget-jss';
import LinearBuffer from '../../../components/Massenergize/LinearBuffer';
//import { bindActionCreators } from 'redux';
import { loadAllEvents } from '../../../redux/redux-actions/adminActions';
//import CommunitySwitch from '../Summary/CommunitySwitch';

class AllEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      loading: true,
      allItems: [],
      communityFilterList: [],
      data: [],  
      error: null,
    };
  }

  async componentDidMount() {
    // flag to return actions from all communities
    const itemsListUrl = '/events.listForCommunityAdmin';
    const allItemsResponse = await apiCall(itemsListUrl, {'community_id': 0});
    if (allItemsResponse && allItemsResponse.success) {
      const user = this.props.auth;
      const communityFilterList = [];
      const community = this.props.community;
      if (community) {
        communityFilterList.push(community.name)
      }
      else if (user && user.admin_at) {
        user.admin_at.forEach((comm) => communityFilterList.push(comm.name));
      }
      communityFilterList.push("Template")

      loadAllEvents(allItemsResponse.data);
      await this.setStateAsync({
        loading: false,
        error: null,
        allItems: allItemsResponse.data,
        data: this.fashionData(allItemsResponse.data),
        communityFilterList,
      });
    } else if (allItemsResponse && !allItemssResponse.success) {
      await this.setStateAsync({
        loading: false,
        error: allItemsResponse.error,
      });
    }
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  changeItems = async (id) => {
    const { allItems } = this.state;
    const newData = allItems.filter(
      (a) => (a.community && a.community.id === id) || a.is_global
    );
    await this.setStateAsync({ data: this.fashionData(newData) });
  };

  fashionData = (data) => {
    const fashioned = data.map(d => (
      [
        d.id,
        {
          id: d.id,
          image: d.image,
          initials: `${d.name && d.name.substring(0, 2).toUpperCase()}`
        },
        `${d.name}...`.substring(0, 30), // limit to first 30 chars
        d.rank,
        `${d.tags.map(t => t.name).join(', ')}`,
        (d.is_global ? 'Template' : (d.community && d.community.name)),
        d.is_published ? 'Yes' : 'No',
        d.id
      ]
    ));
    return fashioned;
  }


  getColumns = () => [
    {
      name: 'ID',
      key: 'id',
      options: {
        filter: false,
        filterType: 'textField'
      }
    },
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
        filter: false,
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
      name: 'Tags',
      key: 'tags',
      options: {
        filter: true,
        filterType: 'textField'
      }
    },
    {
      name: 'Community',
      key: 'community',
      options: {
        filter: true,
        filterList: this.state.communityFilterList,
        filterType: 'multiselect'
      }
    },
    {
      name: 'Is Live',
      key: 'is_live',
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
            <Link to={`/admin/edit/${id}/event`} target="_blank">
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
    const { classes } = this.props;
    const { loading, data, error } = this.state;

    if (loading) {
      return <LinearBuffer />;
    }
    if (error) {
      return (
        <div>
          <h2>Error</h2>
        </div>
      );
    }

    const columns = this.getColumns();
    const options = {
      filterType: 'dropdown',
      responsive: 'stacked',
      print: true,
      rowsPerPage: 100,
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        idsToDelete.forEach(d => {
          const eventId = data[d.dataIndex][0];
          apiCall('/events.delete', { event_id: eventId });
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
          {/* {this.showCommunitySwitch()} */}
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
    allItems: state.getIn(['allEvents']),
    community: state.getIn(['selected_community'])
  };
}
//function mapDispatchToProps(dispatch) {
//  return bindActionCreators({
//    callForSuperAdminEvents: reduxGetAllEvents,
//    callForNormalAdminEvents: reduxGetAllCommunityEvents
//
//  }, dispatch);
//}

const EventsMapped = connect(
  mapStateToProps, 
  //mapDispatchToProps
)(AllEvents);
export default withStyles(styles)(EventsMapped);
