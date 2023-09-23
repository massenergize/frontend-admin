import React, { useEffect, useState } from "react";
import { Editor as TinyEditor } from "@tinymce/tinymce-react";
import FormMediaLibraryImplementation from "./media library/FormMediaLibraryImplementation";
const TINY_MCE_API_KEY = process.env.REACT_APP_TINY_MCE_KEY;

function TinyMassEnergizeEditor(props) {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [editor, setEditor] = useState(null);
  const { onEditorChange } = props;

  useEffect(() => {
    if (!image || !editor) return;
    editor.insertContent &&
      editor.insertContent(
        `<img style='object-fit:contain;' src="${image}" alt="Google Image" />`
      );
  }, [image]);

  const config = {
    setup: (editor) => {
      editor.ui.registry.addButton("media_library", {
        text: "Media Library",
        onAction: () => setOpen(true),
      });
    },
  };
  const handleEditorChange = (content, _editor) => {
    setEditor(_editor);
    if (!onEditorChange) return;
    onEditorChange(content, _editor);
  };
  return (
    <div>
      <FormMediaLibraryImplementation
        onStateChange={({ show }) => setOpen(show)}
        openState={open}
        defaultTab="library"
        onInsert={(files) => {
          const img = (files || [])[0];
          setImage(img?.url);
        }}
        floatingMode
      />
      <TinyEditor
        onInit={(editor) => {
          let ed = editor?.target?.editorCommands || {};
          setEditor(ed?.editor);
        }}
        {...props}
        onEditorChange={handleEditorChange}
        toolbar="undo redo | blocks | formatselect | media_library | bold italic backcolor forecolor | alignleft aligncenter alignright alignjustify | link | bullist numlist outdent indent | fontfamily | fontsize |"
        plugins="advlist media_library autolink lists link charmap print preview anchor forecolor"
        init={{
          height: 350,
          menubar: false,
          default_link_target: "_blank",
          force_br_newlines: true,
          force_p_newlines: false,
          forced_root_block: "", // Needed for 3.x
          ...config,
        }}
        apiKey={TINY_MCE_API_KEY}
      />
    </div>
  );
}

export default TinyMassEnergizeEditor;
