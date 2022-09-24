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
  oldInfos,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [flag, setFlag] = useState(null);
  // -------------------------------------------------------------------
  useEffect(() => {
    console.log("the id is here", id);
    if (!id) {
      setLoading(false);
      setError("Sorry, we could not load content related to this feature flag");
      return;
    }

    apiCall("/featureFlags.info", { id })
      .then((response) => {
        console.log("Here is the response", response);
        if (!response || !response.success)
          return console.log("FFBE_ERROR", response.error);
      })
      .catch((e) => console.log("FF_INFO_ERROR", e.toString()));
  }, []);
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
      <div style={{ overflowY: "scroll", maxHeight: 309, paddingBottom: 50 }}>
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <OneDisplayItem name={"Community - " + i} />
        ))}
      </div>

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
      >
        Close
      </Button>
      {/* ---------------------------------------------------------------------- */}
    </div>
  );
}

const mapStateToProps = (state) => {
  return { infos: state.flagInfos };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      addFlagToRedux: reduxAddFlagInfo,
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListingComponent);

// --------------------------------------------------------------------------------

const OneDisplayItem = ({ name }) => {
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
      <Typography variant="body2">{error}</Typography>
    </div>
  );
};
