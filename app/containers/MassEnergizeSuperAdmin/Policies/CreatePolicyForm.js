import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import { apiCall } from "../../../utils/messenger";
import MassEnergizeForm from "../_FormGenerator/MassEnergizeForm";
import Loading from "dan-components/Loading";
import { PAGE_KEYS } from "../ME  Tools/MEConstants";
import { connect } from "react-redux";
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

class CreateNewPolicyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communities: [],
      formJson: null,
    };
  }

  async componentDidMount() {
    const { communities } = this.props;
    console.log("I am the COMS", communities);
    (communities || []).sort((a, b) => (a.name > b.name ? 1 : -1));
    // const communitiesResponse = await apiCall(
    //   "/communities.listForCommunityAdmin"
    // );

    // if (communitiesResponse && communitiesResponse.data) {
    //   const communities = communitiesResponse.data.map((c) => ({
    //     ...c,
    //     displayName: c.name,
    //   }));
    //   await this.setStateAsync({ communities });
    // }

    const formJson = this.createFormJson({
      communities: (communities || []).map((com) => ({
        displayName: com?.name,
        id: com?.id,
      })),
    });
    this.setState({ formJson });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }
  autoGenerateKey({ newValue, _, setValueInForm }) {
    let policyNameArr = newValue?.toLowerCase()?.split(" ");
    let key = policyNameArr.join("-");
    console.log("Here is the joined", key);
    setValueInForm({ key });
  }

  createFormJson = ({ communities }) => {
    // const { communities } = this.state;
    const formJson = {
      title: "Create New Policy",
      subTitle: "",
      cancelLink: "/admin/read/policies",
      method: "/policies.create",
      successRedirectPage: "/admin/read/policies",
      fields: [
        {
          label: "About this Policy",
          fieldType: "Section",
          children: [
            {
              name: "name",
              label: "Name of Policy",
              placeholder: "eg. Terms and Conditions",
              fieldType: "TextField",
              contentType: "text",
              isRequired: true,
              defaultValue: "",
              dbName: "name",
              readOnly: false,
              onChangeMiddleware: this.autoGenerateKey,
            },
            {
              name: "key",
              label: "Key (auto generated, but can be edited)",
              placeholder: "Unique Key",
              fieldType: "TextField",
              contentType: "text",
              isRequired: true,
              defaultValue: "",
              dbName: "key",
              readOnly: false,
            },
            {
              name: "is_global",
              label: "Is this Policy a Template?",
              fieldType: "Radio",
              isRequired: false,
              defaultValue: "true",
              dbName: "is_global",
              readOnly: false,
              data: [
                { id: "false", value: "No" },
                { id: "true", value: "Yes" },
              ],
              child: {
                valueToCheck: "false",
                fields: [
                  {
                    name: "community",
                    label: "Primary Community",
                    placeholder: "eg. Wayland",
                    fieldType: "Dropdown",
                    defaultValue: null,
                    dbName: "community_id",
                    data: [{ displayName: "--", id: "" }, ...communities],
                  },
                ],
              },
            },
          ],
        },
        {
          name: "description",
          label: "Policy Details",
          placeholder: "eg. Provide details about this Policy ...",
          fieldType: "HTMLField",
          contentType: "text",
          isRequired: true,
          isMultiline: true,
          defaultValue: "",
          dbName: "description",
          readOnly: false,
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
          pageKey={PAGE_KEYS.CREATE_POLICY.key}
          classes={classes}
          formJson={formJson}
          enableCancel
        />
      </div>
    );
  }
}

CreateNewPolicyForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  communities: state.getIn(["communities"]),
});
const Mapped = connect(mapStateToProps)(CreateNewPolicyForm);
export default withStyles(styles, { withTheme: true })(Mapped);
