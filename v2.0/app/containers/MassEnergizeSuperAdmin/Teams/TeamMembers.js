import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import { bindActionCreators } from 'redux';
import brand from 'dan-api/dummy/brand';
import MUIDataTable from 'mui-datatables';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import messageStyles from 'dan-styles/Messages.scss';
import { connect } from 'react-redux';
import { Paper } from '@material-ui/core';
import styles from '../../../components/Widget/widget-jss';
import { reduxGetAllTeams, reduxGetAllCommunityTeams } from '../../../redux/redux-actions/adminActions';
import { apiCall } from '../../../utils/messenger';
import MassEnergizeForm from '../_FormGenerator';

class TeamMembers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], loading: true, team: null, columns: this.getColumns()
    };
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    const teamResponse = await apiCall('/teams.info', { team_id: id });
    if (teamResponse && teamResponse.data) {
      const team = teamResponse.data;
      await this.setStateAsync({ team });
    }

    const allTeamMembersResponse = await apiCall('/teams.members', { team_id: id });
    console.log(allTeamMembersResponse);
    if (allTeamMembersResponse && allTeamMembersResponse.success) {
      await this.setStateAsync({ loading: false, allTeamMembers: allTeamMembersResponse.data, data: this.fashionData(allTeamMembersResponse.data) });
    }

    const formJson = await this.createFormAddTeamAdminJson();
    await this.setStateAsync({ formJson, loading: false });
  }


  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }


  fashionData = (data) => {
    if (!data) return [];
    const fashioned = data.map(d => (
      [
        d.id,
        d.user && d.user.full_name,
        d.user && d.user.email,
        d.is_admin ? 'Admin' : 'Member',
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
        filter: true,
        filterType: 'textField'
      }
    },
    {
      name: 'User Name',
      key: 'user',
      options: {
        filter: true,
        filterType: 'textField'
      }
    },
    {
      name: 'User Email',
      key: 'user',
      options: {
        filter: true,
        filterType: 'textField'
      }
    },
    {
      name: 'Status',
      key: 'status',
      options: {
        filter: true,
      }
    },
  ]


  createFormAddTeamAdminJson = async () => {
    const { team } = this.state;
    const formJson = {
      title: 'Add Team Member / Change their Membership Status',
      subTitle: '',
      method: '/teams.addMember',
      successRedirectPage: '/admin/read/teams',
      fields: [
        {
          label: 'About this User',
          fieldType: 'Section',
          children: [
            {
              name: 'team_id',
              label: 'Team ID',
              placeholder: 'eg. id',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: team.id,
              dbName: 'team_id',
              readOnly: true
            },
            {
              name: 'email',
              label: 'Email',
              placeholder: 'eg. john.kofi.mensah@gmail.com',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              dbName: 'email',
              readOnly: false
            },
            {
              name: 'is_admin',
              label: 'New status for the user with this email',
              fieldType: 'Radio',
              isRequired: false,
              defaultValue: 'false',
              dbName: 'is_admin',
              readOnly: false,
              data: [
                { id: 'false', value: 'Member' },
                { id: 'true', value: 'Admin' }
              ]
            }
          ]
        },
      ]
    };
    return formJson;
  }


  render() {
    const title = brand.name + ' - All Teams';
    const description = brand.desc;
    const {
      columns, data, team, formJson
    } = this.state;
    const { classes } = this.props;
    const options = {
      filterType: 'dropdown',
      responsive: 'stacked',
      print: true,
      rowsPerPage: 10,
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        idsToDelete.forEach(d => {
          const email = data[d.index][2];
          apiCall('/teams.removeMember', { team_id: team.id, email });
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
          <Paper className={classes.root} elevation={4}>
            {team
            && (
              <Typography component="p">
                Team:&nbsp;&nbsp;
                {team.name}
              </Typography>
            )
            }
            <br />
            {team && team.community
            && (
              <Typography component="p">
                Community:&nbsp;&nbsp;
                {team.community.name}
              </Typography>
            )
            }
            <br />
            <Link to="/admin/read/teams">All Teams</Link>
          </Paper>
          <br />
          <br />
          <MUIDataTable
            title="Team Members"
            data={data}
            columns={columns}
            options={options}
          />
          <br />
          <br />
          {formJson
            && (
              <MassEnergizeForm
                classes={classes}
                formJson={formJson}
              />
            )
          }

        </div>
      </div>
    );
  }
}

TeamMembers.propTypes = {
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
    callTeamsForSuperAdmin: reduxGetAllTeams,
    callTeamsForNormalAdmin: reduxGetAllCommunityTeams
  }, dispatch);
}
const TeamsMapped = connect(mapStateToProps, mapDispatchToProps)(TeamMembers);

export default withStyles(styles)(TeamsMapped);
