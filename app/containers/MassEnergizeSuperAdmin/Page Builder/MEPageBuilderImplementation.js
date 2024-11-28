import React, { useCallback, useEffect, useMemo, useState } from "react";
import PBEntry from "./page-builder/PBEntry";
import { PBImageSelector, PROPERTY_TYPES } from "./page-builder/components/sidepanels/PBPropertyTypes";
import MediaLibrary from "../ME  Tools/media library/MediaLibrary";
import { useSelector } from "react-redux";
import AdminPageBuilderSettings from "./AdminPageBuilderSettings";
import AdminPublishConfirmationDialog from "./AdminPublishConfirmationDialog";
import { useApiRequest, useSimpleRequest } from "../../../utils/hooks/useApiRequest";
import { fetchParamsFromURL, getHumanFriendlyDate } from "../../../utils/common";
import Loading from "dan-components/Loading";
import { apiCall } from "../../../utils/messenger";
function MEPageBuilderImplementation() {
  // const imagesObject = useSelector((state) => state.getIn(["galleryImages"]));
  const admin = useSelector((state) => state.getIn(["auth"]));
  const [builderContent, setPageBuilderContent] = useState({});

  const [fetchImages, loadedImages, e, l, se, sl, updateImages] = useSimpleRequest({
    url: "/gallery.search",
    body: { my_uploads: true }
  });
  const [saveNewImage, _, __, saveLoading] = useSimpleRequest({ url: "/gallery.add" });
  const [fetchPage, page, error, loading, setError, setValue, setData] = useSimpleRequest({
    url: "/community.custom.pages.info"
  });
  const [savePageFunction] = useSimpleRequest({ url: "/community.custom.pages.update" });

  // -------------------------------------------------- FUNCTIONS ------------------------------------------------

  const { pageId } = fetchParamsFromURL(window.location, "pageId");

  const renderPageSettings = useCallback(() => {
    return <AdminPageBuilderSettings sections={builderContent?.sections} data={page} updateData={setData} />;
  }, [page, setData, builderContent?.sections]);

  useEffect(() => {
    fetchImages();
    if (!pageId) return;
    fetchPage({ id: pageId });
  }, []);

  const uploadMedia = useCallback(
    (props) => {
      const { files, setNotification, insertSelectedImages } = props || {};
      const file = (files || [])[0];
      const body = {
        user_id: admin?.id,
        file,
        community_ids: []
      };
      saveNewImage(body, (response) => {
        const image = response?.data?.image;
        if (image) {
          insertSelectedImages([response?.data?.image]);
          updateImages({ ...loadedImages, images: [image, ...loadedImages?.images] });
        }
        // if (response?.error) return setNotification({ type: "error", message: response?.error });
      });
    },
    [admin?.id?.toString(), loadedImages]
  );

  const listOfImages = useMemo(() => loadedImages?.images || [], [loadedImages?.images]);
  const overrideProperties = useMemo(
    () => ({
      [PROPERTY_TYPES.MEDIA]: (props) => {
        const { onPropertyChange, itemProps } = props || {};

        return (
          <MediaLibrary
            onUpload={uploadMedia}
            // excludeTabs={[MediaLibrary.Tabs.UPLOAD_TAB]}
            images={listOfImages}
            onInsert={(item) => {
              const [image] = item || [];
              if (!image) return console.log("Did not select any image...");
              onPropertyChange({
                blockId: props?.blockId,
                prop: { ...(itemProps || {}), value: image?.url, rawValue: image?.url }
              });
            }}
            customRender={({ openLibrary }) => {
              if (!listOfImages || saveLoading)
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
    [listOfImages, saveLoading]
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
    [page]
  );
  const builderOverrides = useMemo(
    () => ({
      modals: {
        [PBEntry.PUBLISH_CONFIRMATION_DIALOG_MODAL_KEY]: (props) => (
          <AdminPublishConfirmationDialog {...props || {}} data={page} />
        )
      }
    }),
    [page?.page]
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

  // if (error) {
  //   return (
  //     // <div style={{ color: "red", padding: 20, borderRadius: 10, textAlign: "center" }}>
  //     //   <h6> Error: {error} </h6>
  //     // </div>
  //     <p className={`pb-canvas-notification pb-dangerous`}>
  //       {error}{" "}
  //       <i className="fa fa-times touchable-opacity" style={{ marginLeft: "auto" }} onClick={() => setError(null)} />
  //     </p>
  //   );
  //   // console.log("Error: ", error);
  // }

  return (
    <>
      {error && (
        <div
          style={{
            width: "100%",
            position: "fixed",
            top: 10,
            zIndex: "30000",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <p
            className={`elevate-float`}
            style={{
              fontWeight: "bold",

              padding: "10px 20px",
              color: "#c14e4e",
              backgroundColor: "#ff000014",
              borderRadius: 5,
              width: "fit-content",
              marginLeft: "-21%"
            }}
          >
            {/* Lets see what the error will look like */}
            {error}{" "}
            <i className="fa fa-times touchable-opacity" style={{ marginLeft: 10 }} onClick={() => setError(null)} />
          </p>
        </div>
      )}
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
