import React from "react";
import "./pb-pages.css";
const AUDIENCE = [
  // everyone, specific communities, only my community
  { id: 1, name: "Everyone", key: "everyone" },
  { id: 2, name: "Specific Communities", key: "specific-communities" },
  { id: 3, name: "Only My Community", key: "only-my-community" },
];
function PBPageSettings() {
  return (
    <div style={{ padding: 20 }}>
      <h6 style={{ color: "#0b9edc" }}>PAGE SETTINGS</h6>
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
          {AUDIENCE?.map((item) => (
            <div key={item?.key} className="pb-s-radio touchable-opacity">
              <input type="radio" />
              <span>{item?.name}</span>
            </div>
          ))}
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

export default PBPageSettings;
