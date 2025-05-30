import React, { useEffect, useRef, useState } from "react";
import { Editor as TinyEditor } from "@tinymce/tinymce-react";
import { debounce } from "../../utils/engine/engine";
function TinMCE({ height, onChange, onFocused, focus, ...props }) {
  const [value, setValue] = useState("");
  const handleOnChange = (content, editor) => {
    onChange && onChange({ content, editor });
  };
  const ref = useRef();
  useEffect(() => {
    if (focus) {
      ref.current.focus();
    }
  }, [focus]);

  useEffect(() => {
    setValue(props?.value);
  }, []);

  const transfer = () => {
    onChange && onChange({ content: value });
  };
  return (
    <div style={{ padding: 10 }}>
      <div style={{ marginTop: 20 }} />
      <TinyEditor
        ref={ref}
        onBlur={() => {
          // onChange && onChange({ content: value });
          transfer();
        }}
        {...props}
        value={value}
        onFocus={onFocused}
        // onEditorChange={handleOnChange}
        onEditorChange={(content, editor) => setValue(content)}
        toolbar="undo redo | blocks | formatselect| bold italic backcolor forecolor|  link | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | fontfamily | fontsize |"
        plugins="advlist media_library autolink lists link charmap print preview anchor forecolor"
        init={{
          height: height || 600,
          menubar: false,
          default_link_target: "_blank",
          force_br_newlines: true,
          force_p_newlines: false,
          forced_root_block: "", // Needed for 3.x
          font_formats: "Google Sans='Google Sans';",
          font_default: "Google Sans",
          content_style: `
            @import url('https://fonts.googleapis.com/css?family=Google+Sans:400,400i,500,500i,600,600i,700,700i,900,900i&display=swap');
            body { 
              font-family: Google Sans, sans-serif; 
              font-size: 14px; 
            }
          `
        }}
        apiKey={props?.apiKey}
      />
      <div style={{ display: "flex", flexDirection: "row" }}>
        <small style={{ marginLeft: "auto", marginTop: 5, color: "white", fontWeight: "bold", fontSize: 12 }}>
          Resize here if the editor is too small
        </small>
      </div>
      <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "center" }}>
        <button className="touchable-opacity" onClick={() => transfer()}>
          Insert Text
        </button>
      </div>
    </div>
  );
}

export default TinMCE;
