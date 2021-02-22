import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import states from 'dan-api/data/states';
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


class EditCommunityByCommunityAdmin extends Component {
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

    // quick and dirty - duplicated code - needs to be consistant between pages and with the API
    // could read these options from the API or share the databaseFieldChoices json
    const geography_types = [
      { id: "ZIPCODE", value:"Community defined by one or more towns or zipcodes (can't be subdivided)" },
      { id: "CITY", value:"Community defined by one or more larger cities (can have smaller communities within)" },
      //{ id: "COUNTY", value:"Community defined by one or more counties" },
      //{ id: "STATE", value: "Community defined by one or more states" },
      //{ id: "COUNTRY", value:"Community defined by a country" },
      //{ id: "NON_GEOGRAPHIC", value:"A non-geographic community" },
    ]
    const { community } = this.state;

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
              readOnly: true
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
              readOnly: true,
              data: [
                { id: 'false', value: 'No' },
                { id: 'true', value: 'Yes' }
              ],
              child: {
                valueToCheck: 'true',
                fields: [
                  {
                    name: 'geography_type',
                    label: 'Type of geographic community',
                    fieldType: 'Radio',
                    isRequired: true,
                    defaultValue: community.geography_type || 'ZIPCODE',
                    dbName: 'geography_type',
                    readOnly: true,
                    data: geography_types,
                  },
                  {
                    name: 'location_set',
                    label: 'List of all such regions (zipcodes or town-state, city-state, states) within the community, separated by commas ',
                    placeholder: 'eg. 01101, 01102, 01103, 01104 or Springfield-MA',
                    fieldType: 'TextField',
                    contentType: 'text',
                    isRequired: true,
                    defaultValue: community.location_set || '',
                    dbName: 'location_set',
                    readOnly: true
                  },
                ]}},
          ]
        },
        {
          label: 'Community Public Information (Will be displayed in the community portal\'s footer)',
          fieldType: 'Section',
          children: [
            {
              name: 'admin_full_name',
              label: 'Contact Person\'s Full Name',
              placeholder: 'eg. Grace Tsu',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: community.owner_name,
              dbName: 'owner_name',
              readOnly: false
            },
            {
              name: 'admin_email',
              label: 'Community\'s Public Email',
              placeholder: 'eg. johny.appleseed@gmail.com',
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

EditCommunityByCommunityAdmin.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles, { withTheme: true })(EditCommunityByCommunityAdmin);
