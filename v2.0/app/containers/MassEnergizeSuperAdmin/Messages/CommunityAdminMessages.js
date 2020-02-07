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
import DetailsIcon from '@material-ui/icons/Details';
import messageStyles from 'dan-styles/Messages.scss';
import { connect } from 'react-redux';
import { apiCall } from '../../../utils/messenger';
import styles from '../../../components/Widget/widget-jss';
import { reduxGetAllVendors, reduxGetAllCommunityVendors } from '../../../redux/redux-actions/adminActions';
import CommunitySwitch from '../Summary/CommunitySwitch';
class AllCommunityAdminMessages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      columns: this.getColumns(props.classes)
    };
  }

  async componentDidMount() {
    const allMessagesResponse = await apiCall('/messages.listForCommunityAdmin');
    if (allMessagesResponse && allMessagesResponse.success) {
      await this.setStateAsync({
        loading: false,
        data: this.fashionData(allMessagesResponse.data)
      });
    }
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


  fashionData = (data) => {
    return data.map(d => (
      [
        d.id,
        d.title,
        d.user_name,
        d.email,
        d.community && d.community.name,
        d.have_replied ? 'Yes' : 'No',
        d.id
      ]
    ));
  }


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
      name: 'Title',
      key: 'title',
      options: {
        filter: true,
      }
    },
    {
      name: 'User Name',
      key: 'user_name',
      options: {
        filter: true,
        filterType: 'textField'
      }
    },
    {
      name: 'Email',
      key: 'email',
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
        filterType: 'multiselect'
      }
    },
    {
      name: 'Replied?',
      key: 'replied?',
      options: {
        filter: true,
      }
    },
    {
      name: 'See Details',
      key: 'edit_or_copy',
      options: {
        filter: false,
        download: false,
        customBodyRender: (id) => (
          <div>
            <Link to={`/admin/edit/${id}/message`}>
              <DetailsIcon size="small" variant="outlined" color="secondary" />
            </Link>
          </div>
        )
      }
    },
  ]

  render() {
    const title = brand.name + ' - Community Admin Messages';
    const description = brand.desc;
    const { columns, data } = this.state;
    const { classes } = this.props;

    const options = {
      filterType: 'dropdown',
      responsive: 'stacked',
      print: true,
      rowsPerPage: 10,
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        idsToDelete.forEach(d => {
          const messageId = data[d.dataIndex][0];
          apiCall('/messages.delete', { message_id: messageId });
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
            title="All Community Admin Messages"
            data={data}
            columns={columns}
            options={options}
          />
        </div>

      </div>
    );
  }
}

AllCommunityAdminMessages.propTypes = {
  classes: PropTypes.object.isRequired,
};
function mapStateToProps(state) {
  return {
    auth: state.getIn(['auth']),
    community: state.getIn(['selected_community'])
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch);
}
const VendorsMapped = connect(mapStateToProps, mapDispatchToProps)(AllCommunityAdminMessages);

export default withStyles(styles)(VendorsMapped);
