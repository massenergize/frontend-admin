import React, { useEffect, useRef } from "react";
import { Editor as TinyEditor } from "@tinymce/tinymce-react";
function TinMCE({ height, onChange, onFocused, focus, ...props }) {
  const handleOnChange = (content, editor) => {
    // console.log("LEts se what content, editor", content, editor);
    onChange && onChange({ content, editor });
  };
  const ref = useRef();
  useEffect(() => {
    if (focus) {
      ref.current.focus();
    }
  }, [focus]);
  return (
    <div style={{ padding: 10 }}>
      <div style={{ marginTop: 20 }} />
      <TinyEditor
        ref={ref}
        onInit={(editor) => {
          //   let ed = editor?.target?.editorCommands || {};
          //   setEditor(ed?.editor);
        }}
        {...props}
        onFocus={onFocused}
        onEditorChange={handleOnChange}
        toolbar="undo redo | blocks | formatselect| bold italic backcolor forecolor|  link | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | fontfamily | fontsize |"
        plugins="advlist media_library autolink lists link charmap print preview anchor forecolor"
        init={{
          height: height || 300,
          menubar: false,
          default_link_target: "_blank",
          force_br_newlines: true,
          force_p_newlines: false,
          forced_root_block: "" // Needed for 3.x
        }}
        apiKey={props?.apiKey}
      />
      <div style={{ display: "flex", flexDirection: "row" }}>
        <small style={{ marginLeft: "auto", marginTop: 5, color: "grey", fontSize: 12 }}>
          Resize here if the editor is too small
        </small>
      </div>
    </div>
  );
}

export default TinMCE;
