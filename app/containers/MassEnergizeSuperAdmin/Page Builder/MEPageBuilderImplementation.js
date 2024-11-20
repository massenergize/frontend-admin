import React from "react";
import PBEntry from "./page-builder/PBEntry";
import { PBImageSelector, PROPERTY_TYPES } from "./page-builder/components/sidepanels/PBPropertyTypes";
import MediaLibrary from "../ME  Tools/media library/MediaLibrary";
import { useSelector } from "react-redux";
import AdminPageBuilderSettings from "./AdminPageBuilderSettings";
import AdminPublishConfirmationDialog from "./AdminPublishConfirmationDialog";

function MEPageBuilderImplementation() {
  const imagesObject = useSelector((state) => state.getIn(["galleryImages"]));
  const openMediaLibrary = () => {
    console.log("I have opened the media library");
  };

  const renderPageSettings = () => {
    return <AdminPageBuilderSettings />;
  };
  const fetchMediaItems = () => {};

  const overrideProperties = {
    [PROPERTY_TYPES.MEDIA]: (props) => {
      const { onPropertyChange, itemProps } = props || {};

      return (
        <MediaLibrary
          excludeTabs={[MediaLibrary.Tabs.UPLOAD_TAB]}
          images={imagesObject?.images}
          onInsert={(item) => {
            const [image] = item || [];
            if (!image) return console.log("Did not select any image...");
            onPropertyChange({
              blockId: props?.blockId,
              prop: { ...(itemProps || {}), value: image?.url, rawValue: image?.url }
            });
          }}
          customRender={({ openLibrary }) => {
            if (!imagesObject?.images)
              return (
                <div
                  style={{
                    color: "#29d",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    margin: "10px 0px",
                    fontWeight: "bold"
                  }}
                >
                  <div>
                    {" "}
                    <i className="fa fa-spinner fa-spin" />
                  </div>

                  <small>
                    <b>Just a moment...</b>
                  </small>
                </div>
              );
            return (
              <>
                <PBImageSelector
                  {...props}
                  remove={() =>
                    onPropertyChange &&
                    onPropertyChange({
                      blockId: props?.blockId,
                      prop: { ...(itemProps || {}), value: "", rawValue: "" }
                    })
                  }
                  src={itemProps?.value}
                  openMediaLibrary={() => openLibrary(true)}
                />
              </>
            );
          }}
        />
      );
    }
  };

  const builderOverrides = {
    modals: {
      [PBEntry.PAGE_SETTINGS_MODAL_KEY]: () => <AdminPublishConfirmationDialog />
    }
  };
  
  return (
    <>
      <PBEntry
        renderPageSettings={renderPageSettings}
        propsOverride={overrideProperties}
        builderOverrides={builderOverrides}
        // openMediaLibrary={openMediaLibrary}
        tinyKey={process.env.REACT_APP_TINY_MCE_KEY}
      />
    </>
  );
}

export default MEPageBuilderImplementation;
