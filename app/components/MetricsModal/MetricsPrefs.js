import React, { useEffect, useState } from "react";
import MassEnergizeForm from "../../containers/MassEnergizeSuperAdmin/_FormGenerator/MassEnergizeForm";
import fieldTypes from "../../containers/MassEnergizeSuperAdmin/_FormGenerator/fieldTypes";
import Loading from "dan-components/Loading";
import { LOADING } from "../../utils/constants";
import { Paper, } from "@mui/material";


function MetricsPrefs({
    communities,
    featureFlags,
    featureToEdit,
    handleClose,
}) {

  if (featureFlags === LOADING) return <Loading />;

  const flagKeys = (featureFlags && featureFlags.keys) || {};
  if (!Object.keys(flagKeys).length)
    return (
      <Paper style={{ padding: 40 }}>
        Sorry, something happened. Please try again later.
      </Paper>
    );

  const ifApiIsSuccessful = (yes) => {
    if (!yes) return;
    const response = "response"
    setTimeout(handleClose(response), 7000)
  };

  const formJson = createFormJson({
    communities:communities,
    flagKeys,
    featureToEdit,
  }); 

  return (
    <MassEnergizeForm formJson={formJson} onComplete={ifApiIsSuccessful} noBack = {true} />
  );
}
// -----------------------------------------------------------------------------------

const preflight = (data) => {
  const user_ids = data.user_ids || [];
  var [scope] = data.scope || [] || null;
  const json = {
    ...(data || {}),
    user_ids: user_ids.map((u) => u.id),
    scope,
    key: uniqueIdentifier(data.name),
  };
  if (json.should_expire === "false") delete json.expires_on;  //json.expires_on = null;
  delete json.should_expire;
  return json;
};

const uniqueIdentifier = (text) => {
  if (!text || !text.trim()) return "";
  var arr = text.split(" ");
  return arr.join("-").toLowerCase() + "-feature-flag";
};

const parseFeatureForEditMode = (feature) => {
  const comIds = ((feature && feature.communities) || []).map((c) =>
    c.id.toString()
  );
  const json = {
    ...(feature || {}),
    comIds,
    selectedUsers: (feature && feature.users) || [],
    userAudience: feature && feature.user_audience,
    scope: feature && feature.scope ? [feature.scope] : [],
  };
  return json;
};

var createFormJson = ({
  communities,
  flagKeys,
  featureToEdit,
}) => {

  const audienceKeys = flagKeys.audience || {};
  const audienceKeysArr = Object.entries(flagKeys.audience || {});
  communities = (communities || []).map((com) => ({
    displayName: com.name,
    id: com.id,
    value: com.id.toString(),
  }));

  const {
    comIds,
    audience,
  } = parseFeatureForEditMode(featureToEdit);

  const json = {
    title: "",
    subTitle: "",
    method: "/downloads.metrics", 
    preflightFxn: preflight,
    fields: [
      {
        label: "Which communities should be included in the report?",
        fieldType: "Section",
        children: [
          {
            name: "audience",
            label: "Should this report include every community?",
            fieldType: fieldTypes.Radio,
            isRequired: true,
            defaultValue: audience || audienceKeys.EVERYONE.key,
            dbName: "audience",
            readOnly: false,
            data: audienceKeysArr.map(([_, { name, key }]) => ({
              id: key,
              value: name,
            })),

            conditionalDisplays: [
              {
                valueToCheck: audienceKeys.SPECIFIC.key,
                fields: [
                  {
                    name: "community_ids",
                    label:
                      "Select all communities that should be included in the report",
                    placeholder: "eg. Wayland",
                    fieldType: fieldTypes.Checkbox,
                    selectMany: true,
                    defaultValue: comIds || [],
                    dbName: "community_ids",
                    data: communities,
                  },
                ],
              },
              {
                valueToCheck: audienceKeys.ALL_EXCEPT.key,
                fields: [
                  {
                    name: "community_ids",
                    label:
                      "Select all communities that should NOT be included in the report",
                    placeholder: "eg. Wayland",
                    fieldType: fieldTypes.Checkbox,
                    selectMany: true,
                    defaultValue: comIds || [],
                    dbName: "community_ids",
                    data: communities,
                  },
                ],
              },
            ],
          },
        ],
      },
      // -------------------------------------

    ],
  };
  return json;
};
export default MetricsPrefs;