import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { apiCall } from '../../../utils/messenger';
import MassEnergizeForm from '../_FormGenerator';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reduxGetAllCommunityTeams } from '../../../redux/redux-actions/adminActions';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 30
  },
  field: {
    width: '100%',
    marginBottom: 20
  },
  fieldBasic: {
    width: '100%',
    marginBottom: 20,
    marginTop: 10
  },
  inlineWrap: {
    display: 'flex',
    flexDirection: 'row'
  },
  buttonInit: {
    margin: theme.spacing.unit * 4,
    textAlign: 'center'
  },
});


class EditTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communities: [],
      formJson: null,
      addTeamAdminJson: null,
      team: null,
      parentTeamOptions: false,
    };
  }


  async componentDidMount() {
    const { id } = this.props.match.params;
    let parentTeamOptions = "0";    
    const teamResponse = await apiCall('/teams.info', { team_id: id });
    if (teamResponse && teamResponse.data) {
      const team = teamResponse.data;

      if (team.primary_community) {
        // const teams = await this.props.callTeamsForNormalAdmin();
        const teams = await apiCall('/teams.list', { community_id: team.primary_community.id });
        // if other teams have us as a parent, can't set a parent ourselves
        // from that point, can set parent teams that are not ourselves AND don't have parents themselves (i.e. aren't sub-teams)
        const parentTeams = teams.data.filter(_team => _team.parent && _team.parent.id === team.id).length === 0
          && teams.data.filter(_team => ((_team.id !== team.id) && !_team.parent));
        if (parentTeams) {
          parentTeamOptions = parentTeams.map(_team => ({ id: _team.id, displayName: _team.name }));
          parentTeamOptions = [{displayName:"NONE", id:"0"}, ...parentTeamOptions]
        }
        else
        {
          parentTeamOptions = [{displayName:"Team cannot have a parent, because it is a parent of another team", id:"0"}];
        }
      }
      await this.setStateAsync({ team, parentTeamOptions });
    }
    const communitiesResponse = await apiCall('/communities.listForCommunityAdmin');

    if (communitiesResponse && communitiesResponse.data) {
      const communities = communitiesResponse.data.map(c => ({ ...c, displayName: c.name, id: '' + c.id }));
      await this.setStateAsync({ communities });
    }

    const formJson = await this.createFormJson();
    await this.setStateAsync({ formJson });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  createFormJson = async () => {
    const { communities, team, parentTeamOptions } = this.state;
    const selectedCommunities = team.communities ? team.communities.map(e => '' + e.id) : [];
    const formJson = {
      title: 'Edit Team Information',
      subTitle: '',
      method: '/teams.update',
      successRedirectPage: '/admin/read/teams',
      fields: [
        {
          label: 'About this Team',
          fieldType: 'Section',
          children: [
            {
              name: 'id',
              label: 'ID',
              placeholder: 'eg. id',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: team.id,
              dbName: 'id',
              readOnly: true
            },
            {
              name: 'name',
              label: 'Name of Team',
              placeholder: 'eg. Cool Rangers',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: team.name,
              dbName: 'name',
              readOnly: false
            },
            {
              name: 'primary_community',
              label: 'Primary Community',
              placeholder: '',
              fieldType: 'Dropdown',
              defaultValue: team.primary_community && team.primary_community.id,
              dbName: 'primary_community_id',
              data: [{displayName:"--", id:""}, ...communities],
            },
            {
              name: 'communities',
              label: 'Communities which share this team',
              placeholder: '',
              fieldType: 'Checkbox',
              selectMany: true,
              defaultValue: selectedCommunities,
              dbName: 'communities',
              data: communities,
            },
             {
              name: 'parent',
              label: parentTeamOptions && 'Parent Team (must be in the same primary community)',
              fieldType: 'Dropdown',
              defaultValue: (team.parent && team.parent.id) || "0",
              dbName: 'parent_id',
              data: parentTeamOptions,
              readOnly: parentTeamOptions && false || true,
            },
            {
              name: 'tagline',
              label: 'Team Tagline',
              placeholder: 'eg. A catchy slogan for your team...',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              isMultiline: false,
              defaultValue: team.tagline && team.tagline,
              dbName: 'tagline',
              readOnly: false
            },
            {
              name: 'description',
              label: 'Team Description',
              placeholder: 'eg. Tell us more about this Team ...',
              fieldType: 'HTMLField',
              contentType: 'text',
              isRequired: true,
              isMultiline: true,
              defaultValue: team.description,
              dbName: 'description',
              readOnly: false
            },
          ]
        },
        {
          name: 'logo',
          placeholder: 'Select a Logo for this team',
          fieldType: 'File',
          previewLink: team.logo && team.logo.url,
          dbName: 'logo',
          label: 'Select a Logo for this team',
          selectMany: false,
          isRequired: false,
          defaultValue: '',
          filesLimit: 1
        },
        {
          name: 'is_published',
          label: 'Should this team go live?',
          fieldType: 'Radio',
          isRequired: false,
          defaultValue: '' + team.is_published,
          dbName: 'is_published',
          readOnly: false,
          data: [
            { id: 'false', value: 'No' },
            { id: 'true', value: 'Yes' }
          ],
        },
      ]
    };
    return formJson;
  }


  render() {
    const { classes } = this.props;
    const { formJson, team } = this.state;
    if (!formJson) return (<div />);
    return (
      <div>
        <Paper>
          <Link to={`/admin/edit/${team && team.id}/team_members`}>Team Members and Admins</Link>
        </Paper>


        <br />
        <MassEnergizeForm
          classes={classes}
          formJson={formJson}
        />
      </div>
    );
  }
}

EditTeam.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    callTeamsForNormalAdmin: reduxGetAllCommunityTeams
  }, dispatch);
}
const EditTeamMapped = connect(null, mapDispatchToProps)(EditTeam);

export default withStyles(styles, { withTheme: true })(EditTeamMapped);
