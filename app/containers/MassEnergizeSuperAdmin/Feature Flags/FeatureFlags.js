import { Paper, Tab, Tabs, Typography } from "@mui/material";
import { withStyles } from "@mui/styles";
import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import styles from "../../../components/Widget/widget-jss";
import {
  loadFeatureFlags,
  reduxToggleUniversalModal,
  reduxToggleUniversalToast,
} from "../../../redux/redux-actions/adminActions";
import AddOrEditFeatureFlags from "./AddOrEditFeatureFlags";
import ManageFeatureFlags from "./ManageFeatureFlags";

function FeatureFlags({
  classes,
  featureFlags,
  communities,
  users,
  putFlagsInRedux,
  toggleDeleteConfirmation,
  toggleToast
}) {
  const [currentTab, setCurrentTab] = useState(0);
  const [featureToEdit, setFeatureToEdit] = useState(null);
  const TABS = {
    0: {
      key: "manage-flags",
      name: "Manage Feature Flags",
      component: (
        <ManageFeatureFlags
          classes={classes}
          featureFlags={featureFlags}
          // flags={featureFlags && featureFlags.features}
          editFeature={(data) => {
            setFeatureToEdit(data);
            setCurrentTab(1);
          }}
          toggleDeleteConfirmation={toggleDeleteConfirmation}
          putFlagsInRedux={putFlagsInRedux}
          toggleToast={toggleToast}
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
          // flagKeys={(featureFlags && featureFlags.keys) || {}}
          users={users}
          switchTabs={() => setCurrentTab(0)}
          featureFlags={featureFlags}
          putFlagsInRedux={putFlagsInRedux}
          featureToEdit={featureToEdit}
          setFeatureToEdit = {setFeatureToEdit}
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
            Feature flags help you control which functionalities are available
            to different audiences. Here, you can create flags that can be used
            to narrow a functionality to a group of communities, a group of
            users, or a particular platform. Like (User portal, or admin portal)
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
  return bindActionCreators(
    {
      putFlagsInRedux: loadFeatureFlags,
      toggleDeleteConfirmation: reduxToggleUniversalModal,
      toggleToast:reduxToggleUniversalToast
    },
    dispatch
  );
};
const Mapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(FeatureFlags);
export default withStyles(styles)(Mapped);
