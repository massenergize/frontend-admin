import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
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


class CreateNewVendorForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formJson: null
    };
  }


  async componentDidMount() {
    const formJson = await this.createFormJson();
    await this.setStateAsync({ formJson });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  createFormJson = async () => {
    const formJson = {
      title: 'Create New Vendor',
      subTitle: '',
      method: '/vendors.create',
      successRedirectPage: '/admin/read/vendors',
      fields: [
        {
          label: 'About this Vendor',
          fieldType: 'Section',
          children: [
            {
              name: 'name',
              label: 'Name of this Vendor',
              placeholder: 'eg. Solar Provider Inc.',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: '',
              dbName: 'name',
              readOnly: false
            },
            {
              name: 'phone_number',
              label: 'Primary Phone Number',
              placeholder: 'eg. +1(571)-000-2231',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: '',
              dbName: 'phone_number',
              readOnly: false
            },
            {
              name: 'description',
              label: 'Tell us about what you do',
              placeholder: 'Tell us more ...',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              isMultiline: true,
              defaultValue: '',
              dbName: 'description',
              readOnly: false
            },
            {
              name: 'have_address',
              label: 'Do you have an address?',
              fieldType: 'Radio',
              isRequired: false,
              defaultValue: 'false',
              dbName: 'have_address',
              readOnly: false,
              data: [
                { id: 'false', value: 'No' },
                { id: 'true', value: 'Yes' }
              ],
              child: {
                valueToCheck: 'true',
                fields: [
                  {
                    name: 'address',
                    label: 'Street Address',
                    placeholder: 'eg. Wayland',
                    fieldType: 'TextField',
                    contentType: 'text',
                    isRequired: true,
                    defaultValue: '',
                    dbName: 'address',
                    readOnly: false
                  },
                  {
                    name: 'unit',
                    label: 'Unit Number',
                    placeholder: 'eg. wayland',
                    fieldType: 'TextField',
                    contentType: 'text',
                    isRequired: true,
                    defaultValue: '',
                    dbName: 'unit',
                    readOnly: false
                  },
                  {
                    name: 'city',
                    label: 'City',
                    placeholder: 'eg. wayland',
                    fieldType: 'TextField',
                    contentType: 'text',
                    isRequired: true,
                    defaultValue: '',
                    dbName: 'city',
                    readOnly: false
                  },
                  {
                    name: 'state',
                    label: 'State ',
                    placeholder: 'eg. New York',
                    fieldType: 'TextField',
                    contentType: 'text',
                    isRequired: true,
                    defaultValue: '',
                    dbName: 'state',
                    readOnly: false
                  },
                  {
                    name: 'country',
                    label: 'Which Country is this community Located?',
                    placeholder: 'eg. United States',
                    fieldType: 'TextField',
                    contentType: 'text',
                    isRequired: true,
                    defaultValue: '',
                    dbName: 'country',
                    readOnly: false
                  },
                ]
              }
            },
          ]
        },
        {
          label: 'Services',
          fieldType: 'Section',
          children: [
            {
              name: 'service_area',
              label: 'Please select your service Area',
              placeholder: 'eg. Ellen Tohn',
              fieldType: 'Radio',
              contentType: 'text',
              isRequired: true,
              defaultValue: 'national',
              dbName: 'service_area',
              readOnly: false,
              data: [
                { id: 'national', value: 'National', displayName: 'National' },
                { id: 'statewide', value: 'Statewide', displayName: 'Statewide' },
              ],
              child: {
                valueToCheck: 'statewide',
                fields: [
                  {
                    name: 'service_area_state',
                    label: 'Which State?',
                    placeholder: 'eg. New York',
                    fieldType: 'TextField',
                    contentType: 'text',
                    isRequired: true,
                    defaultValue: '',
                    dbName: 'service_area_state',
                    readOnly: false
                  },
                ]
              }
            },
            {
              name: 'properties_serviced',
              label: 'Please select your service Area',
              placeholder: 'eg. Please select one option',
              fieldType: 'Checkbox',
              contentType: 'text',
              isRequired: true,
              selectMany: true,
              defaultValue: [],
              dbName: 'properties_serviced',
              readOnly: false,
              data: [
                { id: 'residential', value: 'Residential', displayName: 'Residential' },
                { id: 'commercial', value: 'Commercial', displayName: 'Commercial' },
              ],
            },
          ]
        },
        {
          label: 'Key Contact Person',
          fieldType: 'Section',
          children: [
            {
              name: 'contact_person_name',
              label: 'Contact Person\'s Full Name',
              placeholder: 'eg. Ellen Tohn',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: '',
              dbName: 'owner_name',
              readOnly: false
            },
            {
              name: 'contact_person_name',
              label: 'Contact Person\'s Email (this person should already have an account with us)',
              placeholder: 'eg. etohn@comcast.net',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: '',
              dbName: 'owner_email',
              readOnly: false
            },
          ]
        },
        {
          name: 'image',
          placeholder: 'Upload a Logo',
          fieldType: 'File',
          dbName: 'image',
          label: 'Upload a logo for this Vendor',
          selectMany: false,
          isRequired: false,
          defaultValue: '',
          filesLimit: 1
        },
        {
          name: 'accepted_terms_and_conditions',
          label: 'Accept Terms And Conditions',
          fieldType: 'Radio',
          isRequired: false,
          defaultValue: 'false',
          dbName: 'accepted_terms_and_conditions',
          readOnly: false,
          data: [
            { id: 'false', value: 'No' },
            { id: 'true', value: 'Yes' }
          ]
        },
      ]
    };
    return formJson;
  }


  render() {
    const { classes } = this.props;
    const { formJson } = this.state;
    if (!formJson) return (<div>Hold tight! Preparing your form ...</div>);
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

CreateNewVendorForm.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles, { withTheme: true })(CreateNewVendorForm);
