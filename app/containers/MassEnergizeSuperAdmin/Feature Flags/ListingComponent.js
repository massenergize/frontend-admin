import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { reduxAddFlagInfo } from "../../../redux/redux-actions/adminActions";
import { apiCall } from "../../../utils/messenger";

function ListingComponent({
  id,
  keepInfoInRedux,
  infos,
  close,
  isCommunity = true,
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState(null); // The full version of the ff that has been loaded from the api is put here
  const [deleteContent, setDeleteContent] = useState(null); // The item that is in focus for deletion, is put here
  const title = `This feature flag is associated with the following ${
    isCommunity ? " communities " : " users "
  } `;
  const contentToDisplay = isCommunity
    ? (content || {}).communities
    : (content || {}).users;
  // -------------------------------------------------------------------
  useEffect(() => {
    const errorMessage =
      "Sorry, we could not load content related to this feature flag";
    if (!id) {
      setLoading(false);
      setError(errorMessage);
      return;
    }
    // If content has been fetched before, it will surely be in infos, so check locally, before running api request again
    const found = (infos || {})[id];
    if (found) {
      setLoading(false);
      setContent(found);
      return;
    }
    //-------------------------------------------------------------

    apiCall("/featureFlags.info", { id })
      .then((response) => {
        setLoading(false);
        if (!response || !response.success) {
          setError(errorMessage);
          return console.log("FFBE_ERROR", response.error);
        }
        setContent(response.data);
        keepInfoInRedux({ ...(infos || {}), [id]: response.data });
      })
      .catch((e) => {
        setLoading(false);
        setError(errorMessage);
        console.log("FF_INFO_ERROR", e.toString());
      });
  }, []);
  // -------------------------------------------------------------------

  const remove = () => {
    const id = deleteContent.id;
    var data = [];
    if (isCommunity) data = (content || {}).communities;
    else data = (content || {}).users;

    data = data.filter((it) => it.id !== id);

    var newContent = {};
    // Add the user/community back to the array on the particular feature flag
    if (isCommunity) newContent = { ...content, communities: data };
    else newContent = { ...content, users: data };

    // Put the whole feature flag back to the fold
    setDeleteContent(null);
    setContent(newContent);
    const newInfos = { ...infos, [newContent.id]: newContent };
    keepInfoInRedux(newInfos);

    // Now send api request here
    data = data.map((it) => it.id);
    var body = {};
    if (isCommunity) body = { community_ids: data };
    else body = { user_ids: data };

    setError(null);
    apiCall("/featureFlag.update", { id: newContent.id, ...body }).catch(
      (e) => {
        setError(e.toString());
        console.log("BE_ERROR:", e.toString());
      }
    );
  };

  // -------------------------------------------------------------------

  return (
    <div style={{ minWidth: 470, minHeight: 400, position: "relative" }}>
      <div>
        <Typography
          variant="h6"
          style={{
            padding: "10px 15px",
            border: "solid 0px #f6f6f6",
            borderBottomWidth: 2,
            fontSize: 15,
          }}
        >
          {title}
        </Typography>
      </div>
      <Error error={error} />

      <LoadingSpinner show={loading} />

      {/* ---------------------------------------------------------------------- */}
      {deleteContent ? (
        <DeleteBox
          {...deleteContent}
          close={() => setDeleteContent(null)}
          remove={remove}
        />
      ) : (
        <div style={{ overflowY: "scroll", maxHeight: 309, paddingBottom: 50 }}>
          {(contentToDisplay || []).map((item) => {
            const name = isCommunity
              ? item.name
              : `${item.preferred_name} (${item.email})`;
            return (
              <OneDisplayItem
                name={name}
                triggerRemoveConfirmation={() =>
                  setDeleteContent({
                    ...item,
                    name: item.name || item.preferred_name,
                  })
                }
              />
            );
          })}
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      <Button
        variant="raised"
        color="primary"
        style={{
          width: "100%",
          marginLeft: "auto",
          padding: 10,
          borderRadius: 0,
          position: "absolute",
          bottom: 0,
          fontSize: 12,
        }}
        onClick={() => close && close()}
      >
        Close
      </Button>
      {/* ---------------------------------------------------------------------- */}
    </div>
  );
}

const mapStateToProps = (state) => {
  return { infos: state.getIn(["flagInfos"]) };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      keepInfoInRedux: reduxAddFlagInfo,
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListingComponent);

// --------------------------------------------------------------------------------

const DeleteBox = ({ name, close, remove }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "2% 20%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Typography variant="body1">
        Are you sure you want to remove{" "}
        <span>
          <b>"{name || "..."}"</b>
        </span>
      </Typography>
      <div style={{ display: "flex", flexDirection: "row", marginTop: 20 }}>
        <small
          onClick={() => close && close()}
          style={{ marginRight: 10, color: "#cb6565" }}
          className="touchable-opacity"
        >
          <b>No</b>
        </small>
        <small
          onClick={() => remove && remove()}
          style={{ color: "Green" }}
          className="touchable-opacity"
        >
          <b>Yes</b>
        </small>
      </div>
    </div>
  );
};

const OneDisplayItem = ({ name, triggerRemoveConfirmation }) => {
  return (
    <div
      style={{
        display: "flex",
        marginTop: 5,
        alignItems: "center",
        width: "100%",
        border: "solid 0px #f6f6f6",
        borderBottomWidth: 1,
        padding: "10px 15px",
      }}
    >
      <Typography variant="body2" style={{}}>
        {name || "..."}
      </Typography>

      <small
        style={{
          color: "#cb6565",
          fontWeight: "bold",
          marginLeft: "auto",
          fontSize: 11,
        }}
        className="touchable-opacity"
        onClick={() => triggerRemoveConfirmation && triggerRemoveConfirmation()}
      >
        <i className="fa fa-trash" style={{ margin: "0px 4px" }} />{" "}
        <span>Remove</span>
      </small>
    </div>
  );
};

const LoadingSpinner = ({ show }) => {
  if (!show) return <></>;

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <i
        className="fa fa-spinner fa-spin"
        style={{ fontSize: 22, padding: 10, color: "#AB47BC" }}
      />
    </div>
  );
};

const Error = ({ error }) => {
  if (!error) return <></>;
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="body2" style={{ color: "#bb4646" }}>
        {error}
      </Typography>
    </div>
  );
};
