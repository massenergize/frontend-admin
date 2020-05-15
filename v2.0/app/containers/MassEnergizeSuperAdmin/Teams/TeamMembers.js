import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import { bindActionCreators } from 'redux';
import brand from 'dan-api/dummy/brand';
import MUIDataTable from 'mui-datatables';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import classNames from 'classnames';
import Tab from '@material-ui/core/Tab';
import PeopleIcon from '@material-ui/icons/People';
import AddBoxIcon from '@material-ui/icons/AddBox';
import messageStyles from 'dan-styles/Messages.scss';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import styles from '../../../components/Widget/widget-jss';
import { reduxGetAllTeams, reduxGetAllCommunityTeams } from '../../../redux/redux-actions/adminActions';
import { apiCall } from '../../../utils/messenger';
import MassEnergizeForm from '../_FormGenerator';

function TabContainer(props) {
  const { children } = props;
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};


class TeamMembers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], loading: true, team: null, columns: this.getColumns(), value: 0,

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

  handleTabChange = (event, value) => {
    this.setState({ value });
  };


  render() {
    const title = brand.name + ' - All Teams';
    const description = brand.desc;
    const {
      columns, data, team, formJson, value
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
          const email = data[d.dataIndex][2];
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
        <div>
          <SnackbarContent
            className={classNames(classes.snackbar, messageStyles.bgSuccess)}
            message={`Team: ${team && team.name}`}
            action={() => (
              <Link color="secondary" size="small">
              Action
              </Link>
            )}
          />
          <br />
          <SnackbarContent
            className={classNames(classes.snackbar, messageStyles.bgWarning)}
            message={`Community: ${team && team.community && team.community.name}`}
            action={() => (
              <Link color="secondary" size="small">
              Action
              </Link>
            )}
          />
          <br />
          <Link to="/admin/read/teams">
            <SnackbarContent
              className={classNames(classes.snackbar, messageStyles.bgInfo)}
              message="<<< Go Back to All Teams"
              action={() => (
                <Link color="secondary" size="small">
              Action
                </Link>
              )}
            />
          </Link>

        </div>
        <div className={classes.root}>
          <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={this.handleTabChange}
              variant="scrollable"
              scrollButtons="on"
              indicatorColor="primary"
              textColor="secondary"
            >
              <Tab label="Team Members & Admins" icon={<PeopleIcon />} />
              <Tab label="Change Team Member Status" icon={<AddBoxIcon />} />

            </Tabs>
          </AppBar>
          {value === 0 && (
            <TabContainer>

              <div className={classes.table}>
                <MUIDataTable
                  title="Team Members"
                  data={data}
                  columns={columns}
                  options={options}
                />
              </div>


            </TabContainer>
          )}
          {value === 1 && (
            <TabContainer>
              {formJson
            && (
              <MassEnergizeForm
                classes={classes}
                formJson={formJson}
              />
            )
              }
            </TabContainer>
          )}
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
