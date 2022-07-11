import { Paper, Tab, Tabs, Typography, withStyles } from "@material-ui/core";
import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import styles from "../../../components/Widget/widget-jss";
import { loadFeatureFlags } from "../../../redux/redux-actions/adminActions";
import AddOrEditFeatureFlags from "./AddOrEditFeatureFlags";
import ManageFeatureFlags from "./ManageFeatureFlags";

function FeatureFlags({
  classes,
  featureFlags,
  communities,
  users,
  putFlagsInRedux,
}) {
  const [currentTab, setCurrentTab] = useState(1);
  const [featureToEdit, setFeatureToEdit] = useState(null);
  const TABS = {
    0: {
      key: "manage-flags",
      name: "Manage Feature Flags",
      component: (
        <ManageFeatureFlags
          classes={classes}
          flags={featureFlags && featureFlags.features}
          editFeature={(data) => {
            setFeatureToEdit(data);
            setCurrentTab(1);
          }}
        />
      ),
    },
    1: {
      key: "add-new-flag",
      name: "New Feature Flag",
      component: (
        <AddOrEditFeatureFlags
          classes={classes}
          communities={communities}
          flagKeys={(featureFlags && featureFlags.keys) || {}}
          users={users}
          switchTabs={() => setCurrentTab(0)}
          featureFlags={featureFlags}
          putFlagsInRedux={putFlagsInRedux}
          featureToEdit={featureToEdit}
        />
      ),
    },
  };
  const tab = TABS[currentTab];

  return (
    <div>
      <Paper>
        <div style={{ padding: 20 }}>
          <Typography variant="body">
            Thisi s the page for feature flags, feel free to toggle anything
            that needs to be done
          </Typography>
        </div>

        <Tabs
          onChange={(_, tabIndex) => setCurrentTab(tabIndex)}
          value={currentTab}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          {Object.entries(TABS).map(([_, tab]) => (
            <Tab label={tab.name} key={tab.key} />
          ))}
        </Tabs>
      </Paper>

      <div style={{ marginTop: 10 }}>{(tab && tab.component) || <></>}</div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    featureFlags: state.getIn(["featureFlags"]),
    communities: state.getIn(["communities"]),
    users: state.getIn(["allUsers"]),
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ putFlagsInRedux: loadFeatureFlags }, dispatch);
};
const Mapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(FeatureFlags);
export default withStyles(styles)(Mapped);
