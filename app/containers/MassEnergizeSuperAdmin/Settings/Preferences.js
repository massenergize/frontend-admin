import {
  Checkbox,
  Button,
  FormControlLabel,
  Hidden,
  Paper,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
  withStyles,
  withTheme,
  Tooltip,
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
import { Snackbar } from "@material-ui/core";
import MySnackbarContentWrapper from "../../../components/SnackBar/SnackbarContentWrapper";

const CHECKBOX = "checkbox";
const RADIO = "radio";
const BUTTON = "button";
const LIST_OF_COMMUNITIES = "list-of-communities";

function Preferences({ settings, auth, communities, updateAdminObject }) {
  const [currentTab, setCurrentTab] = useState(0);
  const [notification, setNotification] = useState({});
  const [changed, setChanged] = useState(false); // track if user makes any changes
  const [newPrefrences, setNewPrefrences] = useState({});

  const adminNudgeSettings =
    ((auth && auth.preferences) || {}).admin_portal_settings || {};
  if (!settings) return <Loading />;

  const settingsCategories = Object.entries(settings).filter(
    ([_, { live }]) => live
  );
  const [categoryKey, { options }] = settingsCategories[currentTab];
  const optionsArray = Object.entries(options);
  var optionInUserSettings = adminNudgeSettings[categoryKey] || {};

  const trackChanges = (data) => {
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
    setNewPrefrences(newSettings);
    setChanged(true);
  };
  const updateSettings = () => {
    if (!Object.values(newPrefrences).length) return;
    sendUpdatesToBackend(newPrefrences);
  };

  const sendUpdatesToBackend = (newSettings) => {
    setNotification({});
    apiCall("/users.update", {
      preferences: JSON.stringify(newSettings),
      id: auth.id,
    })
      .then((response) => {
        if (!response.success) {
          setNotification({ open: true, bad: true, message: response.error });
          return console.log("Error updating user settings: ", response.error);
        }
        setNotification({ open: true, message: "Saved preference changes!" });
        setChanged(false);
      })
      .catch((e) => {
        console.log("Error updating admin settings: ", e.toString());
        setNotification({ open: true, bad: true, message: e.toString() });
      });
  };

  const sendReportToAdmin = () => {
    setNotification({});
    apiCall("/downloads.cadmin_report", {
      id: auth.id,
    })
      .then((response) => {
        if (!response.success) {
          setNotification({ open: true, bad: true, message: response.error });
          return console.log(
            "Error sending action to backend: ",
            response.error
          );
        }

        setNotification({
          open: true,
          message: "Sample report is sent to your email!",
        });
      })
      .catch((e) => {
        setNotification({ open: true, bad: true, message: e.toString() });
        console.log("Error sending action: ", e.toString());
      });
  };
  const functions = {
    sendReportToAdmin,
  };

  return (
    <div>
      <Paper>
        {/*  TODO: The text here is just a placeholder. Text description from Kaat or Brad will be used here... */}
        <Typography variant="body1" style={{ padding: 20, margin: 20 }}>
          Choose the frequency and content of information you wish to receive.
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
      <Paper>
        <div style={{ marginTop: 10, padding: 40 }}>
          {/* ---------------- SETTINGS OPTION DISPLAY LEVEL --------------- */}
          {optionsArray.map(
            ([
              optionKey,
              {
                live,
                text,
                explanation,
                type,
                values,
                expected_data_source,
                function_key,
              },
            ]) => {
              const availableOptionsForCurrentLevel =
                (optionInUserSettings || {})[optionKey] || {};
              if (!live) return <></>;
              const usesCheckboxes = type === CHECKBOX;
              const usesRadioButtons = type === RADIO;
              const usesButton = type === BUTTON;

              if (usesButton)
                return (
                  <>
                    <Button
                      style={{ marginTop: 15 }}
                      variant="outlined"
                      onClick={() => {
                        const func = functions[function_key];
                        if (!func) return;
                        func();
                      }}
                      color="primary"
                    >
                      {text}
                    </Button>
                  </>
                );

              values = Object.entries(values);

              return (
                <div key={optionKey}>
                  <Typography variant="p" style={{ fontWeight: "bold" }}>
                    {text}
                  </Typography>
                  <Typography variant="p">{explanation}</Typography>

                  {usesCheckboxes ? (
                    <RenderCheckboxes
                      values={values}
                      expectedDataSource={expected_data_source}
                      auth={auth}
                      communities={communities}
                      selectedItemsFromUserObj={availableOptionsForCurrentLevel}
                      userSettings={adminNudgeSettings}
                      updateSettings={(data) =>
                        trackChanges({
                          ...optionInUserSettings,
                          [optionKey]: data,
                        })
                      }
                    />
                  ) : null}

                  {usesRadioButtons ? (
                    <RenderRadioButtons
                      values={values}
                      auth={auth}
                      selectedItemsFromUserObj={availableOptionsForCurrentLevel}
                      userSettings={adminNudgeSettings}
                      optionLevelKey={optionKey}
                      updateSettings={(data) =>
                        trackChanges({
                          ...optionInUserSettings,
                          [optionKey]: data,
                        })
                      }
                    />
                  ) : null}
                </div>
              );
            }
          )}

          <div style={{ marginTop: 15 }}>
            <Button
              disabled={!changed}
              variant="contained"
              color="secondary"
              className="touchable-opacity"
              onClick={() => updateSettings()}
            >
              <Tooltip title="Click to save all the changes you have made to your preferences">
                <span> Save Changes</span>
              </Tooltip>
            </Button>
          </div>
        </div>

        {/* WILL REMOVE WHEN APPROVED AND DEPLOYED */}
        {/* <div style={{ background: "#fbfbfb", display: "flex" }}>
          <Button
            variant="contained"
            color="secondary"
            className="touchable-opacity"
            style={{
              borderRadius: 0,
              padding: 10,
              width: 200,
              background: "#00BCD4",
            }}
          >
            SAVE CHANGES
          </Button>
        </div> */}
      </Paper>

      <Snackbar
        open={notification.open}
        style={{ marginBottom: 10 }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        autoHideDuration={6000}
        onClose={() => setNotification({})}
      >
        <MySnackbarContentWrapper
          variant={notification.bad ? "error" : "success"}
          message={
            <small style={{ marginLeft: 15, fontSize: 15 }}>
              {notification.message}
            </small>
          }
        />
      </Snackbar>
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
)(Preferences);
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
