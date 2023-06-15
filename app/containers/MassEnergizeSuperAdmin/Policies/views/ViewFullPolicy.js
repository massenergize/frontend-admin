import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { LOADING } from "../../../../utils/constants";

import MEPaperBlock from "../../ME  Tools/paper block/MEPaperBlock";
import LinearBuffer from "../../../../components/Massenergize/LinearBuffer";
import { Button, Typography, Snackbar, Alert } from "@mui/material";
import { useHistory, useParams } from "react-router-dom";
import RichTextToPDF from "../../ME  Tools/to pdf/RichTextToPDF";
import { apiCall } from "../../../../utils/messenger";
import { bindActionCreators } from "redux";
import {
  reduxLoadAuthAdmin,
  reduxSignOut,
  reduxToggleUniversalModal,
} from "../../../../redux/redux-actions/adminActions";
import { getHumanFriendlyDate } from "../../../../utils/common";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const MOU = "mou";
const ACCEPT = "accept";
const DECLINE = "decline";
const DEFER = "defer";

function ViewFullPolicy({ showModal, signOut, auth, policies }) {
  const history = useHistory();
  const [policy, setPolicy] = useState(LOADING);
  const [loading, setLoading] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { policyKey } = useParams();
  const isMOU = MOU === policyKey;
  const alreadyAcceptedMOU = !auth?.needs_to_accept_mou;
  const signedMouAt = getHumanFriendlyDate(
    auth?.mou_details?.signed_at,
    false,
    false
  );

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

  const requestPDF = (id, title) => {
    apiCall("/downloads.policy", { policy_id: id, title }).then((res) => {
      if (res.success) {
        setOpenSnackbar(true);
      }
    });
  };
  const handleCloseStyle = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };
  return (
    <div style={{ marginTop: -70 }}>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "cen" }}
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseStyle}
      >
        <Alert
          onClose={handleCloseStyle}
          severity={"success"}
          sx={{ width: "100%" }}
        >
          <small style={{ marginLeft: 15, fontSize: 15 }}>
            Your request has been received. Please check your email for the
            file.
          </small>
        </Alert>
      </Snackbar>

      <Typography
        variant="h3"
        style={{ fontWeight: "700", fontSize: "2.125rem", color: "white" }}
      >
        {policy?.name || "..."}
      </Typography>

      {/* --------------------------------------------------- */}
      {!alreadyAcceptedMOU ? (
        <MEPaperBlock
          containerStyle={{
            minHeight: 100,
            marginTop: 25,
            padding: "16px 30px",
            background: "#198754",
            color: "white",
          }}
        >
          <Typography variant="h6">
            Hi <b>{auth?.full_name || "..."},</b>
          </Typography>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <span
              className="fa fa-check-circle"
              style={{ marginRight: 8, color: "white", fontSize: 24 }}
            />
            <Typography variant="h6" style={{ fontSize: "1.1rem" }}>
              You already signed the MOU on{" "}
              <b style={{ textDecoration: "underline" }}>
                {signedMouAt || "..."}
              </b>
              unless you've changed your mind, please
              <Link to="/" style={{ marginLeft: 5, color: "white" }}>
                click here to proceed to the dashboard
              </Link>
            </Typography>
          </div>
        </MEPaperBlock>
      ) : (
        <MEPaperBlock
          containerStyle={{
            padding: 0,
            height: "auto",
            minHeight: "auto",
            marginTop: 25,
          }}
        >
          <div style={{ padding: "25px 35px" }}>
            <Typography variant="h6">
              Hi <b>{auth?.full_name || "..."}</b>, please do one of the
              following:{" "}
            </Typography>
            <ol
              style={{
                listStyleType: "decimal",
                marginLeft: 20,
                marginTop: 6,
              }}
            >
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
            <Button
              variant="contained"
              style={{
                borderRadius: 0,
                fontWeight: "bold",
                width: 190,
                padding: 10,
              }}
              onClick={() =>
                requestPDF(
                  policy?.id,
                  "Memorandum of Understanding (MOU) - MassEnergize"
                )
              }
            >
              Download As PDF
            </Button>
          </div>
        </MEPaperBlock>
      )}

      {/* --------------------------------------------------- */}
      <MEPaperBlock>
        <div
          dangerouslySetInnerHTML={{
            __html: policy?.description,
          }}
        />
      </MEPaperBlock>

      <BFooter
        alreadySigned={alreadyAcceptedMOU}
        isMOU={isMOU}
        loading={loading}
        confirm={toggleConfirmationDialog}
      />
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    auth: state.getIn(["auth"]),
    policies: state.getIn(["allPolicies"]),
  };
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
const BFooter = ({ isMOU, loading, confirm, alreadySigned }) => {
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
      {alreadySigned ? (
        <div style={{ padding: "30px" }}>
          <Typography variant="body" style={{ marginBottom: 10 }}>
            Use the button below to revoke your admin rights and deactivate your
            account if you no longer agree to the terms.
          </Typography>
        </div>
      ) : (
        <div style={{ padding: "30px" }}>
          <Typography variant="h6" style={{ marginBottom: 10 }}>
            Please proceed to <b>"Accept"</b> the terms, or choose <b>"No"</b>{" "}
            to deactivate your role as an admin
          </Typography>
          <Typography variant="body" style={{ marginBottom: 10 }}>
            A copy of the signed agreement will be sent to you and the{" "}
            massenergize team via email when you accept.
          </Typography>
        </div>
      )}
      <div style={{ background: "#fbfbfb" }}>
        {!alreadySigned && (
          <>
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
          </>
        )}
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
