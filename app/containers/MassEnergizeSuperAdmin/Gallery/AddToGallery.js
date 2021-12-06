import React from "react";
import FormGenerator from "./../_FormGenerator/index";
const onUpload = (files, tabChanger, reset) => {
  console.log("This is the selected file", files);
};
const json = {
  title: "Add an image to your library",
  fields: [
    {
      label: "The Image your add will be available to other community admins",
      fieldType: FormGenerator.FieldTypes.MediaLibrary,
      name: "gallery-images",
      dbName: "gallery_images",
      onUpload: onUpload,
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
