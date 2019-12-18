import React, { Component } from 'react';
import PropTypes from 'prop-types';
import states from 'dan-api/data/states';
import { withStyles } from '@material-ui/core/styles';
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


class EditCommunityForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formJson: null,
      community: null
    };
  }


  async componentDidMount() {
    const { id } = this.props.match.params;
    const communityResponse = await apiCall('/communities.info', { community_id: id });
    if (communityResponse && !communityResponse.success) {
      return;
    }

    const community = communityResponse.data;
    await this.setStateAsync({ community });

    const formJson = await this.createFormJson();
    await this.setStateAsync({ formJson });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  createFormJson = async () => {
    const { community } = this.state;
    console.log(community);
    // if (!community) return {};
    const formJson = {
      title: 'Edit your Community',
      subTitle: '',
      method: '/communities.update',
      successRedirectPage: `/admin/community/${community.id}/edit`,
      fields: [
        {
          label: 'About this Community',
          fieldType: 'Section',
          children: [
            {
              name: 'id',
              label: 'Community ID',
              placeholder: 'eg. 10',
              fieldType: 'TextField',
              contentType: 'number',
              isRequired: true,
              defaultValue: community.id,
              dbName: 'community_id',
              readOnly: true
            },
            {
              name: 'name',
              label: 'Name of this Community',
              placeholder: 'eg. Wayland',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: community.name,
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
              defaultValue: community.subdomain,
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
              defaultValue: community.about_community,
              dbName: 'about_community',
              readOnly: false
            },
            {
              name: 'is_geographically_focused',
              label: 'Is this community Geographically focused?',
              fieldType: 'Radio',
              isRequired: false,
              defaultValue: community.is_geographically_focused ? 'true' : 'false',
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
                    defaultValue: `${community.location && community.location.address ? community.location.address : ''}`,
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
                    defaultValue: `${community.location && community.location.unit ? community.location.unit : ''}`,
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
                    defaultValue: `${community.location && community.location.city ? community.location.city : ''}`,
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
                    defaultValue: community.location && community.location.zipcode,
                    dbName: 'zipcode',
                    readOnly: false
                  },
                  {
                    name: 'state',
                    label: 'State ',
                    placeholder: 'eg. New York',
                    fieldType: 'Dropdown',
                    contentType: 'text',
                    isRequired: false,
                    data: states,
                    defaultValue: community.location && community.location.state,
                    dbName: 'state',
                    readOnly: false
                  },
                ]
              }
            },
            {
              name: 'is_published',
              label: 'Should this go live now?',
              fieldType: 'Radio',
              isRequired: false,
              defaultValue: community.is_published ? 'true' : 'false',
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
              defaultValue: community.is_approved ? 'true' : 'false',
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
              defaultValue: community.owner_name,
              dbName: 'owner_name',
              readOnly: false
            },
            {
              name: 'admin_email',
              label: 'Contact Person\'s Full Name',
              placeholder: 'eg. etohn@comcast.net',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: community.owner_email,
              dbName: 'owner_email',
              readOnly: false
            },
            {
              name: 'admin_phone_number',
              label: 'Community\'s Public Phone Number',
              placeholder: 'eg. 571 222 4567',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: false,
              defaultValue: community.owner_phone_number,
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
          previewLink: `${community.logo && community.logo.url}`,
          label: 'Upload a new logo for this community',
          selectMany: false,
          isRequired: false,
          defaultValue: '',
          filesLimit: 1
        }
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

EditCommunityForm.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles, { withTheme: true })(EditCommunityForm);
