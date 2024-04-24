import React from "react";
import { useHistory, Link } from "react-router-dom";

function GoBack({ text, children }) {
  const history = useHistory();
  return (
    <Link
      style={{ color: "#c83535", cursor: "pointer", textDecoration: "none" }}
      onClick={(e) => {
        e?.preventDefault();
        history.goBack();
      }}
    >
      <i className=" fa fa-long-arrow-left" />{" "}
      <span style={{ marginLeft: 5, fontWeight: "bold", textDecoration: "underline" }}>
        {text || children || "Go Back"}
      </span>
    </Link>
  );
}

export default GoBack;
