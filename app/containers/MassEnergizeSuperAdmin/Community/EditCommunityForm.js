import React, { Component } from "react";
import PropTypes from "prop-types";
import states from "dan-api/data/states";
import { withStyles } from "@mui/styles";
import MassEnergizeForm from "../_FormGenerator/MassEnergizeForm";
import { apiCall } from "../../../utils/messenger";
import { getMoreInfo, groupSocialMediaFields } from "./utils";
import fieldTypes from "../_FormGenerator/fieldTypes";
import { withRouter } from "react-router-dom";
import { PAGE_KEYS } from "../ME  Tools/MEConstants";
import Seo from "../../../components/Seo/Seo";
// @NB: Looks like this file isnt being used anymore
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

class EditCommunityForm extends Component {
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
    const superAdmin = this.props.superAdmin ? this.props.superAdmin : false;
    const location = this.props.location;
    const geographyTypes = superAdmin
      ? [
          {
            id: "ZIPCODE",
            value:
              "Community defined by one or more towns or zipcodes (can't be subdivided)",
          },
          {
            id: "CITY",
            value:
              "Community defined by one or more cities (can have smaller communities within)",
          },
          { id: "COUNTY", value: "Community defined by one or more counties" },
          { id: "STATE", value: "Community defined by one or more states" },
          { id: "COUNTRY", value: "Community defined by a country" },
          // { id: "NON_GEOGRAPHIC", value:"A non-geographic community" },
        ]
      : [
          {
            id: "ZIPCODE",
            value:
              "Community defined by one or more towns or zipcodes (can't be subdivided)",
          },
          {
            id: "CITY",
            value:
              "Community defined by one or more cities (can have smaller communities within)",
          },
        ];

    const { community } = this.state;
    const moreInfo = getMoreInfo(community);
    const libOpen = location.state && location.state.libOpen;
    const formJson = {
      title: "Edit your Community",
      subTitle: "",
      method: "/communities.update",
      successRedirectPage: `/admin/community/${community.id}/edit`,
      preflightFxn: this.preflightFxn,
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
              isRequired: false,
              defaultValue: community.id,
              dbName: "community_id",
              readOnly: true,
            },
            {
              name: "community_name",
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
              readOnly: !superAdmin, // readonly if you are a Cadmin
            },
            {
              name: "website",
              label:
                "Custom website domain (optional): URL which would forward to the portal, that users will see.  Start with 'www.' but don't include 'https://' ",
              placeholder:
                "eg. 'www.EnergizeYourTown.org' (leave blank or enter 'None' to remove website domain)",
              fieldType: "TextField",
              contentType: "text",
              isRequired: false,
              defaultValue: community.website,
              dbName: "website",
              readOnly: false,
            },
            {
              name: "about",
              label:
                "Short intro about this community for new users - 100 char max",
              placeholder: "Welcome to Energize xxx, a project of ....",
              fieldType: "TextField",
              contentType: "text",
              isRequired: false,
              defaultValue: community.about_community,
              dbName: "about_community",
              readOnly: false,
            },
          ],
        },
        {
          label: "Primary contact (seen in community portal footer)",
          fieldType: "Section",
          children: [
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
              label: "Community's Public Phone Number (optional)",
              placeholder: "eg. 571 222 4567",
              fieldType: "TextField",
              contentType: "text",
              isRequired: false,
              defaultValue: community.owner_phone_number,
              dbName: "owner_phone_number",
              readOnly: false,
            },
            {
              name: "contact_sender_alias",
              label: "The name that should appear on all emails to your community members",
              placeholder: "eg. The 'Community Name' Team",
              fieldType: "TextField",
              contentType: "text",
              isRequired: false,
              defaultValue: community.contact_sender_alias || "",
              dbName: "contact_sender_alias",
              readOnly: false,
            },
          ],
        },
        {
          label: "Contact Address (seen as Location on ContactUs page)",
          fieldType: "Section",
          children: [
            {
              name: "address",
              label: "Street Address",
              placeholder: "Enter street address (optional)",
              fieldType: "TextField",
              contentType: "text",
              isRequired: false,
              defaultValue: `${
                community.location && community.location.address
                  ? community.location.address
                  : ""
              }`,
              dbName: "address",
              readOnly: false,
            },
            {
              name: "city",
              label: "City",
              placeholder: "eg. Springfield",
              fieldType: "TextField",
              contentType: "text",
              isRequired: false,
              defaultValue: `${
                community.location && community.location.city
                  ? community.location.city
                  : ""
              }`,
              dbName: "city",
              readOnly: false,
            },
            {
              name: "state",
              label: "State",
              placeholder: "eg. Massachusetts",
              fieldType: "Dropdown",
              contentType: "text",
              isRequired: false,
              data: states,
              defaultValue: community.location && community.location.state,
              dbName: "state",
              readOnly: false,
            },
            {
              name: "zipcode",
              label: "Zip code",
              placeholder: "eg. 01020",
              fieldType: "TextField",
              contentType: "text",
              isRequired: false,
              defaultValue:
                community.location && community.location.zipcode,
              dbName: "zipcode",
              readOnly: false,
            },
          ],
        },
        {
          label: "Community Type",
          fieldType: "Section",
          children: [
            {
              name: "is_geographically_focused",
              label: "Is this community Geographically focused?",
              fieldType: "Radio",
              isRequired: false,
              defaultValue: community.is_geographically_focused
                ? "true"
                : "false",
              dbName: "is_geographically_focused",
              readOnly: !superAdmin, // readonly if just a cadmin
              data: [
                { id: "false", value: "No" },
                { id: "true", value: "Yes" },
              ],
              child: {
                valueToCheck: "true",
                fields: [
                  {
                    name: "geography_type",
                    label: "Type of geographic community",
                    fieldType: "Radio",
                    isRequired: true,
                    defaultValue: community.geography_type || "ZIPCODE",
                    dbName: "geography_type",
                    readOnly: !superAdmin, // readonly if just a cadmin
                    data: geographyTypes,
                  },
                  {
                    name: "locations",
                    label:
                      "List of all such regions (zipcodes or town-state, city-state, states) within the community, separated by commas ",
                    placeholder:
                      "eg. 01101, 01102, 01103, 01104 or Springfield-MA",
                    fieldType: "TextField",
                    contentType: "text",
                    isRequired: true,
                    defaultValue: community.locations || "",
                    dbName: "locations",
                    readOnly: !superAdmin, // readonly if just a cadmin
                  },
                ],
              },
            },
            {
              name: "is_demo",
              label: "Is this community a demo community?",
              fieldType: "Radio",
              isRequired: false,
              defaultValue: community.is_demo ? "true" : "false",
              dbName: "is_demo",
              readOnly: !superAdmin,
              data: [
                { id: "false", value: "No" },
                { id: "true", value: "Yes" },
              ],
            },
          ],
        },
        {
          label:
            "Social media or Newsletter subscription (displayed in the community portal footer)",
          fieldType: "Section",
          children: [
            {
              name: "social_or_newsletter",
              label:
                "Choose what to show (Social Media Links or Subscribe to Newsletter)",
              fieldType: "Radio",
              isRequired: true,
              defaultValue:
                moreInfo && moreInfo.wants_socials === "true"
                  ? "true"
                  : "false",
              dbName: "wants_socials",
              readOnly: false,
              data: [
                { id: "true", value: "Social Media Links" },
                { id: "false", value: "Subscribe to Newsletter" },
              ],
              child: {
                valueToCheck: "true",
                fields: [
                  {
                    name: "com_facebook_link",
                    label:
                      "Provide a link to your community's Facebook page",
                    placeholder: "www.facebook.com/your-community",
                    fieldType: "TextField",
                    contentType: "text",
                    isRequired: false,
                    defaultValue: moreInfo && moreInfo.facebook_link,
                    dbName: "facebook_link",
                    readOnly: false,
                  },
                  {
                    name: "com_twitter_link",
                    label:
                      "Provide a link to your community's Twitter page",
                    placeholder: "eg. www.twitter.com/your-community",
                    fieldType: "TextField",
                    contentType: "text",
                    isRequired: false,
                    defaultValue: moreInfo && moreInfo.twitter_link,
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
                    defaultValue: moreInfo && moreInfo.instagram_link,
                    dbName: "instagram_link",
                    readOnly: false,
                  },
                ],
              },
            },
          ],
        },
        {
          name: "image",
          placeholder: "Upload a Logo",
          fieldType: fieldTypes.MediaLibrary,
          openState: libOpen,
          dbName: "image",
          selected: community && community.logo ? [community.logo] : [],
          label: "Upload a new logo for this community",
          uploadMultiple: false,
          multiple: false,
        },
        {
          name: "is_approved",
          label:
            "Do you approve this community? (Check yes after background check)",
          fieldType: "Radio",
          isRequired: false,
          defaultValue: community.is_approved ? "true" : "false",
          dbName: "is_approved",
          readOnly: !superAdmin, // readonly if just a cadmin
          data: [
            { id: "false", value: "No" },
            { id: "true", value: "Yes" },
          ],
        },
        {
          name: "is_published",
          label: "Should this go live now?",
          fieldType: "Radio",
          isRequired: false,
          defaultValue: community.is_published ? "true" : "false",
          dbName: "is_published",
          readOnly: false,
          data: [
            { id: "false", value: "No" },
            { id: "true", value: "Yes" },
          ],
        },
      ],
    };

    return formJson;
  };

  render() {
    const { classes } = this.props;
    const { formJson, community } = this.state;
    const { id } = this.props.match.params;
    if (!formJson) return <div>Hold tight! Preparing your form ...</div>;

    return (
      <div>
        <Seo name={`Edit- ${community?.name} Information`}/>
        <MassEnergizeForm
          classes={classes}
          formJson={formJson}
          pageKey={`${PAGE_KEYS.EDIT_COMMUNITY.key}-${id}`}
        />
      </div>
    );
  }
}

EditCommunityForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(
  withRouter(EditCommunityForm)
);
