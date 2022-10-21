import { Button, Paper, Typography } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getHumanFriendlyDate } from "../../../utils/common";
import ImageThumbnail from "../ME  Tools/media library/shared/components/thumbnail/ImageThumbnail";

function EventFullView({ events }) {
  console.log("I think its events", events);
  const event = (events || [])[2];

  const {
    name,
    community,
    description,
    featured_summary,
    image,
    end_date_and_time,
    start_date_and_time,
    location,
    tags,
  } = event || {};
  const tagString = (tags || []).map((t) => t.name).join(", ");
  const { address, city, state, zipcode, unit } = location || {};
  return (
    <div>
      <Paper style={{ marginBottom: 10 }}>
        <div style={{ padding: "15px 25px" }}>
          <Typography variant="h5">{name || "..."}</Typography>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" style={{ marginRight: 15, fontSize: 17 }}>
              {getHumanFriendlyDate(start_date_and_time, true, false)}
            </Typography>
            <hr
              style={{
                width: 100,
                // border: "dotted 0px #e3e3e3",
                border: "dotted 0px #00bcd4",
                borderBottomWidth: 4,
              }}
            />

            <Typography variant="h6" style={{ marginLeft: 15, fontSize: 17 }}>
              {getHumanFriendlyDate(end_date_and_time, true, false)}
            </Typography>
            <Typography
              variant="h6"
              color="primary"
              style={{ marginLeft: "auto" }}
            >
              {(community && community.name) || "..."}
            </Typography>
          </div>
          {location && (
            <div>
              <Typography variant="caption" color="grey">
                LOCATION
              </Typography>
              <Typography variant="body1">
                {address || ""}
                <br />
                {`${state || ""} ${city || ""} ${unit || ""} ${zipcode || ""}`}
              </Typography>
            </div>
          )}
        </div>
        <Footer />
      </Paper>

      <Paper>
        <div style={{ padding: "15px 25px" }}>
          <div style={{ marginBottom: 10 }}>
            <Typography variant="h6">FEATURED SUMMARY</Typography>
            <div dangerouslySetInnerHTML={{ __html: featured_summary }} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <Typography variant="h6">TAGS</Typography>
            <Typography variant="body2">{tagString}</Typography>
          </div>
          <div style={{ marginBottom: 10 }}>
            <img
              src={(image || {}).url}
              style={{ width: "100%", maxHeight: 400, objectFit: "contain" }}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <Typography variant="h6">DESCRIPTION</Typography>
            <div dangerouslySetInnerHTML={{ __html: description }} />
          </div>
        </div>
        <Footer />
      </Paper>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    events: state.getIn(["allEvents"]),
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventFullView);

const Footer = () => {
  return (
    <div style={{ background: "#fbfbfb", display: "flex" }}>
      <Button
        variant="contained"
        color="secondary"
        className="touchable-opacity"
        style={{
          borderRadius: 0,
          padding: 10,
          width: 200,
          background: "#d97c7c",
        }}
      >
        <i className="fa fa-long-arrow-left" style={{ marginRight: 6 }} /> Back
      </Button>
      <div style={{ marginLeft: "auto" }}>
        <Button
          variant="contained"
          color="secondary"
          style={{
            borderRadius: 0,
            padding: 10,
            width: 200,
          }}
        >
          Edit Event
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{
            borderRadius: 0,
            padding: 10,
            width: 200,
          }}
        >
          Copy Event
        </Button>
      </div>
    </div>
  );
};
