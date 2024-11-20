import React, { useState } from "react";
import "./admin-pb-settings.css";
import LightAutoComplete from "../Gallery/tools/LightAutoComplete";
import { useSelector } from "react-redux";

const SPECIFIC = "specific-communities";
const AUDIENCE = [
  { id: 3, name: "Only admins in my community", key: "only-my-community" },
  { id: 1, name: "Admins from all communities", key: "everyone" },
  { id: 2, name: "Admins from specific communities", key: SPECIFIC }
];
function AdminPageBuilderSettings() {
  const communities = useSelector((state) => state.getIn(["otherCommunities"]));
  const [form, setform] = useState({ scope: "everyone" });

  const onChange = (e) => {
    const { name, value } = e.target || {};
    setform({ ...form, [name]: value });
  };
  const { scope, name, slug } = form || {};

  const slugValue = (s) =>
    s
      ?.toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "");
  return (
    <div style={{ padding: 20 }}>
      <h6 style={{ color: "#0b9edc", fontSize: 21 }}>Admin Settings</h6>
      <div className="pb-textbox">
        <label>What's the name of the page</label>
        <input onChange={onChange} name="name" value={name} type="text" placeholder="Enter page title..." />
      </div>
      <div className="pb-textbox">
        <label>Enter page slug</label>
        <input
          onChange={onChange}
          name="slug"
          value={slugValue(slug)}
          type="text"
          placeholder="Eg. 'homepage-for-concord'"
        />
      </div>
      {/* --- AUDIENCE SECTION ------ */}
      <div className="pb-bordered-section">
        <h6 style={{ color: "#0b9edc" }}>Access</h6>
        <label>Which communities should be able to copy this page?</label>
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
              <LightAutoComplete
                multiple
                data={communities}
                onChange={(items) => {
                  console.log("Items came in like this", items);
                  onChange({ target: { name: "community_ids", value: items } });
                }}
                valueExtractor={(c) => c.id}
                labelExtractor={(c) => c.name}
              />
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row" }}>
        <button style={{ marginLeft: "auto" }} className="pb-s-btn touchable-opacity">
          {/* <i className="fa fa-spinner fa-spin" /> Save  */}
          Save
        </button>
      </div>
    </div>
  );
}

export default AdminPageBuilderSettings;
