import { Button, FormControlLabel, Radio, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
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

const options = [
  { key: "enable", icon: "fa-play", name: "Enable Sending" },
  { key: "disable", icon: "fa-stop", name: "Disable Sending" },
  { key: "pause", icon: "fa-pause", name: "Pause Sending" },
  { key: "custom", icon: "", name: "Custom (I want to stop some, pause some)" }
];
const dummies = [
  {
    key: "event-nudges",
    name: "Event Nudges",
    description:
      "Manage event notifications in your community. Stop, pause, or add community specific controls as well",
    options,
    disabled: true
  },
  {
    key: "action-nudges",

    name: "Action Nudges",
    description:
      "Manage action notifications on all your platforms. Stop, pause, or add community specific controls as well",
    options
  },
  {
    key: "testimonial-nudges",
    name: "Testimonial Notifications",
    description:
      "Manage testimonial notifications on all your platforms. Stop, pause, or add community specific controls as well",
    options
  }
];

function NudgeControlPage() {
  const [form, setForm] = useState({});
  const [loadPage, setLoadingPage] = useState(false);
  const [loading, setLoading] = useState({});

  const { id } = fetchParamsFromURL(window.location, "id");
  const communities = useSelector((state) => state.getIn(["communities"]));
  const community = (communities || []).find((c) => c.id?.toString() === id) || {};

  const controlOptions = dummies;

  const isLoading = (sectionKey) => {
    return loading[sectionKey] || false;
  };

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

  const saveChanges = (optionKey, selection) => {
    setLoadingPage({ ...loading, [optionKey]: true });
    // Now run api call to save the changes
    const formBody = {
      featureFlags: [],
      section_key: optionKey,
      selection_key: selection?.key,
      selection_value: selection?.value
    };
    console.log("Lets see selection", selection);
  };
  // if (true) return <LinearBuffer lines={1} asCard />;

  console.log("HERE IS TTHE FORM", form);
  return (
    <div>
      <MEPaperBlock>
        <Typography>
          Control all items related to nudges for <b>{community?.name || "..."}</b> on this page
        </Typography>

        <div style={{ marginTop: 30 }}>
          {controlOptions?.map(({ name, key: sectionKey, description, options }) => {
            const isSaving = (loading || {})[sectionKey];
            return (
              <div key={sectionKey} style={{ marginTop: 20, border: "solid 1px #ab47bc", padding: 20 }}>
                <Typography variant="h6">{name}</Typography>
                <Typography variant="p">{description}</Typography>
                <div>
                  {options.map(({ key, name, icon }) => {
                    const isCustom = key === "custom" && isSelected(sectionKey, key);
                    const isPaused = key === "pause" && isSelected(sectionKey, key);

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
                          <div style={{ paddingLeft: 30 }}>
                            <LocalizationProvider
                              dateAdapter={AdapterMoment}
                              utils={MomentUtils}
                              style={{ width: "100%" }}
                            >
                              <DateTimePicker
                                renderInput={(props) => <TextField {...props} />}
                                label="" // don't put label in the box {field.label}
                                // mask="MM/DD/YYYY, h:mm a"
                                inputFormat="MM/DD/YYYY"
                                mask={"__/__/____"}
                              />
                            </LocalizationProvider>
                          </div>
                        )}

                        {isCustom && <CustomChoiceBox />}
                      </div>
                    );
                  })}
                </div>

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
