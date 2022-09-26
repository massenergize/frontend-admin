import { Button, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { reduxAddFlagInfo } from "../../../redux/redux-actions/adminActions";
import { apiCall } from "../../../utils/messenger";

function ListingComponent({
  id,
  title = "Communities below have the Guest Authentication active",
  keepInfoInRedux,
  infos,
  close,
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState(null); // The full version of the ff that has been loaded from the api is put here
  const [deleteContent, setDeleteContent] = useState(null); // The item that is in focus for deletion, is put here

  const communities = (content || {}).communities;
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
    //-------------------------------------------------

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
    data = (content || {}).communities;
    data = data.filter((it) => it.id !== id);
    const newContent = { ...content, communities: data };
    setDeleteContent(null);
    setContent(newContent);
    const newInfos = { ...infos, [newContent.id]: newContent };
    keepInfoInRedux(newInfos);
    // Now send api request here
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
          {(communities || []).map((item) => (
            <OneDisplayItem
              name={item.name}
              triggerRemoveConfirmation={() => setDeleteContent(item)}
            />
          ))}
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
