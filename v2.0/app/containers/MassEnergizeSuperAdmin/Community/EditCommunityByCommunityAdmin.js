import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import states from "dan-api/data/states";
import MassEnergizeForm from "../_FormGenerator";
import { apiCall } from "../../../utils/messenger";
import { getMoreInfo, groupSocialMediaFields } from "./utils";

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
    margin: theme.spacing.unit * 4,
    textAlign: "center",
  },
});

class EditCommunityByCommunityAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formJson: null,
      community: null,
    };
    this.preflightFxn = this.preflightFxn.bind(this);
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    const communityResponse = await apiCall("/communities.info", {
      community_id: id,
    });
    if (communityResponse && !communityResponse.success) {
      return;
    }

    const community = communityResponse.data;
    await this.setStateAsync({ community });

    const formJson = await this.createFormJson();
    await this.setStateAsync({ formJson });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  preflightFxn = (formData) => {
    const { community } = this.state;
    return groupSocialMediaFields(formData, getMoreInfo(community));
  };

  createFormJson = async () => {

    // quick and dirty - duplicated code - needs to be consistant between pages and with the API
    // could read these options from the API or share the databaseFieldChoices json
    const geography_types = [
      { id: "ZIPCODE", value:"Community defined by one or more towns or zipcodes (can't be subdivided)" },
      { id: "CITY", value:"Community defined by one or more larger cities (can have smaller communities within)" },
      //{ id: "COUNTY", value:"Community defined by one or more counties" },
      //{ id: "STATE", value: "Community defined by one or more states" },
      //{ id: "COUNTRY", value:"Community defined by a country" },
      //{ id: "NON_GEOGRAPHIC", value:"A non-geographic community" },
    ]
    const { community } = this.state;
    const more_info = getMoreInfo(community);
    // if (!community) return {};
    const formJson = {
      title: "Edit your Community",
      subTitle: "",
      method: "/communities.update",
      successRedirectPage: `/admin/community/${community.id}/edit`,
      preflightFxn: this.preflightFxn, // lets you modify the form content before the collected values in the form generator are submitted
      fields: [
        {
          label: "About this Community",
          fieldType: "Section",
          children: [
            {
              name: "id",
              label: "Community ID",
              placeholder: "eg. 10",
              fieldType: "TextField",
              contentType: "number",
              isRequired: true,
              defaultValue: community.id,
              dbName: "community_id",
              readOnly: true,
            },
            {
              name: "name",
              label: "Name of this Community",
              placeholder: "eg. Wayland",
              fieldType: "TextField",
              contentType: "text",
              isRequired: true,
              defaultValue: community.name,
              dbName: "name",
              readOnly: false,
            },
            {
              name: "subdomain",
              label:
                "Subdomain: Please Provide a short unique name.  (only letters and numbers) ",
              placeholder: "eg. wayland",
              fieldType: "TextField",
              contentType: "text",
              isRequired: true,
              defaultValue: community.subdomain,
              dbName: "subdomain",
              readOnly: true,
            },
            {
              name: "about",
              label: "Tell us about this community",
              placeholder: "Tell us more ...",
              fieldType: "TextField",
              contentType: "text",
              isRequired: true,
              isMultiline: true,
              defaultValue: community.about_community,
              dbName: "about_community",
              readOnly: false,
            },
          ]
        },
        {
          label: "Contact Address (seen as Location on ContactUs page)",
          fieldType: "Section",
          children: [
            {
                 name: 'address',
                 label: 'Street Address',
                 placeholder: 'Enter street address (optional)',
                 fieldType: 'TextField',
                 contentType: 'text',
                 isRequired: false,
                 defaultValue: `${community.location && community.location.address ? community.location.address : ''}`,
                dbName: 'address',
                 readOnly: false
            },
            {
                 name: 'city',
                 label: 'City',
                 placeholder: 'eg. Springfield',
                 fieldType: 'TextField',
                 contentType: 'text',
                 isRequired: true,
                 defaultValue: `${community.location && community.location.city ? community.location.city : ''}`,
                 dbName: 'city',
                 readOnly: false
            },
            {
                 name: 'state',
                 label: 'State',
                 placeholder: 'eg. Massachusetts',
                 fieldType: 'Dropdown',
                 contentType: 'text',
                 isRequired: true,
                 data: states,
                 defaultValue: community.location && community.location.state,
                 dbName: 'state',
                 readOnly: false
            },
            {
                 name: 'zipcode',
                 label: 'Zip code',
                 placeholder: 'eg. 01020',
                 fieldType: 'TextField',
                 contentType: 'text',
                 isRequired: true,
                 defaultValue: community.location && community.location.zipcode,
                 dbName: 'zipcode',
                 readOnly: false
            },
          ]
        },

        {
          label: "Community Type - Contact a Super Admin to change these settings",
          fieldType: "Section",
          children: [
            {
              name: "is_geographically_focused",
              label: "Is this community Geographically focused?",
              fieldType: "Radio",
              isRequired: false,
              defaultValue: community.is_geographically_focused ? 'true' : 'false',
              dbName: 'is_geographically_focused',
              readOnly: true,
              data: [
                { id: "false", value: "No" },
                { id: "true", value: "Yes" },
              ],
              child: {
                valueToCheck: "true",
                fields: [
                  {
                    name: 'geography_type',
                    label: 'Type of geographic community',
                    fieldType: 'Radio',
                    isRequired: true,
                    defaultValue: community.geography_type || 'ZIPCODE',
                    dbName: 'geography_type',
                    readOnly: true,
                    data: geography_types,
                  },
                  {
                    name: 'locations',
                    label: 'List of all such regions (zipcodes or town-state, city-state, states) within the community, separated by commas ',
                    placeholder: 'eg. 01101, 01102, 01103, 01104 or Springfield-MA',
                    fieldType: 'TextField',
                    contentType: 'text',
                    isRequired: true,
                    defaultValue: community.locations || '',
                    dbName: 'locations',
                    readOnly: true
                  },
                ]}},
          ]
        },
        {
          label:
            "Community Public Information (Will be displayed in the community portal's footer)",
          fieldType: "Section",
          children: [
            {
              name: "social_or_email",
              label: "Choose what to show (Email Or Social Media Links)",
              fieldType: "Radio",
              isRequired: true,
              defaultValue: more_info && more_info.wants_socials ==="true" ? "true" : "false",
              dbName: "wants_socials",
              readOnly: false,
              data: [
                { id: "false", value: "Contact Person's Information" },
                { id: "true", value: "Social Media Links" },
              ],

              conditionalDisplays: [
                {
                  valueToCheck: "true",
                  fields: [
                    {
                      name: "com_facebook_link",
                      label: "Provide a link to your community's Facebook page",
                      placeholder: "www.facebook.com/your-community",
                      fieldType: "TextField",
                      contentType: "text",
                      isRequired: false,
                      defaultValue: more_info && more_info.facebook_link,
                      dbName: "facebook_link",
                      readOnly: false,
                    },
                    {
                      name: "com_twitter_link",
                      label: "Provide a link to your community's Twitter page",
                      placeholder: "eg. www.twitter.com/your-community",
                      fieldType: "TextField",
                      contentType: "text",
                      isRequired: false,
                      defaultValue: more_info && more_info.twitter_link,
                      dbName: "twitter_link",
                      readOnly: false,
                    },
                    {
                      name: "com_instagram_link",
                      label:
                        "Provide a link to your community's Instagram page",
                      placeholder: "eg. www.instagram.com/your-community",
                      fieldType: "TextField",
                      contentType: "text",
                      isRequired: false,
                      defaultValue: more_info && more_info.instagram_link,
                      dbName: "instagram_link",
                      readOnly: false,
                    },
                  ],
                },

                {
                  valueToCheck: "false",
                  fields: [
                    {
                      name: "admin_full_name",
                      label: "Contact Person's Full Name",
                      placeholder: "eg. Grace Tsu",
                      fieldType: "TextField",
                      contentType: "text",
                      isRequired: true,
                      defaultValue: community.owner_name,
                      dbName: "owner_name",
                      readOnly: false,
                    },
                    {
                      name: "admin_email",
                      label: "Community's Public Email",
                      placeholder: "eg. johny.appleseed@gmail.com",
                      fieldType: "TextField",
                      contentType: "text",
                      isRequired: true,
                      defaultValue: community.owner_email,
                      dbName: "owner_email",
                      readOnly: false,
                    },
                    {
                      name: "admin_phone_number",
                      label: "Community's Public Phone Number",
                      placeholder: "eg. 571 222 4567",
                      fieldType: "TextField",
                      contentType: "text",
                      isRequired: false,
                      defaultValue: community.owner_phone_number,
                      dbName: "owner_phone_number",
                      readOnly: false,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "image",
          placeholder: "Upload a Logo",
          fieldType: "File",
          dbName: "image",
          previewLink: `${community.logo && community.logo.url}`,
          label: "Upload a new logo for this community",
          selectMany: false,
          isRequired: false,
          defaultValue: "",
          filesLimit: 1,
        },
        //{
        //  name: 'favicon',
        //  placeholder: 'Upload a favicon (optional)',
        //  fieldType: 'File',
        //  dbName: 'favicon',
        //  previewLink: `${community.favicon && community.favicon.url}`,
        //  label: 'Upload a favicon for this community',
        //  selectMany: false,
        //  isRequired: false,
        //  defaultValue: '',
        //  filesLimit: 1
        //},
        {
          name: "is_published",
          label: "Should this go live now?",
          fieldType: "Radio",
          isRequired: false,
          defaultValue: community.is_published ? "true" : "false",
          dbName: "is_published",
          readOnly: false,
          data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }],
        },
      ],
    };

    return formJson;
  };

  render() {
    const { classes } = this.props;
    const { formJson } = this.state;
    if (!formJson) return <div>Hold tight! Preparing your form ...</div>;
    return (
      <div>
        <MassEnergizeForm classes={classes} formJson={formJson} />
      </div>
    );
  }
}

EditCommunityByCommunityAdmin.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(
  EditCommunityByCommunityAdmin
);
