import React, { useEffect, useState } from "react";
import MEPaperBlock from "../ME  Tools/paper block/MEPaperBlock";
import { Button, FormControlLabel, Radio, Typography } from "@mui/material";
import useCommunityFromURL from "../../../utils/hooks/useCommunityHook";
import { DISABLED, ENABLED } from "./NudgeControlPage";
import { fetchParamsFromURL } from "../../../utils/common";
import { FLAGS, USER_PORTAL_FLAGS } from "../../../components/FeatureFlags/flags";
import { apiCall } from "../../../utils/messenger";
import { useDispatch, useSelector } from "react-redux";
import { reduxKeepFeatureActivations } from "../../../redux/redux-actions/adminActions";
import LinearBuffer from "../../../components/Massenergize/LinearBuffer";

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
// const FEATURES = [
//   {
//     options: OPTIONS,
//     key: FLAGS.USER_PORTAL_GUEST_AUTHENTICATION,
//     name: "Guest Users",
//     description:
//       "Allow unknown users to fully use your community site without going through the authentication (login & registration) process"
//   },
//   {
//     options: OPTIONS,
//     key: FLAGS.USER_PORTAL_USER_SUBMITTED_ACTIONS,
//     name: "User Generated Actions",
//     description: "Allow users to submit actions."
//   },
//   {
//     options: OPTIONS,
//     key: FLAGS.USER_PORTAL_USER_SUBMITTED_EVENTS,
//     name: "User Generated Events",
//     description: "Allow users to submit events."
//   },
//   {
//     options: OPTIONS,
//     key: FLAGS.USER_PORTAL_USER_SUBMITTED_VENDORS,
//     name: "User Generated Vendors",
//     description: "Allow users to submit vendors."
//   }
// ];

const FLAG_KEYS = Object.values(USER_PORTAL_FLAGS);
function PlatformFeaturesPage() {
  const dispatch = useDispatch();
  const comFeatures = useSelector((state) => state.getIn(["featureActivationsForCommunities"]) || {});
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

  const getValue = (sectionKey) => {
    const data = form || {};
    const item = data[sectionKey] || {};
    return item;
  };

  const selectOption = (sectionKey, optionKey, value) => {
    const oldValue = getValue(sectionKey);
    setForm({ ...form, [sectionKey]: { ...oldValue, key: optionKey, value } });
  };

  const saveChanges = (optionKey, selection) => {
    setLoading({ ...loading, [optionKey]: true });
    setErrors({ ...errors, [optionKey]: null });
    const { key, value } = selection || {};
    console.log("IS THIS THE SELECTION", selection);
    // Now run api call to save the changes
    const formBody = {
      community_id: comId,
      feature_flag_key: optionKey,
      enable: key === ENABLED ? true : false
    };

    // return console.log("HEre is the form Body", formBody);

    apiCall("communities.features.request", formBody)
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
      data?.map((ffItem) => {
        return [
          ffItem?.key,
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
    // if (activations) {
    //   setLoadingPage(false);
    //   return reformatBackendData(nudgeList);
    // }
    apiCall("communities.features.list", { community_id: comId })
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
  };

  useEffect(() => init(), [comId]);

  // TODO: Save the request for toggled features in redux so you dont run it again each time

  const loadingError = errors["loadingError"];
  if (loadPage) return <LinearBuffer lines={1} asCard message="Hold tight, fetching your items..." />;
  if (loadingError)
    return (
      <MEPaperBlock banner>
        <p style={{ color: "#af3131" }}>
          This is the first error I have seen in my life
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
    <MEPaperBlock>
      <Typography>
        Not all features are enabled for all communities. This page gives you a chance to review and opt into special
        features and functionalities. You can enable or disable these features for <b>{community?.name || "..."}</b> as
        you see fit.
      </Typography>

      {Object.entries(form).map(([sectionKey, { name: nameProvidedBySadmin, notes }]) => {
        const { options, name, description } = FEATURES[sectionKey];
        // const { name: nameProvidedBySadmin, notes } = getValue(sectionKey);

        const isSaving = (loading || {})[sectionKey];
        const error = (errors || {})[sectionKey];
        return (
          <div key={sectionKey} style={{ marginTop: 20, border: "solid 1px #ab47bc", padding: 20 }}>
            <Typography variant="h6">{name || nameProvidedBySadmin}</Typography>
            <Typography variant="p">{notes || description}</Typography>
            <div>
              {options?.map(({ key, name, icon }) => {
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
    </MEPaperBlock>
  );
}

export default PlatformFeaturesPage;
