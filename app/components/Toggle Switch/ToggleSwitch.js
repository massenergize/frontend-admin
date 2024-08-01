import React, { useEffect, useState } from "react";
import "./toggle-switch.css";

const ToggleSwitch = ({ onChange, ON }) => {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => {
    const state = !isOn;
    setIsOn(state);
    onChange && onChange(state);
  };

  useEffect(() => {
    setIsOn(ON);
  }, []);

  return (
    <div className={`toggle-switch ${isOn ? "on" : "off"}`} onClick={toggleSwitch} style={{ marginRight: 10 }}>
      <div className="switch-handle elevate-1"></div>
    </div>
  );
};

export default ToggleSwitch;
