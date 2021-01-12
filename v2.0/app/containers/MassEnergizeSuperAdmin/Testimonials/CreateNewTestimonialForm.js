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


class CreateNewTestimonialForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communities: [],
      actions: [],
      vendors: [],
      formJson: null
    };
  }


  async componentDidMount() {
    const tagCollectionsResponse = await apiCall('/tag_collections.listForCommunityAdmin');
    const actionsResponse = await apiCall('/actions.listForCommunityAdmin');
    const vendorsResponse = await apiCall('/vendors.listForCommunityAdmin');
    const communitiesResponse = await apiCall('/communities.listForCommunityAdmin');

    if (communitiesResponse && communitiesResponse.data) {
      const communities = communitiesResponse.data.map(c => ({ ...c, displayName: c.name }));
      await this.setStateAsync({ communities });
    }

    if (actionsResponse && actionsResponse.data) {
      const actions = actionsResponse.data.map(c => ({ ...c, displayName: c.title + ` - ${c.community && c.community.name}` }));
      await this.setStateAsync({ actions });
    }
    if (vendorsResponse && vendorsResponse.data) {
      const vendors = vendorsResponse.data.map(c => ({ ...c, displayName: c.name }));
      await this.setStateAsync({ vendors });
    }

    const formJson = await this.createFormJson();
    if (tagCollectionsResponse && tagCollectionsResponse.data) {
      const section = {
        label: 'Please select tag(s) that apply to this testimonial',
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

    await this.setStateAsync({ formJson });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  createFormJson = async () => {
    const { communities, actions, vendors } = this.state;
    const formJson = {
      title: 'Create New Testimonial',
      subTitle: '',
      method: '/testimonials.create',
      successRedirectPage: '/admin/read/testimonials',
      fields: [
        {
          label: 'About this Testimonial',
          fieldType: 'Section',
          children: [
            {
              name: 'title',
              label: 'Title of Testimonial',
              placeholder: 'A catchy title so people will read it',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: '',
              dbName: 'title',
              readOnly: false
            },
            {
              name: 'body',
              label: 'Body',
              placeholder: 'Tell us more ...',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              isMultiline: true,
              defaultValue: '',
              dbName: 'body',
              readOnly: false
            },
            {
              name: 'rank',
              label: 'Give this testimonial a number to determine which order it appears in.  Smaller appears first',
              placeholder: 'eg. 0',
              fieldType: 'TextField',
              contentType: 'number',
              isRequired: true,
              defaultValue: '',
              dbName: 'rank',
              readOnly: false
            },
          ]
        },
        {
          label: 'What this Testimonial is linked to',
          fieldType: 'Section',
          children: [
            {
              name: 'community',
              label: 'Primary Community',
              placeholder: 'eg. Wayland',
              fieldType: 'Dropdown',
              defaultValue: null,
              dbName: 'community_id',
              data: communities
            },
            {
              name: 'action',
              label: 'Primary Action',
              placeholder: 'eg. Action',
              fieldType: 'Dropdown',
              defaultValue: null,
              dbName: 'action_id',
              data: actions
            },
            {
              name: 'vendor',
              label: 'Which Vendor did you use?',
              placeholder: 'eg. Wayland',
              fieldType: 'Dropdown',
              defaultValue: null,
              dbName: 'vendor_id',
              data: vendors
            },
            {
              name: 'other_vendor',
              label: 'Other Vendor',
              placeholder: 'Other Vendor',
              fieldType: 'TextField',
              contentType: 'text',
              defaultValue: null,
              dbName: 'other_vendor',
            },
            {
              name: 'user_email',
              label: 'Please provide email of the user',
              placeholder: 'eg. johny.appleseed@massenergize.org',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: '',
              dbName: 'user_email',
              readOnly: false
            },
            {
              name: 'preferredName',
              label: 'Preferred user name to display',
              placeholder: 'User name',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: '',
              dbName: 'preferred_name',
              readOnly: false
            },
          ]
        },
        {
          name: 'image',
          placeholder: 'Select an Image',
          fieldType: 'File',
          dbName: 'image',
          label: 'Upload a file for this testimonial',
          selectMany: false,
          isRequired: true,
          defaultValue: '',
          filesLimit: 1
        },
        {
          name: 'is_approved',
          label: 'Is this testimonial approved ?',
          fieldType: 'Radio',
          isRequired: false,
          defaultValue: 'true',
          dbName: 'is_approved',
          readOnly: false,
          data: [
            { id: 'false', value: 'No' },
            { id: 'true', value: 'Yes' }
          ]
        },
        {
          name: 'is_published',
          label: 'Should this go live ?',
          fieldType: 'Radio',
          isRequired: false,
          defaultValue: 'false',
          dbName: 'is_published',
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

CreateNewTestimonialForm.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles, { withTheme: true })(CreateNewTestimonialForm);
