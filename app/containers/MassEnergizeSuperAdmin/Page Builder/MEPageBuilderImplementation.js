import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  // const customPages = useSelector((state) => state.getIn(["customPagesList"]));
  const admin = useSelector((state) => state.getIn(["auth"]));
  const [builderContent, setPageBuilderContent] = useState({});

  const [requestHandler, pageSaveHandler, mediaRequestHandler] = useApiRequest([
    { key: "findPages", url: "/community.custom.pages.info" },
    { key: "saveOrUpdate", url: "/community.custom.pages.update" },
    { key: "addMedia", url: "/gallery.add" }
  ]);
  const [fetchPage, page, error, loading, setError, setValue, setData] = requestHandler || [];
  const [savePageFunction] = pageSaveHandler || [];
  const [saveNewImage] = mediaRequestHandler || [];

  const { pageId } = fetchParamsFromURL(window.location, "pageId");

  const renderPageSettings = useCallback(() => {
    return <AdminPageBuilderSettings sections={builderContent?.sections} data={page} updateData={setData} />;
  }, [page, setData, builderContent?.sections]);

  useEffect(() => {
    if (!pageId) return;
    fetchPage({ id: pageId });
  }, []);

  console.log("PAGE", page);

  const uploadMedia = useCallback(
    (props) => {
      const { files, setNotification } = props || {};
      const file = (files || [])[0];
      console.log("The props from media", props);
      const body = {
        user_id: admin?.id,
        file, 
        community_ids: []
      };
      saveNewImage(body, (response) => {
        console.log("HERE IS THE RESPONSE AFTER UPLAOD", response);
        if (response?.error) return setNotification({ type: "error", message: response?.error });
      });
    },
    [admin]
  );

  const overrideProperties = useMemo(
    () => ({
      [PROPERTY_TYPES.MEDIA]: (props) => {
        const { onPropertyChange, itemProps } = props || {};

        return (
          <MediaLibrary
            onUpload={uploadMedia}
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
    }),
    [imagesObject?.images?.toString()]
  );

  const saveToBackend = useCallback(
    (props) => {
      const { pruneSections } = PBEntry.Functions;
      const { sections, notify, openPageSettings, setLoading } = props || {};
      const id = page?.page?.id;
      if (!id) {
        console.log("User is creating for the first time...");
        notify({ type: "error", message: "Please provide a name for the page (Page Configuration)" });
        return openPageSettings();
      }
      const mapped = pruneSections(sections);
      notify();
      setLoading(true);
      const body = { id, content: JSON.stringify(mapped) };
      savePageFunction(body, (response) => {
        setLoading(false);
        if (!response?.success) return notify({ type: "error", message: response?.error });
        notify({ type: "success", message: "Page saved successfully!" });
        setData(response?.data);
      });
    },
    [page?.toString()]
  );
  const builderOverrides = useMemo(
    () => ({
      modals: {
        [PBEntry.PUBLISH_CONFIRMATION_DIALOG_MODAL_KEY]: (props) => (
          <AdminPublishConfirmationDialog {...props || {}} data={page} />
        )
      }
    }),
    [page?.page?.toString()]
  );

  const publishPage = ({ defaultFunction }) => {
    if (!page?.page?.id) return console.log("Please create a page first...");
    defaultFunction && defaultFunction();
  };
  const footerOverrides = useMemo(
    () => ({
      save: saveToBackend,
      publish: publishPage
    }),
    [saveToBackend]
  );

  const publishedProps = useMemo(
    () => ({
      published_at: getHumanFriendlyDate(page?.page?.latest_version?.created_at, true, false),
      published_link: null // TODO: change this when you have the link preview setup
    }),
    [page?.page]
  );
  // -------------------------------------------------- RENDER ------------------------------------------------
  if (loading) return <Loading />;

  if (error) console.log("Error: ", error);

  return (
    <>
      <PBEntry
        onChange={setPageBuilderContent}
        data={{ content: PBEntry.Functions.reconfigurePruned(page?.page?.content) }}
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
