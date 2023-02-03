import React, { useState } from "react";
import { PapperBlock } from "dan-components";
import EngagementCard from "./EngagementCard";
import { Typography } from "@material-ui/core";
import MEDropdown from "../ME  Tools/dropdown/MEDropdown";
function CommunityEngagement() {
  useState;
  const [specific, setSpecific] = useState(false);
  return (
    <div>
      <PapperBlock
        noMargin
        title="Community Engagement"
        icon="ios-share-outline"
        whiteBg
        desc=""
      >
        <Typography variant="body">
          Here is a summary of user engagements in all of your communities.
          <br />
          {!specific && (
            <span
              onClick={() => setSpecific(true)}
              
              className="touchable-opacity"
              style={{
                paddingBottom: 4,
                border: "dotted 0px",
                borderBottomWidth: 2,
                fontWeight: "bold",
                color: "rgb(156, 39, 176)",
              }}
            >
              Click for more specific results
            </span>
          )}
        </Typography>
        {specific && <AddFilters hide={() => setSpecific(false)} />}
        <div
          style={{ display: "flex", flexDirection: "row", margin: "10px 0px" }}
        >
          <EngagementCard
            color="#A38E6E"
            title="USER SIGN-INS"
            subtitle="See involved users"
            icon="fa-user"
          />
          <EngagementCard
            theme="#EAFFEB"
            color="#82A36E"
            title="ACTIONS COMPLETED"
            subtitle="See involved actions"
            icon="fa-check-circle"
          />
          <EngagementCard
            color="#9BA1D8"
            theme="#EAEEFF"
            title="ACTIONS IN TODO"
            subtitle="See involved actions"
            icon="fa-tasks"
          />
        </div>
        <div>
          <Typography variant="h6" color="primary">
            <b>IMPACT</b>
          </Typography>
          {/* <Typography variant="body">
            See impact in any of your communities from the dropdown below
          </Typography> */}

          <MEDropdown
            placeholder="See impact in any of your communities from the dropdown below"
            data={["First", "Second", "Third"]}
          />
        </div>
      </PapperBlock>
    </div>
  );
}

export default CommunityEngagement;

export const AddFilters = ({ hide }) => {
  return (
    <div>
      <MEDropdown
        placeholder="Time Range"
        data={["First", "Second", "Third"]}
      />
      <MEDropdown
        placeholder="Select any of the communities you manage"
        data={["First", "Second", "Third"]}
      />
      <div style={{ display: "flex", flexDirection: "row", marginTop: 8 }}>
        <Typography
          onClick={() => hide && hide()}
          className="touchable-opacity"
          style={{
            marginLeft: "auto",
            fontWeight: "bold",
            border: "dotted 0px",
            borderBottomWidth: 2,
            color: "#d24646",
          }}
        >
          Hide
        </Typography>
      </div>
    </div>
  );
};
