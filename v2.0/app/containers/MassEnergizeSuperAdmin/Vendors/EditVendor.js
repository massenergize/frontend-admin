import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import states from 'dan-api/data/states';
import countries from 'dan-api/data/countries';
import MassEnergizeForm from '../_FormGenerator';
import { apiCall } from '../../../utils/messenger';

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
      formJson: null,
      loading: true,
      vendor: null
    };
  }


  async componentDidMount() {
    const { id } = this.props.match.params;
    const vendorResponse = await apiCall('/vendors.info', { vendor_id: id });
    if (vendorResponse && vendorResponse.success) {
      await this.setStateAsync({ vendor: vendorResponse.data, loading: false });
    }

    const formJson = await this.createFormJson();
    const tagCollectionsResponse = await apiCall('/tag_collections.listForSuperAdmin');
    if (tagCollectionsResponse && tagCollectionsResponse.data) {
      const section = {
        label: 'Please select tag(s) that apply to this event',
        fieldType: 'Section',
        children: []
      };

      Object.values(tagCollectionsResponse.data).forEach(tCol => {
        const { vendor } = this.state;
        const newField = {
          name: tCol.name,
          label: `${tCol.name} ${tCol.allow_multiple ? '(You can select multiple)' : '(Only one selection allowed)'}`,
          placeholder: '',
          fieldType: 'Checkbox',
          selectMany: tCol.allow_multiple,
          defaultValue: this.getSelectedIds(vendor.tags, tCol.tags),
          dbName: 'tags',
          data: tCol.tags.map(t => ({ ...t, displayName: t.name, id: '' + t.id }))
        };

        // want this to be the 5th field
        if (tCol.name === 'Category') {
          section.children.push(newField);
        }
      });

      // want this to be the 2nd field
      formJson.fields.splice(1, 0, section);
    }
    await this.setStateAsync({ formJson, loading: false });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  createFormJson = async () => {
    const { vendor } = this.state;
    const formJson = {
      title: 'Update Vendor',
      subTitle: '',
      method: '/vendors.update',
      successRedirectPage: '/admin/read/vendors',
      fields: [
        {
          label: 'About this Vendor',
          fieldType: 'Section',
          children: [
            {
              name: 'id',
              label: 'ID',
              placeholder: 'eg. 100',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: vendor.id,
              dbName: 'id',
              readOnly: true
            },
            {
              name: 'name',
              label: 'Name of this Vendor',
              placeholder: 'eg. Solar Provider Inc.',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: vendor.name,
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
              defaultValue: vendor.phone_number,
              dbName: 'phone_number',
              readOnly: false
            },
            {
              name: 'email',
              label: 'Primary Email of this vendor',
              placeholder: 'eg. abc@gmail.com',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: vendor.email,
              dbName: 'email',
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
              defaultValue: vendor.description,
              dbName: 'description',
              readOnly: false
            },
            {
              name: 'is_verified',
              label: 'Have you verified this Vendor?',
              fieldType: 'Radio',
              isRequired: false,
              defaultValue: vendor.is_verified ? 'true' : 'false',
              dbName: 'is_verified',
              readOnly: false,
              data: [
                { id: 'false', value: 'No' },
                { id: 'true', value: 'Yes' }
              ]
            },
            {
              name: 'have_address',
              label: 'Do you have an address?',
              fieldType: 'Radio',
              isRequired: false,
              defaultValue: vendor.location ? 'true' : 'false',
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
                    defaultValue: vendor.location && vendor.location.address,
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
                    defaultValue: vendor.location && vendor.location.unit,
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
                    defaultValue: vendor.location && vendor.location.city,
                    dbName: 'city',
                    readOnly: false
                  },
                  {
                    name: 'country',
                    label: 'Which Country is this community Located?',
                    placeholder: 'eg. United States',
                    fieldType: 'Dropdown',
                    contentType: 'text',
                    isRequired: true,
                    data: countries,
                    defaultValue: (vendor.location && vendor.location.country) || 'United States',
                    dbName: 'country',
                    readOnly: false,
                    child: {
                      valueToCheck: 'United States',
                      fields: [
                        {
                          name: 'state',
                          label: 'State ',
                          placeholder: 'eg. New York',
                          fieldType: 'TextField',
                          contentType: 'text',
                          isRequired: true,
                          data: states,
                          defaultValue: vendor.location && vendor.location.state,
                          dbName: 'state',
                          readOnly: false
                        },
                      ]
                    }
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
              label: 'Please select your service sector(s)',
              placeholder: 'eg. Ellen Tohn',
              fieldType: 'Radio',
              contentType: 'text',
              isRequired: true,
              defaultValue: vendor.service_area,
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
                    name: 'service_area_states',
                    label: 'Which States? Separate them by commas',
                    placeholder: 'eg. New York',
                    fieldType: 'TextField',
                    contentType: 'text',
                    isRequired: true,
                    defaultValue: vendor.service_area_states && vendor.service_area_states.join(', '),
                    dbName: 'service_area_states',
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
              defaultValue: vendor.properties_serviced || [],
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
              name: 'key_contact_full_name',
              label: 'Contact Person\'s Full Name',
              placeholder: 'eg. Ellen Tohn',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: vendor.key_contact && vendor.key_contact.name,
              dbName: 'key_contact_name',
              readOnly: false
            },
            {
              name: 'key_contact_email',
              label: 'Contact Person\'s Email (this person should already have an account with us)',
              placeholder: 'eg. etohn@comcast.net',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: vendor.key_contact && vendor.key_contact.email,
              dbName: 'key_contact_email',
              readOnly: false
            },
          ]
        },
        {
          name: 'onboarding_contact_email',
          label: 'Email of Person onboarding this vendor',
          placeholder: 'eg. ellen@gmail.com',
          fieldType: 'TextField',
          contentType: 'text',
          isRequired: true,
          defaultValue: vendor && vendor.onboarding_contact && vendor.onboarding_contact.email,
          dbName: 'onboarding_contact_email',
          readOnly: true
        },
        {
          name: 'image',
          placeholder: 'Upload a Logo',
          fieldType: 'File',
          dbName: 'image',
          label: 'Upload a logo for this Vendor',
          previewLink: vendor.logo && vendor.logo.url,
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
