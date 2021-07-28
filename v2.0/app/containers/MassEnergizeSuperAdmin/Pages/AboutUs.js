import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
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

class AboutUsPageEditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formJson: null,
      aboutUsPageData: null,
    };
  }

  async componentDidMount() {
    const { id } = this.props.match.params;

    const aboutUsPageData = await apiCall("/about_us_page_settings.info", {
      community_id: id,
    });
    if (aboutUsPageData && aboutUsPageData.success) {
      await this.setStateAsync({ aboutUsPageData: aboutUsPageData.data });
    }

    const formJson = await this.createFormJson(aboutUsPageData.data);
    await this.setStateAsync({ formJson });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  createFormJson = async () => {
    const { aboutUsPageData } = this.state;
    const { community } = aboutUsPageData;
    const image =
      aboutUsPageData && aboutUsPageData.image && aboutUsPageData.image.url;

    console.log("I am the image", image);
    console.log("I am the about us page data", aboutUsPageData);
    const formJson = {
      title: `Edit ${
        community ? community.name + "'s" : "Community's"
      } - About Us Page`,
      subTitle: "",
      method: "/about_us_page_settings.update",
      // successRedirectPage: `/admin/edit/${community.id}/about_us`,
      fields: [
        {
          name: "id",
          label: "ID",
          placeholder: "eg. 1",
          fieldType: "TextField",
          contentType: "number",
          isRequired: true,
          defaultValue: `${aboutUsPageData.id}`,
          dbName: "id",
          readOnly: true,
        },
        {
          name: "title",
          label: "Main Title",
          placeholder: "eg. Welcome to Wayland!",
          fieldType: "TextField",
          contentType: "text",
          isRequired: true,
          defaultValue: `${aboutUsPageData.title}`,
          dbName: "title",
          readOnly: false,
        },
        {
          name: "sub-title",
          label: "Optional Sub-title",
          placeholder: "eg. Welcome to Wayland!",
          fieldType: "TextField",
          contentType: "text",
          isRequired: false,
          defaultValue: `${aboutUsPageData.sub_title}`,
          dbName: "sub_title",
          readOnly: false,
        },
        {
          name: "description",
          label: "Paragraph to be displayed below the title",
          placeholder: "Tell us more ...",
          fieldType: "HTMLField",
          contentType: "text",
          isRequired: true,
          isMultiline: true,
          defaultValue: `${aboutUsPageData.description}`,
          dbName: "description",
          readOnly: false,
        },
        {
          name: "featured_video_link",
          label: "Optional video Link",
          placeholder: "eg. https://www.youtube.com/?v=as122aas",
          fieldType: "TextField",
          contentType: "text",
          isRequired: false,
          defaultValue: `${aboutUsPageData.featured_video_link}`,
          dbName: "featured_video_link",
          readOnly: false,
        },
        {
          name: "image",
          placeholder: "Select an Image",
          fieldType: "File",
          dbName: "image",
          label: "Upload File",
          previewLink: image,
          defaultValue: image,
          allowReset: true,
          filesLimit: 1,
        },
        {
          name: "enable",
          fieldType: "Radio",
          dbName: "is_published",
          label: "This page is enabled if checked",
          isRequired: false,
          defaultValue: `${aboutUsPageData.is_published}`,
          data: [{ id: "false", value: "No" }, { id: "true", value: "Yes" }],
        },
      ],
    };
    return formJson;
  };

  render() {
    const { classes } = this.props;
    const { formJson } = this.state;
    if (!formJson) return <div>Hold tight! Retrieving your data ...</div>;
    return (
      <div>
        <MassEnergizeForm classes={classes} formJson={formJson} />
      </div>
    );
  }
}

AboutUsPageEditForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(AboutUsPageEditForm);
