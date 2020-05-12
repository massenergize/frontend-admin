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


class EditTestimonial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communities: [],
      actions: [],
      vendors: [],
      formJson: null,
      testimonial: null
    };
  }


  async componentDidMount() {
    const { id } = this.props.match.params;
    const testimonialResponse = await apiCall('/testimonials.info', { testimonial_id: id });
    console.log(testimonialResponse)
    if (testimonialResponse && !testimonialResponse.success) {
      return;
    }
    const testimonial = testimonialResponse.data;
    await this.setStateAsync({ testimonial });
    const tagCollectionsResponse = await apiCall('/tag_collections.listForCommunityAdmin');
    const actionsResponse = await apiCall('/actions.listForCommunityAdmin');
    const vendorsResponse = await apiCall('/vendors.listForCommunityAdmin');
    const communitiesResponse = await apiCall('/communities.listForCommunityAdmin');

    if (communitiesResponse && communitiesResponse.data) {
      const communities = communitiesResponse.data.map(c => ({ ...c, id: '' + c.id, displayName: c.name }));
      await this.setStateAsync({ communities });
    }

    if (actionsResponse && actionsResponse.data) {
      const actions = actionsResponse.data.map(c => ({ ...c, id: '' + c.id, displayName: c.title + ` - ${c.community && c.community.name}` }));
      await this.setStateAsync({ actions });
    }
    if (vendorsResponse && vendorsResponse.data) {
      const vendors = vendorsResponse.data.map(c => ({ ...c, id: '' + c.id, displayName: c.name }));
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
          defaultValue: this.getSelectedIds(testimonial.tags, tCol.tags),
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

  getSelectedIds = (selected, dataToCrossCheck) => {
    const res = [];
    selected.forEach(s => {
      if (dataToCrossCheck.filter(d => d.id === s.id).length > 0) {
        res.push('' + s.id);
      }
    });
    console.log(res);
    return res;
  }

  createFormJson = async () => {
    const {
      communities, actions, vendors, testimonial
    } = this.state;

    const formJson = {
      title: 'Edit Testimonial',
      subTitle: '',
      method: '/testimonials.update',
      successRedirectPage: '/admin/read/testimonials',
      fields: [
        {
          label: 'About this Testimonial',
          fieldType: 'Section',
          children: [
            {
              name: 'ID',
              label: 'ID',
              placeholder: '0',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: testimonial && testimonial.id,
              dbName: 'testimonial_id',
              readOnly: true
            },
            {
              name: 'preferredName',
              label: 'Preferred user name to display',
              placeholder: 'User name',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: false,
              defaultValue: testimonial && testimonial.preferred_name,
              dbName: 'preferred_name',
              readOnly: false
            },
            {
              name: 'title',
              label: 'Title of Testimonial',
              placeholder: 'Enter a catchy title',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: testimonial && testimonial.title,
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
              defaultValue: testimonial && testimonial.body,
              dbName: 'body',
              readOnly: false
            },
            {
              name: 'is_approved',
              label: 'Do you approve this testimonial?',
              fieldType: 'Radio',
              isRequired: false,
              defaultValue: (testimonial && testimonial.is_approved) ? 'true' : 'false',
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
              defaultValue: (testimonial && testimonial.is_published) ? 'true' : 'false',
              dbName: 'is_published',
              readOnly: false,
              data: [
                { id: 'false', value: 'No' },
                { id: 'true', value: 'Yes' }
              ]
            },
            {
              name: 'rank',
              label: 'Give this testimonial a number to determine which order it appears in.  Smaller appears first',
              placeholder: 'eg. 0',
              fieldType: 'TextField',
              contentType: 'number',
              isRequired: true,
              defaultValue: testimonial && testimonial.rank,
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
              defaultValue: testimonial && testimonial.community && '' + testimonial.community.id,
              dbName: 'community_id',
              data: communities
            },
            {
              name: 'action',
              label: 'Primary Action',
              placeholder: 'eg. Action',
              fieldType: 'Dropdown',
              defaultValue: testimonial && testimonial.action && '' + testimonial.action.id,
              dbName: 'action_id',
              data: actions
            },
            {
              name: 'vendor',
              label: 'Which Vendor did you use?',
              placeholder: 'eg. Wayland',
              fieldType: 'Dropdown',
              defaultValue: testimonial && testimonial.vendor && testimonial && '' + testimonial.vendor.id,
              dbName: 'vendor_id',
              data: vendors
            },
            {
              name: 'other_vendor',
              label: 'Other Vendor',
              placeholder: 'Other Vendor',
              fieldType: 'TextField',
              contentType: 'text',
              defaultValue: testimonial && testimonial.other_vendor,
              dbName: 'other_vendor',
            },
          ]
        },
        {
          name: 'image',
          placeholder: 'Select an Image',
          fieldType: 'File',
          dbName: 'image',
          previewLink: testimonial && testimonial.image && testimonial.image.url,
          label: 'Upload a file for this testimonial',
          selectMany: false,
          isRequired: true,
          defaultValue: '',
          filesLimit: 1
        },
      ]
    };
    return formJson;
  }


  render() {
    const { classes } = this.props;
    const { formJson, testimonial } = this.state;
    if (!formJson) return (<div>Hold tight! Preparing your form ...</div>);
    return (
      <div>
        {testimonial.user && (
          <p>
            Created By:&nbsp;
            {testimonial.user.full_name}
            ,&nbsp;
            {testimonial.user.email}
          </p>
        )}
        {!testimonial.user && (
          <p>Created By: Community Admin</p>
        )
        }
        <br />
        <MassEnergizeForm
          classes={classes}
          formJson={formJson}
        />
      </div>
    );
  }
}

EditTestimonial.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles, { withTheme: true })(EditTestimonial);
