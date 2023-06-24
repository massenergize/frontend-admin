import React, { useEffect } from "react";
import useIsActive from "../../utils/hooks/isActiveHook";

function UserActivityMonitor({ children, onStateChange, minutes }) {
  const waitTime = (minutes || 1) * 60 * 1000
  const isActive = useIsActive(waitTime);

  useEffect(() => {
    onStateChange && onStateChange(isActive);
  }, [isActive]);
  return <>{children}</>;
}

export default UserActivityMonitor;
