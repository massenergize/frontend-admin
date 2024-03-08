import { Button, FormControlLabel, Radio, Typography } from "@mui/material";
import React, { useState } from "react";
import MEPaperBlock from "../ME  Tools/paper block/MEPaperBlock";
import { CheckBox } from "@mui/icons-material";
import LightAutoComplete from "../Gallery/tools/LightAutoComplete";
import { useSelector } from "react-redux";

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
      "Manage event notifications on all your platforms. Stop, pause, or add community specific controls as well",
    options
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
  const [form, setForm] = useState();
  const [loading, setLoading] = useState({});

  const isLoading = (sectionKey) => {
    return loading[sectionKey] || false;
  };

  const isSelected = (sectionKey, option) => {
    const data = form || {};
    return data[sectionKey] === option;
  };

  const selectOption = (sectionKey, optionKey) => {
    setForm({ ...form, [sectionKey]: optionKey });
  };
  return (
    <div>
      <MEPaperBlock>
        <Typography>Control all items related to nudges for your communities on this page</Typography>

        <div style={{ marginTop: 30 }}>
          {dummies.map(({ name, key: sectionKey, description, options }) => {
            return (
              <div key={sectionKey} style={{ marginTop: 20, border: "solid 1px #ab47bc", padding: 20 }}>
                <Typography variant="h6">{name}</Typography>
                <Typography variant="p">{description}</Typography>
                <div>
                  {options.map(({ key, name, icon }) => {
                    const isCustom = key === "custom" && isSelected(sectionKey, key);
                    return (
                      <div>
                        <FormControlLabel
                          key={key}
                          control={
                            <Radio
                              checked={isSelected(sectionKey, key)}
                              onChange={() => selectOption(sectionKey, key)}
                            />
                          }
                          label={
                            <>
                              <i className={`fa ${icon}`} style={{ marginRight: 6, color: "#ab47bc" }} />
                              {name}
                            </>
                          }
                        />

                        {isCustom && <CustomChoiceBox />}
                      </div>
                    );
                  })}
                </div>

                <Button variant="contained" color="primary" style={{ margin: "10px 20px" }}>
                  SAVE
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
    <div style={{ paddingLeft: 20 }}>
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
