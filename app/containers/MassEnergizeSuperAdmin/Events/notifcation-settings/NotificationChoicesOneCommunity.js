import React, { useEffect, useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Button, Typography } from "@mui/material";
import { OPTIONS } from "./EventNotificationSettingsOneCommunity";
import MEDropdown from "../../ME  Tools/dropdown/MEDropdown";
import LightAutoComplete from "../../Gallery/tools/LightAutoComplete";
import { useSelector } from "react-redux";
import { mergeUnique, smartString } from "../../../../utils/common";

const NotificationChoicesOneCommunity = ({ state, handleChange, setCommunities, targetCommunities, event }) => {
  let communities = useSelector((state) => state.getIn(["communities"]));
  const comparator = (a, b) => a?.id?.toString() === b?.id?.toString();
  communities = mergeUnique(communities, event?.shared_to || [], comparator);
  const admin = useSelector((state) => state.getIn(["auth"]));

  const getValue = (name) => {
    const data = state || {};
    return data[name] || false;
  };

  const community = communities?.find((c) => c?.id === event?.community?.id);
  return (
    <div
      style={{
        padding: "10px",
        marginBottom: 40
      }}
    >
      {/* <div style={{ marginBottom: 5, color: "black", fontWeight: "bold" }}>
        <small>
          <b>
            First select a list of communities (The list only shows communities that this event is shared to, and ones
            you manage){" "}
          </b>
        </small>
      </div> */}
      {/* {admin?.is_super_admin ? ( */}
      {/* <LightAutoComplete
        selectAllV2
        allowClearAndSelectAll
        multiple
        data={communities}
        onChange={(t) => {
          setCommunities(t);
        }}
        isAsync
        endpoint="communities.listForCommunityAdmin"
        defaultSelected={targetCommunities}
        valueExtractor={(t) => t?.id}
        labelExtractor={(t) => t?.name}
        placeholder="Select the communities that these settings apply to..."
      /> */}

      <Typography variant="h6" style={{ fontWeight: "bol", color: "black", marginTop:10 }}>
        {smartString(event?.name, 50) || "Notification Settings"}
      </Typography>
      <div style={{ margin: "5px 0px", color: "black", fontWeight: "bold" }}>
        <small>
          Configure notification behaviour of this event for <b>{community?.name || "..."}</b>
        </small>
      </div>
      {OPTIONS.map((t) => {
        return (
          <>
            <FormControlLabel
              key={t.key}
              control={<Checkbox checked={getValue(t.key)} onChange={handleChange} name={t.key} />}
              label={t.name}
              value={t.key}
              style={{ color: "black" }}
            />
            <br />
          </>
        );
      })}
    </div>
  );
};

export default NotificationChoicesOneCommunity;
