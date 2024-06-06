import React, { useState } from "react";

function MEAccordion({ title, header, render, children }) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen(!open);
  };
  const renderHeader = () => {
    if (header) return header({ toggle });

    return (
      <div
        onClick={() => toggle()}
        className="touchable-opacity elevate-float"
        style={{
          padding: "10px 20px",
          display: "inline-flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          //   minWidth: 400,
          borderRadius: 3,
          marginTop: 10
        }}
      >
        <h4 style={{ margin: 0 }}>{title || "Accordion Header"}</h4>
        <div style={{ marginLeft: "auto", display: "flex", flexDirection: "row", alignItems: "center" }}>
          {/* <i className="fa fa-plus-square" style={{ marginRight: 15, fontSize: 26 }} /> */}
          <i className={`fa fa-caret-${open ? "up" : "down"}`} />
        </div>
      </div>
    );
  };
  const renderBody = () => {
    if (!open) return null;
    if (render) return render({});

    return (
      <div style={{ border: "solid 2px #f5f4f9", borderTopColor: "white", minHeight: 200, width: "auto" }}>
        {children}
      </div>
    );
  };
  return (
    <div style={{ width: "100%" }}>
      {renderHeader()}
      {renderBody()}
    </div>
  );
}

export default MEAccordion;
