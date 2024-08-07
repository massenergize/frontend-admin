import { Button, FormControlLabel, Radio, TextField, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import MEPaperBlock from "../ME  Tools/paper block/MEPaperBlock";
import { CheckBox, LeakAddSharp } from "@mui/icons-material";
import LightAutoComplete from "../Gallery/tools/LightAutoComplete";
import { useDispatch, useSelector } from "react-redux";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import MomentUtils from "@date-io/moment";
import Loading from "dan-components/Loading";
import LinearBuffer from "../../../components/Massenergize/LinearBuffer";
import { fetchParamsFromURL, formatWithDelimiter, formatWithMoment } from "../../../utils/common";
import { apiCall } from "../../../utils/messenger";
import { DatePicker } from "@mui/x-date-pickers";
import useCommunityFromURL from "../../../utils/hooks/useCommunityHook";
import { reduxKeepCommunityNudgeSettings } from "../../../redux/redux-actions/adminActions";
import { FLAGS } from "../../../components/FeatureFlags/flags";
import CustomPageTitle from "../Misc/CustomPageTitle";
import GoBack from "../../Pages/CustomPages/Frags/GoBack";
import Seo from "../../../components/Seo/Seo";
export const ENABLED = "enabled";
export const PAUSED = "paused";
export const DISABLED = "disabled";
const options = [
  { key: ENABLED, icon: "fa-play", name: "Enable Sending" },
  { key: DISABLED, icon: "fa-stop", name: "Disable Sending" },
  { key: PAUSED, icon: "fa-pause", name: "Pause Sending" }
  // { key: "custom", icon: "", name: "Custom (I want to stop some, pause some)" }
];
const NUDGE_CONTROL_FEATURES = [
  {
    key: FLAGS.EVENT_NUDGE_FEATURE_FLAG_KEY,
    name: "Event Notifications",
    description: "Manage event notifications in your community. Stop, pause, and add when you want to continue",
    options
  }
];
const ACTIVE_FLAG_KEYS = [FLAGS.EVENT_NUDGE_FEATURE_FLAG_KEY];

function NudgeControlPage() {
  const dispatch = useDispatch();
  const nudgeSettingsTray = useSelector((state) => state.getIn(["communityNudgeSettings"]) || {});
  const [lastSavedOptions, setLastSavedOption] = useState({});
  const [form, setForm] = useState({});
  const [loadPage, setLoadingPage] = useState(false);
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const community = useCommunityFromURL();
  const { comId } = fetchParamsFromURL(window.location, "comId");

  const nudgeControlItems = NUDGE_CONTROL_FEATURES;

  const putNudgeListInRedux = (data) => {
    dispatch(reduxKeepCommunityNudgeSettings({ ...nudgeSettingsTray, [comId]: data }));
  };
  const isSelected = (sectionKey, option) => {
    const data = form || {};
    const item = data[sectionKey] || {};
    return option === item?.key;
  };

  const getValue = (sectionKey, data) => {
    data = data || form || {};
    const item = data[sectionKey] || {};
    return item;
  };

  const selectOption = (sectionKey, optionKey, value) => {
    const oldValue = getValue(sectionKey);
    setForm({
      ...form,
      [sectionKey]: { ...oldValue, key: optionKey, value }
    });
  };

  const reformat = (obj) => {
    const { is_active, activate_on } = obj || {};
    const isPaused = !is_active && activate_on;
    return {
      ...(obj || {}),
      key: is_active ? ENABLED : isPaused ? PAUSED : DISABLED,
      value: isPaused ? activate_on : true
    };
  };
  const reformatBackendData = (data) => {
    const formatted = Object.fromEntries(
      Object.entries(data).map(([ffKey, value]) => {
        return [
          ffKey,
          {
            ...(value || {}),
            ...reformat(value)
          }
        ];
      })
    );
    return formatted;
  };

  const updateLastSavedOption = (sectionKey, selection) => {
    setLastSavedOption({ ...lastSavedOptions, [sectionKey]: selection });
  };

  const changesMadeAllowSave = (sectionKey) => {
    const newItem = getValue(sectionKey, form);
    const oldItem = getValue(sectionKey, lastSavedOptions);
    return newItem?.key !== oldItem?.key;
  };
  const saveChanges = (optionKey, selection) => {
    setLoading({ ...loading, [optionKey]: true });
    setErrors({ ...errors, [optionKey]: null });
    const { key, value, id } = selection || {};
    // Now run api call to save the changes
    const formBody = {
      id,
      community_id: community?.id,
      is_active: key === ENABLED,
      activate_on: key === PAUSED ? (value === true ? formatWithMoment() : value) : null
    };

    apiCall("communities.notifications.settings.set", formBody)
      .then((res) => {
        setLoading({ ...loading, [optionKey]: false });
        if (!res || !res?.success) {
          setErrors({ ...errors, [optionKey]: res?.error || "An error occurred" });
          return;
        }
        const { data } = res || {};
        const formatted = {...(data || {}), ...reformat(data)}
        const newState = { ...form, [optionKey]: formatted };
        setForm(newState);
        putNudgeListInRedux(newState);
        updateLastSavedOption(optionKey, formatted);
      })
      .catch((err) => {
        setLoading({ ...loading, [optionKey]: false });
        setErrors({ ...errors, [optionKey]: err?.toString() });
        console.log("ERROR_SAVING_NUDGE_CONTROL: ", err?.toString());
      });
  };

  const init = () => {
    setLoadingPage(true);
    setErrors({});
    //If User has been to the page for the same community before, the list should already be in redux, so fetch from redux instead of an API request
    const nudgeList = nudgeSettingsTray[comId];
    if (nudgeList) {
      setLoadingPage(false);
      const formated = reformatBackendData(nudgeList);
      setLastSavedOption(formated);
      return setForm(formated);
    }
    apiCall("communities.notifications.settings.list", { community_id: comId, feature_flag_keys: ACTIVE_FLAG_KEYS })
      .then((res) => {
        setLoadingPage(false);
        if (!res || !res?.success) {
          console.log("Error fetching notification settings", res);
          setErrors({ ...errors, loadingError: res?.error });
          return;
        }
        const { data } = res || {};
        const hasContent = Object.keys(data || {}).length > 0;
        if (!hasContent)
          return setErrors({
            ...errors,
            loadingError: "Notification control keys are not available yet, please contact a super admin"
          });

        setLoadingPage(false);
        const formated = reformatBackendData(data);
        setForm(formated);
        setLastSavedOption(formated);
        putNudgeListInRedux(data);
      })
      .catch((err) => {
        console.log("ERROR_FETCHING_NUDGE_CONTROL: ", err?.toString());
        setErrors({ ...errors, loadingError: err?.toString() });
        setLoadingPage(false);
      });
  };
  useEffect(() => init(), [comId]);

  if (loadPage) return <LinearBuffer lines={1} asCard message="Hold tight, fetching your items..." />;

  const loadingError = errors["loadingError"];
  if (loadingError)
    return (
      <MEPaperBlock banner>
        <p style={{ color: "#af3131" }}>
          {loadingError}
          <span
            onClick={() => init()}
            className="touchable-opacity"
            style={{ marginLeft: 5, border: "solid 0px #af3131", borderBottomWidth: 2 }}
          >
            <b>Retry</b>
          </span>
        </p>
      </MEPaperBlock>
    );
  return (
    <div>
      <Seo name="Notification Control" />
      <CustomPageTitle>
        Notification Control for <b>{community?.name || "..."}</b>
      </CustomPageTitle>
      <MEPaperBlock>
        <GoBack />
        <Typography style={{ marginTop: 5 }}>
          Use these controls to start, pause or stop sending <b>{community?.name || "..."}</b> community members
          {/* Control all items related to nudges for <b>{community?.name || "..."}</b> on this page */}
        </Typography>

        <div style={{ marginTop: 30 }}>
          {nudgeControlItems?.map((oneNudgeControlOption) => {
            const { name, key: sectionKey, description, options } = oneNudgeControlOption || {};
            const isSaving = (loading || {})[sectionKey];
            const error = (errors || {})[sectionKey];

            const optionInState = getValue(sectionKey);
            const last = lastSavedOptions[sectionKey];
            const formattedValue = optionInState?.value
            const isPausedAndDateChanged = optionInState?.key === PAUSED && formattedValue !== last?.value;
            const userHasMadeChanges = changesMadeAllowSave(sectionKey) || isPausedAndDateChanged;
            const inputValue = optionInState?.value === true ? optionInState?.activate_on : optionInState?.value;

            return (
              <div key={sectionKey} style={{ marginTop: 20, border: "solid 1px #ab47bc", padding: 20 }}>
                <Typography variant="h6">{name}</Typography>
                <Typography variant="p">{description}</Typography>
                <div>
                  {options.map(({ key, name, icon }) => {
                    const selected = isSelected(sectionKey, key);
                    const isCustom = key === "custom" && selected;
                    const isPaused = key === PAUSED && selected;

                    return (
                      <div>
                        <FormControlLabel
                          key={key}
                          control={<Radio checked={selected} onChange={() => selectOption(sectionKey, key, true)} />}
                          label={
                            <>
                              <i className={`fa ${icon}`} style={{ marginRight: 6, color: "#ab47bc" }} />
                              {name}
                            </>
                          }
                        />

                        {isPaused && (
                          <div style={{ paddingLeft: 30, marginBottom: 10 }}>
                            <LocalizationProvider
                              dateAdapter={AdapterMoment}
                              utils={MomentUtils}
                              style={{ width: "100%" }}
                            >
                              <DatePicker
                                renderInput={(props) => <TextField {...props} />}
                                minDate={new Date()}
                                value={inputValue || new Date()}
                                label="" // don't put label in the box {field.label}
                                inputFormat="MM/DD/YYYY"
                                onChange={(date) => selectOption(sectionKey, key, formatWithMoment(date))}
                              />
                            </LocalizationProvider>
                            <br />
                            <small>After this date, your settings will automatically revert to "enabled"</small>
                          </div>
                        )}

                        {isCustom && <CustomChoiceBox />}
                      </div>
                    );
                  })}
                </div>

                {error && <p style={{ color: "#e64d4d", marginBottom: 5 }}>{error}</p>}

                <Tooltip
                  placement="right"
                  title={
                    userHasMadeChanges
                      ? "Click to save the changes you just made"
                      : "When you make changes, this button will be activated"
                  }
                >
                  <div style={{ display: "inline" }}>
                    <Button
                      disabled={!userHasMadeChanges}
                      variant="contained"
                      color="primary"
                      style={{ margin: "10px 20px" }}
                      onClick={() => saveChanges(sectionKey, getValue(sectionKey))}
                    >
                      <span>
                        {isSaving ? <i className="fa fa-spinner fa-spin" style={{ marginRight: 5 }} /> : "SAVE"}
                      </span>
                    </Button>
                  </div>
                </Tooltip>
              </div>
            );
          })}
        </div>
      </MEPaperBlock>
    </div>
  );
}

export default NudgeControlPage;

const CustomChoiceBox = () => {
  const communities = useSelector((state) => state.getIn(["communities"]));

  return (
    <div style={{ paddingLeft: 30 }}>
      <Typography variant="p">
        Stop For <b>(Which Communities)</b>
      </Typography>
      <LightAutoComplete
        placeholder="Select communities that should have this stopped..."
        valueExtractor={(c) => c.id}
        labelExtractor={(c) => c.name}
        data={communities || []}
      />
      <Typography variant="p">
        Pause For <b>(Which Communities)</b>
      </Typography>
      <LightAutoComplete
        placeholder="Select which communities that should have this paused.."
        valueExtractor={(c) => c.id}
        labelExtractor={(c) => c.name}
        data={communities || []}
      />
    </div>
  );
};
