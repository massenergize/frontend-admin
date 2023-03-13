import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ErrorIcon from '@mui/icons-material/Error';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select2 from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import green from '@mui/material/colors/green';
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
    if (communitiesResponse && communitiesResponse.data ) {
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
      title: 'Edit Policy',
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
              label: 'Is this Policy a Template?',
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
