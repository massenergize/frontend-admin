import React from "react";
import FormGenerator from "./../_FormGenerator/index";

const json = {
  title: "Add an image to your library",
  fields: [
    {
      label: "The Image your add will be available to other community admins",
      fieldType: "Section",
      children: [{ fieldType: FormGenerator.FieldTypes.MediaLibrary }],
    },
  ],
};
export default function AddToGallery() {
  return (
    <div>
      <FormGenerator formJson={json} />
    </div>
  );
}
