import React, { Component } from 'react';
import PropTypes from 'prop-types';
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


class HomePageEditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formJson: null,
      actionsPageData: null,
    };
  }


  async componentDidMount() {
    const { id } = this.props.match.params;

    const actionsPageResponse = await apiCall('/actions_page_settings.info', { community_id: id });
    if (actionsPageResponse && actionsPageResponse.success) {
      await this.setStateAsync({ actionsPageData: actionsPageResponse.data });
    }

    const formJson = await this.createFormJson(actionsPageResponse.data);
    await this.setStateAsync({ formJson });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  createFormJson = async () => {
    const { actionsPageData } = this.state;
    const { community } = actionsPageData;

    const formJson = {
      title: `Edit ${community ? community.name + '\'s' : 'Community\'s'} Actions Page`,
      subTitle: '',
      method: '/actions_page_settings.update',
      cancelLink: `/admin/edit/${community.id}/home`,
      // successRedirectPage: `/admin/edit/${community.id}/all-actions`,
      fields: [
        {
          name: 'id',
          label: 'ID',
          placeholder: 'eg. 1',
          fieldType: 'TextField',
          contentType: 'number',
          isRequired: true,
          defaultValue: `${actionsPageData.id}`,
          dbName: 'id',
          readOnly: true
        },
        {
          name: 'title',
          label: 'Main Title',
          placeholder: 'e.g. All Actions',
          fieldType: 'TextField',
          contentType: 'text',
          isRequired: true,
          defaultValue: `${actionsPageData.title}`,
          dbName: 'title',
          readOnly: false
        },
        {
          name: 'sub-title',
          label: 'Optional Sub-title',
          placeholder: 'e.g. Let us know what you have already done, and pledge to do more for impact',
          fieldType: 'TextField',
          contentType: 'text',
          isRequired: false,
          defaultValue: `${actionsPageData.sub_title}`,
          dbName: 'sub_title',
          readOnly: false
        },
        {
          name: 'description',
          label: 'Paragraph to be displayed below the title',
          placeholder: 'Tell us more ...',
          fieldType: 'TextField',
          contentType: 'text',
          isRequired: false,
          isMultiline: true,
          defaultValue: `${actionsPageData.description}`,
          dbName: 'description',
          readOnly: false
        },
        {
          name: 'featured_video_link',
          label: 'Video Link',
          placeholder: 'eg. https://www.youtube.com/?v=as122aas',
          fieldType: 'TextField',
          contentType: 'text',
          isRequired: false,
          defaultValue: `${actionsPageData.featured_video_link}`,
          dbName: 'featured_video_link',
          readOnly: false
        },
      ]
    };
    return formJson;
  }


  render() {
    const { classes } = this.props;
    const { formJson } = this.state;
    if (!formJson) return (<div>Hold tight! Retrieving your data ...</div>);
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

HomePageEditForm.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles, { withTheme: true })(HomePageEditForm);
