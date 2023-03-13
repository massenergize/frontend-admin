import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { LOADING } from "../../../../utils/constants";
import Loading from "dan-components/Loading";
import MEPaperBlock from "../../ME  Tools/paper block/MEPaperBlock";
import LinearBuffer from "../../../../components/Massenergize/LinearBuffer";
import { Typography } from "@mui/material";
function ViewFullPolicy() {
  const [tos, setTos] = useState(LOADING);
  const policies = useSelector((store) => store.getIn(["allPolicies"]));
  console.log("WHAT IS INSIDE ANOTHER", policies);

  useEffect(() => {
    const found = (policies || []).find((item) =>
      item.name.toLowerCase().includes("terms of service")
    );
    setTos(found);
  }, [policies]);

  if (tos === LOADING) return <LinearBuffer message="Almost there..." asCard />;
  if (!tos)
    return (
      <MEPaperBlock containerStyle={{ minHeight: 120 }}>
        Sorry, something happened we could not load the Terms of Service. Please
        refresh in a few!
      </MEPaperBlock>
    );

  console.log("HEre is the tos", tos);
  return (
    <div>
      <Typography
        variant="h3"
        style={{ fontWeight: "700", fontSize: "2.125rem", color: "white" }}
      >
        {tos?.name || "..."}
      </Typography>
      <br />
      <MEPaperBlock>
        <div dangerouslySetInnerHTML={{ __html: tos?.description }} />
      </MEPaperBlock>
    </div>
  );
}

export default ViewFullPolicy;
