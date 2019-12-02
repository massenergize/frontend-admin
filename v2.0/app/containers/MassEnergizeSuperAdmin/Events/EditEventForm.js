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
      formJson: null
    };
  }


  async componentDidMount() {
    const { id } = this.props.match.params;
    const eventResponse = await apiCall('/events.info', { event_id: id });
    if (eventResponse && !eventResponse.success) {
      return;
    }
    const event = eventResponse.data;
    const tagCollectionsResponse = await apiCall('/tag_collections.listForCommunityAdmin');
    const communitiesResponse = await apiCall('/communities.listForCommunityAdmin');

    if (communitiesResponse && communitiesResponse.data) {
      const communities = communitiesResponse.data.map(c => ({ ...c, displayName: c.name }));
      await this.setStateAsync({ communities });
    }

    const formJson = await this.createFormJson(event);
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
          defaultValue: this.getSelectedIds(event.tags, tCol.tags),
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

    await this.setStateAsync({ formJson });
  }

  getSelectedIds = (selected, dataToCrossCheck) => {
    const res = [];
    selected.forEach(s => {
      if (dataToCrossCheck.filter(d => d.id === s.id).length > 0) {
        res.push('' + s.id);
      }
    });
    return res;
  }


  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  createFormJson = async (event) => {
    const { communities } = this.state;
    const { pathname } = window.location;
    console.log(event);
    const formJson = {
      title: 'Create New Event',
      subTitle: '',
      method: '/events.update',
      successRedirectPage: pathname || '/admin/read/events',
      fields: [
        {
          label: 'Update this event',
          fieldType: 'Section',
          children: [
            {
              name: 'event_id',
              label: 'Event ID',
              placeholder: 'Event ID',
              fieldType: 'TextField',
              contentType: 'number',
              isRequired: true,
              defaultValue: event.id,
              dbName: 'event_id',
              readOnly: true
            },
            {
              name: 'name',
              label: 'Name of Event',
              placeholder: 'Wayland Heatpump Event',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: event.name,
              dbName: 'name',
              readOnly: false
            },
            {
              name: 'rank',
              label: 'Rank (Which order should this event appear in?  Lower numbers come first)',
              placeholder: 'eg. 1',
              fieldType: 'TextField',
              contentType: 'number',
              isRequired: true,
              defaultValue: event.rank,
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
              defaultValue: event.start_date_and_time,
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
              defaultValue: event.end_date_and_time,
              dbName: 'end_date_and_time',
              readOnly: false
            },
            {
              name: 'is_global',
              label: 'Is this Event Global',
              fieldType: 'Radio',
              isRequired: false,
              defaultValue: '' + event.is_global,
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
                    defaultValue: event.community && event.community.id,
                    dbName: 'community_id',
                    data: communities
                  },
                ]
              }
            },
          ]
        },
        {
          name: 'have_address',
          label: 'Do you have an address?',
          fieldType: 'Radio',
          isRequired: false,
          defaultValue: event.location ? 'true' : 'false',
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
                defaultValue: event.location && event.location.address,
                dbName: 'address',
                readOnly: false
              },
              {
                name: 'unit',
                label: 'Unit Number',
                placeholder: 'eg. wayland',
                fieldType: 'TextField',
                contentType: 'text',
                isRequired: false,
                defaultValue: event.location && event.location.unit,
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
                defaultValue: event.location && event.location.city,
                dbName: 'city',
                readOnly: false
              },
              {
                name: 'state',
                label: 'State ',
                placeholder: 'eg. New York',
                fieldType: 'Dropdown',
                contentType: 'text',
                isRequired: true,
                data: states,
                defaultValue: event.location && event.location.state,
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
          defaultValue: event.description,
          dbName: 'description',
        },
        {
          name: 'image',
          placeholder: 'Select an Image',
          fieldType: 'File',
          dbName: 'image',
          label: 'Upload Files',
          selectMany: false,
          isRequired: true,
          previewLink: [event.image && event.image.url],
          defaultValue: [],
          filesLimit: 1
        },
      ]
    };
    return formJson;
  }


  render() {
    const { classes } = this.props;
    const { formJson } = this.state;
    if (!formJson) return (<div style={{ color: 'white' }}><h1>Loading ...</h1></div>);
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
