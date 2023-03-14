import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { LOADING } from "../../../../utils/constants";

import MEPaperBlock from "../../ME  Tools/paper block/MEPaperBlock";
import LinearBuffer from "../../../../components/Massenergize/LinearBuffer";
import { Button, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

const MOU = "mou";
function ViewFullPolicy() {
  const [policy, setPolicy] = useState(LOADING);
  const policies = useSelector((store) => store.getIn(["allPolicies"]));
  const { policyKey } = useParams();
  const isMOU = MOU == policyKey;

  useEffect(() => {
    const found = (policies || []).find((item) => item.key === policyKey);
    if (found) setPolicy(found);
  }, [policies]);

  if (policy === LOADING)
    return <LinearBuffer message="Almost there..." asCard />;

  if (!policy)
    return (
      <MEPaperBlock containerStyle={{ minHeight: 120 }}>
        Sorry, something happened we could not load the policy you were looking
        for. Please refresh in a few!
      </MEPaperBlock>
    );

  return (
    <div>
      <Typography
        variant="h3"
        style={{ fontWeight: "700", fontSize: "2.125rem", color: "white" }}
      >
        {policy?.name || "..."}
      </Typography>
      <br />
      <BFooter isMOU={isMOU} />
      <br />
      <MEPaperBlock>
        <div dangerouslySetInnerHTML={{ __html: policy?.description }} />
      </MEPaperBlock>
    </div>
  );
}

const BFooter = ({ isMOU }) => {
  return (
    <MEPaperBlock
      containerStyle={{
        display: "flex column",
        justifyContent: "center",
        minHeight: "auto",
        padding: "15px 30px",
      }}
    >
      <Typography variant="h6" style={{ marginBottom: 10 }}>
        Please proceed to "Accept" the terms, or choose "No" to deactivate your
        role as an admin
      </Typography>
      <div>
        <Button variant="contained" color="success">
          Yes, I accept
        </Button>
        <Button variant="contained" color="error" style={{ marginLeft: 10 }}>
          No
        </Button>
      </div>
    </MEPaperBlock>
  );
};

export default ViewFullPolicy;
