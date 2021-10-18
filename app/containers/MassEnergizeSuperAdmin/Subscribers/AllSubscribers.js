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
import CommunitySwitch from '../Summary/CommunitySwitch';


class AllSubscribers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], dataFiltered: [], loading: true, columns: this.getColumns(props.classes) 
    };
  }

  async componentDidMount() {
    const user = this.props.auth ? this.props.auth : {};
    let allSubscribersResponse = null;
    if (user.is_super_admin) {
      allSubscribersResponse = await apiCall('/subscribers.listForCommunityAdmin');
    } else if (user.is_community_admin) {
      allSubscribersResponse = await apiCall('/subscribers.listForCommunityAdmin', { community_id: null });
    }

    if (allSubscribersResponse && allSubscribersResponse.data) {
      const { data } = allSubscribersResponse;
      await this.setStateAsync({ data, dataFiltered: data });
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
    return <div />;
  }

  handleCommunityChange = async (id) => {
    const { data } = this.state;
    if (!id) {
      await this.setStateAsync({ dataFiltered: data });
      return;
    }
    const filteredData = (data || []) && data.filter(d => d.community && d.community.id === id);
    console.log(data, filteredData, id);
    await this.setStateAsync({ dataFiltered: filteredData });
  }


  fashionData = (data) => data.map(d => (
    [
      d.id,
      d.name,
      d.email,
      d.community && d.community.name,
    ]
  ))


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
        filter: false,
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
      name: 'Email',
      key: 'email',
      options: {
        filter: false,
      }
    },
    {
      name: 'Community',
      key: 'community',
      options: {
        filter: true,
      }
    },
  ]

  render() {
    const title = brand.name + ' - All Subscribers';
    const description = brand.desc;
    const { columns, dataFiltered } = this.state;
    const { classes } = this.props;
    const data = this.fashionData(dataFiltered);

    const options = {
      filterType: 'dropdown',
      responsive: 'stacked',
      print: true,
      rowsPerPage: 100,
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        idsToDelete.forEach(async d => {
          const subscriberId = dataFiltered[d.index].id;
          await apiCall('/subscribers.delete', { subscriber_id: subscriberId });
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
            title="All Subscribers"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    );
  }
}

AllSubscribers.propTypes = {
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
  }, dispatch);
}
const VendorsMapped = connect(mapStateToProps, mapDispatchToProps)(AllSubscribers);

export default withStyles(styles)(VendorsMapped);
