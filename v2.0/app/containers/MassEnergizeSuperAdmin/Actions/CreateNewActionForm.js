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


class CreateNewActionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communities: [],
      vendors: [],
      formJson: null
    };
  }


  async componentDidMount() {
    const tagCollectionsResponse = await apiCall('/tag_collections.listForSuperAdmin');
    const communitiesResponse = await apiCall('/communities.listForCommunityAdmin');
    const vendorsResponse = await apiCall('/vendors.listForSuperAdmin');

    if (communitiesResponse && communitiesResponse.data) {
      const communities = communitiesResponse.data.map(c => ({ ...c, displayName: c.name, id: '' + c.id }));
      await this.setStateAsync({ communities });
    }

    if (vendorsResponse && vendorsResponse.data) {
      const vendors = vendorsResponse.data.map(c => ({ ...c, displayName: c.name, id: '' + c.id }));
      await this.setStateAsync({ vendors });
    }

    const formJson = await this.createFormJson();
    if (tagCollectionsResponse && tagCollectionsResponse.data) {
      const section = {
        label: 'Please select tag(s) that apply to this action',
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
        section.children.push(newField);
      });

      // want this to be the 2nd field
      formJson.fields.splice(1, 0, section);
    }

    await this.setStateAsync({ formJson });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  createFormJson = async () => {
    const { communities, vendors } = this.state;
    const formJson = {
      title: 'Create a New Action',
      subTitle: '',
      method: '/actions.create',
      // successRedirectPage: '/admin/read/actions',
      fields: [
        {
          label: 'About this Action',
          fieldType: 'Section',
          children: [
            {
              name: 'title',
              label: 'Title of Action (Between 4 and 25 characters)',
              placeholder: 'Use Heat Pumps',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: '',
              dbName: 'title',
              readOnly: false
            },
            {
              name: 'rank',
              label: 'Rank (Which order should this action appear in?  Lower numbers come first)',
              placeholder: 'eg. 1',
              fieldType: 'TextField',
              contentType: 'number',
              isRequired: true,
              defaultValue: '',
              dbName: 'rank',
              readOnly: false
            },
            {
              name: 'is_global',
              label: 'Is this Action a Global/Template Action?',
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
                    data: communities
                  },
                ]
              }
            },
            {
              name: 'is_published',
              label: 'Should this action go live?',
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
        },
        {
          name: 'featured_summary',
          label: 'Featured Summary',
          placeholder: 'eg. This event is happening in ...',
          fieldType: 'TextField',
          isMulti: true,
          isRequired: true,
          defaultValue: null,
          dbName: 'featured_summary',
        },
        {
          name: 'about',
          label: 'Write some detailed description about this action',
          placeholder: 'eg. This event is happening in ...',
          fieldType: 'HTMLField',
          isRequired: true,
          defaultValue: null,
          dbName: 'about',
        },
        {
          name: 'steps_to_take',
          label: 'Please outline steps to take for your users',
          placeholder: 'eg. This event is happening in ...',
          fieldType: 'HTMLField',
          isRequired: true,
          defaultValue: null,
          dbName: 'steps_to_take',
        },
        {
          name: 'vendors',
          label: 'Select which vendors provide services for this action',
          placeholder: 'eg. Solarize Wayland',
          fieldType: 'Checkbox',
          selectMany: true,
          defaultValue: null,
          dbName: 'vendors',
          data: vendors
        },
        {
          name: 'image',
          placeholder: 'Select an Image',
          fieldType: 'File',
          dbName: 'image',
          label: 'Upload Files',
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

CreateNewActionForm.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles, { withTheme: true })(CreateNewActionForm);
