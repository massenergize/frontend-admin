import React from "react";
import PBEntry from "./page-builder/PBEntry";
import { PROPERTY_TYPES } from "./page-builder/components/sidepanels/PBPropertyTypes";

function MEPageBuilderImplementation() {
  const openMediaLibrary = () => {
    console.log("I have opened the media library");
  };

  const overrideProperties = {
    [PROPERTY_TYPES.MEDIA]: (props) => {
      return <h3>Apuskeleke eee, apuskeleke eeee, apuskeleke wosik</h3>;
    }
  };
  return (
    <>
      <PBEntry
        propsOverride={overrideProperties}
        openMediaLibrary={openMediaLibrary}
        tinyKey={process.env.REACT_APP_TINY_MCE_KEY}
      />
    </>
  );
}

export default MEPageBuilderImplementation;
