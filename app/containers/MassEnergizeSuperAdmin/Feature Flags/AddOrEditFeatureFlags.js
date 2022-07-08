import { keyBy } from "lodash";
import React from "react";
import MassEnergizeForm from "../_FormGenerator";
import fieldTypes from "../_FormGenerator/fieldTypes";

function AddOrEditFeatureFlags({ classes, communities, flagKeys }) {
  const formJson = createFormJson({ communities, flagKeys });
  return <MassEnergizeForm formJson={formJson} />;
}

var createFormJson = ({ communities, flagKeys }) => {
  const audienceKeys = flagKeys.audience;
  const audienceKeysArr = Object.entries(flagKeys.audience || {});
  communities = (communities || []).map((com) => ({
    displayName: com.name,
    id: com.id,
  }));
  const scopeArr = Object.entries(flagKeys.scope);
  const json = {
    title: "Add a new feature flag",
    subTitle: "",
    // method: "/actions.create",
    // successRedirectPage: "/admin/read/actions",
    fields: [
      {
        label: "About this feature",
        fieldType: "Section",
        children: [
          {
            name: "name",
            label: "Name of the feature (60 Chars)",
            placeholder: "Eg. 'Guest Authentication Feature '",
            fieldType: fieldTypes.TextField,
            contentType: "text",
            isRequired: true,
            defaultValue: "",
            dbName: "name",
            readOnly: false,
            maxLength: 60,
          },

          {
            name: "notes",
            label: "Briefly describe this feature",
            placeholder:
              "Eg. This feature allows guests to use all platform functionalities without....",
            fieldType: fieldTypes.TextField,
            contentType: "text",
            isRequired: true,
            defaultValue: "",
            dbName: "notes",
            readOnly: false,
          },
          {
            name: "key",
            label: "unique-identifier",
            fieldType: fieldTypes.TextField,
            contentType: "text",
            isRequired: true,
            defaultValue: "some-unique-identifier",
            dbName: "notes",
            readOnly: true,
            disabled: true,
          },
          {
            name: "target",
            label: "Which platform is this feature related to? ",
            fieldType: fieldTypes.Checkbox,
            isRequired: true,
            dbName: "target",
            readOnly: false,
            data: scopeArr.map(([_, { name, key }]) => ({
              id: key,
              displayName: name,
            })),
          },
        ],
      },

      {
        label: "Community Audience",
        fieldType: "Section",
        children: [
          {
            name: "audience",
            label: "Should this feature be available to every community?",
            fieldType: fieldTypes.Radio,
            isRequired: true,
            defaultValue: "true",
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
                    name: "community",
                    label:
                      "Select all communities that should have this feature activated",
                    placeholder: "eg. Wayland",
                    fieldType: fieldTypes.Dropdown,
                    defaultValue: null,
                    dbName: "community_ids",
                    data: [{ displayName: "--", id: "" }, ...communities],
                  },
                ],
              },
              {
                valueToCheck: audienceKeys.ALL_EXCEPT.key,
                fields: [
                  {
                    name: "community",
                    label:
                      "Select all communities that should NOT have this feature",
                    placeholder: "eg. Wayland",
                    fieldType: fieldTypes.Dropdown,
                    defaultValue: null,
                    dbName: "community_ids",
                    data: [{ displayName: "--", id: "" }, ...communities],
                  },
                ],
              },
            ],
          },
        ],
      },
      // -------------------------------------
      {
        label: "User Audience",
        fieldType: "Section",
        children: [
          {
            name: "user_audience",
            label: "Should this feature be available to every user?",
            fieldType: fieldTypes.Radio,
            isRequired: true,
            defaultValue: "true",
            dbName: "user_audience",
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
                    name: "community",
                    label:
                      "Select all users that should have this feature activated",
                    placeholder: "eg. Wayland",
                    fieldType: fieldTypes.Dropdown,
                    defaultValue: null,
                    dbName: "community_ids",
                    data: [{ displayName: "--", id: "" }, ...communities],
                  },
                ],
              },
              {
                valueToCheck: audienceKeys.ALL_EXCEPT.key,
                fields: [
                  {
                    name: "community",
                    label: "Select all users that should NOT have this feature",
                    placeholder: "eg. Wayland",
                    fieldType: fieldTypes.Dropdown,
                    defaultValue: null,
                    dbName: "community_ids",
                    data: [{ displayName: "--", id: "" }, ...communities],
                  },
                ],
              },
            ],
          },
        ],
      },
      // ------------------------------------
      {
        label: "Feature Deactivation",
        fieldType: "Section",
        children: [
          {
            name: "expires_on",
            label: "When should this feature expire?",
            placeholder: "Eg. 'Guest Authentication Feature'",
            fieldType: fieldTypes.DateTime,
            contentType: "text",
            isRequired: true,
            defaultValue: "",
            dbName: "expires_on",
            readOnly: false,
          },
        ],
      },
    ],
  };
  return json;
};
export default AddOrEditFeatureFlags;
