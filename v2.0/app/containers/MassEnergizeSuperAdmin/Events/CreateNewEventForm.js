import React, { Component } from 'react';
import PropTypes from 'prop-types';
import states from 'dan-api/data/states';
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


class CreateNewEventForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communities: [],
      formJson: null,
      loading: true
    };
  }


  async componentDidMount() {
    const tagCollectionsResponse = await apiCall('/tag_collections.listForCommunityAdmin');
    const communitiesResponse = await apiCall('/communities.listForCommunityAdmin');

    if (communitiesResponse && communitiesResponse.data) {
      const communities = communitiesResponse.data.map(c => ({ ...c, displayName: c.name }));
      await this.setStateAsync({ communities });
    }

    const formJson = await this.createFormJson();
    if (tagCollectionsResponse && tagCollectionsResponse.data) {
      const section = {
        label: 'Please select tag(s) that apply to this event',
        fieldType: 'Section',
        children: []
      };

      Object.values(tagCollectionsResponse.data).forEach(tCol => {
        const newField = {
          name: tCol.name,
          label: `${tCol.name} ${tCol.allow_multiple ? '(You can select multiple)' : '(Only one selection allowed)'}`,
          placeholder: '',
          fieldType: 'Checkbox',
          selectMany: tCol.allow_multiple,
          defaultValue: [],
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
    const { communities } = this.state;
    const formJson = {
      title: 'Create New Event or Campaign',
      subTitle: '',
      method: '/events.create',
      successRedirectPage: '/admin/read/events',
      fields: [
        {
          label: 'About this event',
          fieldType: 'Section',
          children: [
            {
              name: 'name',
              label: 'Name of Event or Campaign',
              placeholder: 'Enter name of event or campaign',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: '',
              dbName: 'name',
              readOnly: false
            },
            {
              name: 'featured_summary',
              label: 'One sentence that describes this event',
              placeholder: 'One sentence that describes this event',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: '',
              dbName: 'featured_summary',
              readOnly: false
            },
            {
              name: 'rank',
              label: 'Rank (Which order should this event appear in?  Lower numbers come first)',
              placeholder: 'eg. 1',
              fieldType: 'TextField',
              contentType: 'number',
              isRequired: true,
              defaultValue: '',
              dbName: 'rank',
              readOnly: false
            },
            {
              name: 'start_date_and_time',
              label: 'Start Date And Time',
              placeholder: 'YYYY-MM-DD HH:MM',
              fieldType: 'DateTime',
              contentType: 'text',
              isRequired: true,
              defaultValue: '',
              dbName: 'start_date_and_time',
              readOnly: false
            },
            {
              name: 'end_date_and_time',
              label: 'End Date And Time',
              placeholder: 'YYYY-MM-DD HH:MM',
              fieldType: 'DateTime',
              contentType: 'text',
              isRequired: true,
              defaultValue: '',
              dbName: 'end_date_and_time',
              readOnly: false
            },
            {
              name: 'is_global',
              label: 'Is this Event a Template?',
              fieldType: 'Radio',
              isRequired: false,
              defaultValue: 'false',
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
                    data: ["--", ...communities],
                  },
                ]
              }
            },
          ]
        },
        {
          name: 'have_address',
          label: 'Want to add an address for this event?',
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
                placeholder: 'Street Address or Public Facility',
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
                placeholder: 'eg. "2A"',
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
                placeholder: 'eg. Springfield',
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
                fieldType: 'Dropdown',
                contentType: 'text',
                isRequired: false,
                data: states,
                defaultValue: 'Massachusetts',
                dbName: 'state',
                readOnly: false
              },
            ]
          }
        },
        {
          name: 'description',
          label: 'Event Description',
          placeholder: 'eg. This event is happening in ...',
          fieldType: 'HTMLField',
          isRequired: true,
          defaultValue: null,
          dbName: 'description',
        },
        {
          name: 'image',
          placeholder: 'Select an Image',
          fieldType: 'File',
          dbName: 'image',
          label: 'Upload Files',
          selectMany: false,
          isRequired: false,
          defaultValue: '',
          filesLimit: 1
        },
        {
          name: 'archive',
          label: 'Archive this Event',
          fieldType: 'Radio',
          isRequired: false,
          defaultValue: 'false',
          dbName: 'archive',
          readOnly: false,
          data: [
            { id: 'false', value: 'No' },
            { id: 'true', value: 'Yes' }
          ],
        },
        {
          name: 'is_published',
          label: 'Should this event Go Live?',
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

      ]
    };
    return formJson;
  }


  render() {
    const { classes } = this.props;
    const { formJson, loading } = this.state;
    if (loading) return (<div>Loading...</div>);
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

CreateNewEventForm.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles, { withTheme: true })(CreateNewEventForm);
