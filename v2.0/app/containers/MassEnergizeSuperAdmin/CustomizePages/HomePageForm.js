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
      homePageData: null,
      events: null
    };
  }


  async componentDidMount() {
    const { id } = this.props.match.params;

    const homePageResponse = await apiCall('/home_page_settings.info', { community_id: id });
    if (homePageResponse && homePageResponse.success) {
      await this.setStateAsync({ homePageData: homePageResponse.data });
    }

    const eventsResponse = await apiCall('/events.list', { community_id: id });
    if (eventsResponse && eventsResponse.data) {
      const events = eventsResponse.data.map(c => ({ ...c, displayName: c.name, id: '' + c.id }));
      await this.setStateAsync({ events });
    }

    const formJson = await this.createFormJson(homePageResponse.data);
    await this.setStateAsync({ formJson });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  createFormJson = async () => {
    const { homePageData, events } = this.state;
    const { community, images, featured_links, featured_events } = homePageData;
    const [image1, image2, image3] = images;
    const [iconBox1, iconBox2, iconBox3, iconBox4] = featured_links;
    const { goal } = homePageData;
    const selectedEvents = homePageData ? featured_events.map(e => '' + e.id) : [];


    const formJson = {
      title: `Edit ${community ? community.name + '\'s' : 'Community\'s'} HomePage`,
      subTitle: '',
      method: '/home_page_settings.update',
      successRedirectPage: `/admin/edit/${community.id}/home`,
      fields: [
        {
          name: 'id',
          label: 'ID',
          placeholder: 'eg. 1',
          fieldType: 'TextField',
          contentType: 'number',
          isRequired: true,
          defaultValue: `${homePageData.id}`,
          dbName: 'id',
          readOnly: true
        },
        {
          label: 'Welcome Title and Pictures',
          fieldType: 'Section',
          children: [
            {
              name: 'title',
              label: 'Main Title',
              placeholder: 'eg. Welcome to Wayland!',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              defaultValue: `${homePageData.title}`,
              dbName: 'title',
              readOnly: false
            },
            {
              name: 'description',
              label: 'Paragraph to be displayed below the title',
              placeholder: 'Tell us more ...',
              fieldType: 'TextField',
              contentType: 'text',
              isRequired: true,
              isMultiline: true,
              defaultValue: `${homePageData.description}`,
              dbName: 'description',
              readOnly: false
            },
          ]
        },
        {
          label: 'Upload your 3 pictures',
          fieldType: 'Section',
          children: [
            {
              name: 'image_1',
              placeholder: 'Picture 1',
              fieldType: 'File',
              dbName: 'image_1',
              label: 'Upload Picture 1',
              previewLink: `${image1 && image1.url}`,
              selectMany: false,
              isRequired: false,
              defaultValue: [],
              filesLimit: 1
            },
            {
              name: 'image_2',
              placeholder: 'Picture 2',
              fieldType: 'File',
              dbName: 'image_2',
              previewLink: `${image2 && image2.url}`,
              label: 'Upload Picture 2',
              selectMany: false,
              isRequired: false,
              defaultValue: [],
              filesLimit: 1
            },
            {
              name: 'image_3',
              placeholder: 'Picture 3',
              fieldType: 'File',
              previewLink: `${image3 && image3.url}`,
              dbName: 'image_3',
              label: 'Upload Picture 3',
              selectMany: false,
              isRequired: false,
              defaultValue: [],
              filesLimit: 1
            },
          ]
        },
        {
          label: 'Home Page Statistics',
          fieldType: 'Section',
          children: [
            {
              name: 'show_featured_stats',
              label: 'Should we display summary Stats on your home page?',
              fieldType: 'Radio',
              isRequired: false,
              defaultValue: `${homePageData.show_featured_stats}`,
              dbName: 'show_featured_stats',
              readOnly: false,
              data: [
                { id: 'false', value: 'No' },
                { id: 'true', value: 'Yes' }
              ],
              child: {
                valueToCheck: 'true',
                fields: [
                  {
                    name: 'attained_number_of_actions',
                    label: 'Attained Number of Actions',
                    placeholder: 'eg. 100',
                    fieldType: 'TextField',
                    contentType: 'number',
                    isRequired: false,
                    defaultValue: goal && goal.attained_number_of_actions,
                    dbName: 'attained_number_of_actions',
                    readOnly: false
                  },
                  {
                    name: 'target_number_of_actions',
                    label: 'Attained Number of Actions',
                    placeholder: 'eg. 100',
                    fieldType: 'TextField',
                    contentType: 'number',
                    isRequired: false,
                    defaultValue: goal && goal.target_number_of_actions,
                    dbName: 'target_number_of_actions',
                    readOnly: false
                  },
                  {
                    name: 'attained_number_of_households',
                    label: 'How many households joined this community?',
                    placeholder: 'eg. 100',
                    fieldType: 'TextField',
                    contentType: 'number',
                    isRequired: false,
                    defaultValue: goal && goal.attained_number_of_households,
                    dbName: 'attained_number_of_households',
                    readOnly: false
                  },
                  {
                    name: 'target_number_of_households',
                    label: 'How many households joined this community?',
                    placeholder: 'eg. 100',
                    fieldType: 'TextField',
                    contentType: 'number',
                    isRequired: false,
                    defaultValue: goal && goal.target_number_of_households,
                    dbName: 'target_number_of_households',
                    readOnly: false
                  },
                ]
              }
            },
          ]
        },
        {
          label: 'Events Section',
          fieldType: 'Section',
          children: [
            {
              name: 'show_featured_events',
              label: 'Should we display some selected events on the home page?',
              fieldType: 'Radio',
              isRequired: false,
              defaultValue: `${homePageData.show_featured_events}`,
              dbName: 'show_featured_events',
              readOnly: false,
              data: [
                { id: 'false', value: 'No' },
                { id: 'true', value: 'Yes' }
              ],
              child: {
                valueToCheck: 'true',
                fields: [
                  {
                    name: 'featured_events',
                    label: 'Select which events to show up on the home Page',
                    placeholder: '',
                    fieldType: 'Checkbox',
                    selectMany: true,
                    defaultValue: selectedEvents,
                    dbName: 'featured_events',
                    data: events
                  }
                ]
              }
            },
          ]
        },
        {
          label: 'Icon Links: The four icon boxes on the Home Page',
          fieldType: 'Section',
          children: [
            {
              name: 'show_featured_links',
              label: 'Should we display summary Stats on your home page?',
              fieldType: 'Radio',
              isRequired: false,
              defaultValue: `${homePageData.show_featured_links}`,
              dbName: 'show_featured_links',
              readOnly: false,
              data: [
                { id: 'false', value: 'No' },
                { id: 'true', value: 'Yes' }
              ],
              child: {
                valueToCheck: 'true',
                fields: [
                  {
                    label: 'Icon Box 1',
                    fieldType: 'Section',
                    children: [
                      {
                        name: 'icon_box_1_title',
                        label: 'Title on Icon Box 1',
                        placeholder: 'eg. Take Action',
                        fieldType: 'TextField',
                        contentType: 'text',
                        isRequired: false,
                        defaultValue: `${iconBox1 && iconBox1.title}`,
                        dbName: 'icon_box_1_title',
                        readOnly: false
                      },
                      {
                        name: 'icon_box_1_icon',
                        label: 'Put an icon Name: (select from ...)',
                        placeholder: 'eg. 100',
                        fieldType: 'TextField',
                        contentType: 'text',
                        isRequired: false,
                        defaultValue: `${iconBox1 && iconBox1.icon}`,
                        dbName: 'icon_box_1_icon',
                        readOnly: false
                      },
                      {
                        name: 'icon_box_1_link',
                        label: 'Url: When someone clicks, where should it go?',
                        placeholder: 'eg. 100',
                        fieldType: 'TextField',
                        contentType: 'text',
                        isRequired: false,
                        defaultValue: `${iconBox1 && iconBox1.link}`,
                        dbName: 'icon_box_1_link',
                        readOnly: false
                      },
                      {
                        name: 'icon_box_1_description',
                        label: 'Short description the card (no more than 20 characters)',
                        placeholder: 'Tell us more ...',
                        fieldType: 'TextField',
                        contentType: 'text',
                        isRequired: true,
                        isMultiline: true,
                        defaultValue: `${iconBox1 && iconBox1.description}`,
                        dbName: 'icon_box_1_description',
                        readOnly: false
                      },
                    ]
                  },
                  {
                    label: 'Icon Box 2',
                    fieldType: 'Section',
                    children: [
                      {
                        name: 'icon_box_2_title',
                        label: 'Title on Icon Box 2',
                        placeholder: 'eg. Take Action',
                        fieldType: 'TextField',
                        contentType: 'text',
                        isRequired: false,
                        defaultValue: `${iconBox2 && iconBox2.title}`,
                        dbName: 'icon_box_2_title',
                        readOnly: false
                      },
                      {
                        name: 'icon_box_2_icon',
                        label: 'Put an icon Name: (select from ...)',
                        placeholder: 'eg. 100',
                        fieldType: 'TextField',
                        contentType: 'text',
                        isRequired: false,
                        defaultValue: `${iconBox2 && iconBox2.icon}`,
                        dbName: 'icon_box_2_icon',
                        readOnly: false
                      },
                      {
                        name: 'icon_box_2_link',
                        label: 'Url: When someone clicks, where should it go?',
                        placeholder: 'eg. 100',
                        fieldType: 'TextField',
                        contentType: 'text',
                        isRequired: false,
                        defaultValue:  `${iconBox2 && iconBox2.link}`,
                        dbName: 'icon_box_2_link',
                        readOnly: false
                      },
                      {
                        name: 'icon_box_2_description',
                        label: 'Short description the card (no more than 20 characters)',
                        placeholder: 'Tell us more ...',
                        fieldType: 'TextField',
                        contentType: 'text',
                        isRequired: true,
                        isMultiline: true,
                        defaultValue: `${iconBox2 && iconBox2.description}`,
                        dbName: 'icon_box_2_description',
                        readOnly: false
                      },
                    ]
                  },
                  {
                    label: 'Icon Box 3',
                    fieldType: 'Section',
                    children: [
                      {
                        name: 'icon_box_3_title',
                        label: 'Title on Icon Box 1',
                        placeholder: 'eg. Take Action',
                        fieldType: 'TextField',
                        contentType: 'text',
                        isRequired: false,
                        defaultValue: `${iconBox3 && iconBox3.title}`,
                        dbName: 'icon_box_3_title',
                        readOnly: false
                      },
                      {
                        name: 'icon_box_3_icon',
                        label: 'Put an icon Name: (select from ...)',
                        placeholder: 'eg. 100',
                        fieldType: 'TextField',
                        contentType: 'text',
                        isRequired: false,
                        defaultValue: `${iconBox3 && iconBox3.icon}`,
                        dbName: 'icon_box_3_icon',
                        readOnly: false
                      },
                      {
                        name: 'icon_box_3_link',
                        label: 'Url: When someone clicks, where should it go?',
                        placeholder: 'eg. 100',
                        fieldType: 'TextField',
                        contentType: 'text',
                        isRequired: false,
                        defaultValue: `${iconBox3 && iconBox3.link}`,
                        dbName: 'icon_box_3_link',
                        readOnly: false
                      },
                      {
                        name: 'icon_box_3_description',
                        label: 'Short description the card (no more than 20 characters)',
                        placeholder: 'Tell us more ...',
                        fieldType: 'TextField',
                        contentType: 'text',
                        isRequired: true,
                        isMultiline: true,
                        defaultValue: `${iconBox3 && iconBox3.description}`,
                        dbName: 'icon_box_3_description',
                        readOnly: false
                      },
                    ]
                  },
                  {
                    label: 'Icon Box 4',
                    fieldType: 'Section',
                    children: [
                      {
                        name: 'icon_box_4_title',
                        label: 'Title on Icon Box 1',
                        placeholder: 'eg. Take Action',
                        fieldType: 'TextField',
                        contentType: 'text',
                        isRequired: false,
                        defaultValue: `${iconBox4 && iconBox4.title}`,
                        dbName: 'icon_box_4_title',
                        readOnly: false
                      },
                      {
                        name: 'icon_box_4_icon',
                        label: 'Put an icon Name: (select from ...)',
                        placeholder: 'eg. 100',
                        fieldType: 'TextField',
                        contentType: 'text',
                        isRequired: false,
                        defaultValue: `${iconBox4 && iconBox4.icon}`,
                        dbName: 'icon_box_4_icon',
                        readOnly: false
                      },
                      {
                        name: 'icon_box_4_link',
                        label: 'Url: When someone clicks, where should it go?',
                        placeholder: 'eg. 100',
                        fieldType: 'TextField',
                        contentType: 'text',
                        isRequired: false,
                        defaultValue: `${iconBox4 && iconBox4.link}`,
                        dbName: 'icon_box_4_link',
                        readOnly: false
                      },
                      {
                        name: 'icon_box_1_description',
                        label: 'Short description the card (no more than 20 characters)',
                        placeholder: 'Tell us more ...',
                        fieldType: 'TextField',
                        contentType: 'text',
                        isRequired: true,
                        isMultiline: true,
                        defaultValue: `${iconBox4 && iconBox4.description}`,
                        dbName: 'icon_box_4_description',
                        readOnly: false
                      },
                    ]
                  },
                ]
              }
            },
          ]
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
