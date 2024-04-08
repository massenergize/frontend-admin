import React, { useState } from "react";

const THEME = "rgb(171, 71, 188)";
const DEEP_THEME = "#6E137E";
const Accordion = ({ children, title, opened = false }) => {
  const [isOpen, setIsOpen] = useState(opened);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div
        style={{
          marginBottom: "10px"
        }}
      >
        <div
          style={{
            backgroundColor: "rgb(254 245 255)",
            padding: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            border: `1px solid ${THEME}`,
            color: DEEP_THEME,
            fontWeight: "bold"
          }}
          onClick={toggleAccordion}
        >
          <span>
            <b>{title || "Accordion Title"}</b>
          </span>
          <i className={isOpen ? "fa fa-chevron-up" : "fa fa-chevron-down"} />
        </div>
        {isOpen && (
          <div
            style={{
              border: `1px solid ${THEME}`,
              borderBottomRightRadius: 4,
              borderBottomLeftRadius: 4,
              borderTop: "none",
              marginBottom: "10px"
            }}
          >
            <div
              style={{
                padding: "10px"
              }}
            >
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accordion;
