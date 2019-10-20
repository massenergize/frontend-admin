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


class CreateNewTeamForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communities: [],
      formJson: null
    };
  }


  async componentDidMount() {
    const communitiesResponse = await apiCall('/communities.listForSuperAdmin');

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
    const { communities } = this.state;
    const formJson = {
      title: 'Create New Team',
      subTitle: '',
      method: '/teams.create',
      successRedirectPage: '/admin/read/teams',
      fields: [
        {
          label: 'About this Team',
          fieldType: 'Section',
          children: [
            {
              name: 'name',
              label: 'Name of Team',
              placeholder: 'eg. Cool Rangers',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: '',
              dbName: 'name',
              readOnly: false
            },
            {
              name: 'community',
              label: 'Primary Community',
              placeholder: 'eg. Wayland',
              fieldType: 'Dropdown',
              defaultValue: null,
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
              defaultValue: '',
              dbName: 'description',
              readOnly: false
            },
          ]
        },

        {
          name: 'image',
          placeholder: 'Select a Logo for this team',
          fieldType: 'File',
          dbName: 'image',
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

CreateNewTeamForm.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles, { withTheme: true })(CreateNewTeamForm);
