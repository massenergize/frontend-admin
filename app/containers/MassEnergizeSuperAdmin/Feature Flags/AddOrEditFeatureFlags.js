import React from "react";
import MassEnergizeForm from "../_FormGenerator";
import fieldTypes from "../_FormGenerator/fieldTypes";
import Loading from "dan-components/Loading";

function AddOrEditFeatureFlags({ classes, communities, flagKeys, users }) {
  if (!flagKeys || !flagKeys.audience) return <Loading />;
  const formJson = createFormJson({ communities, flagKeys, users });
  return <MassEnergizeForm formJson={formJson} />;
}

var createFormJson = ({ communities, flagKeys, users }) => {
  const labelExt = (user) => `${user.preferred_name} - (${user.email})`;
  const valueExt = (user) => user.id;
  const audienceKeys = flagKeys.audience || {};
  const audienceKeysArr = Object.entries(flagKeys.audience || {});
  communities = (communities || []).map((com) => ({
    displayName: com.name,
    id: com.id,
    value: com.id,
  }));
  const scopeArr = Object.entries(flagKeys.scope || {});
  const json = {
    title: "Add a new feature flag",
    subTitle: "",
    method: "/featureFlags.add",
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
            name: "scope",
            label: "Which platform is this feature related to? ",
            fieldType: fieldTypes.Checkbox,
            isRequired: true,
            dbName: "scope",
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
                    fieldType: fieldTypes.Checkbox,
                    selectMany: true,
                    contentType: "text",
                    defaultValue: [],
                    dbName: "community_ids",

                    data: communities,
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
                    fieldType: fieldTypes.Checkbox,
                    selectMany: true,
                    contentType: "text",
                    defaultValue: [],
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
                    name: "users",
                    label:
                      "Select all users that should have this feature activated",
                    placeholder: "Search with their username, or email.. Eg. 'Mademoiselle Kaat'",
                    fieldType: fieldTypes.AutoComplete,
                    defaultValue: [],
                    dbName: "user_ids",
                    data: users || [],
                    labelExtractor: labelExt,
                    valueExtractor: valueExt,
                  },
                ],
              },
              {
                valueToCheck: audienceKeys.ALL_EXCEPT.key,
                fields: [
                  {
                    name: "users",
                    label: "Select all users that should NOT have this feature",
                    placeholder: "Search with their username, or email.. Eg. 'Monsieur Brad'",
                    fieldType: fieldTypes.AutoComplete,
                    selectMany: true,
                    contentType: "text",

                    defaultValue: [],
                    dbName: "user_ids",
                    labelExtractor: labelExt,
                    valueExtractor: valueExt,
                    data: users || [],
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
