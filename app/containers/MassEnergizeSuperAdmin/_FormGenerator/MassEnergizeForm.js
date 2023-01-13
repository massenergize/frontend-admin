import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { reduxKeepFormContent } from "../../../redux/redux-actions/adminActions";
import { removePageProgressFromStorage } from "../../../utils/common";
import { PAGE_KEYS } from "../ME  Tools/MEConstants";
import FormGenerator from "./index";

/**
 * SUMMARY OF WHATS HAPPENING HERE
 * -------------------------------
 * This is component is a wrapper componpent.
 * Its main purpose is to save the user's form progress temporarily
 * Until they have been able to submit. (Yes, so when a user submits, all saved progress will be cleared)
 *
 * HOW THAT HAPPENS?
 * -----------------
 * We collect the form content when the formGenerator is about to unmount.
 * Then save that content inside redux, and local storage (happens in adminActions.js).
 * Why Local Storage? So that we can still retrieve the progress even when a user refreshes
 *
 * HOW DOES PREFILLING THE FORM WORK?
 * ----------------------------------
 * When the site loads (i.e. when user loads for the first time, or refreshes anytime afterwards)
 * Any saved progress content in local storage is retrieved. (Happens in Application.js)
 * And set inside redux store. Then from redux, we can pass it down to this component via props.
 * When this component loads, it just uses the "pageKey" to retrieve the part of the saved progress
 * that belongs to the current page the user is on.
 * With the progress object retrieved (project object contains all data the user entered saved in an object with the name of each field as key),
 * We run through the formJson children recursively and use their "name" to retrieve values
 * if they exist. (check insertProgress())
 *
 *
 * @param {*} props
 * @returns
 */
function MassEnergizeForm(props) {
  const [json, setJson] = useState({});
  const { formState, saveFormTemporarily, formJson } = props;
  const pageKey = props.pageKey || PAGE_KEYS.PLACEHOLDER_PAGE.key;
  const progress = (formState || {})[pageKey] || {};
  console.log("RETRIEVED ", progress);

  const insertProgress = (children, progress) => {
    if (!children) return [];
    const temp = [];
    for (var child of children) {
      const value = child.defaultValue || progress[child.name];
      child.defaultValue = value;
      if (child.children) {
        const content = insertProgress(child.children, progress);
        if (content.length) child = { ...child, children: content };
      } else if (child.child) {
        const content = insertProgress(child.child.fields, progress);
        if (content.length)
          child = {
            ...child,
            ...{ ...child.child, fields: content },
          };
      }
      temp.push(child);
    }
    return temp;
  };

  useEffect(() => {
    const inflatedWithProgress = {
      ...formJson,
      fields: insertProgress(formJson.fields, progress),
    };
    setJson(inflatedWithProgress);
  }, [formJson, progress]);

  const preserveFormData = (currentFormState) => {
    const { formData } = currentFormState || {};
    console.log("CURRENT FORM STATE: ", formData);
    saveFormTemporarily({
      key: pageKey,
      data: formData,
      whole: formState, // oldFormState
    });
  };

  const clearProgress = (resetForm) => {
    resetForm();
    saveFormTemporarily({
      key: pageKey,
      data: {},
      whole: formState,
    });
    removePageProgressFromStorage(pageKey);
  };

  if (!json.fields) return <></>;

  return (
    <FormGenerator
      unMount={preserveFormData}
      clearProgress={clearProgress}
      {...props}
      formJson={json}
    />
  );
}

const mapStateToProps = (state) => ({
  formState: state.getIn(["tempForm"]),
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      saveFormTemporarily: reduxKeepFormContent,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MassEnergizeForm);
