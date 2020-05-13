import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { bindActionCreators } from 'redux';
import MUIDataTable from 'mui-datatables';
import { connect } from 'react-redux';
import { apiCall } from '../../../utils/messenger';
import styles from '../../../components/Widget/widget-jss';

class AllUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      columns: this.getColumns(props.classes)
    };
  }

  async componentDidMount() {
    const allUsersResponse = await apiCall('/users.listForCommunityAdmin');
    if (allUsersResponse && allUsersResponse.success) {
      await this.setStateAsync({
        loading: false,
        data: this.fashionData(allUsersResponse.data)
      });
    }
  }


  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }


  fashionData = (data) => {
    return data.map(d => (
      [
        d.full_name,
        d.preferred_name,
        d.email,
        `${d.communities.join(', ')} `,
        d.is_super_admin ? 'Super Admin' : d.is_community_admin ? 'Community Admin' : 'Member',
        d.id,
      ]
    ));
  }

  getColumns = (classes) => [
    {
      name: 'Full Name',
      key: 'full_name',
      options: {
        filter: true,
      }
    },
    {
      name: 'Preferred Name',
      key: 'preferred_name',
      options: {
        filter: true,
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
        filterType: 'textField'
      }
    },
    {
      name: 'Membership',
      key: 'status',
      options: {
        filter: true,
      }
    }
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
          const idField = data[d.dataIndex].length - 1
          const userId = data[d.dataIndex][idField];
          apiCall('/users.delete', { id: userId });
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
            title="All Users"
            data={data}
            columns={columns}
            options={options}
          />
        </div>

      </div>
    );
  }
}

AllUsers.propTypes = {
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
const VendorsMapped = connect(mapStateToProps, mapDispatchToProps)(AllUsers);

export default withStyles(styles)(VendorsMapped);
