// TODO: eliminate nearly identical code
import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import states from "dan-api/data/states";
import { apiCall } from "../../../utils/messenger";
import { getMoreInfo, groupSocialMediaFields } from "./utils";
import { connect } from "react-redux";
import fieldTypes from "../_FormGenerator/fieldTypes";
import brand from "dan-api/dummy/brand";
import { Helmet } from "react-helmet";
import { PapperBlock } from "dan-components";
import EditCommunityForm from "./EditCommunityForm";
import { withRouter } from "react-router-dom";
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

class EditCommunityByCommunityAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formJson: null,
      community: undefined,
      loading: true,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { communities, match, location } = props;
    const { id } = match.params;
    if (state.community === undefined) {
      const community = (communities || []).find((c) => c.id.toString() === id);
      const libOpen = location.state && location.state.libOpen;
      const formJson = createFormJson({
        community,
        autoOpenMediaLibrary: libOpen,
      });
      return { community, formJson };
    }
    return null;
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

    const formJson = createFormJson({ community });
    await this.setStateAsync({ formJson });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  render() {
    const description = brand.desc;
    const auth = this.props.auth;
    const superAdmin =auth?.is_super_admin
    const formTitle = "Edit Community Infomation";
    const title = brand.name + " - " + formTitle;

    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        <PapperBlock title="Edit Community Information" desc="">
          <EditCommunityForm {...this.props} superAdmin={superAdmin} />
        </PapperBlock>
      </div>
    );
  }
}

EditCommunityByCommunityAdmin.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    communities: state.getIn(["communities"]),
    auth: state.getIn(["auth"]),
  };
};

const Wrapped = connect(mapStateToProps)(EditCommunityByCommunityAdmin);
export default withStyles(styles, { withTheme: true })(withRouter(Wrapped));

const createFormJson = ({ community, autoOpenMediaLibrary }) => {
  if (!community) return null;
  // quick and dirty - duplicated code - needs to be consistant between pages and with the API
  // could read these options from the API or share the databaseFieldChoices json
  const geographyTypes = [
    {
      id: "ZIPCODE",
      value:
        "Community defined by one or more towns or zipcodes (can't be subdivided)",
    },
    {
      id: "CITY",
      value:
        "Community defined by one or more larger cities (can have smaller communities within)",
    },
    // { id: "COUNTY", value:"Community defined by one or more counties" },
    // { id: "STATE", value: "Community defined by one or more states" },
    // { id: "COUNTRY", value:"Community defined by a country" },
    // { id: "NON_GEOGRAPHIC", value:"A non-geographic community" },
  ];
  const moreInfo = getMoreInfo(community);

  const preflightFxn = (formData) => {
    return groupSocialMediaFields(formData, getMoreInfo(community));
  };

  const formJson = {
    title: "Edit your Community",
    subTitle: "",
    method: "/communities.update",
    successRedirectPage: `/admin/community/${community.id}/edit`,
    preflightFxn: preflightFxn, // lets you modify the form content before the collected values in the form generator are submitted
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
            name: "website",
            label:
              "Custom website domain (optional): URL which would forward to the portal, that users will see.  Start with 'www.' but don't include 'https://'",
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
            maxLength: 100,
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
            isRequired: true,
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
            isRequired: true,
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
            isRequired: true,
            defaultValue: community.location && community.location.zipcode,
            dbName: "zipcode",
            readOnly: false,
          },
        ],
      },
      {
        label:
          "Community Type - Contact a Super Admin to change these settings",
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
            readOnly: true,
            data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }],
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
                  readOnly: true,
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
                  defaultValue: community.locations || "",
                  dbName: "locations",
                  readOnly: true,
                },
              ],
            },
          },
        ],
      },
      {
        label:
          "Social media or Newsletter subscription (Will be displayed in the community portal's footer)",
        fieldType: "Section",
        children: [
          {
            name: "social_or_email",
            label:
              "Choose what to show (Social Media Links or Subscribe to Newsletter)",
            fieldType: "Radio",
            isRequired: true,
            defaultValue:
              moreInfo && moreInfo.wants_socials === "true" ? "true" : "false",
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
                  label: "Provide a link to your community's Facebook page",
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
                  label: "Provide a link to your community's Twitter page",
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
                  label: "Provide a link to your community's Instagram page",
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
        openState: autoOpenMediaLibrary,
        dbName: "image",
        selected: community && community.logo ? [community.logo] : [],
        label: "Upload a new logo for this community",
        uploadMultiple: false,
        multiple: false,
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
