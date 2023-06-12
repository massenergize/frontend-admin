import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { LOADING } from "../../../../utils/constants";

import MEPaperBlock from "../../ME  Tools/paper block/MEPaperBlock";
import LinearBuffer from "../../../../components/Massenergize/LinearBuffer";
import { Button, Typography } from "@mui/material";
import { useHistory, useParams } from "react-router-dom";
import RichTextToPDF from "../../ME  Tools/to pdf/RichTextToPDF";
import { apiCall } from "../../../../utils/messenger";
import { bindActionCreators } from "redux";
import {
  reduxLoadAuthAdmin,
  reduxSignOut,
  reduxToggleUniversalModal,
} from "../../../../redux/redux-actions/adminActions";
import {PDFDownloadLink } from '@react-pdf/renderer'


const MOU = "mou";
const ACCEPT = "accept";
const DECLINE = "decline";
const DEFER = "defer";

function ViewFullPolicy({ showModal, signOut, auth, policies }) {
  const history = useHistory();
  const [policy, setPolicy] = useState(LOADING);
  const [loading, setLoading] = useState(null);

  const { policyKey } = useParams();
  const isMOU = MOU === policyKey;

  const toggleConfirmationDialog = (show, options = {}) => {
    showModal({
      show,
      component: (
        <ConfirmationModal
          {...options || {}}
          accept={respond}
          defer={signUserOut}
          decline={respond}
          close={() => showModal({ show: false })}
          auth={auth}
        />
      ),
      fullControl: true,
      closeAfterConfirmation: true,
      contentStyle: { minWidth: 450 },
    });
  };

  useEffect(() => {
    const found = (policies || []).find((item) => item.key === policyKey);
    if (found) setPolicy(found);
  }, [policies]);

  const signUserOut = () => {
    signOut(() => history.push("/login"));
  };
  const respond = ({ accept, type }) => {
    setLoading(type);
    if (loading) return;
    apiCall("/users.mou.accept", { accept, policy_key: policyKey }).then(
      (response) => {
        setLoading(null);
        if (!response.success)
          return console.log("ERROR RESPONDING:", response.error);
        if (!accept) signUserOut();

        // putAdminInRedux(response.data);
        window.location.href = "/";
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

      {/* --------------------------------------------------- */}
      <MEPaperBlock
        containerStyle={{ padding: 0, height: "auto", minHeight: "auto" }}
      >
        <div style={{ padding: "25px 65px" }}>
          <Typography variant="h6">
            Hi <b>{auth?.full_name || "..."}</b>, please do one of the
            following:{" "}
          </Typography>
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
            justifyContent: "space-between",
          }}
        >
          <div style={{ padding: "10px 30px" }}>
            <Typography variant="body">
              Please scroll down to read the entire document
            </Typography>
          </div>
          {/* <RichTextToPDF
            filename={"Memorandum of Understanding (MOU) - MassEnergize"}
            style={{ marginLeft: "auto" }}
            richText={policy?.description}
            render={( )  => {
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
          /> */}
          <div>
            <PDFDownloadLink
              document={
                <RichTextToPDF
                  richText={policy?.description}
                  style={{ marginLeft: "auto" }}
                />
              }
              fileName="Memorandum of Understanding (MOU) - MassEnergize"
            >
              {({ loading }) => (
                <Button
                  variant="contained"
                  disabled={loading}
                  style={{
                    borderRadius: 0,
                    fontWeight: "bold",
                    width: 190,
                    padding: 10,
                  }}
                >
                  {loading ? "Loading.." : " Download As PDF"}
                </Button>
              )}
            </PDFDownloadLink>
          </div>
        </div>
      </MEPaperBlock>
      {/* --------------------------------------------------- */}
      <MEPaperBlock>
        <div
          dangerouslySetInnerHTML={{
            __html: policy?.description,
          }}
        />
      </MEPaperBlock>
      <BFooter
        isMOU={isMOU}
        loading={loading}
        confirm={toggleConfirmationDialog}
      />
    </div>
  );
}
const mapStateToProps = (state) => {
  return { auth: state.getIn(["auth"]),
  policies: state.getIn(["allPolicies"]) };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      putAdminInRedux: reduxLoadAuthAdmin,
      showModal: reduxToggleUniversalModal,
      signOut: reduxSignOut,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewFullPolicy);

{
  /* --------------------------------------------------- */
}

const ConfirmationModal = ({
  type = "accept",
  close,
  defer,
  decline,
  accept,
  auth,
}) => {
  const states = {
    [ACCEPT]: {
      title: "You are almost there!",
      subtext: "This is what it means to accept:",
      content: (
        <>
          <ol style={{ listStyleType: "decimal" }}>
            <li>
              You will receive a confirmation email of your signed document
            </li>
            <li>You will continue with all your admin rights</li>
            <li>You will only be reminded to sign again in a year's time</li>
            <li>
              Your full name <b>"{auth?.full_name}"</b> will be used to sign the
              document
            </li>
          </ol>
        </>
      ),
      okText: "Yes, Proceed",
      action: () => {
        accept && accept({ accept: true, type: ACCEPT });
        close && close();
      },
    },
    [DEFER]: {
      title: "Are you sure you want to defer?",
      subtext: "What it means to defer: ",
      content: (
        <Typography variant="body">
          You will be signed out, and will be brought back to this page the next
          time you sign in again.
        </Typography>
      ),
      okText: "Yes, Defer",
      action: () => {
        defer && defer();
        close && close();
      },
    },
    [DECLINE]: {
      title: "Are you sure you want to decline?",
      subtext: "What it means to decline:",
      okText: "Yes, Decline",
      content: (
        <>
          <ol style={{ listStyleType: "decimal" }}>
            <li>You will be signed out</li>
            <li>You will no longer be an admin (all rights revoked)</li>
          </ol>
        </>
      ),
      action: () => {
        accept && accept({ accept: false, type: DECLINE });
        close && close();
      },
    },
  };

  const { title, subtext, content, okText, action } = states[type] || {};
  return (
    <div>
      <div style={{ padding: "10px 25px", color: "black" }}>
        {title && (
          <Typography variant="h6" style={{ fontWeight: "bold", fontSize: 16 }}>
            {title}
          </Typography>
        )}
        {subtext && (
          <Typography variant="body2" style={{ fontWeight: "bold" }}>
            {subtext}
          </Typography>
        )}
        {content && (
          <div style={{ padding: "10px 20px", color: "black" }}>{content}</div>
        )}
      </div>
      <div style={{ background: "#fbfbfb", display: "flex" }}>
        <div style={{ marginLeft: "auto" }}>
          <Button
            className="touchable-opacity"
            style={{
              borderRadius: 0,
              padding: 10,
              width: 130,
              fontSize: 13,
              fontWeight: "bold",
            }}
            variant="contained"
            color="error"
            onClick={() => close && close()}
          >
            Cancel
          </Button>
          <Button
            className="touchable-opacity"
            style={{
              borderRadius: 0,
              padding: 10,
              width: 130,
              fontSize: 13,
              fontWeight: "bold",
            }}
            variant="contained"
            color="success"
            onClick={() => action && action()}
          >
            {okText || "Yes, Proceed"}
          </Button>
        </div>
      </div>
    </div>
  );
};
const BFooter = ({ isMOU, loading, confirm }) => {
  if (!isMOU) return <></>;
  const btnStyles = {
    borderRadius: 0,
    padding: 10,
    width: 180,
    fontWeight: "bold",
  };
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
          style={{ ...btnStyles }}
          variant="contained"
          color="success"
          disabled={loading && loading !== ACCEPT}
          onClick={() => confirm("accept", { type: "accept" })}
        >
          {loading === ACCEPT && (
            <i
              style={{ color: "white", marginRight: 6 }}
              className="fa fa-spinner fa-spin"
            />
          )}
          Yes, I accept
        </Button>

        <Button
          className="touchable-opacity"
          style={{ ...btnStyles }}
          variant="contained"
          color="secondary"
          disabled={loading && loading !== DEFER}
          onClick={() => confirm("defer", { type: "defer" })}
        >
          Defer
        </Button>
        <Button
          className="touchable-opacity"
          style={{ ...btnStyles, minWidth: 240 }}
          variant="contained"
          color="error"
          disabled={loading && loading !== DECLINE}
          onClick={() => confirm("decline", { type: "decline" })}
        >
          {loading === DECLINE && (
            <i
              style={{ color: "white", marginRight: 6 }}
              className="fa fa-spinner fa-spin"
            />
          )}
          No, I Don't Accept (DELETE)
        </Button>
      </div>
    </MEPaperBlock>
  );
};
