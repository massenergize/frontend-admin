import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { fetchParamsFromURL } from "../../../utils/common";
import { LAST_VISITED } from "../../../utils/constants";

const WAIT_TIME = 20000; // 20 seconds
function ContinueWhereYouLeft() {
  const [savedURL, setSavedURL] = useState();
  const host = window.location.host;
  const url = localStorage.getItem(LAST_VISITED);
  const history = useHistory();

  const startExitTimer = () => {
    const currentLocation = window.location.href.split(host)[1];
    const weAreNoLongerOnDashboard = currentLocation !== "/";
    setTimeout(() => {
      // If the user got out of the dashboard page before the timer finished counting, this operation is no longer needed.
      if (weAreNoLongerOnDashboard) return;
      setSavedURL(null);
      history.push("/");
    }, WAIT_TIME);
  };
  useEffect(() => {
    // This value will be available right after login everytime (in the URL)
    let { atf } = fetchParamsFromURL(window.location, "atf");
    atf = atf === "true";
    // If there isnt any saved URL in local storage, dont bother!
    if (!url) return;
    // If there is a URL saved, make sure it isnt the same as the dashboard URL
    const isNotDashboard = url.split(host)[1] !== "/";
    // If it isnt the same as the dashboard link, then ask tthe user if they want to go back to that page
    // And start counting down to WAIT_TIME (The notification will be disabled when WAIT_TIME is reached)
    if (atf && isNotDashboard) {
      setSavedURL(url);
      startExitTimer();
    }
  }, []);

  if (!savedURL) return <></>;

  return (
    <div
      className="touchable-opacity"
      style={{
        display: "flex",
        alignItems: "center",
        background: "rgb(253 235 222)",
        color: "black",
        padding: "15px 20px",
        marginBottom: 20,
      }}
    >
      <Typography
        onClick={() => (window.location.href = url)}
        style={{ border: "dotted 0px black", borderBottomWidth: 2 }}
      >
        <b>
          Looks like you just signed in, want to continue where you last left
          off?
        </b>
      </Typography>{" "}
      <i style={{ marginLeft: 8 }} className=" fa fa-long-arrow-right" />
    </div>
  );
}

export default ContinueWhereYouLeft;
