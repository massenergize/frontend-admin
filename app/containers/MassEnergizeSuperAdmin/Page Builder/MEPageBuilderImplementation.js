import React from "react";
import PBEntry from "./page-builder/PBEntry";

function MEPageBuilderImplementation() {
  return (
    <>
      <PBEntry tinyKey = {process.env.REACT_APP_TINY_MCE_KEY} />
    </>
  );
}

export default MEPageBuilderImplementation;
