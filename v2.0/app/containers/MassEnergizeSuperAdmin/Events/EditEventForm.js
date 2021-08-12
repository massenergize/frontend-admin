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
      rescheduledEvent: null
    };
  }


  async componentDidMount() {
    const { id } = this.props.match.params;
    const eventResponse = await apiCall('/events.info', { event_id: id });
    if (eventResponse && !eventResponse.success) {
      return;
    }
    const event = eventResponse.data;
    apiCall('events.exceptions.list', {'event_id': event.id })
    .then((json) => {
      if (json.success) {
        console.log(json);
        this.setState({
          rescheduledEvent: json.data[0]
        });
      } else {
        console.log(json.error);
      }
    })
    .catch((err) => {
      console.log(err);
    });
    const tagCollectionsResponse = await apiCall('/tag_collections.listForCommunityAdmin');
    const communitiesResponse = await apiCall('/communities.listForCommunityAdmin');

    if (communitiesResponse && communitiesResponse.data) {
      const communities = communitiesResponse.data.map(c => ({ ...c, displayName: c.name }));
      await this.setStateAsync({ communities });
    }

    const formJson = await this.createFormJson(event, this.state.rescheduledEvent);
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

  createFormJson = async (event, rescheduledEvent) => {
    const { communities } = this.state;
    const statuses = ['Draft', 'Live', 'Archived']
    
    // const { pathname } = window.location;
    const formJson = {
      title: 'Edit Event or Campaign',
      subTitle: '',
      method: '/events.update',
      successRedirectPage: '/admin/read/events',
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
              placeholder: 'Enter name of event or campaign',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: event.name,
              dbName: 'name',
              readOnly: false
            },
            {
              name: 'featured_summary',
              label: 'One sentence that describes this event',
              placeholder: 'Enter a catchy summary',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: event.featured_summary,
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
              name: 'is_recurring', 
              label: 'Make this a recurring event (if this is a rescheduled instance of a previous recurring event, you cannot make this recurring)', 
              fieldType: 'Radio', 
              isRequired: true,
              defaultValue: event.is_recurring ? 'true' : 'false', 
              dbName: 'is_recurring', 
              readOnly: false, 
              data: [
                { id: 'false', value: 'No' },
                { id: 'true', value: 'Yes' }
              ],
              child: {
                dbName: 'recurring_details',
                valueToCheck: 'true', 
                fields: [
                  {
                    name: 'upcoming_is_cancelled',
                    label: 'The event is recurring. Do you want to cancel the next instance of the event?',
                    fieldType: 'Radio', 
                    isRequired: false,
                    defaultValue: event.recurring_details && event.recurring_details.is_cancelled ? 'true' : 'false',
                    dbName: 'upcoming_is_cancelled', 
                    readOnly: false, 
                    data: [
                      { id: 'false', value: 'No' },
                      { id: 'true', value: 'Yes' }
                    ],
                  },

                  {
                    name: 'upcoming_is_rescheduled', 
                    label: 'Do you want to reschedule the next instance of the event?', 
                    fieldType: 'Radio', 
                    isRequired: false, 
                    defaultValue: rescheduledEvent ? 'true' : 'false',
                    dbName: 'upcoming_is_rescheduled', 
                    readOnly: false, 
                    data: [
                      { id: 'false', value: 'No'}, 
                      { id: 'true', value: 'Yes'}
                    ], 
                    child: {
                      dbName: "rescheduled_details",
                      valueToCheck: 'true',
                      fields: [
                        {
                          name: 'rescheduled_start_datetime', 
                          dbName: 'rescheduled_start_datetime', 
                          label: 'Date and time you want your rescheduled event to take place (must occur before the next instance of the event; e.g., if your event is scheduled for every Friday, you cannot reschedule this Friday to next Saturday.',
                          fieldType: 'DateTime', 
                          contentType: 'text', 
                          isRequired: true
                        },
                        {
                          name: 'rescheduled_end_datetime', 
                          dbName: 'rescheduled_end_datetime', 
                          label: 'Date and time you want your rescheduled event to end',
                          fieldType: 'DateTime', 
                          contentType: 'text', 
                          isRequired: true
                        }
                      ]
                    }
                  },
                  {
                    name: 'separation_count', 
                    label: 'Repeat every', 
                    fieldType: 'Dropdown', 
                    isRequired: true,
                    dbName: 'separation_count',
                    contentType: 'number',
                    defaultValue: event.recurring_details.separation_count,
                    data: [
                      { id: 1, displayName: '1'},
                      { id: 2, displayName: '2'},
                      { id: 3, displayName: '3'},
                      { id: 4, displayName: '4'},
                      { id: 5, displayName: '5'},
                      { id: 6, displayName: '6'}
                    ]
                  },
                  {
                    name: 'recurring_type', 
                    label: '', 
                    fieldType: 'Radio', 
                    dbName: 'recurring_type',
                    isRequired: true,
                    defaultValue: event.recurring_details.recurring_type,
                    data: [
                      { id: 'week', value: 'weeks'}, 
                      { id: 'month', value: 'months'}
                    ]
                  }, 
                  {
                    name: 'day_of_week', 
                    label: 'Choose the day of the week on which you want the event to repeat.', 
                    fieldType: 'Dropdown', 
                    isRequired: true,
                    dbName: 'day_of_week', 
                    defaultValue: event.recurring_details.day_of_week, 
                    data: [
                      { id: 'Monday', displayName: 'Monday'}, 
                      { id: 'Tuesday', displayName: 'Tuesday'},
                      { id: 'Wednesday', displayName: 'Wednesday'}, 
                      { id: 'Thursday', displayName: 'Thursday'}, 
                      { id: 'Friday', displayName: 'Friday'}, 
                      { id: 'Saturday', displayName: 'Saturday'}, 
                      { id: 'Sunday', displayName: 'Sunday'}, 
                    ]
                  }, 
                  {
                    name: 'week_of_month', 
                    label: 'ONLY if you selected "month", choose the week of the month on which you want the event to repeat.', 
                    fieldType: 'Dropdown',
                    isRequired: true,
                    dbName: 'week_of_month',  
                    defaultValue: event.recurring_details.week_of_month, 
                    data: [
                      { id: 'first', displayName: 'first'}, 
                      { id: 'second', displayName: 'second'},
                      { id: 'third', displayName: 'third'}, 
                      { id: 'fourth', displayName: 'fourth'}
                    ]
                  }, 
                ]
              }
            },
            {
              name: 'is_global',
              label: 'Is this Event a Template?',
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
                    placeholder: 'eg. Springfield',
                    fieldType: 'Dropdown',
                    defaultValue: event.community && event.community.id,
                    dbName: 'community_id',
                    data: [{displayName:"--", id:""}, ...communities],
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
                placeholder: 'Street address or public facility',
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
                placeholder: 'eg. "2A"',
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
                placeholder: 'eg. Spriingfield',
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
                placeholder: 'eg. Massachusetts',
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
        {
          name: 'archive',
          label: 'Archive this Event',
          fieldType: 'Radio',
          isRequired: false,
          defaultValue: '' + event.archive,
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
          defaultValue: '' + event.is_published,
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
