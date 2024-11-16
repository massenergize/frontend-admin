import React, { useState } from "react";
import "./admin-pb-settings.css";
import LightAutoComplete from "../Gallery/tools/LightAutoComplete";

const SPECIFIC = "specific-communities";
const AUDIENCE = [
  // everyone, specific communities, only my community

  { id: 3, name: "Only My Community", key: "only-my-community" },
  { id: 1, name: "Everyone", key: "everyone" },
  { id: 2, name: "Specific Communities", key: SPECIFIC }
];
function AdminPageBuilderSettings() {
  const [form, setform] = useState({ scope: "everyone" });

  const onChange = (e) => {
    const { name, value } = e.target || {};
    setform({ ...form, [name]: value });
  };

  const { scope, name, slug } = form || {};
  return (
    <div style={{ padding: 20 }}>
      <h6 style={{ color: "#0b9edc", fontSize: 21 }}>Admin Settings</h6>
      <div className="pb-textbox">
        <label>What's the name of the page</label>
        <input className="here-we-go" type="text" placeholder="Enter page title..." />
      </div>
      <div className="pb-textbox">
        <label>Enter page slug</label>
        <input className="here-we-go" type="text" placeholder="Eg. 'homepage-for-concord'" />
      </div>
      {/* --- AUDIENCE SECTION ------ */}
      <div className="pb-bordered-section">
        <h6 style={{ color: "#0b9edc" }}>Audience</h6>
        <label>Who can view this page?</label>
        <div>
          {AUDIENCE?.map(({ key, name }) => {
            return (
              <div
                onClick={() => onChange({ target: { name: "scope", value: key } })}
                key={key}
                className="pb-s-radio touchable-opacity"
              >
                <input type="radio" checked={key === scope} />
                <span>{name}</span>
              </div>
            );
          })}
          {scope === SPECIFIC && (
            <div style={{ marginTop: 10 }}>
              <p>Please select the communities?</p>
              <LightAutoComplete />
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row" }}>
        <button style={{ marginLeft: "auto" }} className="pb-s-btn touchable-opacity">
          Save
        </button>
      </div>
    </div>
  );
}

export default AdminPageBuilderSettings;
