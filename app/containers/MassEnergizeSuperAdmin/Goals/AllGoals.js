import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';

import MUIDataTable from 'mui-datatables';
import FileCopy from '@mui/icons-material/FileCopy';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';

import messageStyles from 'dan-styles/Messages.scss';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { apiCall } from '../../../utils/messenger';
import styles from '../../../components/Widget/widget-jss';
import { reduxGetAllGoals, reduxGetAllCommunityGoals } from '../../../redux/redux-actions/adminActions';
import CommunitySwitch from '../Summary/CommunitySwitch';

class AllGoals extends React.Component {
  constructor(props) {
    super(props);
    this.state = { columns: this.getColumns(), data: [] };
  }


  async componentDidMount() {
    const user = this.props.auth ? this.props.auth : {};
    if (user.is_super_admin) {
      await this.props.callGoalsForSuperAdmin();
    }
    if (user.is_community_admin) {
      const com = this.props.community ? this.props.community : user.admin_at[0];
      await this.props.callGoalsForNormalAdmin(com.id);
    }
    // const allGoalsResponse = await apiCall('/goals.listForCommunityAdmin');
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
    this.props.callGoalsForNormalAdmin(id);
  }

  getStatus = isApproved => {
    switch (isApproved) {
      case false: return messageStyles.bgError;
      case true: return messageStyles.bgSuccess;
      default: return messageStyles.bgSuccess;
    }
  };


  fashionData = (data) => data.map(d => {
    const teamOrCommunity = d.community || d.team || { name: 'Unknown' };
    const typeOfObj = d.community ? ' (Community)' : (d.team ? ' (Team)' : '');
    const res = [
      d.id,
      d.name,
      {
        id: teamOrCommunity.id,
        image: teamOrCommunity.logo,
        initials: `${teamOrCommunity.name && teamOrCommunity.name.substring(0, 2).toUpperCase()}`,
        name: teamOrCommunity.name,
        type: typeOfObj
      },
      `${d.attained_number_of_actions}/${d.target_number_of_actions}`,
      `${d.attained_number_of_households}/${d.target_number_of_households}`,
      d.id
    ];
    return res;
  })


  getColumns = () => [
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
      name: 'Community/Team',
      key: 'name',
      options: {
        filter: true,
        download: false,
        customBodyRender: (d) => (
          <div>
            {d.image
              && <Link to={`/admin/community/${d.id}/profile`} target="_blank"><Avatar alt={d.initials} src={d.image.url} style={{ margin: 10 }} /></Link>
            }
            {!d.image
              && <Link to={`/admin/community/${d.id}/profile`} target="_blank"><Avatar style={{ margin: 10 }}>{d.initials}</Avatar></Link>
            }
            {d.name + d.type}
          </div>
        )
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
      rowsPerPage: 25,
      rowsPerPageOptions: [10, 25, 100],
      page: 1,
      indexColumn: 'id',
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        idsToDelete.forEach(async d => {
          const goalId = data[d.dataIndex][0];
          await apiCall('/goals.delete', { goal_id: goalId });
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
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    callGoalsForSuperAdmin: reduxGetAllGoals,
    callGoalsForNormalAdmin: reduxGetAllCommunityGoals
  }, dispatch);
}
const GoalsMapped = connect(mapStateToProps, mapDispatchToProps)(AllGoals);

export default withStyles(styles)(GoalsMapped);
