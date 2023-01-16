import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { apiCall } from "../../../utils/messenger";
// import MassEnergizeForm from '../_FormGenerator';
import { PAGE_KEYS } from "../ME  Tools/MEConstants";
import MassEnergizeForm from "../_FormGenerator/MassEnergizeForm";
import Loading from "dan-components/Loading";

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

class CreateNewTagCollectionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formJson: null,
    };
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

  createFormJson = async () => {
    const formJson = {
      title: "Create New Tag Collection",
      subTitle: "",
      // cancelLink: '/admin/read/categories',
      method: "/tag_collections.create",
      successRedirectPage: "/admin/read/categories",
      fields: [
        {
          label: "About this Tag Collection",
          fieldType: "Section",
          children: [
            {
              name: "name",
              label: "Name of Tag Collection",
              placeholder: "eg. Category",
              fieldType: "TextField",
              contentType: "text",
              isRequired: true,
              defaultValue: "",
              dbName: "name",
              readOnly: false,
            },
            {
              name: "rank",
              label: "Rank of Category (Lower comes first)",
              placeholder: "eg. 1",
              fieldType: "TextField",
              contentType: "number",
              isRequired: true,
              defaultValue: "",
              dbName: "rank",
              readOnly: false,
            },
            {
              name: "tags",
              label: "Please write the tags separated by commas",
              placeholder: "eg. Low, Medium, High",
              fieldType: "TextField",
              contentType: "text",
              isRequired: true,
              isMultiline: true,
              defaultValue: "",
              dbName: "tags",
              readOnly: false,
            },
          ],
        },
      ],
    };
    return formJson;
  };

  render() {
    const { classes } = this.props;
    const { formJson } = this.state;
    if (!formJson) return <Loading />;
    return (
      <div>
        <MassEnergizeForm
          pageKey={PAGE_KEYS.CREATE_NEW_TAG.key}
          classes={classes}
          formJson={formJson}
          enableCancel
        />
      </div>
    );
  }
}

CreateNewTagCollectionForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(
  CreateNewTagCollectionForm
);
