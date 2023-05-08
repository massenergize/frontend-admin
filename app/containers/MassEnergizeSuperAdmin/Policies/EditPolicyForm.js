import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import MassEnergizeForm from "../_FormGenerator/MassEnergizeForm";

import { apiCall } from "../../../utils/messenger";
import { makeKeyFromName } from "./CreatePolicyForm";
import { connect } from "react-redux";
import LinearBuffer from "../../../components/Massenergize/LinearBuffer";
import { bindActionCreators } from "redux";
import { loadAllPolicies } from "../../../redux/redux-actions/adminActions";
import { withRouter } from "react-router-dom";
import { PAGE_KEYS } from "../ME  Tools/MEConstants";

// validation functions
// const required = value => (value == null ? 'Required' : undefined);

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
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  menu: {
    width: 200,
  },
});

class EditPolicyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      policy: null,
      communities: [],
    };
  }

  async componentDidMount() {
    const { policies, communities } = this.props;
    const id = this.fetchId();
    const comMap = (c) => ({
      ...c,
      id: "" + c.id,
      displayName: c.name,
    });
    const policy = (policies || []).find(
      (p) => p.id?.toString() === id?.toString()
    );

    this.setState({ policy, communities: (communities || []).map(comMap) });
    // Even if we find policy and communities locally, we still want to run a request to bring up the latest updates
    try {
      const policyResponse = await apiCall("/policies.info", { policy_id: id });
      const communitiesResponse = await apiCall(
        "/communities.listForCommunityAdmin"
      );

      if (policyResponse && policyResponse.success)
        this.setState({ policy: policyResponse.data });

      if (communitiesResponse && communitiesResponse.data) {
        const communities = communitiesResponse.data.map(comMap);
        this.setState({ communities });
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }
  fetchId() {
    const { id } = this.props.match.params;
    return id;
  }

  createFormJson = () => {
    const { communities, policy } = this.state;
    if (!communities?.length || !policy) return;

    const formJson = {
      title: "Edit Policy",
      subTitle: "",
      method: "/policies.update",
      cancelLink: "/admin/read/policies",

      fields: [
        {
          label: "About this Policy",
          fieldType: "Section",
          children: [
            {
              name: "ID",
              label: "ID",
              placeholder: "eg. 1",
              fieldType: "TextField",
              contentType: "text",
              defaultValue: policy && policy.id,
              dbName: "policy_id",
              readOnly: true,
            },
            {
              name: "name",
              label: "Name of Policy",
              placeholder: "eg. Terms and Conditions",
              fieldType: "TextField",
              contentType: "text",
              isRequired: true,
              defaultValue: policy && policy.name,
              dbName: "name",
              readOnly: false,
              onChangeMiddleware: makeKeyFromName,
            },
            {
              name: "key",
              label: "Key (auto generated, but can be edited)",
              placeholder: "Unique Key",
              fieldType: "TextField",
              contentType: "text",
              isRequired: true,
              defaultValue: (policy && policy.key) || "",
              dbName: "key",
              readOnly: false,
            },
            {
              name: "is_global",
              label: "Is this Policy a Template?",
              fieldType: "Radio",
              isRequired: false,
              defaultValue: policy && policy.is_global ? "true" : "false",
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
                    defaultValue:
                      policy && policy.community && "" + policy.community.id,
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
          defaultValue: policy && policy.description,
          dbName: "description",
          readOnly: false,
        },
      ],
    };
    return formJson;
  };

  onComplete(data, passed) {
    const { policies, updatePoliciesInRedux, history } = this.props;
    const id = this.fetchId();
    if (!passed) return;
    const rem = (policies || []).filter(
      (p) => p?.id?.toString() !== id?.toString()
    );
    updatePoliciesInRedux([data, ...rem]);
    history.goBack();
  }
  render() {
    const { classes } = this.props;
    const formJson = this.createFormJson();
    const id = this.fetchId();
    if (!formJson)
      return <LinearBuffer message="Retrieving policy..." asCard />;
    return (
      <div>
        <MassEnergizeForm
          classes={classes}
          formJson={formJson}
          onComplete={this.onComplete.bind(this)}
          pageKey={`${PAGE_KEYS.EDIT_POLICY.key}-${id}`}
          enableCancel
        />
      </div>
    );
  }
}

EditPolicyForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      updatePoliciesInRedux: loadAllPolicies,
    },
    dispatch
  );
};
const mapStateToProps = (state) => {
  return {
    policies: state.getIn(["allPolicies"]),
    communities: state.getIn(["communities"]),
  };
};
const Mapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditPolicyForm);
export default withStyles(styles, { withTheme: true })(withRouter(Mapped));
