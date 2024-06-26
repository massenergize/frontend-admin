import { connect, useSelector } from "react-redux";
import { bindActionCreators } from "redux";

function Feature({ name, fallback, children, auth, community }) {
  const communityFeatureFlags = useSelector((state) => state.getIn(["communityFeatureFlags"]));
  const loggedInUserFeatureFlags = (auth || {})?.feature_flags || [];

  let flags = [...loggedInUserFeatureFlags, ...(communityFeatureFlags || [])];

  flags = [...flags.reduce((map, flag) => map.set(flag.key, flag), new Map()).values()];

  const flag = (flags || []).find((f) => f?.key === name);

  if (auth?.is_super_admin) return children;

  if (flag && !community) return children;

  const enabledForCommunity = flag?.communities?.find((id) => id === community?.id);
  if (enabledForCommunity) return children;

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
