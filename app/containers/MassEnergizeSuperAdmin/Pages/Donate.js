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


class DonatePageEditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formJson: null,
      donatePageData: null,
    };
  }


  async componentDidMount() {
    const { id } = this.props.match.params;

    const donatePageResponse = await apiCall('/donate_page_settings.info', { community_id: id });
    if (donatePageResponse && donatePageResponse.success) {
      await this.setStateAsync({ donatePageData: donatePageResponse.data });
    }

    const formJson = await this.createFormJson(donatePageResponse.data);
    await this.setStateAsync({ formJson });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  createFormJson = async () => {
    const { donatePageData } = this.state;
    const { community } = donatePageData;

    const formJson = {
      title: `Edit ${community ? community.name + '\'s' : 'Community\'s'} Donate Page`,
      subTitle: '',
      method: '/donate_page_settings.update',
      // successRedirectPage: `/admin/edit/${community.id}/donate`,
      fields: [
        {
          name: 'id',
          label: 'ID',
          placeholder: 'eg. 1',
          fieldType: 'TextField',
          contentType: 'number',
          defaultValue: `${donatePageData.id}`,
          dbName: 'id',
          readOnly: true
        },
        {
          name: 'title',
          label: 'Main Title',
          placeholder: 'eg. Help us reach our goal!',
          fieldType: 'TextField',
          contentType: 'text',
          isRequired: false,
          defaultValue: `${donatePageData.title}`,
          dbName: 'title',
          readOnly: false
        },
        {
          name: 'sub-title',
          label: 'Optional sub-title',
          placeholder: 'Every donation counts',
          fieldType: 'TextField',
          contentType: 'text',
          isRequired: false,
          defaultValue: `${donatePageData.sub_title}`,
          dbName: 'sub_title',
          readOnly: false
        },
        {
          name: 'description',
          label: 'Paragraph to be displayed below the title',
          placeholder: 'Tell us more ...',
          fieldType: 'HTMLField',
          contentType: 'text',
          isRequired: true,
          isMultiline: true,
          defaultValue: `${donatePageData.description}`,
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
          defaultValue: `${donatePageData.featured_video_link}`,
          dbName: 'featured_video_link',
          readOnly: false
        },
        {
          name: 'donation_link',
          label: 'Community Donation Link',
          placeholder: 'eg. https://www.your-org.org/your-donate-page',
          fieldType: 'TextField',
          contentType: 'text',
          isRequired: false,
          defaultValue: `${donatePageData.donation_link}`,
          dbName: 'donation_link',
          readOnly: false
        },
        {
          name: "enable",
          fieldType: "Radio",
          dbName: "is_published",
          label: "This page is enabled if checked",
          isRequired: false,
          defaultValue: `${donatePageData.is_published}`,
          data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }],
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

DonatePageEditForm.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles, { withTheme: true })(DonatePageEditForm);
