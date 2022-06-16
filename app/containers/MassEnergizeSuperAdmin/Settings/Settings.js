import {
  FormControlLabel,
  Hidden,
  Paper,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
  withStyles,
  withTheme,
} from "@material-ui/core";
import { AppBar } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import React, { useState } from "react";
import styles from "dan-components/SocialMedia/jss/cover-jss";
import { connect } from "react-redux";
import Loading from "dan-components/Loading";

function Settings({ settings }) {
  const [currentTab, setCurrentTab] = useState(0); // an integer
  if (!settings) return <Loading />;
  const settingsCategories = Object.entries(settings);
  const [categoryKey, { name, options }] = settingsCategories[currentTab];
  const optionsArray = Object.entries(options);
  return (
    <div>
      <Paper>
        {" "}
        <Typography variant="p" style={{ padding: 20, margin: 20 }}>
          Use the toggles provided to customise the application in a way that
          bests suits you.
        </Typography>
        <Tabs
          onChange={(_, v) => setCurrentTab(v)}
          value={currentTab}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          {settingsCategories.map(([key, { name }]) => (
            <Tab label={name || "..."} key={key} />
          ))}
        </Tabs>
      </Paper>
      <Paper style={{ marginTop: 10, padding:40 }}>
        {optionsArray.map(([optionKey, { live, text, values }]) => {
          // if (!live) return <></>;
          values = Object.entries(values);
          return (
            <div key={optionKey}>
              <Typography variant="p" style={{ fontWeight: "bold" }}>
                {text}
              </Typography>
              <RadioGroup>
                {values.map(([valueKey, answer]) => {
                  return (
                    <FormControlLabel
                      key={valueKey}
                      control={<Radio />}
                      label={answer.name}
                      value={answer.value}
                    />
                  );
                })}
              </RadioGroup>
            </div>
          );
        })}
      </Paper>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    settings: state.getIn(["settings"]),
  };
};
const Mapped = connect(mapStateToProps)(Settings);
export default withStyles(styles)(Mapped);
