import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./MediaLibrary.css";
import MLButton from "./shared/components/button/MLButton";
import MediaLibraryModal from "./shared/components/library modal/MediaLibraryModal";
import ImageThumbnail from "./shared/components/thumbnail/ImageThumbnail";
import { DEFFAULT_MAX_SIZE, IMAGE_QUALITY, libraryImage, TABS } from "./shared/utils/values";
import { EXTENSIONS, functionsToExport } from "./shared/utils/utils";
function MediaLibrary(props) {
  const {
    actionText,
    selected,
    sourceExtractor,
    onInsert,
    multiple,
    openState,
    onStateChange,
    images,
    defaultTab,
    dragToOrder,
    floatingMode,
    passedNotification,
    handleCropFromLink,
    uploadMultiple,
    customRender
  } = props;
  const [show, setShow] = useState(false);
  const [imageTray, setTrayImages] = useState([]);
  const [state, setState] = useState({});
  const [hasMounted, setHasMountedTo] = useState(undefined);
  const [cropped, setCropped] = useState({}); // all items that have been cropped are saved in this object, E.g. idOfParentImage: CroppedContent
  const [cropLoot, setCropLoot] = useState(null); // Where item to be cropped is temporarily stored and managed in  the cropping tab
  const [currentTab, setCurrentTab] = useState(defaultTab);
  const [files, setFiles] = useState([]); // all files that have been selected from user's device [Schema: {id, file}]
  const [croppedSource, setCroppedSource] = useState();
  const [notification, setNotification] = useState(null); // just used to communicate when the mlib is working on something(that isnt the typical 'loading' state), and the user needs to be updated
  const [previews, setPreviews] = useState([]);
  // --------------------------------------------------
  const oldPosition = useRef(null);
  const newPosition = useRef(null);
  // --------------------------------------------------

  const finaliseCropping = () => {
    if (!cropLoot) return;
    const { source } = cropLoot;
    setCropped({ ...(cropped || {}), [source.id.toString()]: croppedSource });
    setCurrentTab(TABS.UPLOAD_TAB);
    return false;
  };

  const switchToCropping = (content, options = {}) => {
    const { external } = options || {};
    const loot = { source: content, image: content && content.src };
    setCropLoot(loot);
    setShow(true);
    setCurrentTab("crop");
    if (external) fitIntoNormalFlow(content);
  };

  const fitIntoNormalFlow = (content) => {
    // The function makes sure the image Obj that has been created from an external link is
    // put into the file & preview trays, so that it follows normal procedure.
    // (The function is used when cropping from Link)
    if (uploadMultiple) {
      const func = (im) => im.id !== content.id;
      const filesRem = files.filter(func);
      const prevRem = previews.filter(func);
      setFiles([content, ...filesRem]);
      setPreviews([content, ...prevRem]);
    } else {
      content = [content];
      setFiles(content);
      setPreviews(content);
    }
  };
  const transfer = (content, reset) => {
    if (onInsert) return onInsert(content, reset);
  };

  const handleSelected = (content, reset) => {
    setTrayImages(content);
    setState((prev) => ({ ...prev, resetor: reset }));
    transfer(content, reset);
  };

  const remove = (id) => {
    const rest = imageTray.filter((itm) => itm.id !== id);
    setTrayImages(rest);
    transfer(rest, state.resetor);
  };

  useEffect(() => {
    setShow(openState);
  }, [openState]);

  useEffect(() => {
    const isMountingForTheFirstTime = hasMounted === undefined;
    if (!onStateChange || isMountingForTheFirstTime) return;
    onStateChange({ show, state });
  }, [show, state]);

  useEffect(() => {
    setHasMountedTo(true);
    const imagesMap = new Map(images.map((item) => [item.id, item]));
    const selectedAndExists = selected?.map((item) => imagesMap.get(item.id)).filter(Boolean) || [];
    setTrayImages(selectedAndExists);
  }, [selected?.toString(), images?.toString()]); // TO make sure selected, and images actually change before updating the tray

  // useEffect(() => {}, [cropped]);

  useEffect(() => {
    setNotification(passedNotification);
  }, [passedNotification]);

  const close = () => {
    setShow(false);
    setFiles([]);
  };

  const swapPositions = () => {
    const prev = oldPosition.current;
    const next = newPosition.current;

    if (prev === null || next === null) return;
    const images = [...(imageTray || [])];
    const image = images.splice(prev, 1)[0];
    images.splice(next, 0, image);
    handleSelected(images);
  };

  const renderSelectedItems = ({ show, imageTray }) => {
    if (customRender)
      return customRender({
        open: show,
        openLibrary: setShow,
        selected: imageTray
      });
    return (
      !floatingMode && (
        <div
          style={{
            width: "100%",
            minHeight: 380,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            border: "dashed 2px #e3e3e3",
            borderRadius: 10,
            marginBottom: 20,
            padding: 20
          }}
        >
          {!imageTray || imageTray.length === 0 ? (
            <img src={libraryImage} style={{ height: 150 }} />
          ) : (
            <ImageTray
              sourceExtractor={sourceExtractor}
              content={imageTray}
              remove={remove}
              multiple={multiple}
              dragToOrder={dragToOrder}
              oldPosition={oldPosition}
              newPosition={newPosition}
              swapPositions={swapPositions}
              switchToCropping={switchToCropping}
              handleCropFromLink={handleCropFromLink}
            />
          )}

          <div
            onClick={(e) => {
              e.preventDefault();
              setShow(true);
            }}
            className={`ml-footer-btn `}
            style={{
              "--btn-color": "white",
              "--btn-background": "green",
              borderRadius: 5,
              marginTop: 20,
              padding: "15px 40px"
            }}
          >
            {actionText}
          </div>
        </div>
      )
    );
  };

  return (
    <React.Fragment>
      {show && (
        <div
          style={{
            position: "fixed",
            zIndex: "1500",
            top: 0,
            left: 0
          }}
        >
          <MediaLibraryModal
            {...props}
            notification={notification}
            setNotification={setNotification}
            // images={addPreselectedImagesToList()}
            close={close}
            getSelected={handleSelected}
            selected={imageTray}
            cropLoot={cropLoot}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            switchToCropping={switchToCropping}
            files={files}
            setFiles={setFiles}
            cropped={cropped}
            setCropped={setCropped}
            setCroppedSource={setCroppedSource}
            croppedSource={croppedSource}
            finaliseCropping={finaliseCropping}
            previews={previews}
            setPreviews={setPreviews}
          />
        </div>
      )}
      {renderSelectedItems({ show, imageTray })}
    </React.Fragment>
  );
}

// ----------------------------------------------------------
const ImageTray = ({
  sourceExtractor,
  remove,
  content,
  dragToOrder,
  newPosition,
  oldPosition,
  swapPositions,
  switchToCropping,
  handleCropFromLink
}) => {
  return (
    <>
      {dragToOrder && (
        <center>
          <small>Rearrange selected images in your preferred order, by dragging them</small>
        </center>
      )}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          width: "100%",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {content.map((img, index) => {
          const src = sourceExtractor ? sourceExtractor(img) : img.url;
          return (
            <React.Fragment key={index.toString()}>
              <TrayImage
                src={src}
                id={img.id}
                remove={remove}
                index={index}
                setOldPosition={() => (oldPosition.current = index)}
                setNewPosition={() => (newPosition.current = index)}
                onDragEnd={() => swapPositions()}
                dragToOrder={dragToOrder}
                switchToCropping={switchToCropping}
                handleCropFromLink={handleCropFromLink}
              />
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};
// ----------------------------------------------------------

/**
 *
 * Component that shows a preview of the image that a user has selected
 * @returns
 */
const TrayImage = (props) => {
  const {
    src,
    remove,
    id,
    setOldPosition,
    setNewPosition,
    onDragEnd,
    dragToOrder,
    switchToCropping,
    handleCropFromLink
  } = props;
  const [loading, setLoading] = useState(false);
  const cssOptions = dragToOrder ? {} : { pointerEvents: "none" };

  const cropFromLink = (imageObj) => {
    if (!handleCropFromLink) return;
    setLoading(true);
    handleCropFromLink(imageObj, (base64String) => {
      setLoading(false);
      if (!base64String) return;
      const content = createCropData(base64String);
      switchToCropping(content, { external: true });
    });
  };

  const createCropData = (base64String) => {
    const { getRandomStringKey, toFile, getFileSize } = MediaLibrary.Functions;
    const file = toFile(base64String);
    const content = {
      id: getRandomStringKey(),
      file,
      src: base64String,
      size: getFileSize(file)
    };
    return content;
  };

  return (
    <div className="ml-tray-image">
      <img
        src={src}
        className="ml-preview-image elevate-float"
        style={{ "--mouse-type": "move", ...cssOptions }}
        draggable
        onDragStart={() => setOldPosition()}
        onDragEnter={() => setNewPosition()}
        onDragOver={(e) => e.preventDefault()}
        onDragEnd={onDragEnd}
      />
      <div style={{ display: "flex", flexDirection: "row" }}>
        <small className="ml-prev-el-remove" onClick={() => remove(id)}>
          Remove
        </small>
        {loading ? (
          <small style={{ marginLeft: 6 }}>
            <i className="fa fa-spinner fa-spin" /> One moment...
          </small>
        ) : (
          <small
            className="ml-prev-el-remove"
            style={{ color: "blue", marginLeft: 6 }}
            onClick={() => cropFromLink(props)}
          >
            Crop
          </small>
        )}
      </div>
    </div>
  );
};

MediaLibrary.propTypes = {
  /**
   * @param images
   * Function that retrieves all selected images out of the component  */
  onInsert: PropTypes.func,

  /**
   * @param files
   * @param reset Provides a function that will reset the component
   * @param close Provides a function to close the modal
   * @param tabChanger Provides a function that will allow you to change tab outside the component
   * Function that should run to upload selected files to backend */
  onUpload: PropTypes.func,
  /**
   * Array of images to be shown in the library
   */
  images: PropTypes.arrayOf(PropTypes.object).isRequired,

  /**
   determines if user will be allowed to select multiple images from library
   */
  uploadMultiple: PropTypes.bool,
  /**
   * Sets whether multiple images should be selected for upload. select multiple images from the library
   */
  multiple: PropTypes.bool,
  /**
   * A function that is used to extract the  URL of each image
   */
  sourceExtractor: PropTypes.func,
  /**
   * List of images to show as preselected items in the library. Should be an array if multiple = true, and not an array if multiple = false
   */
  selected: PropTypes.arrayOf(PropTypes.object),

  /**
   * Custom text that should show on media library modal trigger button
   */
  actionText: PropTypes.string,

  /**
   * A function to load more images into library
   */
  loadMoreFunction: PropTypes.func,

  /**
   *  Determines whether or not "load more " functionality should be allowed
   */
  limited: PropTypes.bool,
  /**
   * Keys of tabs to exclude from media library modal dialog
   */
  excludeTabs: PropTypes.arrayOf(PropTypes.string),

  /**
   * Rendering images and animating modal causes lag. This boolean value tells the library to wait before rendering the images
   */
  useAwait: PropTypes.bool,
  /**
   * Milliseconds to wait before rendering images
   */
  awaitSeconds: PropTypes.number,

  /**
   * Exports the internal state of the component, everytime the state changes
   * @param stateObject  E.g { show: false, state, }
   */

  onStateChange: PropTypes.func,

  /**
   * The number of images that can be selected from the library
   */
  fileLimit: PropTypes.number,
  /**
   * Determines whether or not cropping should be enabled on images. (That are freshly being uploaded)
   */
  allowCropping: PropTypes.bool,
  /**
   * Lets you render another component in the sidepanel of modal in case a situation needs more specific content
   * @param props
   */
  sideExtraComponent: PropTypes.func,
  dragToOrder: PropTypes.bool,

  /**
   * This boolean turned on will force large images to be resized by slightly reducing the image quality
   *
   */
  compress: PropTypes.bool,

  /**
   * This string could be "LOW,MEDIUM or HGH" and indicates the extent that images should be compressed
   * when compression is turned on. Default value is set to MEDIUM quality
   */
  compressedQuality: PropTypes.string,
  /**
   * Maximum size that an image should be. If a selected image exceeds this number, and the "compress" value
   * is true, the image will be reduced to a lower quality before uploading
   */
  maximumImageSize: PropTypes.number,
  /**
   * A component that needs to be rendered before the images in the library are to be rendered
   */
  renderBeforeImages: PropTypes.element,

  /**
   * A function that should return a tooltip component.
   */
  TooltipWrapper: PropTypes.string,
  /**
   * In some situations, the tray images that display when a user has inserted an images from the mlibrary, is not needed. Typical example is how mlib is being used in TinyMCE
   * So, this value is used to toggle the image tray ON/OFF. (true = No image Tray)
   */
  floatingMode: PropTypes.bool
};

MediaLibrary.Button = MLButton;
MediaLibrary.Image = ImageThumbnail;
MediaLibrary.Tabs = TABS;
MediaLibrary.AcceptedFileTypes = {
  Images: ["image/jpg", "image/png", "image/jpeg"].join(", "),
  All: EXTENSIONS.join(", ")
};
MediaLibrary.Functions = functionsToExport;
MediaLibrary.CompressedQuality = IMAGE_QUALITY;
MediaLibrary.defaultProps = {
  multiple: true,
  uploadMultiple: false,
  images: [],
  defaultTab: MediaLibrary.Tabs.LIBRARY_TAB,
  selected: [],
  actionText: "Select From Library",
  limited: false,
  excludeTabs: [],
  useAwait: false,
  awaitSeconds: 500,
  allowCropping: true,
  dragToOrder: false,
  compress: true,
  compressedQuality: IMAGE_QUALITY.MEDIUM.key,
  maximumImageSize: DEFFAULT_MAX_SIZE,
  renderBeforeImages: null,
  floatingMode: false
};
export default MediaLibrary;
