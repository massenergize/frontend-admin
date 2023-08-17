import { Typography } from "@mui/material";
import React from "react";
import { connect } from "react-redux";

export const FilterBarForMediaLibrary = (props) => {
  return (
    <div style={{ padding: "0px 27px" }}>
      <div
        style={{
          padding: "15px 20px",
          background: "navajowhite",
          border: "solid 2px antiquewhite",
        }}
      />
      <Typography variant="body2" color="#b2b2b2">
        Items below are sorted by date. The most recent items show up first!
      </Typography>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterBarForMediaLibrary);
