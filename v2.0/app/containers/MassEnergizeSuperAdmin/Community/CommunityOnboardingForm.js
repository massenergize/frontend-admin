import React, { Component } from "react";
import PropTypes from "prop-types";
import states from "dan-api/data/states";
import { withStyles } from "@material-ui/core/styles";
import MassEnergizeForm from "../_FormGenerator";
import { groupSocialMediaFields, getMoreInfo } from "./utils";

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

class CreateNewCommunityForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formJson: null,
    };
    this.preflightFxn = this.preflightFxn.bind(this);
  }

  async componentDidMount() {
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
      { id: "ZIPCODE", value:"Community defined by one or more towns or zipcodes (can have smaller communities within)" },
      { id: "CITY", value:"Community defined by one or more cities" },
      //{ id: "COUNTY", value:"Community defined by one or more counties" },
      { id: "STATE", value: "Community defined by one or more states" },
      { id: "COUNTRY", value:"Community defined by a country" },
      //{ id: "NON_GEOGRAPHIC", value:"A non-geographic community" },
    ]  
    const formJson = {
      title: "Create New Community",
      subTitle: "",
      method: "/communities.create",
      successRedirectPage: "/admin/read/communities",
      preflightFxn: this.preflightFxn,
      fields: [
        {
          label: "About this Community",
          fieldType: "Section",
          children: [
            {
              name: "community_name",
              label: "Name of this Community",
              placeholder: "eg. Energize Springfield",
              fieldType: "TextField",
              contentType: "text",
              isRequired: true,
              defaultValue: "",
              dbName: "name",
              readOnly: false,
            },
            {
              name: "subdomain",
              label:
                "Subdomain: Please Provide a short unique name.  (only letters and numbers) ",
              placeholder: "eg. SpringfieldMA",
              fieldType: "TextField",
              contentType: "text",
              isRequired: true,
              defaultValue: "",
              dbName: "subdomain",
              readOnly: false,
            },
            {
              name: "about",
              label: "Tell us about this community",
              placeholder: "Tell us more ...",
              fieldType: "TextField",
              contentType: "text",
              isRequired: true,
              isMultiline: true,
              defaultValue: "",
              dbName: "about_community",
              readOnly: false,
            },
            {
              name: "is_geographically_focused",
              label: "Is this community Geographically focused?",
              fieldType: "Radio",
              isRequired: false,
              defaultValue: "false",
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
                    name: 'geography_type',
                    label: 'Type of geographic community',
                    fieldType: 'Radio',
                    isRequired: true,
                    defaultValue: 'ZIPCODE',
                    dbName: 'geography_type',
                    readOnly: false,
                    data: geography_types,
                  },
                  {
                    name: 'locations',
                    label: 'List of all such regions (zipcodes or towns, cities, states) within the community, separated by commas ',
                    placeholder: 'eg. 01101, 01102, 01103, 01104',
                    fieldType: 'TextField',
                    contentType: 'text',
                    isRequired: true,
                    defaultValue: '',
                    dbName: 'locations',
                    readOnly: false
                  },
                ]}},
                // these fields now duplicative - unless we want to use them as the community group address  
                //  {
                //    name: 'community_address',
                //    label: 'Street Address',
                //    placeholder: '',
                //    fieldType: 'TextField',
                //    contentType: 'text',
                 //   isRequired: false,
                //    defaultValue: '',
                //    dbName: 'address',
                //    readOnly: false
                //  },
                //  {
                //    name: 'unit',
                //    label: 'Unit Number',
                //    placeholder: '',
                //    fieldType: 'TextField',
                //    contentType: 'text',
                //    isRequired: false,
                //    defaultValue: '',
                //    dbName: 'unit',
                //    readOnly: false
                //  },
                //  {
                //    name: 'city',
                //    label: 'City',
                //    placeholder: 'eg. Springfield',
                //    fieldType: 'TextField',
                //    contentType: 'text',
                //    isRequired: false,
                //    defaultValue: '',
                //    dbName: 'city',
                //    readOnly: false
                //  },
                //  {
                //    name: 'zipcode',
                //    label: 'Zip code ',
                //    placeholder: 'eg. 80202',
                //    fieldType: 'TextField',
                //    contentType: 'text',
                //    isRequired: false,
                //    defaultValue: '',
                //    dbName: 'zipcode',
                //    readOnly: false
                //  },
                //  {
                //    name: 'state',
                //    label: 'State ',
                //    placeholder: 'eg. Massachusetts',
                //    fieldType: 'Dropdown',
                //    contentType: 'text',
                //    isRequired: false,
                //    data: states,
                //    defaultValue: 'Massachusetts',
                //    dbName: 'state',
                //    readOnly: false
                //  },
                //]
              //}
            //},
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
              defaultValue:'false',
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
                      defaultValue: "",
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
                      defaultValue: "",
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
                      defaultValue: "",
                      dbName: "owner_phone_number",
                      readOnly: false,
                    },
                  ],
                },
              ],
            },
            // {
            //   name: 'admin_full_name',
            //   label: 'Contact Person\'s Full Name',
            //   placeholder: 'eg. Grace Tsu',
            //   fieldType: 'TextField',
            //   contentType: 'text',
            //   isRequired: true,
            //   defaultValue: '',
            //   dbName: 'owner_name',
            //   readOnly: false
            // },
            // {
            //   name: 'admin_email',
            //   label: 'Community\'s Public Email',
            //   placeholder: 'eg. johny.appleseed@gmail.com',
            //   fieldType: 'TextField',
            //   contentType: 'text',
            //   isRequired: true,
            //   defaultValue: '',
            //   dbName: 'owner_email',
            //   readOnly: false
            // },
            // {
            //   name: 'admin_phone_number',
            //   label: 'Community\'s Public Phone Number',
            //   placeholder: 'eg. 571 222 4567',
            //   fieldType: 'TextField',
            //   contentType: 'text',
            //   isRequired: false,
            //   defaultValue: '',
            //   dbName: 'owner_phone_number',
            //   readOnly: false
            // },
          ],
        },
        {
          name: "image",
          placeholder: "Upload a Logo",
          fieldType: "File",
          dbName: "image",
          label: "Upload a logo for this community",
          selectMany: false,
          isRequired: false,
          defaultValue: "",
          filesLimit: 1,
        },
        {
          name: "accepted_terms_and_conditions",
          modalText: "Terms and Conditions",
          modalTitle: "Terms and Conditions",
          label: "Accept Terms And Conditions",
          fieldType: "Radio",
          isRequired: false,
          defaultValue: "false",
          dbName: "accepted_terms_and_conditions",
          readOnly: false,
          data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }],
        },
        {
          name: "is_approved",
          label:
            "Do you approve this community? (Check yes after background check)",
          fieldType: "Radio",
          isRequired: false,
          defaultValue: "true",
          dbName: "is_approved",
          readOnly: false,
          data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }],
        },
        {
          name: "is_published",
          label: "Should this go live now?",
          fieldType: "Radio",
          isRequired: false,
          defaultValue: "false",
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

CreateNewCommunityForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(CreateNewCommunityForm);
