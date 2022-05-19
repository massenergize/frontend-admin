import React, { Suspense, useState, useEffect } from "react";
import Modal from "./../modal/Modal";
import SidePane from "../sidepane/SidePane";
import Upload from "../upload/Upload";
import MLButton from "../button/MLButton";
import Cropping from "../cropping/Cropping";
const Library = React.lazy(() => import("../library/Library")); // so that library component only loads when needed

function MediaLibraryModal({
  multiple = true,
  close,
  onUpload,
  images,
  sourceExtractor,
  defaultTab,
  selected,
  getSelected,
  uploadMultiple,
  uploading,
  loadMoreFunction,
  limited,
  excludeTabs,
  useAwait,
  awaitSeconds,
  accept,
  extras,
}) {
  const [currentTab, setCurrentTab] = useState(defaultTab);
  const [showSidePane, setShowSidePane] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [files, setFiles] = useState([]);
  const [content, setSelectedContent] = useState(selected);
  const [state, setState] = useState({ uploading: uploading });
  const [loadingMore, setLoadingMore] = useState(false);
  const [shouldWait, setShouldWait] = useState(useAwait);

  const clean = (files) => {
    // just a function that retrieves only the FileObject from the file jsons provided
    if (!files) return files;
    return files.map((obj) => obj.file);
  };
  const handleUpload = () => {
    if (!onUpload) return;
    setState((prev) => ({ ...prev, uploading: true }));
    onUpload(clean(files), reset, close, setCurrentTab);
  };

  const handleInsert = () => {
    getSelected(content, reset);
    close();
  };

  const reset = () => {
    setPreviews([]);
    setFiles([]);
    setState({});
  };

  const fireLoadMoreFunction = () => {
    if (!loadMoreFunction) return;
    setLoadingMore(true);
    loadMoreFunction(() => setLoadingMore(false), close);
  };

  var Tabs = [
    {
      headerName: "Upload",
      key: "upload",
      component: (
        <Upload
          previews={previews}
          setPreviews={setPreviews}
          files={files}
          setFiles={setFiles}
          multiple={uploadMultiple}
          uploading={state.uploading}
          upload={handleUpload}
          accept={accept}
          extras={extras}
        />
      ),
    },
    {
      headerName: "Library",
      key: "library",
      component: (
        <Suspense fallback={<p>Loading...</p>}>
          <Library
            sourceExtractor={sourceExtractor}
            setSelectedContent={setSelectedContent}
            content={content}
            setShowSidePane={setShowSidePane}
            multiple={multiple}
            images={images}
            loadingMore={loadingMore}
            loadMoreFunction={fireLoadMoreFunction}
            limited={limited}
            shouldWait={shouldWait}
            setShouldWait={setShouldWait}
            awaitSeconds={awaitSeconds}
          />
        </Suspense>
      ),
    },
    { headerName: "Crop", key: "crop", component: <Cropping /> },
  ];

  Tabs = Tabs.filter((tab) => !(excludeTabs || []).includes(tab.key));

  useEffect(() => {}, [images, shouldWait]);

  const TabComponent = Tabs.find((tab) => tab.key === currentTab).component;
  const last = content.length - 1;
  const activeImage = (content || [])[last]; // if multiple selection is active, just show the last selected item in the side pane

  return (
    <React.Fragment>
      <Modal
        close={close}
        size="md"
        style={{
          minHeight: 680,
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 0,
        }}
        className="elevate-5"
      >
        <div style={{ position: "relative", height: "100%" }}>
          {showSidePane && (
            <SidePane
              activeImage={activeImage}
              setShowSidePane={setShowSidePane}
              sourceExtractor={sourceExtractor}
            />
          )}
          <div className="m-inner-container">
            <div className="m-title-bar">
              <h3 style={{ marginBottom: 0 }}>Media Library</h3>
              {/* --------------------- TAB HEADER AREA -------------- */}
              <div className="m-tab-header-area">
                {Tabs.map((tab) => {
                  const isCurrent = currentTab === tab.key;
                  return (
                    <div
                      key={tab.key}
                      className={`m-tab-header-item m-tab-header-item-${
                        isCurrent ? "selected" : "unselected"
                      }`}
                      onClick={() => {
                        setCurrentTab(tab.key);
                        setShowSidePane(false);
                      }}
                    >
                      <p style={{ margin: "15px 0px" }}>{tab.headerName}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ------------------------ MAIN TAB DISPLAY AREA ------------------- */}
            <div style={{ maxHeight: 530, overflowY: "scroll" }}>
              {TabComponent}
            </div>
          </div>
          <Footer
            images={images}
            files={files}
            content={content}
            multiple={multiple}
            cancel={close}
            insert={handleInsert}
          />
        </div>
      </Modal>
    </React.Fragment>
  );
}

const Footer = ({ content, cancel, insert, images }) => {
  const len = content && content.length;
  return (
    <div className="ml-footer">
      <h3
        style={{
          margin: 0,
          marginLeft: 10,
          color: "rgb(128 103 71)",
          fontSize: 12,
        }}
      >
        @massenergize
      </h3>
      {images && images.length && (
        <small style={{ fontWeight: "bold", marginLeft: 15 }}>
          [{(images && images.length) || 0} items]
        </small>
      )}
      <div style={{ marginLeft: "auto" }}>
        <MLButton backColor="maroon" btnColor="white" onClick={cancel}>
          CANCEL
        </MLButton>

        <button
          className="ml-footer-btn"
          style={{ "--btn-color": "white", "--btn-background": "green" }}
          onClick={(e) => {
            e.preventDefault();
            insert();
          }}
          disabled={!len}
        >
          INSERT {len > 0 ? `(${len})` : ""}
        </button>
      </div>
    </div>
  );
};

MediaLibraryModal.defaultProps = {
  multiple: true,
  images: [],
  defaultTab: "library",
  selected: [],
};
export default MediaLibraryModal;
