import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';

import MUIDataTable from 'mui-datatables';
import FileCopy from '@material-ui/icons/FileCopy';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';

import messageStyles from 'dan-styles/Messages.scss';
import { apiCall } from '../../../utils/messenger';
import styles from '../../../components/Widget/widget-jss';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxGetAllGoals, reduxGetAllCommunityGoals } from '../../../redux/redux-actions/adminActions';
import CommunitySwitch from './../Summary/CommunitySwitch'; 

class AllGoals extends React.Component {
  constructor(props) {
    super(props);
    this.state = { columns: this.getColumns(), data: [] };
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
    this.props.callGoalsForNormalAdmin(id);
  }
  
  async componentDidMount() {
    const user = this.props.auth ? this.props.auth : {};
    if (user.is_super_admin) {
      await this.props.callGoalsForSuperAdmin()
    }
    if (user.is_community_admin) {
      var com = this.props.community ? this.props.community : user.communities[0]
      await this.props.callGoalsForNormalAdmin(com.id)
    }
    // const allGoalsResponse = await apiCall('/goals.listForSuperAdmin');
    // if (allGoalsResponse && allGoalsResponse.success) {
    //   const data = allGoalsResponse.data.map(d => (
    //     [
    //       d.id,
    //       d.name,
    //       `${d.attained_number_of_actions}/${d.target_number_of_actions}`,
    //       `${d.attained_number_of_households}/${d.target_number_of_households}`,
    //       `${d.attained_carbon_footprint_reduction}/${d.target_carbon_footprint_reduction}`,
    //       d.id
    //     ]
    //   ));
    //   await this.setStateAsync({ data });
    // }
  }
  fashionData = (data) => {
    data = data.map(d => (
      [
        d.id,
        d.name,
        `${d.attained_number_of_actions}/${d.target_number_of_actions}`,
        `${d.attained_number_of_households}/${d.target_number_of_households}`,
        `${d.attained_carbon_footprint_reduction}/${d.target_carbon_footprint_reduction}`,
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
      name: 'Actions Achieved/Target',
      key: 'actions',
      options: {
        filter: true,
      }
    },
    {
      name: 'Households Achieved/Target',
      key: 'households',
      options: {
        filter: true,
      }
    },
    {
      name: 'CarbonSavings Achieved/Target',
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
            <Link to={`/admin/edit/${id}/goal`}>
              <EditIcon size="small" variant="outlined" color="secondary" />
            </Link>
            &nbsp;&nbsp;
            <Link
              onClick={async () => {
                const copiedGoalResponse = await apiCall('/goals.copy', { goal_id: id });
                const newGoal = copiedGoalResponse && copiedGoalResponse.data;
                if (newGoal) {
                  window.location.href = `/admin/edit/${newGoal.id}/goal`;
                }
              }}
              to="/admin/read/goals"
            >
              <FileCopy size="small" variant="outlined" color="secondary" />
            </Link>
          </div>
        )
      }
    },
  ]

  render() {
    const title = brand.name + ' - All Goals';
    const description = brand.desc;
    const { columns } = this.state;
    const { classes } = this.props;
    const data = this.fashionData(this.props.allGoals);
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
          const goalId = data[d.index][0];
          apiCall('/goals.delete', { goal_id: goalId });
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
            title="All Goals"
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    );
  }
}

AllGoals.propTypes = {
  classes: PropTypes.object.isRequired,
};
function mapStateToProps(state) {
  return {
    auth: state.getIn(['auth']),
    allGoals: state.getIn(['allGoals']),
    community: state.getIn(['selected_community'])
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    callGoalsForSuperAdmin: reduxGetAllGoals,
    callGoalsForNormalAdmin: reduxGetAllCommunityGoals
  }, dispatch);
}
const GoalsMapped = connect(mapStateToProps, mapDispatchToProps)(AllGoals);

export default withStyles(styles)(GoalsMapped);
