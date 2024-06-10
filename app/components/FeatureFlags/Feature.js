import { useEffect } from "react";
import { useState } from "react";
import { connect, useSelector } from "react-redux";
import { bindActionCreators } from "redux";

function Feature({ name, fallback, children, auth }) {
  const communityFeatureFlags = useSelector((state) => state.getIn(["communityFeatureFlags"]));
  const loggedInUserFeatureFlags = (auth || {})?.feature_flags || [];

  let flags = [...loggedInUserFeatureFlags, ...(communityFeatureFlags || [])];
  flags = Array.from(new Set(flags?.map(flag => JSON.stringify(flag))))?.map(flag => JSON.parse(flag));

  const flag = (flags || []).find((f) => f?.key === name);

  if (auth?.is_super_admin) return children;

  if (flag) return children;
  if (fallback) return fallback;
  return null;
}

const mapStateToProps = (state) => {
  return {
    // communities: state.getIn(["communities"]),
    auth: state.getIn(["auth"])
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Feature);
