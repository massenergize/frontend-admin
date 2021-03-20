import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import states from "dan-api/data/states";
import MassEnergizeForm from "../_FormGenerator";
import { apiCall } from "../../../utils/messenger";

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

  groupSocialMediaFields = (formData) => {
    if (!formData) return formData;
    if (formData.wants_socials !== "true") return formData;
    const dbNames = {
      fb: "facebook_link",
      tw: "twitter_link",
      insta: "instagram_link",
    };
    const more_info = {
      [dbNames.fb]: formData[dbNames.fb],
      [dbNames.insta]: formData[dbNames.insta],
      [dbNames.tw]: formData[dbNames.tw],
      "wants_socials":formData.wants_socials
    };
    delete formData[dbNames.fb];
    delete formData[dbNames.insta];
    delete formData[dbNames.tw];
    delete formData["wants_socials"]
    return { ...formData, more_info };
  };
  createFormJson = async () => {
    const { community } = this.state;
    // if (!community) return {};

    const formJson = {
      title: "Edit your Community",
      subTitle: "",
      method: "/communities.update",
      successRedirectPage: `/admin/community/${community.id}/edit`,
      preflightFxn: this.groupSocialMediaFields,
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
            {
              name: "is_geographically_focused",
              label: "Is this community Geographically focused?",
              fieldType: "Radio",
              isRequired: false,
              defaultValue: community.is_geographically_focused
                ? "true"
                : "false",
              dbName: "is_geographically_focused",
              readOnly: false,
              data: [
                { id: "false", value: "No" },
                { id: "true", value: "Yes" },
              ],
              child: {
                valueToCheck: "true",
                fields: [
                  {
                    name: "address",
                    label: "Street Address",
                    placeholder: "Street address (not required)",
                    fieldType: "TextField",
                    contentType: "text",
                    isRequired: false,
                    defaultValue:
                      community.location && community.location.address,
                    dbName: "address",
                    readOnly: false,
                  },
                  {
                    name: "unit",
                    label: "Unit Number",
                    placeholder: "eg. Unit 904",
                    fieldType: "TextField",
                    contentType: "text",
                    isRequired: false,
                    defaultValue: community.location && community.location.unit,
                    dbName: "unit",
                    readOnly: false,
                  },
                  {
                    name: "city",
                    label: "City",
                    placeholder: "eg. Springfield",
                    fieldType: "TextField",
                    contentType: "text",
                    isRequired: false,
                    defaultValue: community.location && community.location.city,
                    dbName: "city",
                    readOnly: false,
                  },
                  {
                    name: "zipcode",
                    label: "Zip code ",
                    placeholder: "eg. 80202",
                    fieldType: "TextField",
                    contentType: "text",
                    isRequired: false,
                    defaultValue:
                      community.location && community.location.zipcode,
                    dbName: "zipcode",
                    readOnly: false,
                  },
                  {
                    name: "state",
                    label: "State ",
                    placeholder: "eg. Massachusetts",
                    fieldType: "Dropdown",
                    contentType: "text",
                    isRequired: false,
                    data: states,
                    defaultValue: `${
                      community.location && community.location.state
                        ? community.location.state
                        : ""
                    }`,
                    dbName: "state",
                    readOnly: false,
                  },
                ],
              },
            },
          ],
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
              defaultValue: "false",
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
                      // defaultValue: community.location && community.location.address,
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
                      // defaultValue: community.location && community.location.unit,
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
                      // defaultValue: community.location && community.location.unit,
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
