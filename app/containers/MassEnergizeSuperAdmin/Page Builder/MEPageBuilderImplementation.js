import React from "react";
import PBEntry from "./page-builder/PBEntry";
import { PBImageSelector, PROPERTY_TYPES } from "./page-builder/components/sidepanels/PBPropertyTypes";
import MediaLibrary from "../ME  Tools/media library/MediaLibrary";

function MEPageBuilderImplementation() {
  const openMediaLibrary = () => {
    console.log("I have opened the media library");
  };

  const overrideProperties = {
    [PROPERTY_TYPES.MEDIA]: (props) => {
      return (
        <MediaLibrary
          customRender={({ openLibrary }) => {
            return <PBImageSelector {...props} openMediaLibrary={() => openLibrary(true)} />;
          }}
        />
      );
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
