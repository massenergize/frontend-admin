import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { LOADING } from "../../../../utils/constants";

import MEPaperBlock from "../../ME  Tools/paper block/MEPaperBlock";
import LinearBuffer from "../../../../components/Massenergize/LinearBuffer";
import { Button, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import RichTextToPDF from "../../ME  Tools/to pdf/RichTextToPDF";
import { apiCall } from "../../../../utils/messenger";
import { bindActionCreators } from "redux";
import { reduxLoadAuthAdmin } from "../../../../redux/redux-actions/adminActions";

const MOU = "mou";
function ViewFullPolicy() {
  const [policy, setPolicy] = useState(LOADING);
  const [loading, setLoading] = useState(null);

  const policies = useSelector((store) => store.getIn(["allPolicies"]));
  const { policyKey } = useParams();
  const isMOU = MOU === policyKey;

  useEffect(() => {
    const found = (policies || []).find((item) => item.key === policyKey);
    if (found) setPolicy(found);
  }, [policies]);

  const respond = ({ accept, type }) => {
    setLoading(type);
    apiCall("/users.mou.accept", { accept, policy_key: policyKey }).then(
      (response) => {
        if (!response.success)
          return console.log("ERROR RESPONDING:", response.error);
      }
    );
  };

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
    <div style={{ marginTop: -70 }}>
      <Typography
        variant="h3"
        style={{ fontWeight: "700", fontSize: "2.125rem", color: "white" }}
      >
        {policy?.name || "..."}
      </Typography>

      <BFooter isMOU={isMOU} loading={loading} respond={respond} />
      {/* --------------------------------------------------- */}
      <MEPaperBlock
        containerStyle={{ padding: 0, height: "auto", minHeight: "auto" }}
      >
        <div style={{ padding: "25px 65px" }}>
          <Typography variant="h6">Please do one of the following</Typography>
          <ol style={{ listStyleType: "decimal", marginTop: 6 }}>
            <li>
              Review, <b>accept</b> and continue as admin
            </li>
            <li>Review, don't accept and become inactive as an admin</li>
            <li>Delete your admin access</li>
          </ol>
        </div>

        {/* --------------------------------------------------- */}
        <div
          style={{
            background: "#fbfbfb",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ padding: "10px 30px" }}>
            <Typography variant="body">
              Please scroll down to read the entire document
            </Typography>
          </div>
          <RichTextToPDF
            filename={"Memorandum of Understanding (MOU) - MassEnergize"}
            style={{ marginLeft: "auto" }}
            richText={policy?.description}
            render={(downloadFunction) => {
              return (
                <Button
                  variant="contained"
                  style={{
                    borderRadius: 0,
                    fontWeight: "bold",
                    width: 190,
                    padding: 10,
                  }}
                  onClick={() => downloadFunction(policy?.description)}
                >
                  Download As PDF
                </Button>
              );
            }}
          />
        </div>
      </MEPaperBlock>
      {/* --------------------------------------------------- */}
      <MEPaperBlock>
        <div dangerouslySetInnerHTML={{ __html: policy?.description }} />
      </MEPaperBlock>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      setAuthUser: reduxLoadAuthAdmin,
    },
    dispatch
  );
};

export default connect(
  null,
  mapDispatchToProps
)(ViewFullPolicy);

{
  /* --------------------------------------------------- */
}

const BFooter = ({ isMOU, loading, respond }) => {
  if (!isMOU) return <></>;
  return (
    <MEPaperBlock
      containerStyle={{
        display: "flex column",
        justifyContent: "center",
        minHeight: "auto",
        padding: "0px",
      }}
    >
      <div style={{ padding: "15px 30px" }}>
        <Typography variant="h6" style={{ marginBottom: 10 }}>
          Please proceed to <b>"Accept"</b> the terms, or choose <b>"No"</b> to
          deactivate your role as an admin
        </Typography>
        <Typography variant="body" style={{ marginBottom: 10 }}>
          A copy of the signed agreement will be sent to you and the{" "}
          massenergize team via email when you accept.
        </Typography>
      </div>
      <div style={{ background: "#fbfbfb" }}>
        <Button
          className="touchable-opacity"
          style={{
            borderRadius: 0,
            padding: 10,
            width: 180,
          }}
          variant="contained"
          color="success"
        >
          {loading === "yes" && (
            <i
              style={{ color: "white", marginRight: 6 }}
              className="fa fa-spinner fa-spin"
            />
          )}
          Yes, I accept
        </Button>
        <Button
          className="touchable-opacity"
          style={{
            borderRadius: 0,
            padding: 10,
            width: 180,
            // background: "#d97c7c",
          }}
          variant="contained"
          color="error"
        >
          {loading === "no" && (
            <i
              style={{ color: "white", marginRight: 6 }}
              className="fa fa-spinner fa-spin"
            />
          )}
          No, I Don't Accept
        </Button>
      </div>
    </MEPaperBlock>
  );
};
