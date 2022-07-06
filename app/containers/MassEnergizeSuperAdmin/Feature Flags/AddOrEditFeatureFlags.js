import React from "react";
import MassEnergizeForm from "../_FormGenerator";
import fieldTypes from "../_FormGenerator/fieldTypes";

function AddOrEditFeatureFlags({ classes, communities }) {
  const formJson = createFormJson({ communities });
  return <MassEnergizeForm formJson={formJson} />;
}

var createFormJson = ({ communities }) => {
  communities = (communities || []).map((com) => ({
    displayName: com.name,
    id: com.id,
  }));
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
            name: "everyone",
            label: "Should this feature be available to every community?",
            fieldType: fieldTypes.Radio,
            isRequired: true,
            defaultValue: "true",
            dbName: "on_for_everyone",
            readOnly: false,
            data: [
              { id: "true", value: "Yes" },
              { id: "specific", value: "Only Specific Communities" },
              { id: "except", value: "Everyone Except" },
            ],
            conditionalDisplays: [
              {
                valueToCheck: "specific",
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
                valueToCheck: "except",
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

          {
            name: "description",
            label: "Briefly describe this feature",
            placeholder:
              "Eg. This feature allows guests to use all platform functionalities without....",
            fieldType: fieldTypes.TextField,
            contentType: "text",
            isRequired: true,
            defaultValue: "",
            dbName: "description",
            readOnly: false,
          },
          {
            name: "target",
            label: "Which platform is this feature related to? ",
            fieldType: fieldTypes.Checkbox,
            isRequired: true,
            dbName: "target",
            readOnly: false,
            data: [
              { id: "user_frontend", displayName: "User Frontend" },
              { id: "admin_frontend", displayName: "Admin Frontend" },
              { id: "backend", displayName: "Backend" },
            ],
          },
          {
            name: "notes",
            label: "Notes (Optional)",
            placeholder:
              "Eg. 'Any other information related to this feature...'",
            fieldType: fieldTypes.TextField,
            contentType: "text",
            isRequired: true,
            defaultValue: "",
            dbName: "notes",
            readOnly: false,
            maxLength: 60,
          },
        ],
      },
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
            // maxLength: 40,
          },
        ],
      },
    ],
  };
  return json;
};
export default AddOrEditFeatureFlags;
