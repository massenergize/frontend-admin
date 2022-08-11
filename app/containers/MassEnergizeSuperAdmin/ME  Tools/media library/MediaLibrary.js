import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./MediaLibrary.css";
import MLButton from "./shared/components/button/MLButton";
import MediaLibraryModal from "./shared/components/library modal/MediaLibraryModal";
import ImageThumbnail from "./shared/components/thumbnail/ImageThumbnail";
import {
  DEFFAULT_MAX_SIZE,
  IMAGE_QUALITY,
  libraryImage,
  TABS,
} from "./shared/utils/values";
import { EXTENSIONS } from "./shared/utils/utils";

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
  } = props;

  const [show, setShow] = useState(openState);
  const [imageTray, setTrayImages] = useState(selected);
  const [state, setState] = useState({});
  const [hasMounted, setHasMountedTo] = useState(undefined);
  const [cropped, setCropped] = useState({}); // all items that have been cropped are saved in this object, E.g. idOfParentImage: CroppedContent
  const [cropLoot, setCropLoot] = useState(null); // Where item to be cropped is temporarily stored and managed in  the cropping tab
  const [currentTab, setCurrentTab] = useState(defaultTab);
  const [files, setFiles] = useState([]); // all files that have been selected from user's device [Schema: {id, file}]
  const [croppedSource, setCroppedSource] = useState();

  const finaliseCropping = () => {
    if (!cropLoot) return;
    const { source } = cropLoot;
    setCropped({ ...(cropped || {}), [source.id.toString()]: croppedSource });
    setCurrentTab(TABS.UPLOAD_TAB);
  };

  const switchToCropping = (content) => {
    const loot = { source: content, image: content && content.src };
    setCropLoot(loot);
    setShow(true);
    setCurrentTab("crop");
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
    const isMountingForTheFirstTime = hasMounted === undefined;
    if (!onStateChange || isMountingForTheFirstTime) return;
    onStateChange({ show, state });
  }, [show, state]);

  useEffect(() => {
    setHasMountedTo(true);
  }, []);

  useEffect(() => {}, [cropped]);

  const preselectDefaultImages = () => {
    if (!selected || !selected.length) return images;
    var bank = (images || []).map((img) => img.id);
    // sometimes an image that is preselected, my not be in the library's first load
    // in that case just add it to the library's list
    var isNotThere = selected.filter((img) => !bank.includes(img.id));
    if (!isNotThere.length) return images;

    return [...isNotThere, ...images];
  };
  const close = () => {
    setShow(false);
    setFiles([]);
  };
  return (
    <React.Fragment>
      {show && (
        <div style={{ position: "fixed", top: 0, left: 0, zIndex: 5 }}>
          <MediaLibraryModal
            {...props}
            images={preselectDefaultImages()}
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
          />
        </div>
      )}

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
          padding: 20,
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
            // switchToCropping={switchToCropping}
          />
        )}

        <MediaLibrary.Button
          onClick={(e) => {
            e.preventDefault();
            setShow(true);
          }}
          style={{ borderRadius: 5, marginTop: 20, padding: "15px 40px" }}
        >
          {actionText}
        </MediaLibrary.Button>
      </div>
    </React.Fragment>
  );
}

const ImageTray = ({ sourceExtractor, remove, content }) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
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
              // switchToCropping={switchToCropping}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};

const TrayImage = ({ src, remove, id }) => (
  <div className="ml-tray-image">
    <img src={src} className="ml-preview-image elevate-float" />
    <small className="ml-prev-el-remove" onClick={() => remove(id)}>
      Remove
    </small>
    {/* <small
      className="ml-prev-el-remove"
      style={{ color: "blue" }}
      onClick={() => switchToCropping(id, "library-content")}
    >
      Crop
    </small> */}
  </div>
);

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
};

MediaLibrary.Button = MLButton;
MediaLibrary.Image = ImageThumbnail;
MediaLibrary.Tabs = TABS;
MediaLibrary.AcceptedFileTypes = {
  Images: ["image/jpg", "image/png", "image/jpeg"].join(", "),
  All: EXTENSIONS.join(", "),
};
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
  compress: true,
  compressedQuality: IMAGE_QUALITY.MEDIUM.key,
  maximumImageSize: DEFFAULT_MAX_SIZE,
};
export default MediaLibrary;
