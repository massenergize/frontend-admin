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
import { bindActionCreators } from "redux";
import { reduxLoadAuthAdmin } from "../../../redux/redux-actions/adminActions";
import { apiCall } from "../../../utils/messenger";

const CHECKBOX = "checkbox";
const LIST_OF_COMMUNITIES = "list-of-communities";

function Settings({ settings, auth, communities, updateAdminObject }) {
  const [currentTab, setCurrentTab] = useState(0);

  const adminNudgeSettings =
    ((auth && auth.preferences) || {}).admin_portal_settings || {};

  if (!settings) return <Loading />;

  const settingsCategories = Object.entries(settings).filter(
    ([_, { live }]) => live
  );
  const [categoryKey, { options }] = settingsCategories[currentTab];
  const optionsArray = Object.entries(options);
  var optionInUserSettings = adminNudgeSettings[categoryKey] || {};

  const updateSettings = (data) => {
    var newSettings = {
      ...adminNudgeSettings,
      [categoryKey]: data,
    };
    newSettings = {
      ...(auth.preferences || {}),
      admin_portal_settings: newSettings,
    };
    updateAdminObject({
      ...auth,
      preferences: newSettings,
    });
    sendUpdatesToBackend(newSettings);
  };

  const sendUpdatesToBackend = (newSettings) => {
    apiCall("/users.update", {
      preferences: JSON.stringify(newSettings),
      id: auth.id,
    })
      .then((response) => {
        if (!response.success)
          return console.log("Error updating user settings: ", response.error);
      })
      .catch((e) =>
        console.log("Error updating admin settings: ", e.toString())
      );
  };

  return (
    <div>
      <Paper>
        {" "}
        <Typography variant="p" style={{ padding: 20, margin: 20 }}>
          Use the toggles provided to customise the application in any way that
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
        {/* ---------------- SETTINGS OPTION DISPLAY LEVEL --------------- */}
        {optionsArray.map(
          ([optionKey, { live, text, type, values, expected_data_source }]) => {
            const availableOptionsForCurrentLevel =
              (optionInUserSettings || {})[optionKey] || {};
            if (!live) return <></>;
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
                    selectedItemsFromUserObj={availableOptionsForCurrentLevel}
                    userSettings={adminNudgeSettings}
                    updateSettings={(data) =>
                      updateSettings({
                        ...optionInUserSettings,
                        [optionKey]: data,
                      })
                    }
                  />
                ) : (
                  <RenderRadioButtons
                    values={values}
                    auth={auth}
                    selectedItemsFromUserObj={availableOptionsForCurrentLevel}
                    userSettings={adminNudgeSettings}
                    optionLevelKey={optionKey}
                    updateSettings={(data) =>
                      updateSettings({
                        ...optionInUserSettings,
                        [optionKey]: data,
                      })
                    }
                  />
                )}
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
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    { updateAdminObject: reduxLoadAuthAdmin },
    dispatch
  );
};
const Mapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
export default withStyles(styles)(Mapped);

// -------- DISPLAY LEVEL FOR POSSIBLE CHOICES FOR EACH SETTING ---------
const RenderRadioButtons = ({
  values,
  selectedItemsFromUserObj,
  updateSettings,
  optionLevelKey,
}) => {
  return (
    <RadioGroup>
      {values.map(([valueKey, answer]) => {
        const valueFromUserSettings =
          (selectedItemsFromUserObj || {})[valueKey] || {};
        const checked = valueFromUserSettings.value || answer.value;

        return (
          <FormControlLabel
            onClick={() =>
              updateSettings({
                [valueKey]: { value: !checked },
              })
            }
            key={valueKey}
            control={<Radio checked={checked} />}
            label={answer.name}
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
  selectedItemsFromUserObj,
  updateSettings,
}) => {
  var list,
    labelExt,
    valueExt,
    selected = [];

  if (expectedDataSource === LIST_OF_COMMUNITIES) {
    list = auth.is_super_admin ? communities : auth.admin_at;
    list = (list || []).map((community) => {
      const id = community.id.toString();
      const isCheckedByUser = selectedItemsFromUserObj[id];
      if (isCheckedByUser && isCheckedByUser.value === true) selected.push(id);
      return [community.id.toString(), community];
    });
    list = [["all", { id: "all", name: "All" }], ...list];
    labelExt = ([_, com]) => com.name;
    valueExt = ([id, _]) => id;
  } else {
    list = values;
    labelExt = ([_, val]) => val;
    valueExt = ([key]) => key;
  }

  const dropdownOnChange = (items) => {
    if (!items || !items.length) return updateSettings({});
    items = (items || []).map((it) => [it, { value: true }]);
    items = Object.fromEntries(items);
    updateSettings(items);
  };
  // If items are more than 10, change the checkboxes into a dropdown
  if (list.length > 10) {
    return (
      <MEDropdown
        multiple
        data={list}
        labelExtractor={labelExt}
        valueExtractor={valueExt}
        defaultValue={selected}
        onItemSelected={dropdownOnChange}
      />
    );
  }

  return (
    <RadioGroup>
      {values.map(([valueKey, answer]) => {
        const valueFromUserSettings =
          (selectedItemsFromUserObj || {})[valueKey] || {};
        const checked = valueFromUserSettings.value || answer.value;
        return (
          <FormControlLabel
            onClick={() =>
              updateSettings({
                ...selectedItemsFromUserObj,
                [valueKey]: { value: !checked },
              })
            }
            key={valueKey}
            control={<Checkbox checked={checked} />}
            label={answer.name}
          />
        );
      })}
    </RadioGroup>
  );
};
