import { useEffect } from "react";
import { useState } from "react";
import { connect, useSelector } from "react-redux";
import { bindActionCreators } from "redux";

function Feature({ name, fallback, children, auth, communities }) {
  const [flag, setFlag] = useState();

  useEffect(() => {
    const cf = ((communities || []).map((c) => c.feature_flags) || []).flat(); // Community Flags
    const uf = (auth || {}).feature_flags || []; // User Flags
    const together = [...cf, ...uf];
    let flags = [];
    const track = [];
    for (let f of together) {
      if (!track.includes(f.id)) {
        flags.push(f);
        track.push(f.id);
      }
    }
    let flag = (flags || []).find((f) => f?.key === name);
    setFlag(flag);
  }, []);

  console.log("Logging", flag);

  if (flag) return children;
  if (fallback) return fallback;
  return null;
}

const mapStateToProps = (state) => {
  return {
    communities: state.getIn(["communities"]),
    auth: state.getIn(["auth"]),
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Feature);
