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

const OPTIONS = [
  { key: ENABLED, icon: "", name: "Enabled" },
  { key: DISABLED, icon: "", name: "Disabled" }
  // { key: PAUSED, icon: "f", name: "Pause Sending" }
  // { key: "custom", icon: "", name: "Custom (I want to stop some, pause some)" }
];
const FEATURES = [
  {
    options: OPTIONS,
    key: [FLAGS.USER_PORTAL_GUEST_AUTHENTICATION],
    name: "Guest Users",
    description:
      "Allow unknown users to fully use your community site without going through the authentication (login & registration) process"
  },
  // {
  //   options: OPTIONS,
  //   key: "home-page-carousel",
  //   name: "Homepage Image Carousel",
  //   description: "Replace the side-by-side image view on your homepage with an image carousel"
  // },
  {
    options: OPTIONS,
    key: [FLAGS.USER_PORTAL_USER_SUBMITTED_ACTIONS],
    name: "User Generated Actions",
    description: "Allow users to submit actions."
  },
  {
    options: OPTIONS,
    key: [FLAGS.USER_PORTAL_USER_SUBMITTED_EVENTS],
    name: "User Generated Events",
    description: "Allow users to submit events."
  },
  {
    options: OPTIONS,
    key: [FLAGS.USER_PORTAL_USER_SUBMITTED_VENDORS],
    name: "User Generated Vendors",
    description: "Allow users to submit vendors."
  }
];

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
    setForm({ ...form, [sectionKey]: { key: optionKey, value } });
  };

  const saveChanges = (optionKey, selection) => {
    setLoading({ ...loading, [optionKey]: true });
    setErrors({ ...errors, [optionKey]: null });
    const { key: feature_flag_key, value } = selection || {};
    // Now run api call to save the changes
    const formBody = {
      community_id: comId,
      feature_flag_key
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
        console.log("ERROR_SAVING_FEATURE_REQUEST: ", err?.toString());
      });
  };

  useEffect(() => {
    setLoadingPage(true);
    const activations = comFeatures[comId];
    // if (activations) {
    //   setLoadingPage(false);
    //   return reformatBackendData(nudgeList);
    // }
    apiCall("communities.notifications.settings.list", { community_id: comId, feature_flag_keys: FLAG_KEYS })
      .then((res) => {
        setLoadingPage(false);
        if (!res || !res?.success) {
          console.log("Error fetching nudge settings", res);
          return;
        }
        setLoadingPage(false);
        // setForm(reformatBackendData(res?.data));
        console.log("FROM RESPONSE", res?.data);
      })
      .catch((err) => {
        console.log("ERROR_FETCHING_NUDGE_CONTROL: ", err?.toString());
        setLoadingPage(false);
      });
  }, [comId]);

  // TODO: What if the first request brings an error? Display an error message and dont show the option
  // TODO: Save the request for toggled features in redux so you dont run it again each time
  return (
    <MEPaperBlock>
      <Typography>
        Not all features are enabled for all communities. This page gives you a chance to review and opt into special
        features and functionalities. You can enable or disable these features for <b>{community?.name || "..."}</b> as
        you see fit.
      </Typography>

      {FEATURES.map(({ description, name, key: sectionKey, options }) => {
        const isSaving = (loading || {})[sectionKey];
        const error = (errors || {})[sectionKey];
        return (
          <div key={sectionKey} style={{ marginTop: 20, border: "solid 1px #ab47bc", padding: 20 }}>
            <Typography variant="h6">{name}</Typography>
            <Typography variant="p">{description}</Typography>
            <div>
              {options.map(({ key, name, icon }) => {
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
              // onClick={() => saveChanges(sectionKey, getValue(sectionKey))}
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
