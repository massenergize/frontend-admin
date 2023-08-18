import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
import MassEnergizeForm from '../_FormGenerator';
import { apiCall } from '../../../utils/messenger';
import Seo from '../../../components/Seo/Seo';

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
    margin: theme.spacing(4),
    textAlign: 'center'
  },
});


class ContactUsPageEditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formJson: null,
      contactUsPageData: null,
    };
  }


  async componentDidMount() {
    const { id } = this.props.match.params;

    const contactUsPageResponse = await apiCall('/contact_us_page_settings.info', { community_id: id });
    if (contactUsPageResponse && contactUsPageResponse.success) {
      await this.setStateAsync({ contactUsPageData: contactUsPageResponse.data });
    }

    const formJson = await this.createFormJson(contactUsPageResponse.data);
    await this.setStateAsync({ formJson });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  createFormJson = async () => {
    const { contactUsPageData } = this.state;
    const { community } = contactUsPageData;

    const formJson = {
      title: `Edit ${community ? community.name + '\'s' : 'Community\'s'} Contact Us Page`,
      subTitle: '',
      method: '/contact_us_page_settings.update',
      // successRedirectPage: `/admin/edit/${community.id}/contact_us`,
      fields: [
        {
          name: 'id',
          label: 'ID',
          placeholder: 'eg. 1',
          fieldType: 'TextField',
          contentType: 'number',
          defaultValue: `${contactUsPageData.id}`,
          dbName: 'id',
          readOnly: true
        },
        {
          name: 'title',
          label: 'Main Title',
          placeholder: 'Contact the community administrator',
          fieldType: 'TextField',
          contentType: 'text',
          isRequired: false,
          defaultValue: `${contactUsPageData.title}`,
          dbName: 'title',
          readOnly: false
        },
        //  -- not needed currently -- may change later
        //{
        //  name: 'sub-title',
        //  label: 'Optional sub-title',
        //  placeholder: 'They will get back to you shortly.',
        //  fieldType: 'TextField',
        //  contentType: 'text',
        //  isRequired: false,
        //  defaultValue: `${contactUsPageData.sub_title}`,
        //  dbName: 'sub_title',
        //  readOnly: false
        //},
        {
          name: 'description',
          label: 'Paragraph to be displayed below the title',
          placeholder: 'Tell us more ...',
          fieldType: 'TextField',
          contentType: 'text',
          isRequired: false,
          isMultiline: true,
          defaultValue: `${contactUsPageData.description}`,
          dbName: 'description',
          readOnly: false
        },
        {
          name: "enable",
          fieldType: "Radio",
          dbName: "is_published",
          label: "This page is enabled if checked",
          isRequired: false,
          defaultValue: `${contactUsPageData.is_published}`,
          data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }],
        },
      ]
    };
    return formJson;
  }


  render() {
    const { classes } = this.props;
    const { formJson, contactUsPageData } = this.state;
    if (!formJson) return (<div>Hold tight! Retrieving your data ...</div>);
    return (
      <div>
        <Seo name={`Edit - ${contactUsPageData?.community?.name}'s Contact Us Page`}/>
        <MassEnergizeForm
          classes={classes}
          formJson={formJson}
        />
      </div>
    );
  }
}

ContactUsPageEditForm.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles, { withTheme: true })(ContactUsPageEditForm);
