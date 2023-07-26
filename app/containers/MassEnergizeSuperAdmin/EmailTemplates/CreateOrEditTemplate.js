import React, {  } from "react";
import MassEnergizeForm from "../_FormGenerator";
import fieldTypes from "../_FormGenerator/fieldTypes";
import Loading from "dan-components/Loading";
import { LOADING } from "../../../utils/constants";

export default function CreateOrEditTemplate({
  classes,
  toEdit,
  switchTabs,
  setTemplateToEdit,
  emailTemplates,
  putTemplateInRedux,
}) {
  const inEditMode = toEdit;

  if (emailTemplates === LOADING) return <Loading />;

  const ifApiIsSuccessful = (data, yes) => {
    if (!yes) return;
    let _emailTemplates = emailTemplates?.filter((f) => f?.id?.toString() !== data?.id?.toString()
    );
    putTemplateInRedux([data, ..._emailTemplates]);
    setTemplateToEdit(null);
    switchTabs();
  };

  const formJson = createFormJson({
    putTemplateInRedux,
    ifApiIsSuccessful,
    inEditMode,
    toEdit,
  });

  return (
    <MassEnergizeForm formJson={formJson} onComplete={ifApiIsSuccessful} />
  );
}

var createFormJson = ({ inEditMode, toEdit }) => {
  const json = {
    title: inEditMode ? "Update email template" : "Add a new email template",
    subTitle: "",
    method: inEditMode ? "/email.templates.update" : "/email.templates.create",
    preflightFxn: (data)=>{
        if(!inEditMode) return data
        return {...data, id: toEdit?.id}
    },
    fields: [
      {
        name: "name",
        label: "Name of template(eg. 'GuestAuthentication')",
        placeholder: "Eg. 'Guest Authentication'",
        fieldType: fieldTypes.TextField,
        contentType: "text",
        isRequired: true,
        defaultValue: toEdit?.name || "",
        dbName: "name",
        readOnly: false,
        maxLength: 60,
      },
      {
        name: "template_id",
        label: "Template ID from Postmark",
        placeholder: "Eg. '12345678'",
        fieldType: fieldTypes.TextField,
        contentType: "text",
        isRequired: true,
        defaultValue: toEdit?.template_id || "",
        dbName: "template_id",
        readOnly: false,
        maxLength: 60,
      },
    ],
  };
  return json;
};
