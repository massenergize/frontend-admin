import React from "react";
import MEDropdown from "../ME  Tools/dropdown/MEDropdown";
import { Link, Typography } from "@mui/material";
import LightAutoComplete from "../Gallery/tools/LightAutoComplete";

const dummies = {
  ccActions: [
    {
      id: 1,
      title: "Install Air Condition",
      description:
        "Creates Category and Subcategory models in the carbon calculator app. Carbon Calculator Actions have their Category and Subcategory links to these models. When a cadmin adds or edits an action, these Categories and Subcategories"
    },
    {
      id: 2,
      title: "Use Heat Pumps",
      description:
        "Creates Category and Subcategory models in the carbon calculator app. Carbon Calculator Actions have their Category and Subcategory links to these models. When a cadmin adds or edits an action, these Categories and Subcategories"
    },
    {
      id: 3,
      title: "Use Energy Saving Light Bulbs",
      description:
        "Creates Category and Subcategory models in the carbon calculator app. Carbon Calculator Actions have their Category and Subcategory links to these models. When a cadmin adds or edits an action, these Categories and Subcategories"
    }
  ],
  categories: [
    { id: 1, displayName: "Home Energy" },
    { id: 2, displayName: "Food & Nutrition" },
    { id: 3, displayName: "Waste Management" }
  ],
  subCategories: [
    { value: 1, displayName: "Sub Category 1", parent: 1 },
    { value: 2, displayName: "Sub Category 2", parent: 1 },
    { value: 3, displayName: "Sub Category 3", parent: 3 },
    { value: 4, displayName: "Sub Category 3", parent: 2 },
    { value: 5, displayName: "Sub Category 3", parent: 3 },
    { value: 6, displayName: "Sub Category 3", parent: 2 },
    { value: 7, displayName: "Sub Category 3", parent: 1 }
  ]
};

function RenderCCActionSelector({ resetForm, updateForm, state, renderModal }) {
  const renderCarbonModal = () => {
    return renderModal({
      renderModalTrigger: ({ openModal }) => {
        return (
          <Link onClick={() => openModal && openModal()} className="touchable-opacity">
            <b>Carbon Calculator Action List & Instructions</b>
          </Link>
        );
      },
      hasModal: true,
      modalTitle: "Carbon Calculator Action List",
      modalText: (
        <div>
          <p>
            Check out the instructions here:
            <Link
              style={{ marginLeft: 5, fontWeight: "bold" }}
              href="https://docs.google.com/document/d/1b-tCB83hKk9yWFcB15YdHBORAFOPyh63c8jt1i15WL4"
              target="_blank"
            >
              Carbon Calculator Action List & Instructions
            </Link>
          </p>
        </div>
      )
    });
  };
  return (
    <>
      <div style={{ border: "1px solid rgb(229, 238, 245)", padding: 20, marginBottom: 25, borderRadius: 5 }}>
        <Typography variant="p">Carbon Calculator - Link your action to one of our Carbon Calculator Action</Typography>
        <br />
        {renderCarbonModal()}
        {/* <Link className="touchable-opacity">
          <b>Carbon Action List & Instructions</b>
        </Link> */}
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <div style={{ width: "20%", marginRight: 10 }}>
            {/* <Typography variant="small">Category</Typography> */}
            <MEDropdown
              placeholder="Category"
              data={dummies.categories}
              labelExtractor={(c) => c.displayName}
              valueExtractor={(c) => c.id}
            />
          </div>
          <div style={{ width: "20%", marginRight: 10 }}>
            {/* <Typography variant="small">Sub Category</Typography> */}
            <MEDropdown placeholder="Sub-Category" />
          </div>
          <div style={{ width: "60%", marginTop: 10 }}>
            <LightAutoComplete
              placeholder="Select CC Action"
              data={dummies.ccActions}
              labelExtractor={(c) => c.title}
              valueExtractor={(c) => c.id}
            />
          </div>
        </div>
      </div>

      <br />
    </>
  );
}

export default RenderCCActionSelector;
