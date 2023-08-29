import { Paper, Tab, Tabs, Typography } from "@mui/material";
import { withStyles } from "@mui/styles";
import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import styles from "../../../components/Widget/widget-jss";
import {
  loadEmailTemplates,
  reduxToggleUniversalModal,
  reduxToggleUniversalToast,
} from "../../../redux/redux-actions/adminActions";
import Seo from "../../../components/Seo/Seo";
import ListEmailTemplates from "./ListEmailTemplates";
import CreateOrEditTemplate from "./CreateOrEditTemplate";

function EmailTemplates({
  classes,
  emailTemplates,
  putTemplateInRedux,
  toggleDeleteConfirmation,
  toggleToast,
}) {
  const [currentTab, setCurrentTab] = useState(0);
  const [templateToEdit, setTemplateToEdit] = useState(null);
  const TABS = {
    0: {
      key: "email-templates",
      name: "Manage Email Templates",
      component: (
        <ListEmailTemplates
          classes={classes}
          emailTemplates={emailTemplates}
          putTemplateInRedux={putTemplateInRedux}
          toggleDeleteConfirmation={toggleDeleteConfirmation}
          toggleToast={toggleToast}
          editEmailTemplate={(data) => {
            setTemplateToEdit(data);
            setCurrentTab(1);
          }}
        />
      ),
    },
    1: {
      key: "add-new-email-template",
      name: "New Email Template",
      component: (
        <CreateOrEditTemplate
          classes={classes}
          toEdit={templateToEdit}
          switchTabs={() => setCurrentTab(0)}
          setTemplateToEdit={setTemplateToEdit}
          emailTemplates={emailTemplates}
          putTemplateInRedux={putTemplateInRedux}
        />
      ),
    },
  };
  const tab = TABS[currentTab];

  return (
    <div>
      <Seo name={"Email Templates"} />
      <Paper>
        <div style={{ padding: 20 }}>
          <Typography variant="body" />
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
    emailTemplates: state.getIn(["emailTemplates"]),
    communities: state.getIn(["communities"]),
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      putTemplateInRedux: loadEmailTemplates,
      toggleDeleteConfirmation: reduxToggleUniversalModal,
      toggleToast: reduxToggleUniversalToast,
    },
    dispatch
  );
};
const Mapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(EmailTemplates);
export default withStyles(styles)(Mapped);
