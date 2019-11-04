import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { apiCall } from '../../../utils/messenger';
import MassEnergizeForm from '../_FormGenerator';

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
      team: null
    };
  }


  async componentDidMount() {
    const { id } = this.props.match.params;
    const teamResponse = await apiCall('/teams.info', { team_id: id });
    if (teamResponse && teamResponse.data) {
      const team = teamResponse.data;
      await this.setStateAsync({ team });
    }
    const communitiesResponse = await apiCall('/communities.listForCommunityAdmin');

    if (communitiesResponse && communitiesResponse.data) {
      const communities = communitiesResponse.data.map(c => ({ ...c, displayName: c.name }));
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
    const { communities, team } = this.state;
    console.log(team)
    const formJson = {
      title: 'Edit Team',
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
              name: 'community',
              label: 'Primary Community',
              placeholder: 'eg. Wayland',
              fieldType: 'Dropdown',
              defaultValue: team.community && team.community.id,
              dbName: 'community_id',
              data: communities
            },
            {
              name: 'description',
              label: 'Team Description',
              placeholder: 'eg. Tell us more about this Team ...',
              fieldType: 'TextField',
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
      ]
    };
    return formJson;
  }


  render() {
    const { classes } = this.props;
    const { formJson } = this.state;
    if (!formJson) return (<div />);
    return (
      <div>
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


export default withStyles(styles, { withTheme: true })(EditTeam);
