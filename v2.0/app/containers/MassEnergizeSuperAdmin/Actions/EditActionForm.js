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
      action: null,
      vendors: [],
      ccActions: [],
      formJson: null
    };
  }


  async componentDidMount() {
    const { id } = this.props.match.params;
    const actionResponse = await apiCall('/actions.info', { action_id: id });
    if (actionResponse && !actionResponse.success) {
      return;
    }
    if (actionResponse && actionResponse.success) {
      await this.setStateAsync({ action: actionResponse.data });
    }
    const tagCollectionsResponse = await apiCall('/tag_collections.listForCommunityAdmin');
    const communitiesResponse = await apiCall('/communities.listForCommunityAdmin');
    const vendorsResponse = await apiCall('/vendors.listForCommunityAdmin');
    const ccActionsResponse = await apiCall('/cc/info/actions', {}, null, true);

    if (communitiesResponse && communitiesResponse.data) {
      const communities = communitiesResponse.data.map(c => ({ ...c, displayName: c.name, id: '' + c.id }));
      await this.setStateAsync({ communities });
    }

    if (vendorsResponse && vendorsResponse.data) {
      const vendors = vendorsResponse.data.map(c => ({ ...c, displayName: c.name, id: '' + c.id }));
      await this.setStateAsync({ vendors });
    }

    if (ccActionsResponse && ccActionsResponse.actions) {
      const ccActions = (ccActionsResponse.actions || []).map(c => ({ ...c, displayName: c.description, id: '' + c.id }));
      await this.setStateAsync({ ccActions });
    }

    const formJson = await this.createFormJson();
    if (tagCollectionsResponse && tagCollectionsResponse.data) {
      const section = {
        label: 'Please select tag(s) that apply to this action',
        fieldType: 'Section',
        children: []
      };

      Object.values(tagCollectionsResponse.data).forEach(tCol => {
        const { action } = this.state;
        const newField = {
          name: tCol.name,
          label: `${tCol.name} ${tCol.allow_multiple ? '(You can select multiple)' : '(Only one selection allowed)'}`,
          placeholder: '',
          fieldType: 'Checkbox',
          selectMany: tCol.allow_multiple,
          defaultValue: this.getSelectedIds(action.tags, tCol.tags),
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

  createFormJson = async () => {
    const { action, communities, ccActions, vendors } = this.state;
    console.log(action)
    const formJson = {
      title: 'Update Action',
      subTitle: '',
      method: '/actions.update',
      successRedirectPage: `/admin/edit/${action.id}/action`,
      fields: [
        {
          label: 'About this Action',
          fieldType: 'Section',
          children: [
            {
              name: 'action_id',
              label: 'Action ID (Do not Edit)',
              placeholder: 'Use Heat Pumps',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: action.id,
              dbName: 'action_id',
              readOnly: true
            },
            {
              name: 'title',
              label: 'Title of Action (Between 4 and 40 characters)',
              placeholder: 'Use Heat Pumps',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: action.title,
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
              defaultValue: action.rank,
              dbName: 'rank',
              readOnly: false
            },
            {
              name: 'is_global',
              label: 'Is this Action a Template?',
              fieldType: 'Radio',
              isRequired: false,
              defaultValue: action.is_global ? 'true' : 'false',
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
                    defaultValue: action.community && '' + action.community.id,
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
              defaultValue: action.is_published ? 'true' : 'false',
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
          label: 'Carbon Calculator - Link your Action to one of our Carbon Calculator Actions',
          fieldType: 'Section',
          children: [
            {
              name: 'calculator_action',
              label: 'Calculator Action',
              placeholder: 'eg. Wayland',
              fieldType: 'Dropdown',
              defaultValue: action.calculator_action && '' + action.calculator_action.id,
              dbName: 'calculator_action',
              data: ccActions,
              modalTitle: 'Carbon Action List & Instructions',
              modalText: 'Check out the instructions here: https://docs.google.com/document/d/1RisvrGJQifCq9c62etcwR1YCUffExz_T8lR2XDGmokQ/edit',
            },
          ]
        },
        {
          name: 'featured_summary',
          label: 'Featured Summary',
          placeholder: 'eg. This event is happening in ...',
          fieldType: 'TextField',
          isMulti: true,
          isRequired: false,
          defaultValue: action.featured_summary,
          dbName: 'featured_summary',
        },
        {
          name: 'about',
          label: 'Write some detailed description about this action',
          placeholder: 'eg. Write some detailed description about this action',
          fieldType: 'HTMLField',
          isRequired: true,
          defaultValue: action.about,
          dbName: 'about',
        },
        {
          name: 'steps_to_take',
          label: 'Please outline steps to take for your users',
          placeholder: 'eg. Please outline steps to take for your users',
          fieldType: 'HTMLField',
          isRequired: true,
          defaultValue: action.steps_to_take,
          dbName: 'steps_to_take',
        },
        {
          name: 'deep_dive',
          label: 'Deep dive into all the details',
          placeholder: 'eg. This action ...',
          fieldType: 'HTMLField',
          isRequired: true,
          defaultValue: action.deep_dive,
          dbName: 'deep_dive',
        },
        {
          name: 'vendors',
          label: 'Select which vendors provide services for this action',
          placeholder: 'eg. Solarize Wayland',
          fieldType: 'Checkbox',
          selectMany: true,
          defaultValue: action.vendors ? action.vendors.map(v => '' + v.id) : [],
          dbName: 'vendors',
          data: vendors
        },
        {
          name: 'image',
          placeholder: 'Select an Image',
          fieldType: 'File',
          previewLink: action.image && action.image.url,
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
