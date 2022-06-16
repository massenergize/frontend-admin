import {
  Hidden,
  Paper,
  Tab,
  Tabs,
  withStyles,
  withTheme,
} from "@material-ui/core";
import { AppBar } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { AccountCircle, InsertChart, PhotoLibrary } from "@material-ui/icons";
import React, { useState } from "react";
import styles from "dan-components/SocialMedia/jss/cover-jss";
function Settings({}) {
  const [currentTab, setCurrentTab] = useState(0);
  return (
    <div>
      <Paper>
        {" "}
        <Typography variant="p" style={{ padding: 20, margin: 20 }}>
          YOu have the right to remain silent. All your settings can be found on
          this page but they are not available yet. Please stay tuned
        </Typography>
        <Tabs
          onChange={(_, v) => setCurrentTab(v)}
          value={currentTab}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="General" />
          <Tab label="Advance" />
        </Tabs>
      </Paper>
    </div>
  );
}

export default withStyles(styles)(Settings);
