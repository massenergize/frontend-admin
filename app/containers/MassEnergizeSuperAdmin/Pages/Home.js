import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import MassEnergizeForm from "../_FormGenerator";
import { apiCall } from "../../../utils/messenger";
import fieldTypes from "../_FormGenerator/fieldTypes";


const styles = (theme) => ({
  root: {
    flexGrow: 1,
    padding: 30,
  },
  field: {
    width: "100%",
    marginBottom: 20,
  },
  fieldBasic: {
    width: "100%",
    marginBottom: 20,
    marginTop: 10,
  },
  inlineWrap: {
    display: "flex",
    flexDirection: "row",
  },
  buttonInit: {
    margin: theme.spacing(4),
    textAlign: "center",
  },
});

class HomePageEditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formJson: null,
      homePageData: null,
      events: null,
      goal: null,
      noDataFound: false,
    };
  }

  async componentDidMount() {
    const { id } = this.props.match.params;

    const homePageResponse = await apiCall("/home_page_settings.info", {
      community_id: id,
    });
    if (homePageResponse && homePageResponse.success) {
      await this.setStateAsync({ homePageData: homePageResponse.data });
    } else {
      await this.setStateAsync({ noDataFound: true, formJson: {} });
      return;
    }

    var currentdate = new Date().toISOString().split('T')[0]; 
    const eventsResponse = await apiCall("/events.list", { community_id: id });
    if (eventsResponse && eventsResponse.data) {
      const events = eventsResponse.data.filter((f) => f.end_date_and_time > currentdate).map((c) => ({  // 
        ...c,
        displayName: c.start_date_and_time.split("T", 1) + "  " + c.name ,
        id: "" + c.id,
        date: "" + c.start_date_and_time
      }));
      await this.setStateAsync({ events });
    } else {
      await this.setStateAsync({ noDataFound: true, formJson: {} });
      return;
    }

    const formJson = await this.createFormJson(homePageResponse.data);
    await this.setStateAsync({ formJson, noDataFound: false });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  createFormJson = async () => {
    const { homePageData, events } = this.state;
    const { community, featured_events } = homePageData;
    let { images, featured_links } = homePageData;

    if (!images) {
      images = [];
    }

    if (!featured_links) {
      featured_links = [];
    }

    const [iconBox1, iconBox2, iconBox3, iconBox4] = featured_links;

    const selectedEvents =
      homePageData && featured_events
        ? featured_events.map((e) => "" + e.id)
        : [];
    /*
        const archivedEvents = featured_events
      .filter((f) => !f.is_published)
      .map((c) => ({
        ...c,
        displayName: "(Archived) " + c.name,
        id: "" + c.id,
      }));
      */

    const eventsToDisplay = [ ...events]; //...archivedEvents,

    function sort_by_date(events_data) {
      return events_data.sort((a, b) => (b.date < a.date ? 1 : -1))
    }

    const formJson = {
      title: `Edit ${
        community ? community.name + "'s" : "Community's"
      } HomePage`,
      subTitle: "",
      method: "/home_page_settings.update",
      // successRedirectPage: `/admin/edit/${community.id}/home`,
      fields: [
        {
          name: "id",
          label: "ID",
          placeholder: "eg. 1",
          fieldType: "TextField",
          contentType: "number",
          defaultValue: `${homePageData.id}`,
          dbName: "id",
          readOnly: true,
        },
        {
          label: "Welcome Title and Pictures",
          fieldType: "Section",
          children: [
            {
              /* this won't show by default but be the tab title */
              name: "title",
              label: "Main Title: Displayed on browser tab",
              placeholder: "e.g. Energize Springfield",
              fieldType: "TextField",
              contentType: "text",
              isRequired: false,
              defaultValue: `${homePageData.title}`,
              dbName: "title",
              readOnly: false,
            },
            {
              /* this is the main tagline (which used to be called 'description' */
              name: "sub-title",
              label: "Welcome Text: Displayed right below the three images",
              placeholder: "eg. Join our effort to fight climate risks ...",
              fieldType: "TextField",
              contentType: "text",
              isRequired: true,
              defaultValue: `${homePageData.sub_title}`,
              dbName: "sub_title",
              readOnly: false,
            },
            {
              /* this is now a description which can show on hover */
              name: "description",
              label: 'Additional description, shown on hover or "more info"',
              placeholder:
                "eg. Energize Springfield is a volunteer led effort started in 2020",
              fieldType: "TextField",
              contentType: "text",
              isRequired: false,
              defaultValue: `${homePageData.description}`,
              dbName: "description",
              readOnly: false,
            },
          ],
        },
        {
          label: "Upload 3 pictures",
          fieldType: fieldTypes.Section,
          children: [
            {
              name: "images",
              placeholder: "Select homepage images",
              fieldType: fieldTypes.MediaLibrary,
              dbName: "images",
              uploadMultiple: true,
              multiple: true,
              dragToOrder: true,              
              allowCropping: true,
              fileLimit: 3,
              selected: images,
            },
          ],
        },
        {
          label: "Home Page Statistics",
          fieldType: "Section",
          children: [
            {
              name: "show_featured_stats",
              label:
                "Should we display community impact donut graphs on your home page?",
              fieldType: "Radio",
              isRequired: false,
              defaultValue: `${homePageData.show_featured_stats}`,
              dbName: "show_featured_stats",
              readOnly: false,
              data: [
                { id: "false", value: "No" },
                { id: "true", value: "Yes" },
              ],
              child: {
                valueToCheck: "true",
                fields: [
                  {
                    name: "featured_stats_subtitle",
                    label:
                      "Custom title shown for community impact donut graphs (optional)",
                    placeholder: "eg. Help Us Meet Our Goals",
                    fieldType: "TextField",
                    contentType: "text",
                    isRequired: false,
                    defaultValue: `${homePageData.featured_stats_subtitle}`,
                    dbName: "featured_stats_subtitle",
                    readOnly: false,
                  },
                  {
                    name: "featured_stats_description",
                    label:
                      "Additional information for goals and impact numbers (optional)",
                    placeholder: "",
                    fieldType: "TextField",
                    contentType: "text",
                    isRequired: false,
                    defaultValue: `${homePageData.featured_stats_description}`,
                    dbName: "featured_stats_description",
                    readOnly: false,
                  },
                ],
              },
            },
          ],
        },
        {
          label: "Events Section",
          fieldType: "Section",
          children: [
            {
              name: "show_featured_events",
              label: "Should we display some selected events on the home page?",
              fieldType: "Radio",
              isRequired: false,
              defaultValue: `${homePageData.show_featured_events}`,
              dbName: "show_featured_events",
              readOnly: false,
              data: [
                { id: "false", value: "No" },
                { id: "true", value: "Yes" },
              ],
              child: {
                valueToCheck: "true",
                fields: [
                  {
                    name: "featured_events_subtitle",
                    label:
                      "Custom title shown for selected events section (optional)",
                    placeholder: "eg. Upcoming Events and Campaigns",
                    fieldType: "TextField",
                    contentType: "text",
                    isRequired: false,
                    defaultValue: `${homePageData.featured_events_subtitle}`,
                    dbName: "featured_events_subtitle",
                    readOnly: false,
                  },
                  {
                    name: "featured_events_description",
                    label:
                      "Additional information for selected events section (optional)",
                    placeholder: "",
                    fieldType: "TextField",
                    contentType: "text",
                    isRequired: false,
                    defaultValue: `${homePageData.featured_events_description}`,
                    dbName: "featured_events_description",
                    readOnly: false,
                  },
                  {
                    name: "featured_events",
                    label: "Select which events to show up on the home Page",
                    placeholder: "",
                    fieldType: "Checkbox",
                    selectMany: true,
                    defaultValue: selectedEvents,
                    dbName: "featured_events",
                    data: sort_by_date(eventsToDisplay),
                  },
                ],
              },
            },
          ],
        },
        {
          label: "Icon Links: The four icon boxes on the Home Page",
          fieldType: "Section",
          children: [
            {
              name: "show_featured_links",
              label: "Do you want to display the icon boxes on your home page?",
              fieldType: "Radio",
              isRequired: false,
              defaultValue: `${homePageData.show_featured_links}`,
              dbName: "show_featured_links",
              readOnly: false,
              data: [
                { id: "false", value: "No" },
                { id: "true", value: "Yes" },
              ],
              child: {
                valueToCheck: "true",
                fields: [
                  {
                    label: "Icon Box 1",
                    fieldType: "Section",
                    children: [
                      {
                        name: "icon_box_1_title",
                        label: "Title on Icon Box 1",
                        placeholder: "eg. Take Action",
                        fieldType: "TextField",
                        contentType: "text",
                        isRequired: false,
                        defaultValue: `${iconBox1 && iconBox1.title}`,
                        dbName: "icon_box_1_title",
                        readOnly: false,
                      },
                      {
                        name: "icon_box_1_icon",
                        label: "Pick an icon",
                        placeholder: "eg. 100",
                        fieldType: fieldTypes.Icon,
                        contentType: "text",
                        isRequired: false,
                        defaultValue: `${iconBox1 && iconBox1.icon}`,
                        dbName: "icon_box_1_icon",
                        readOnly: false,
                      },
                      {
                        name: "icon_box_1_link",
                        label: "Url: When someone clicks, where should it go?",
                        placeholder: "eg. 100",
                        fieldType: "TextField",
                        contentType: "text",
                        isRequired: false,
                        defaultValue: `${iconBox1 && iconBox1.link}`,
                        dbName: "icon_box_1_link",
                        readOnly: false,
                      },
                      {
                        name: "icon_box_1_description",
                        label:
                          "Short description the card (no more than 40 characters)",
                        placeholder: "Tell us more ...",
                        fieldType: "TextField",
                        contentType: "text",
                        isRequired: true,
                        defaultValue: `${iconBox1 && iconBox1.description}`,
                        dbName: "icon_box_1_description",
                        readOnly: false,
                        maxLength: 40,
                      },
                    ],
                  },
                  {
                    label: "Icon Box 2",
                    fieldType: "Section",
                    children: [
                      {
                        name: "icon_box_2_title",
                        label: "Title on Icon Box 2",
                        placeholder: "eg. Take Action",
                        fieldType: "TextField",
                        contentType: "text",
                        isRequired: false,
                        defaultValue: `${iconBox2 && iconBox2.title}`,
                        dbName: "icon_box_2_title",
                        readOnly: false,
                      },
                      {
                        name: "icon_box_2_icon",
                        label: "Pick an icon",
                        placeholder: "eg. 100",
                        fieldType: fieldTypes.Icon,
                        contentType: "text",
                        isRequired: false,
                        defaultValue: `${iconBox2 && iconBox2.icon}`,
                        dbName: "icon_box_2_icon",
                        readOnly: false,
                      },
                      {
                        name: "icon_box_2_link",
                        label: "Url: When someone clicks, where should it go?",
                        placeholder: "eg. 100",
                        fieldType: "TextField",
                        contentType: "text",
                        isRequired: false,
                        defaultValue: `${iconBox2 && iconBox2.link}`,
                        dbName: "icon_box_2_link",
                        readOnly: false,
                      },
                      {
                        name: "icon_box_2_description",
                        label:
                          "Short description the card (no more than 40 characters)",
                        placeholder: "Tell us more ...",
                        fieldType: "TextField",
                        contentType: "text",
                        isRequired: true,
                        defaultValue: `${iconBox2 && iconBox2.description}`,
                        dbName: "icon_box_2_description",
                        readOnly: false,
                        maxLength: 40,
                      },
                    ],
                  },
                  {
                    label: "Icon Box 3",
                    fieldType: "Section",
                    children: [
                      {
                        name: "icon_box_3_title",
                        label: "Title on Icon Box 1",
                        placeholder: "eg. Take Action",
                        fieldType: "TextField",
                        contentType: "text",
                        isRequired: false,
                        defaultValue: `${iconBox3 && iconBox3.title}`,
                        dbName: "icon_box_3_title",
                        readOnly: false,
                      },
                      {
                        name: "icon_box_3_icon",
                        label: "Pick an icon",
                        placeholder: "eg. 100",
                        fieldType: fieldTypes.Icon,
                        contentType: "text",
                        isRequired: false,
                        defaultValue: `${iconBox3 && iconBox3.icon}`,
                        dbName: "icon_box_3_icon",
                        readOnly: false,
                      },
                      {
                        name: "icon_box_3_link",
                        label: "Url: When someone clicks, where should it go?",
                        placeholder: "eg. 100",
                        fieldType: "TextField",
                        contentType: "text",
                        isRequired: false,
                        defaultValue: `${iconBox3 && iconBox3.link}`,
                        dbName: "icon_box_3_link",
                        readOnly: false,
                      },
                      {
                        name: "icon_box_3_description",
                        label:
                          "Short description the card (no more than 40 characters)",
                        placeholder: "Tell us more ...",
                        fieldType: "TextField",
                        contentType: "text",
                        isRequired: true,
                        defaultValue: `${iconBox3 && iconBox3.description}`,
                        dbName: "icon_box_3_description",
                        readOnly: false,
                        maxLength: 40,
                      },
                    ],
                  },
                  {
                    label: "Icon Box 4",
                    fieldType: "Section",
                    children: [
                      {
                        name: "icon_box_4_title",
                        label: "Title on Icon Box 1",
                        placeholder: "eg. Take Action",
                        fieldType: "TextField",
                        contentType: "text",
                        isRequired: false,
                        defaultValue: `${iconBox4 && iconBox4.title}`,
                        dbName: "icon_box_4_title",
                        readOnly: false,
                      },
                      {
                        name: "icon_box_4_icon",
                        label: "Pick an icon",
                        placeholder: "eg. 100",
                        fieldType: fieldTypes.Icon,
                        contentType: "text",
                        isRequired: false,
                        defaultValue: `${iconBox4 && iconBox4.icon}`,
                        dbName: "icon_box_4_icon",
                        readOnly: false,
                      },
                      {
                        name: "icon_box_4_link",
                        label: "Url: When someone clicks, where should it go?",
                        placeholder: "eg. 100",
                        fieldType: "TextField",
                        contentType: "text",
                        isRequired: false,
                        defaultValue: `${iconBox4 && iconBox4.link}`,
                        dbName: "icon_box_4_link",
                        readOnly: false,
                      },
                      {
                        name: "icon_box_4_description",
                        label:
                          "Short description on the card (no more than 40 characters)",
                        placeholder: "Tell us more ...",
                        fieldType: "TextField",
                        contentType: "text",
                        isRequired: true,
                        defaultValue: `${iconBox4 && iconBox4.description}`,
                        dbName: "icon_box_4_description",
                        readOnly: false,
                        maxLength: 40,
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      ],
    };
    return formJson;
  };

  render() {
    const { classes } = this.props;
    const { formJson, noDataFound } = this.state;
    if (!formJson) return <div>Hold tight! Retrieving your data ...</div>;
    if (noDataFound)
      return (
        <div>Sorry no Home Page data available for this community ...</div>
      );
    return (
      <div>
        <MassEnergizeForm classes={classes} formJson={formJson} />
      </div>
    );
  }
}

HomePageEditForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(HomePageEditForm);
