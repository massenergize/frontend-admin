import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';
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
import Grid from "@material-ui/core/Grid";
import Tab from '@material-ui/core/Tab';
import PeopleIcon from '@material-ui/icons/People';
import AddBoxIcon from '@material-ui/icons/AddBox';
import messageStyles from 'dan-styles/Messages.scss';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CircularProgress from '@material-ui/core/CircularProgress';

import styles from '../../../components/Widget/widget-jss';
import { reduxGetAllTeams, reduxGetAllCommunityTeams } from '../../../redux/redux-actions/adminActions';
import { apiCall, apiCallFile } from '../../../utils/messenger';
import MassEnergizeForm from '../_FormGenerator';
import { downloadFile } from '../../../utils/common';

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
      data: [], 
      loading: true, 
      team: null, 
      columns: this.getColumns(), 
      value: 0,
      error: null,
      loadingCSVs: [],
    };
  }

  // from About.js
  async getCSV(endpoint) {
    const { team } = this.state;
    if (!team) {
      return;
    }
    let oldLoadingCSVs = this.state.loadingCSVs;
    this.setState({ loadingCSVs: oldLoadingCSVs.concat(endpoint) });

    const csvResponse = await apiCallFile('/downloads.' + endpoint,
      { team_id: team.id });

    oldLoadingCSVs = this.state.loadingCSVs;
    oldLoadingCSVs.splice(oldLoadingCSVs.indexOf(endpoint), 1);
    if (csvResponse.success) {
      downloadFile(csvResponse.file);
    } else {
      this.setState({ error: csvResponse.error });
    }
    this.setState({ loadingCSVs: oldLoadingCSVs });
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    const teamResponse = await apiCall('/teams.info', { team_id: id });
    if (teamResponse && teamResponse.data) {
      const team = teamResponse.data;
      await this.setStateAsync({ team });
    }

    const allTeamMembersResponse = await apiCall('/teams.members', { team_id: id });
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
    const { error, loadingCSVs } = this.state;
    const options = {
      filterType: 'dropdown',
      responsive: 'stacked',
      print: true,
      rowsPerPage: 100,
      onRowsDelete: (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data;
        idsToDelete.forEach(d => {
          const email = data[d.dataIndex][2];
          apiCall('/teams.removeMember', { team_id: team.id, email });
        });
      }
    };
    return (

      /* Not bothering with the error handling for now
      {error
        && (
          <div>
            <Snackbar
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              open={error != null}
              autoHideDuration={6000}
              onClose={this.handleCloseStyle}
            >
              <MySnackbarContentWrapper
                onClose={this.handleCloseStyle}
                variant="error"
                message={`Unable to download: ${error}`}
              />
            </Snackbar>
          </div>
        )}*/

      <div>

        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        <Grid container>
          <Grid item xs={8}>
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
          </Grid>
          <Grid item xs={3}>
            <p className={classes.note}>
              NOTE: this page <i>does not</i> list members of sub-teams.
              On the community portal, parent team pages <i>do</i> list members of sub-teams.
            </p>
            <br />
            <Paper onClick={() => { !loadingCSVs.includes('users') && this.getCSV('users'); }} className={`${classes.pageCard}`} elevation={1}>
              <Typography variant="h5" style={{ fontWeight: '600', fontSize: '1rem' }} component="h3">
                Download Users and Actions CSV
                    {' '}
                <Icon style={{ paddingTop: 3, color: 'green' }}>arrow_downward</Icon>
                {loadingCSVs.includes('users') && <CircularProgress size={20} thickness={2} color="secondary" />}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
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
