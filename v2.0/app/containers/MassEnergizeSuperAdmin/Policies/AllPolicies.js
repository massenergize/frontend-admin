import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { withStyles } from '@material-ui/core/styles';
import brand from 'dan-api/dummy/brand';
import MUIDataTable from 'mui-datatables';
import FileCopy from '@material-ui/icons/FileCopy';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux'; 
import { apiCall } from '../../../utils/messenger';
import styles from '../../../components/Widget/widget-jss';
import { bindActionCreators } from 'redux';
import CommunitySwitch from "../Summary/CommunitySwitch";
import { reduxGetAllPolicies, reduxGetAllCommunityPolicies } from '../../../redux/redux-actions/adminActions';
class AllPolicies extends React.Component {
  constructor(props) {
    super(props);
    this.state = { columns: this.getColumns(), data: [] };
  }


  async componentDidMount() {
    const user = this.props.auth ? this.props.auth: {};
    if (user.is_super_admin) {
      this.props.callPoliciesForSuperAdmin();
    }
    if (user.is_community_admin) {
      this.props.callPoliciesForNormalAdmin(user.admin_at[0].id);
    }
  }

  showCommunitySwitch = () => {
    const user = this.props.auth ? this.props.auth: {};
    if (user.is_community_admin) {
      return (
        <CommunitySwitch actionToPerform={this.handleCommunityChange} />
      );
    }
  }

  handleCommunityChange =(id) => {
    this.props.callPoliciesForNormalAdmin(id);
  }

  fashionData =(data) => {
    console.log(data)
    const fashioned = data.map(d => (
      [
        d.id,
        d.name,
        (d.is_global ? 'Global' : (d.community && d.community.name)),
        '' + d.is_published,
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
        filter: true
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
      name: 'Community',
      key: 'community',
      options: {
        filter: true,
      }
    },
    {
      name: 'Is Published',
      key: 'carbon',
      options: {
        filter: true,
      }
    },
    {
      name: 'Actions',
      key: 'actions',
      options: {
        filter: true,
        customBodyRender: (id) => (
          <div>
            <Link to={`/admin/edit/${id}/policy`}>
              <EditIcon size="small" variant="outlined" color="secondary" />
            </Link>
            &nbsp;&nbsp;
            <Link
              onClick={async () => {
                const copiedPolicyResponse = await apiCall('/policies.copy', { policy_id: id });
                const newPolicy = copiedPolicyResponse && copiedPolicyResponse.data;
                if (newPolicy) {
                  window.location.href = `/admin/edit/${newPolicy.id}/policy`;
                }
              }}
              to="/admin/read/policies"
            >
              <FileCopy size="small" variant="outlined" color="secondary" />
            </Link>
          </div>
        )
      }
    },
  ]

  render() {
    const title = brand.name + ' - All Policies';
    const description = brand.desc;
    const { columns } = this.state;
    const { classes } = this.props;
    const data = this.fashionData(this.props.allPolicies);

    const options = {
      filterType: 'dropdown',
      responsive: 'stacked',
      print: true,
      rowsPerPage: 10,
      page: 1,
      indexColumn: 'id',
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        idsToDelete.forEach(d => {
          const policyId = data[d.index][0];
          apiCall('/policies.delete', { policy_id: policyId });
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
          {this.showCommunitySwitch()}
          <MUIDataTable
            title="All Policies"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    );
  }
}

AllPolicies.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    auth: state.getIn(['auth']),
    allPolicies: state.getIn(['allPolicies'])
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    callPoliciesForSuperAdmin: reduxGetAllPolicies,
    callPoliciesForNormalAdmin: reduxGetAllCommunityPolicies
  }, dispatch);
}
const PoliciesMapped = connect(mapStateToProps, mapDispatchToProps)(AllPolicies);

export default withStyles(styles)(PoliciesMapped);
