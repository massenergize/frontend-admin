import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { reduxKeepFormContent } from "../../../redux/redux-actions/adminActions";
import { removePageProgressFromStorage } from "../../../utils/common";
import { PAGE_KEYS } from "../ME  Tools/MEConstants";
import FormGenerator from "./index";

function MassEnergizeForm(props) {
  const [json, setJson] = useState({});
  const { formState, saveFormTemporarily, formJson } = props;
  const pageKey = props.pageKey || PAGE_KEYS.PLACEHOLDER_PAGE.key;
  const progress = (formState || {})[pageKey] || {};
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
    // console.log("PROGRESS FROM OUTSIDE", progress);
    const inflatedWithProgress = {
      ...formJson,
      fields: insertProgress(formJson.fields, progress),
    };
    console.log("PROGRESS:", progress);
    console.log("THIS IS FORMJSON: ", formJson);
    console.log("AFTER INFLATION", inflatedWithProgress);
    setJson(inflatedWithProgress);
  }, [formJson, progress]);

  const preserveFormData = (currentFormState) => {
    const { formData } = currentFormState || {};
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
