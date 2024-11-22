import React, { useCallback, useEffect } from "react";
import PBEntry from "./page-builder/PBEntry";
import { PBImageSelector, PROPERTY_TYPES } from "./page-builder/components/sidepanels/PBPropertyTypes";
import MediaLibrary from "../ME  Tools/media library/MediaLibrary";
import { useSelector } from "react-redux";
import AdminPageBuilderSettings from "./AdminPageBuilderSettings";
import AdminPublishConfirmationDialog from "./AdminPublishConfirmationDialog";
import { useApiRequest } from "../../../utils/hooks/useApiRequest";
import { fetchParamsFromURL, getHumanFriendlyDate } from "../../../utils/common";
import Loading from "dan-components/Loading";
function MEPageBuilderImplementation() {
  const imagesObject = useSelector((state) => state.getIn(["galleryImages"]));
  const customPages = useSelector((state) => state.getIn(["customPagesList"]));
  const [requestHandler] = useApiRequest([{ key: "findPages", url: "/community.custom.pages.info" }]);

  const [fetchPage, page, error, loading, setError, setValue, setData] = requestHandler || [];

  const { pageId } = fetchParamsFromURL(window.location, "pageId");

  const renderPageSettings = useCallback(() => {
    return <AdminPageBuilderSettings data={page} updateData={setData} />;
  }, [page, setData]);

  useEffect(() => {
    if (!pageId) return;
    fetchPage({ id: pageId });
  }, []);

  console.log("LE PAGE", page);

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

  const saveToBackend = (props) => {
    const { pruneProperties } = PBEntry.Functions;
    const { sections, notify } = props || {};
    const mapped = sections.map((section) => {
      const { options } = section || {};
      const grouped = pruneProperties(section?.block?.properties);
      return { ...section, properties: null, options: { ...options, _propertValues: grouped } };
    });

    notify({ type: "error", message: "Y'all just be clicking me any how, what's your problem?" });

    console.log("These are the mapped sections", mapped);
  };
  const builderOverrides = {
    modals: {
      [PBEntry.PUBLISH_CONFIRMATION_DIALOG_MODAL_KEY]: () => <AdminPublishConfirmationDialog />
    }
  };

  const footerOverrides = {
    save: saveToBackend
  };
  if (loading) return <Loading />;

  if (error) console.log("Error: ", error);

  const publishedProps = {
    published_at: getHumanFriendlyDate(page?.page?.latest_version?.created_at),
    published_link: null // TODO: change this when you have the link preview setup
  };
  return (
    <>
      <PBEntry
        renderPageSettings={renderPageSettings}
        propsOverride={overrideProperties}
        builderOverrides={builderOverrides}
        publishedProps={publishedProps}
        tinyKey={process.env.REACT_APP_TINY_MCE_KEY}
        footerOverrides={footerOverrides}
      />
    </>
  );
}

export default MEPageBuilderImplementation;
