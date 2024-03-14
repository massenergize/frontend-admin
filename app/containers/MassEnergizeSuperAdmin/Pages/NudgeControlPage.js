import { Button, FormControlLabel, Radio, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import MEPaperBlock from "../ME  Tools/paper block/MEPaperBlock";
import { CheckBox, LeakAddSharp } from "@mui/icons-material";
import LightAutoComplete from "../Gallery/tools/LightAutoComplete";
import { useSelector } from "react-redux";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import MomentUtils from "@date-io/moment";
import Loading from "dan-components/Loading";
import LinearBuffer from "../../../components/Massenergize/LinearBuffer";
import { fetchParamsFromURL } from "../../../utils/common";
import { apiCall } from "../../../utils/messenger";
import { DatePicker } from "@mui/x-date-pickers";
import { EVENT_NUDGE_FEATURE_FLAG_KEY } from "../Feature Flags/FlagKeys";
import useCommunityWithId from "../../../utils/hooks/useCommunityHook";
import useCommunityFromURL from "../../../utils/hooks/useCommunityHook";
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
    key: EVENT_NUDGE_FEATURE_FLAG_KEY,
    name: "Event Nudges",
    description: "Manage event notifications in your community. Stop, pause, and add when you want to continue",
    options
  }
];
const ACTIVE_FLAG_KEYS = [EVENT_NUDGE_FEATURE_FLAG_KEY];

function NudgeControlPage() {
  const [form, setForm] = useState({});
  const [loadPage, setLoadingPage] = useState(false);
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const community = useCommunityFromURL();
  const { comId } = fetchParamsFromURL(window.location, "comId");

  const controlOptions = NUDGE_CONTROL_FEATURES;

  const isSelected = (sectionKey, option) => {
    const data = form || {};
    const item = data[sectionKey] || {};
    return option === item?.key;
  };

  const getValue = (sectionKey) => {
    const data = form || {};
    const item = data[sectionKey] || {};
    return item;
  };

  const selectOption = (sectionKey, optionKey, value) => {
    setForm({ ...form, [sectionKey]: { key: optionKey, value } });
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

  const saveChanges = (optionKey, selection) => {
    setLoading({ ...loading, [optionKey]: true });
    setErrors({ ...errors, [optionKey]: null });
    const { key, value } = selection || {};
    // Now run api call to save the changes
    const formBody = {
      community_id: community?.id,
      feature_flag_key: optionKey,
      is_active: key === ENABLED,
      activate_on: key === PAUSED ? value : null
    };


    apiCall("communities.nudge.settings.set", formBody)
      .then((res) => {
        setLoading({ ...loading, [optionKey]: false });
        if (!res || !res?.success) {
          console.log("Error saving", res);
          setErrors({ ...errors, [optionKey]: res?.error || "An error occurred" });
          return;
        }

        setForm({ ...form, [optionKey]: reformat(res?.data) });
      })
      .catch((err) => {
        setLoading({ ...loading, [optionKey]: false });
        setErrors({ ...errors, [optionKey]: err?.toString() });
        console.log("ERROR_SAVING_NUDGE_CONTROL: ", err?.toString());
      });
  };

  useEffect(() => {
    setLoadingPage(true);
    apiCall("communities.nudge.settings.list", { community_id: comId, feature_flag_keys: ACTIVE_FLAG_KEYS })
      .then((res) => {
        setLoadingPage(false);
        if (!res || !res?.success) {
          console.log("Error fetching nudge settings", res);
          return;
        }
        setLoadingPage(false);
        setForm(reformatBackendData(res?.data));
        console.log("FROM RESPONSE", res?.data);
      })
      .catch((err) => {
        console.log("ERROR_FETCHING_NUDGE_CONTROL: ", err?.toString());
        setLoadingPage(false);
      });
  }, [comId]);

  if (loadPage) return <LinearBuffer lines={1} asCard message="Hold tight, fetching your items..." />;

  return (
    <div>
      <MEPaperBlock>
        <Typography>
          Control all items related to nudges for <b>{community?.name || "..."}</b> on this page
        </Typography>

        <div style={{ marginTop: 30 }}>
          {controlOptions?.map(({ name, key: sectionKey, description, options }) => {
            const isSaving = (loading || {})[sectionKey];
            const error = (errors || {})[sectionKey];
            return (
              <div key={sectionKey} style={{ marginTop: 20, border: "solid 1px #ab47bc", padding: 20 }}>
                <Typography variant="h6">{name}</Typography>
                <Typography variant="p">{description}</Typography>
                <div>
                  {options.map(({ key, name, icon }) => {
                    const isCustom = key === "custom" && isSelected(sectionKey, key);
                    const isPaused = key === PAUSED && isSelected(sectionKey, key);

                    return (
                      <div>
                        <FormControlLabel
                          key={key}
                          control={
                            <Radio
                              checked={isSelected(sectionKey, key)}
                              onChange={() => selectOption(sectionKey, key, true)}
                            />
                          }
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
                                value={getValue(sectionKey)?.value || new Date()}
                                label="" // don't put label in the box {field.label}
                                // mask="MM/DD/YYYY, h:mm a"
                                inputFormat="MM/DD/YYYY"
                                // inputFormat="YYYY-MM-DD"
                                // mask={"__/__/____"}
                                onChange={(date) => selectOption(sectionKey, key, date?.toString())}
                              />
                            </LocalizationProvider>
                          </div>
                        )}

                        {isCustom && <CustomChoiceBox />}
                      </div>
                    );
                  })}
                </div>

                {error && <p style={{ color: "#e64d4d", marginBottom: 5 }}>{error}</p>}

                <Button
                  variant="contained"
                  color="primary"
                  style={{ margin: "10px 20px" }}
                  onClick={() => saveChanges(sectionKey, getValue(sectionKey))}
                >
                  {isSaving ? <i className="fa fa-spinner fa-spin" style={{ marginRight: 5 }} /> : "SAVE"}
                </Button>
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
