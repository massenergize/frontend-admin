import React, { useState } from "react";
import "./admin-pb-settings.css";
import LightAutoComplete from "../Gallery/tools/LightAutoComplete";
import { useSelector } from "react-redux";
import { useApiRequest } from "../../../utils/hooks/useApiRequest";

const SPECIFIC = "specific-communities";
const AUDIENCE_TYPES = { EVERYONE: "OPEN", ONLY_ME: "CLOSE", SPECIFIC_COMMUNITIES: "OPENED_TO" };
const AUDIENCE = [
  { id: 3, name: "Only admins in my community", key: AUDIENCE_TYPES.ONLY_ME },
  { id: 1, name: "Admins from all communities", key: AUDIENCE_TYPES.EVERYONE },
  { id: 2, name: "Admins from specific communities", key: AUDIENCE_TYPES.SPECIFIC_COMMUNITIES }
];

const URLS = {
  UPDATE: "/community.custom.pages.update",
  CREATE: "/community.custom.pages.create",
  PUBLISH: "/community.custom.pages.publish"
};
function AdminPageBuilderSettings() {
  const communities = useSelector((state) => state.getIn(["otherCommunities"]));
  const adminCommunities = useSelector((state) => state.getIn(["communities"]));
  const [form, setform] = useState({ sharing_type: AUDIENCE_TYPES.EVERYONE });
  const [pageUpdateRequestObject] = useApiRequest([{ key: "pageUpdateRequest", url: URLS.UPDATE }]);

  const [sendUpdate, data, error, loading, setError] = pageUpdateRequestObject || [];

  const onChange = (e) => {
    const { name, value } = e.target || {};
    let extras = {};
    if (name === "title") extras = { slug: slugValue(value) };
    setform({ ...form, [name]: value, ...extras });
  };
  const { sharing_type: scope, title, slug } = form || {};

  const slugValue = (s) =>
    s
      ?.toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "");

  const makeRequest = () => {
    const community_id = form.community_id?.[0]?.id;
    if (!community_id) return setError("Please select a community to own this page");
    if (!title) return setError("Please enter a name for the page");
    if (!slug) return setError("Please enter a slug for the page");
    const body = { ...form, audience: form.audience?.map((c) => c.id), community_id };
    sendUpdate(body);
  };
  console.log("LA DATA", data);

  return (
    <div style={{ padding: 20, maxHeight: "70vh", overflowY: "scroll" }}>
      <h6 style={{ color: "#0b9edc", fontSize: 21 }}>Configuration</h6>
      <div className="pb-textbox">
        <label>What's the name of the page</label>
        <input onChange={onChange} name="title" value={title} type="text" placeholder="Enter page title..." />
      </div>
      <div className="pb-textbox">
        <label>Enter a unique page slug</label>
        <input onChange={onChange} name="slug" value={slug} type="text" placeholder="Eg. 'homepage-for-concord'" />
      </div>
      {/* --- PAGE OWNERSHIP ------ */}
      <div className="pb-bordered-section">
        <h6 style={{ color: "#0b9edc" }}>Page Ownership</h6>
        <label>
          Which of the communities you manage should own this page? Only admins from the selected community can edit
          this page.
        </label>
        <div>
          <div style={{ marginTop: 10 }}>
            {/* <p>Select the community that owns this page</p> */}
            <LightAutoComplete
              data={adminCommunities}
              onChange={(items) => {
                onChange({ target: { name: "community_id", value: items } });
              }}
              valueExtractor={(c) => c.id}
              labelExtractor={(c) => c.name}
            />
          </div>
        </div>
      </div>
      {/* --- AUDIENCE SECTION ------ */}
      <div className="pb-bordered-section">
        <h6 style={{ color: "#0b9edc" }}>Access Control</h6>
        <label>
          Which community admins should have access to this page? Communities you select here can add your page to their
          navigation and make a copy of your page too.
        </label>
        <div>
          {AUDIENCE?.map(({ key, name }) => {
            return (
              <div
                onClick={() => onChange({ target: { name: "sharing_type", value: key } })}
                key={key}
                className="pb-s-radio touchable-opacity"
              >
                <input type="radio" checked={key === scope} />
                <span>{name}</span>
              </div>
            );
          })}
          {scope === AUDIENCE_TYPES.SPECIFIC_COMMUNITIES && (
            <div style={{ marginTop: 10 }}>
              <p>Please select the communities?</p>
              <LightAutoComplete
                multiple
                data={communities}
                onChange={(items) => {
                  onChange({ target: { name: "audience", value: items } });
                }}
                valueExtractor={(c) => c.id}
                labelExtractor={(c) => c.name}
              />
            </div>
          )}
        </div>
      </div>
      {error && (
        <div style={{ padding: "7px 20px", background: "#ffedf1", borderRadius: 5, margin: "10px 0px" }}>
          <small style={{ color: "#c94646" }}>{error}</small>
          {/* <small style={{ color: "#c94646" }}>Here comes the big show</small> */}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "row" }}>
        <button onClick={() => makeRequest()} style={{ marginLeft: "auto" }} className="pb-s-btn touchable-opacity">
          {loading && <i className="fa fa-spinner fa-spin" />}Save
        </button>
      </div>
    </div>
  );
}

export default AdminPageBuilderSettings;
