import React, { useState } from "react";
import { OPTIONS } from "./EventNotificationSettings";
import { objArrayToString, pluralize, smartString } from "../../../../utils/common";

const SavedNudgeSettings = ({ profiles, editSettings, removeProfile, getStarted }) => {
  const common = {
    marginRight: 10,
    textDecoration: "underline",
    fontWeight: "bold",
    color: "#428BCF"
  };

  if (!profiles?.length)
    return (
      <p style={{ padding: 10, color: "black" }}>
        No saved settings yet... The settings you make for any group of communities will be available here.{" "}
        <span
          onClick={() => getStarted()}
          style={{ textDecoration: "underline", color: "green", fontWeight: "bold", marginLeft: 5 }}
          className="touchable-opacity"
        >
          Get started
        </span>
      </p>
    );

  return (
    <div
      style={{
        padding: "10px"
      }}
    >
      <div style={{ marginBottom: 5, color: "black" }}>
        <small>
          <b>
            The settings you make, show up here. Remove or make changes to your previously saved settings by clicking on
            "Edit/Remove" buttons{" "}
          </b>
        </small>
        <hr />
      </div>
      {profiles?.map((t) => {
        const communities = t?.communities || [];
        let keys = Object.entries(t?.settings);
        keys = keys.filter(([, value]) => value).map(([key]) => key);
        const objs = OPTIONS.filter((o) => keys.includes(o.key));
        const stringOfSettingsSelected = objArrayToString(objs, (ob) => ob.alias);
        const stringOfCommunitiesSelected = objArrayToString(t?.communities, (ob) => ob?.name);
        return (
          <>
            <div style={{ marginTop: 10 }}>
              <p
                style={{
                  marginBottom: 0,
                  color: "black"
                }}
              >
                {smartString(stringOfSettingsSelected, 50)}
              </p>
              <small
                style={{
                  color: "black",
                  fontWeight: "bold"
                }}
              >
                {smartString(stringOfCommunitiesSelected, 50)}
              </small>
              <div style={{ display: "flex" }}>
                <small>
                  {communities?.length === 1
                    ? `${communities?.length} community`
                    : `${communities?.length} communities`}
                  {objs?.length === 1 ? `, ${objs?.length} item toggled` : `, ${objs?.length} items toggled`}
                </small>
                <div style={{ marginLeft: "auto" }}>
                  <small onClick={() => editSettings(t)} className="touchable-opacity" style={{ ...common }}>
                    Edit
                  </small>
                  <RemoveItem onConfirm={() => removeProfile(t)} common={common} />
                </div>
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
};

const RemoveItem = ({ onConfirm, common }) => {
  const [deleting, setDeleting] = useState(false);
  if (!deleting)
    return (
      <small
        onClick={() => setDeleting(true)}
        className="touchable-opacity"
        style={{
          ...common,
          color: "#C15757"
        }}
      >
        Remove
      </small>
    );

  return (
    <>
      <small style={{ marginRight: 10 }}>Are you sure?</small>
      <small
        className="touchable-opacity"
        style={{
          ...common,
          color: "green"
        }}
        onClick={() => onConfirm()}
      >
        Yes
      </small>
      <small
        onClick={() => setDeleting(false)}
        className="touchable-opacity"
        style={{
          ...common,
          color: "#C15757"
        }}
      >
        No
      </small>
    </>
  );
};
export default SavedNudgeSettings;
