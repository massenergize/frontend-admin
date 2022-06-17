import {
  Checkbox,
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
import { Typography } from "@material-ui/core";
import React, { useState } from "react";
import styles from "dan-components/SocialMedia/jss/cover-jss";
import { connect } from "react-redux";
import Loading from "dan-components/Loading";
import MEDropdown from "../ME  Tools/dropdown/MEDropdown";

const CHECKBOX = "checkbox";
const LIST_OF_COMMUNITIES = "list-of-communities";
function Settings({ settings, auth, communities }) {
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
      <Paper style={{ marginTop: 10, padding: 40 }}>
        {optionsArray.map(
          ([optionKey, { live, text, type, values, expected_data_source }]) => {
            // if (!live) return <></>;
            const usesCheckboxes = type === CHECKBOX;
            values = Object.entries(values);
            return (
              <div key={optionKey}>
                <Typography variant="p" style={{ fontWeight: "bold" }}>
                  {text}
                </Typography>
                {usesCheckboxes ? (
                  <RenderCheckboxes
                    values={values}
                    expectedDataSource={expected_data_source}
                    auth={auth}
                    communities={communities}
                  />
                ) : (
                  <RenderRadioButtons values={values} auth={auth} />
                )}
                {/* <RadioGroup>
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
              </RadioGroup> */}
              </div>
            );
          }
        )}
      </Paper>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    settings: state.getIn(["settings"]),
    auth: state.getIn(["auth"]),
    communities: state.getIn(["communities"]),
  };
};
const Mapped = connect(mapStateToProps)(Settings);
export default withStyles(styles)(Mapped);

const RenderRadioButtons = ({ values }) => {
  return (
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
  );
};

const RenderCheckboxes = ({
  values,
  expectedDataSource,
  auth,
  communities,
}) => {
  const list = auth.is_super_admin ? communities : auth.admin_at;
  if (expectedDataSource === LIST_OF_COMMUNITIES)
    values = (list || []).map((community) => [community.id, community]);
  // If items are more than 10, make the checkboxes into a dropdown
  if (list.length > 10) {
    //In future we can modifiy the labelExt, and valueExt depending on the "expectedDataSource" when we have more "list-like" value types to cater for in settings
    const labelExt = (com) => com.name;
    const valueExt = (com) => com.id;
    return (
      <MEDropdown
        multiple
        data={[{ id: "all", name: "All" }, ...communities]}
        labelExtractor={labelExt}
        valueExtractor={valueExt}
      />
    );
  }
  return (
    <RadioGroup>
      {values.map(([valueKey, answer]) => {
        return (
          <FormControlLabel
            key={valueKey}
            control={<Checkbox />}
            label={answer.name}
            value={answer.value}
          />
        );
      })}
    </RadioGroup>
  );
};
