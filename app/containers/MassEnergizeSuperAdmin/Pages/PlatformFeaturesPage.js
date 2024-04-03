import React, { useEffect, useState } from "react";
import MEPaperBlock from "../ME  Tools/paper block/MEPaperBlock";
import { Button, FormControlLabel, Radio, Tooltip, Typography } from "@mui/material";
import useCommunityFromURL from "../../../utils/hooks/useCommunityHook";
import { DISABLED, ENABLED } from "./NudgeControlPage";
import { fetchParamsFromURL } from "../../../utils/common";
import { FLAGS, USER_PORTAL_FLAGS } from "../../../components/FeatureFlags/flags";
import { apiCall } from "../../../utils/messenger";
import { useDispatch, useSelector } from "react-redux";
import { reduxKeepFeatureActivations } from "../../../redux/redux-actions/adminActions";
import LinearBuffer from "../../../components/Massenergize/LinearBuffer";
import CustomPageTitle from "../Misc/CustomPageTitle";

const OPTIONS = [
  { key: ENABLED, icon: "", name: "Enabled" },
  { key: DISABLED, icon: "", name: "Disabled" }
  // { key: PAUSED, icon: "f", name: "Pause Sending" }
  // { key: "custom", icon: "", name: "Custom (I want to stop some, pause some)" }
];
const FEATURES = {
  [FLAGS.USER_PORTAL_GUEST_AUTHENTICATION]: {
    options: OPTIONS,
    key: FLAGS.USER_PORTAL_GUEST_AUTHENTICATION,
    name: "Guest Users",
    description:
      "Allow unknown users to fully use your community site without going through the authentication (login & registration) process"
  },
  [FLAGS.USER_PORTAL_USER_SUBMITTED_ACTIONS]: {
    options: OPTIONS,
    key: FLAGS.USER_PORTAL_USER_SUBMITTED_ACTIONS,
    name: "User Generated Actions",
    description: "Allow users to submit actions."
  },
  [FLAGS.USER_PORTAL_USER_SUBMITTED_EVENTS]: {
    options: OPTIONS,
    key: FLAGS.USER_PORTAL_USER_SUBMITTED_EVENTS,
    name: "User Generated Events",
    description: "Allow users to submit events."
  },
  [FLAGS.USER_PORTAL_USER_SUBMITTED_VENDORS]: {
    options: OPTIONS,
    key: FLAGS.USER_PORTAL_USER_SUBMITTED_VENDORS,
    name: "User Generated Vendors",
    description: "Allow users to submit vendors."
  }
};

const FLAG_KEYS = Object.values(USER_PORTAL_FLAGS);
function PlatformFeaturesPage() {
  const dispatch = useDispatch();
  const comFeatures = useSelector((state) => state.getIn(["featureActivationsForCommunities"]) || {});
  const [lastSavedOptions, setLastSavedOption] = useState({});
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const community = useCommunityFromURL();
  const { comId } = fetchParamsFromURL(window.location, "comId");
  const [loadPage, setLoadingPage] = useState(false);

  const putActivationsInRedux = (data) => {
    dispatch(reduxKeepFeatureActivations({ ...comFeatures, [comId]: data }));
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
  const updateLastSavedOption = (sectionKey, selection) => {
    setLastSavedOption({ ...lastSavedOptions, [sectionKey]: selection });
  };

  const selectOption = (sectionKey, optionKey, value) => {
    const oldValue = getValue(sectionKey);
    setForm({ ...form, [sectionKey]: { ...oldValue, key: optionKey, value } });
  };

  const changesMadeAllowSave = (sectionKey) => {
    const newItem = getValue(sectionKey, form);
    const oldItem = getValue(sectionKey, lastSavedOptions);
    return newItem?.key !== oldItem?.key;
  };
  const saveChanges = (optionKey, selection) => {
    setLoading({ ...loading, [optionKey]: true });
    setErrors({ ...errors, [optionKey]: null });
    const { key, value } = selection || {};
    // Now run api call to save the changes
    const formBody = {
      community_id: comId,
      feature_flag_key: optionKey,
      enable: key === ENABLED ? true : false
    };

    apiCall("communities.features.request", formBody)
      .then((res) => {
        setLoading({ ...loading, [optionKey]: false });
        if (!res || !res?.success) {
          console.log("Error saving", res);
          setErrors({ ...errors, [optionKey]: res?.error || "An error occurred" });
          return;
        }

        const newData = { ...form, [optionKey]: reformat(res?.data) };
        updateLastSavedOption(optionKey, selection);
        setForm(newData);
        putActivationsInRedux(newData);
      })
      .catch((err) => {
        setLoading({ ...loading, [optionKey]: false });
        setErrors({ ...errors, [optionKey]: err?.toString() });
        console.log("ERROR_SAVING_FEATURE_REQUEST: ", err?.toString());
      });
  };

  const reformat = (obj) => {
    const { is_enabled } = obj || {};
    return {
      ...(obj || {}),
      key: is_enabled ? ENABLED : DISABLED,
      value: true
    };
  };

  const reformatBackendData = (data) => {
    const formatted = Object.fromEntries(
      Object.entries(data).map(([ffKey, ffItem]) => {
        return [
          ffKey,
          {
            ...(ffItem || {}),
            ...reformat(ffItem)
          }
        ];
      })
    );
    return formatted;
  };

  const init = () => {
    setLoadingPage(true);
    setErrors({});
    const activations = comFeatures[comId];
    if (activations) {
      setLoadingPage(false);
      const formatted = reformatBackendData(activations);
      setLastSavedOption(formatted);
      return setForm(formatted);
    }
    apiCall("communities.features.list", { community_id: comId })
      .then((res) => {
        setLoadingPage(false);
        if (!res || !res?.success) {
          console.log("Error fetching nudge settings", res);
          setErrors({ ...errors, loadingError: res?.error });
          return;
        }
        setLoadingPage(false);
        const formatted = reformatBackendData(res?.data);
        setForm(formatted);
        setLastSavedOption(formatted);
        putActivationsInRedux(formatted);
      })
      .catch((err) => {
        setErrors({ ...errors, loadingError: err?.toString() });
        console.log("ERROR_FETCHING_NUDGE_CONTROL: ", err?.toString());
        setLoadingPage(false);
      });
  };

  useEffect(() => init(), [comId]);

  const loadingError = errors["loadingError"];
  if (loadPage) return <LinearBuffer lines={1} asCard message="Hold tight, fetching your items..." />;
  if (loadingError)
    return (
      <MEPaperBlock banner>
        <p style={{ color: "#af3131" }}>
          Nation tabaluga
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

  const featuresToDisplay = Object.entries(form);
  if (!featuresToDisplay?.length)
    return (
      <MEPaperBlock banner>
        <p>Sorry, it looks like there are no features available to opt into... </p>
      </MEPaperBlock>
    );
  return (
    <>
      <CustomPageTitle>
        Platform Features for <b>{community?.name || "..."}</b>
      </CustomPageTitle>

      <MEPaperBlock>
        <Typography>
          Not all features are enabled for all communities. This page gives you a chance to review and opt into special
          features and functionalities. You can enable or disable these features for <b>{community?.name || "..."}</b>{" "}
          as you see fit.
        </Typography>

        {featuresToDisplay.map(([sectionKey, { name, notes }]) => {
          const isSaving = (loading || {})[sectionKey];
          const error = (errors || {})[sectionKey];
          const userHasMadeChanges = changesMadeAllowSave(sectionKey);
          return (
            <div key={sectionKey} style={{ marginTop: 20, border: "solid 1px #ab47bc", padding: 20 }}>
              <Typography variant="h6">{name}</Typography>
              <Typography variant="p">{notes}</Typography>
              <div>
                {OPTIONS.map(({ key, name, icon }) => {
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
                    {isSaving ? <i className="fa fa-spinner fa-spin" style={{ marginRight: 5 }} /> : "SAVE"}
                  </Button>
                </div>
              </Tooltip>
            </div>
          );
        })}
      </MEPaperBlock>
    </>
  );
}

export default PlatformFeaturesPage;
