import React from "react";
import PropTypes from "prop-types";

import "./Modal.css";
const getSize = (size, custom) => {
  switch (size) {
    case "lg":
      return "80%";
    case "md":
      return "60%";
    case "sm":
      return "40%";
    case "xs":
      return "25%";
    case "custom":
      return custom;

    default:
      return "60%";
  }
};
function Modal(props) {
  const {
    size,
    customSize,
    sizeValue,
    style,
    className,
    close,
    children,
    showOverlay,
  } = props;
  return (
    <>
      {showOverlay && <Curtain close={close} />}
      <div className="m-container">
        <div
          className={`m-content-wrapper elevate-1 ml-modal-scale-in ${className}`}
          style={{
            "--modal-width-size": getSize(
              customSize ? "custom" : size,
              customSize && sizeValue
            ),
            ...style,
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}

const Curtain = ({ close }) => {
  return (
    <div
      className="ghost-curtain"
      onClick={() => (close ? close() : null)}
    ></div>
  );
};
Modal.propTypes = {
  size: PropTypes.string,
  customSize: PropTypes.bool,
  /**
   * Indicate width size as a percentage
   */
  sizeValue: PropTypes.string,
  showOverlay: PropTypes.bool,
};

Modal.defaultProps = {
  size: "sm",
  sizeValue: "",
  customSize: false,
  style: {},
  className: "",
  showOverlay: true,
};

export default Modal;
