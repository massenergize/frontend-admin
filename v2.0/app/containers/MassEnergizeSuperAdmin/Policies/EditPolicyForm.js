import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ErrorIcon from '@material-ui/icons/Error';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select2 from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import green from '@material-ui/core/colors/green';
import MySnackbarContentWrapper from '../../../components/SnackBar/SnackbarContentWrapper';
import MassEnergizeForm from '../_FormGenerator';

import { apiCall } from '../../../utils/messenger';


// validation functions
// const required = value => (value == null ? 'Required' : undefined);

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
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  menu: {
    width: 200,
  },
});


class EditPolicyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      policy: null,
      communities: []

    };
  }


  async componentDidMount() {
    const { id } = this.props.match.params;    
    const policyResponse = await apiCall('/policies.info', { policy_id: id });
    const communitiesResponse = await apiCall('/communities.listForCommunityAdmin');


    if (policyResponse && policyResponse.success) {
      await this.setStateAsync({ policy: policyResponse.data });
    }
    if (communitiesResponse && communitiesResponse.data) {
      const communities = communitiesResponse.data.map(c => ({ ...c, id: '' + c.id, displayName: c.name }));
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
    const { communities, policy } = this.state;
    const { pathname } = window.location;

    const formJson = {
      title: 'Create New Policy',
      subTitle: '',
      method: '/policies.update',
      cancelLink: '/admin/read/policies',
      successRedirectPage: pathname || '/admin/read/policies',
      fields: [
        {
          label: 'About this Policy',
          fieldType: 'Section',
          children: [
            {
              name: 'ID',
              label: 'ID',
              placeholder: 'eg. 1',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: policy && policy.id,
              dbName: 'policy_id',
              readOnly: true
            },
            {
              name: 'name',
              label: 'Name of Policy',
              placeholder: 'eg. Terms and Conditions',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: policy && policy.name,
              dbName: 'name',
              readOnly: false
            },
            {
              name: 'is_global',
              label: 'Is this Policy Global',
              fieldType: 'Radio',
              isRequired: false,
              defaultValue: policy && policy.is_global ? 'true' : 'false',
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
                    defaultValue: policy && policy.community && '' + policy.community.id,
                    dbName: 'community_id',
                    data: communities
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
          defaultValue: policy && policy.description,
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

EditPolicyForm.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles, { withTheme: true })(EditPolicyForm);
