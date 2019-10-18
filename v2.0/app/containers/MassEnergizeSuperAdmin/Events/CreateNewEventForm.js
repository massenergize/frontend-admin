import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
      // tags: [],
      communities: [],
      tagCollections: [],
      formJson: null
    };
  }


  async componentDidMount() {
    const tagCollectionsResponse = await apiCall('/tag_collections.listForSuperAdmin');
    const communitiesResponse = await apiCall('/tag_collections.listForSuperAdmin');

    if (tagCollectionsResponse && tagCollectionsResponse.data) {
      const tags = [];
      Object.values(tagCollectionsResponse.data).forEach(tCol => {
        Object.values(tCol.tags).forEach(t => {
          tags.push({ ...t, tagCollection: tCol.name });
        });
      });
      await this.setStateAsync({ tags });
      await this.setStateAsync({ tagCollections: tagCollectionsResponse.data });
    }

    if (communitiesResponse && communitiesResponse.data) {
      await this.setStateAsync({ communities: communitiesResponse.data });
    }

    await this.createFormJson();
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  createFormJson = async () => {
    const { communities, tagCollections } = this.state;
    const formJson = {
      title: 'Create New Event',
      subTitle: '',
      method: '/events.create',
      fields: [
        {
          name: 'name',
          label: 'Name of Event',
          placeholder: '',
          fieldType: 'TextField',
          contentType: 'text',
          isRequired: true,
          defaultValue: '',
          dbName: '',
          readOnly: false
        },
        {
          name: 'start_date_and_time',
          label: 'Start Date And Time: YYYY-MM-DD HH:MM',
          placeholder: 'YYYY-MM-DD HH:MM',
          fieldType: 'TextField',
          contentType: 'text',
          isRequired: false,
          defaultValue: '',
          dbName: 'start_date_and_time',
          readOnly: false
        },
        {
          name: 'end_date_and_time',
          label: 'End Date And Time: YYYY-MM-DD HH:MM',
          placeholder: 'YYYY-MM-DD HH:MM',
          fieldType: 'TextField',
          contentType: 'text',
          isRequired: false,
          defaultValue: '',
          dbName: 'end_date_and_time',
          readOnly: false
        },
        {
          name: 'is_global',
          label: 'Is this Event Global',
          fieldType: 'Radio',
          isRequired: false,
          defaultValue: false,
          dbName: 'is_global',
          readOnly: false,
          data: [
            { id: false, value: 'No' },
            { id: true, value: 'Yes' }
          ],
          child: {
            valueToCheck: false,
            fields: [
              {
                name: 'community',
                label: 'Primary Community',
                placeholder: 'eg. Wayland',
                fieldType: 'Dropdown',
                defaultValue: null,
                dbName: 'community_id',
                data: communities
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
          name: 'tags',
          label: 'Select your Tag',
          placeholder: 'YYYY-MM-DD HH:MM',
          fieldType: 'TextField',
          contentType: 'text',
          isRequired: false,
          defaultValue: '',
          dbName: 'tags',
          readOnly: false,
          data: tagCollections
        },
        {
          name: 'image',
          placeholder: 'Select an Image',
          fieldType: 'File',
          dbName: 'image',
          label: 'Upload Files',
          selectMany: false,
          isRequired: true,
          defaultValue: '',
          filesLimit: 1
        },
        {
          name: 'tags',
          placeholder: '',
          fieldType: 'Checkbox',
          selectMany: true,
          dbName: '',
          data: tagCollections
        },
        {
          name: 'files',
          label: 'Upload Files',
          placeholder: '',
          fieldType: 'File',
          selectMany: true,
          contentType: 'text',
          isRequired: true,
          defaultValue: '',
          dbName: 'files',
          readOnly: false,
          filesLimit: 1
        },
      ]
    };
    await this.setStateAsync({ formJson });
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

CreateNewEventForm.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles, { withTheme: true })(CreateNewEventForm);
