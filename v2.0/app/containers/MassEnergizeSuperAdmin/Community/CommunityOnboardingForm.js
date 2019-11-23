import React, { Component } from 'react';
import PropTypes from 'prop-types';
import states from 'dan-api/data/states';
import countries from 'dan-api/data/countries';
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


class CreateNewCommunityForm extends Component {
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
    console.log(states)
    const formJson = {
      title: 'Create New Community',
      subTitle: '',
      method: '/communities.create',
      successRedirectPage: '/admin/read/communities',
      fields: [
        {
          label: 'About this Community',
          fieldType: 'Section',
          children: [
            {
              name: 'name',
              label: 'Name of this Community',
              placeholder: 'eg. Wayland',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: '',
              dbName: 'name',
              readOnly: false
            },
            {
              name: 'subdomain',
              label: 'Subdomain: Please Provide a short unique name.  (only letters and numbers) ',
              placeholder: 'eg. wayland',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: '',
              dbName: 'subdomain',
              readOnly: false
            },
            {
              name: 'about',
              label: 'Tell us about this community',
              placeholder: 'Tell us more ...',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              isMultiline: true,
              defaultValue: '',
              dbName: 'about_community',
              readOnly: false
            },
            {
              name: 'is_geographically_focused',
              label: 'Is this community Geographically focused?',
              fieldType: 'Radio',
              isRequired: false,
              defaultValue: 'false',
              dbName: 'is_geographically_focused',
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
                    isRequired: false,
                    defaultValue: '',
                    dbName: 'address',
                    readOnly: false
                  },
                  {
                    name: 'unit',
                    label: 'Unit Number',
                    placeholder: 'eg. Unit 904',
                    fieldType: 'TextField',
                    contentType: 'text',
                    isRequired: false,
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
                    isRequired: false,
                    defaultValue: '',
                    dbName: 'city',
                    readOnly: false
                  },
                  {
                    name: 'zipcode',
                    label: 'Zip code ',
                    placeholder: 'eg. 80202',
                    fieldType: 'TextField',
                    contentType: 'text',
                    isRequired: false,
                    defaultValue: '',
                    dbName: 'zipcode',
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
                    defaultValue: '',
                    dbName: 'country',
                    readOnly: false,
                    child: {
                      valueToCheck: 'United States',
                      fields: [
                        {
                          name: 'state',
                          label: 'State ',
                          placeholder: 'eg. New York',
                          fieldType: 'Dropdown',
                          contentType: 'text',
                          isRequired: false,
                          data: states,
                          defaultValue: '',
                          dbName: 'state',
                          readOnly: false
                        },
                      ]
                    }
                  },
                ]
              }
            },
            {
              name: 'is_published',
              label: 'Should this go live now?',
              fieldType: 'Radio',
              isRequired: false,
              defaultValue: 'false',
              dbName: 'is_published',
              readOnly: false,
              data: [
                { id: 'false', value: 'No' },
                { id: 'true', value: 'Yes' }
              ],
            },
            {
              name: 'is_approved',
              label: 'Do you approve this community? (Check yes after background check)',
              fieldType: 'Radio',
              isRequired: false,
              defaultValue: 'true',
              dbName: 'is_approved',
              readOnly: false,
              data: [
                { id: 'false', value: 'No' },
                { id: 'true', value: 'Yes' }
              ],
            },
          ]
        },
        {
          label: 'About the Admin',
          fieldType: 'Section',
          children: [
            {
              name: 'admin_full_name',
              label: 'Administrator\'s Full Name',
              placeholder: 'eg. Ellen Tohn',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: '',
              dbName: 'owner_name',
              readOnly: false
            },
            {
              name: 'admin_email',
              label: 'Administrator\'s Email',
              placeholder: 'eg. etohn@comcast.net',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: '',
              dbName: 'owner_email',
              readOnly: false
            },
            {
              name: 'admin_phone_number',
              label: 'Administrator\'s Phone Number',
              placeholder: 'eg. 571 222 4567',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: false,
              defaultValue: '',
              dbName: 'owner_phone_number',
              readOnly: false
            },
          ]
        },
        {
          name: 'image',
          placeholder: 'Upload a Logo',
          fieldType: 'File',
          dbName: 'image',
          label: 'Upload a logo for this community',
          selectMany: false,
          isRequired: false,
          defaultValue: '',
          filesLimit: 1
        },
        {
          name: 'accepted_terms_and_conditions',
          modalText: 'Terms and Conditions',
          modalTitle: 'Terms and Conditions',
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

CreateNewCommunityForm.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles, { withTheme: true })(CreateNewCommunityForm);
