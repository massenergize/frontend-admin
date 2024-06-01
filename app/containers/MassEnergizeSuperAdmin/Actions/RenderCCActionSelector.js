import React, { useState } from "react";
import MEDropdown from "../ME  Tools/dropdown/MEDropdown";
import { Link, Typography } from "@mui/material";
import LightAutoComplete from "../Gallery/tools/LightAutoComplete";
import { smartString } from "../../../utils/common";

const DASH = "----";
const dummies = {
  ccActions: [
    { id: DASH, title: DASH, description: DASH },
    {
      parent: 5,
      id: 1,
      title: "Install Air Condition",
      description:
        "Creates Category and Subcategory models in the carbon calculator app. Carbon Calculator Actions have their Category and Subcategory links to these models. When a cadmin adds or edits an action, these Categories and Subcategories"
    },
    {
      parent: 4,
      id: 2,
      title: "Use Heat Pumps",
      description:
        "Creates Category and Subcategory models in the carbon calculator app. Carbon Calculator Actions have their Category and Subcategory links to these models. When a cadmin adds or edits an action, these Categories and Subcategories"
    },
    {
      parent: 6,
      id: 3,
      title: "Use Energy Saving Light Bulbs",
      description:
        "Creates Category and Subcategory models in the carbon calculator app. Carbon Calculator Actions have their Category and Subcategory links to these models. When a cadmin adds or edits an action, these Categories and Subcategories"
    },
    {
      parent: 4,
      id: 5,
      title: "Fifth Energy Saving Light Bulbs",
      description:
        "Creates Category and Subcategory models in the carbon calculator app. Carbon Calculator Actions have their Category and Subcategory links to these models. When a cadmin adds or edits an action, these Categories and Subcategories"
    },
    {
      parent: 3,
      id: 4,
      title: "Fourth Energy Saving Light Bulbs",
      description:
        "Creates Category and Subcategory models in the carbon calculator app. Carbon Calculator Actions have their Category and Subcategory links to these models. When a cadmin adds or edits an action, these Categories and Subcategories"
    }
  ],
  categories: [
    { id: DASH, displayName: DASH },
    { id: 1, displayName: "Home Energy" },
    { id: 2, displayName: "Food & Nutrition" },
    { id: 3, displayName: "Waste Management" }
  ],
  subCategories: [
    { id: DASH, displayName: DASH },
    { id: 1, displayName: "Solar Beams", parent: 1 },
    { id: 2, displayName: "Wind Turbines", parent: 1 },
    { id: 3, displayName: "Hot Pots", parent: 3 },
    { id: 4, displayName: "Plant Based Diet", parent: 2 },
    { id: 5, displayName: "Spiritual Cleansing", parent: 3 },
    { id: 6, displayName: "Recycle Cocunut Shell", parent: 2 },
    { id: 7, displayName: "Plastic Brick", parent: 1 }
  ]
};

function RenderCCActionSelector({ resetForm, updateForm, state, renderModal }) {
  const [chosenCategory, setChosenCategory] = useState([]);
  const [chosenSubCategory, setChosenSubCategory] = useState([]);
  const [ccAction, setChosenCCAction] = useState([]);

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

  const makeSubCategoryData = (chosenCategory, subCategoriesList) => {
    // Return the subcategories that are related to the chosen categories
    const data = subCategoriesList.filter((sc) => chosenCategory.includes(sc.parent));
    if (data.length) return data;
    return subCategoriesList;
  };

  const makeCCActionData = (chosenSubCategory, ccActionsList) => {
    // Return the ccActions that are related to the chosen subcategories
    return ccActionsList.filter((cc) => chosenSubCategory.includes(cc.parent));
    // return data
    // if (data.length) return data;
    // return ccActionsList;
  };

  const selectedSubs = (chosenSubCategory, subCatList) => {
    // Return the selected subcategories that are in the current list of the subcategories
    // Meaning if a subcategory is selected, but it's not in the current list of subcategories, it will not be returned
    const data = subCatList.filter((sc) => chosenSubCategory.includes(sc.id));
    return data?.map((sc) => sc.id);
  };
  const gatherSelectedCCActions = (chosenCCAction, ccActionsList) => {
    // Return the selected ccActions that are in the current list of the ccActions
    // Meaning if a ccAction is selected, but it's not in the current list of ccActions, it will not be returned
    const data = ccActionsList.filter((cc) => chosenCCAction.includes(cc.id));
    return data?.map((cc) => cc.id);
  };

  const filteredSubCategoriesBasedOnCategories = makeSubCategoryData(chosenCategory, dummies.subCategories);
  const selectedSubCategories = selectedSubs(chosenSubCategory, filteredSubCategoriesBasedOnCategories);
  const filteredCCActionsBasedOnSubCategories = makeCCActionData(chosenSubCategory, dummies.ccActions);
  const selectedCCActions = gatherSelectedCCActions(ccAction, filteredCCActionsBasedOnSubCategories);

  return (
    <>
      <div style={{ border: "1px solid rgb(229, 238, 245)", padding: 20, marginBottom: 25, borderRadius: 5 }}>
        <Typography variant="p">
          Carbon Calculator - Link your action to one of our Carbon Calculator Actions
        </Typography>
        <br />
        {renderCarbonModal()}
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <div style={{ width: "20%", marginRight: 10 }}>
            <MEDropdown
              onItemSelected={(item) => setChosenCategory(item)}
              defaultValue={chosenCategory}
              placeholder="Category"
              data={dummies.categories}
              labelExtractor={(c) => c.displayName}
              valueExtractor={(c) => c.id}
            />
          </div>
          <div style={{ width: "20%", marginRight: 10 }}>
            <MEDropdown
              onItemSelected={(item) => {
                setChosenSubCategory(item);
              }}
              placeholder="Sub-Category"
              defaultValue={selectedSubCategories}
              data={filteredSubCategoriesBasedOnCategories}
              labelExtractor={(c) => c?.displayName}
              valueExtractor={(c) => c.id}
            />
          </div>

          <div style={{ width: "60%" }}>
            <MEDropdown
              placeholder="Select Carbon Calculator Action"
              defaultValue={selectedCCActions}
              data={filteredCCActionsBasedOnSubCategories}
              onItemSelected={(item) => setChosenCCAction(item)}
              labelExtractor={(c) => (
                <span>
                  <b>{c?.title}: </b> <span>{smartString(c?.description, 50)}</span>
                </span>
              )}
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