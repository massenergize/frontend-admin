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


class CreateNewPolicyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communities: [],
      formJson: null
    };
  }


  async componentDidMount() {
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
    const { communities } = this.state;
    const formJson = {
      title: 'Create New Policy',
      subTitle: '',
      cancelLink: '/admin/read/policies',
      method: '/policies.create',
      successRedirectPage: '/admin/read/policies',
      fields: [
        {
          label: 'About this Policy',
          fieldType: 'Section',
          children: [
            {
              name: 'name',
              label: 'Name of Policy',
              placeholder: 'eg. Terms and Conditions',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: '',
              dbName: 'name',
              readOnly: false
            },
            {
              name: 'is_global',
              label: 'Is this Policy a Template?',
              fieldType: 'Radio',
              isRequired: false,
              defaultValue: 'true',
              dbName: 'is_global',
              readOnly: false,
              data: [
                { id: 'false', value: 'No' },
                { id: 'true', value: 'Yes' }
              ],
              child: {
                valueToCheck: 'false',
                fields: [
                  {
                    name: 'community',
                    label: 'Primary Community',
                    placeholder: 'eg. Wayland',
                    fieldType: 'Dropdown',
                    defaultValue: null,
                    dbName: 'community_id',
                    data: [{displayName:"--", id:""}, ...communities],
                  },
                ]
              }
            },
          ]
        },
        {
          name: 'description',
          label: 'Policy Details',
          placeholder: 'eg. Provide details about this Policy ...',
          fieldType: 'HTMLField',
          contentType: 'text',
          isRequired: true,
          isMultiline: true,
          defaultValue: '',
          dbName: 'description',
          readOnly: false
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

CreateNewPolicyForm.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles, { withTheme: true })(CreateNewPolicyForm);
