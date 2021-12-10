import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

export const SideSheet = (props) => {
  return (
    <div>
      <h1>I am the bottom sheet</h1>
    </div>
  );
};

SideSheet.propTypes = {
  props: PropTypes,
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideSheet);
