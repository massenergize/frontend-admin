import React, { useEffect, useRef } from "react";
import "./Upload.css";
import PropTypes from "prop-types";
import uploadDummy from "./up_img.png";
import {
  createLowResolutionImage,
  EXTENSIONS,
  getFilesFromTransfer,
  getFileSize,
  getRandomStringKey,
  readContentOfSelectedFile,
  smartString,
} from "../../utils/utils";
import { IMAGE_QUALITY, spinner } from "../../utils/values";
import MLButton from "../button/MLButton";

function Upload({
  files,
  setFiles,
  previews,
  setPreviews,
  multiple,
  uploading,
  upload, // the upload function
  accept,
  extras,
  setCurrentTab,
  switchToCropping,
  cropped,
  allowCropping,
  compress,
  compressedQuality,
  maximumImageSize,
}) {
  const dragBoxRef = useRef(null);
  const fileOpenerRef = useRef(null);

  const htmlContent = (extras || {})["upload"] || null; // This is just html content that devs can pass to show, grouped by tabs
  /**
   * This is where all the selected files are looped over, and previews are built and saved in the
   * state, so that users can see what they have chosen
   * @param {*} _files
   */
  const processForPreview = async (_files) => {
    const compressionIsEnabled = compress;
    const quality = IMAGE_QUALITY[compressedQuality].value;
    for (let i = 0; i < _files.length; i++) {
      // For each of the files that the user has selected
      const fileObj = _files[i];
      const imageIsTooLarge = fileObj.file.size > maximumImageSize;

      readContentOfSelectedFile(fileObj.file).then((baseImage) => {
        var obj = {
          ...fileObj,
          src: baseImage,
          sizeText: getFileSize(fileObj.file),
        };

        if (imageIsTooLarge && compressionIsEnabled) {
          createLowResolutionImage(
            baseImage,
            { quality, file: fileObj.file },
            (response) => {
              obj = {
                ...obj,
                file: response.file,
                src: response.source,
                sizeText: getFileSize(response.file),
              };
              replaceFile(obj); // replaces the original version of the file with the compressed version in the state
              addItToPreviews(obj);
            }
          );
        } else addItToPreviews(obj);

        // if (multiple) setPreviews((previous) => [...previous, obj]);
        // else setPreviews([obj]);
      });
    }
  };

  const addItToPreviews = (obj) => {
    if (multiple) setPreviews((previous) => [...previous, obj]);
    else setPreviews([obj]);
  };

  /**
   * Used as the onChange function in the file input. It goes over all selected files
   * and puts each file into an object with a unique Id
   * something like this: {file:...., id:'something-unique'}
   * @param {*} e
   */
  const handleSelectedFiles = (e) => {
    e.preventDefault();
    const arr = [];
    const targetFiles = e.target.files;
    for (let i = 0; i < targetFiles.length; i++) {
      const file = targetFiles[i];
      const fileJson = { id: getRandomStringKey(), file };
      arr.push(fileJson);
    }
    if (multiple) setFiles((prevFiles) => [...prevFiles, ...arr]);
    else setFiles(arr);
    processForPreview(arr);
  };

  const replaceFile = (fileObj) => {
    if (!multiple) return setFiles([fileObj]);
    setFiles((prevFiles) => {
      const rem = (prevFiles || []).filter((f) => f.id !== fileObj.id);
      return [...rem, fileObj];
    });
  };
  const handleDroppedFile = (e) => {
    e.preventDefault();
    dragBoxRef.current.classList.remove("ml-drag-over");
    let _files = getFilesFromTransfer(e.dataTransfer.items);
    if (!multiple) _files = [_files[0]]; // if multiple is set to false, just choose the first item from the lot the user dragged in
    const arr = [];
    for (let i = 0; i < _files.length; i++) {
      const file = _files[i];
      const fileJson = { id: getRandomStringKey(), file };
      arr.push(fileJson);
    }
    if (!multiple) _files = arr;
    else _files = [...files, ...arr];
    setFiles(_files);
    processForPreview(arr);
  };

  const removeAnImage = (id) => {
    const remFxn = (item) => item.id !== id;
    const restFiles = files.filter(remFxn);
    const restPreviews = previews.filter(remFxn);
    setPreviews(restPreviews);
    setFiles(restFiles);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
      }}
    >
      <input
        type="file"
        ref={fileOpenerRef}
        style={{ width: 0, height: 0 }}
        onChange={(e) => handleSelectedFiles(e)}
        accept={accept || EXTENSIONS.join(", ")}
        multiple={multiple}
      />
      {htmlContent}
      <div
        ref={dragBoxRef}
        className="ml-drag-box"
        onDragLeave={() => dragBoxRef.current.classList.remove("ml-drag-over")}
        onDragOver={(e) => {
          e.preventDefault();
          dragBoxRef.current.classList.add("ml-drag-over");
        }}
        onDrop={(e) => handleDroppedFile(e)}
      >
        {files.length > 0 ? (
          <></>
        ) : (
          // <>
          //   <p>
          //     Upload ({files.length}) File
          //     {files.length === 1 ? "" : "s"}
          //   </p>
          //   {uploading ? (
          //     <img src={spinner} style={{ height: 70 }} alt="" />
          //   ) : (
          //     <MLButton
          //       style={{
          //         height: "auto",
          //         borderRadius: 4,
          //         padding: "17px 40px",
          //         marginBottom: 5,
          //       }}
          //       backColor="green"
          //       onClick={() => upload()}
          //     >
          //       UPLOAD
          //     </MLButton>
          //   )}
          // </>
          <>
            <img src={uploadDummy} style={{ width: 110, height: 66 }} alt="" />
          </>
        )}
        {uploading ? (
          <>
            <img src={spinner} style={{ height: 70 }} alt="" />
            <p style={{ color: "#de8b28" }}>Uploading, please be patient...</p>
          </>
        ) : (
          <p style={{ textAlign: "center" }}>
            Drag and drop image here or{" "}
            <a
              href="#void"
              onClick={(e) => {
                e.preventDefault();
                fileOpenerRef.current.click();
              }}
            >
              browse
            </a>
            {compress && (
              <>
                <br />
                <small style={{ fontWeight: "bold" }}>
                  NB: All images that exceed{" "}
                  <span style={{ color: "#de8b28" }}>
                    {getFileSize({ size: maximumImageSize }) || "..."}
                  </span>{" "}
                  will be reduced to a lower quality{" "}
                </small>
              </>
            )}
          </p>
        )}
      </div>
      {/* ----------------- PREVIEW AREA --------------- */}
      <div className="ml-preview-area">
        {previews.map((prev) => {
          const croppedVersion = (cropped || {})[prev.id];
          return (
            <React.Fragment key={prev.id.toString()}>
              <PreviewElement
                {...prev}
                src={(croppedVersion && croppedVersion.src) || prev.src}
                parentSource={prev.src}
                sizeText={getFileSize(
                  (croppedVersion && croppedVersion.file) || prev.file
                )}
                remove={removeAnImage}
                uploading={uploading}
                setCurrentTab={setCurrentTab}
                switchToCropping={switchToCropping}
                allowCropping={allowCropping}
              />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

const PreviewElement = ({
  file,
  id,
  src,
  sizeText,
  remove,
  uploading,
  switchToCropping,
  parentSource,
  allowCropping,
}) => {
  return (
    <div
      style={{
        flexDirection: "column",
        display: "flex",
        margin: 10,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!uploading && (
        <div
          style={{
            display: "inline",
          }}
        >
          <small className="ml-prev-el-remove" onClick={() => remove(id)}>
            Remove
          </small>
          {allowCropping && (
            <small
              className="ml-prev-el-remove"
              style={{ color: "blue", height: 80, width: 100, marginLeft: 10 }}
              onClick={() => switchToCropping({ file, id, src: parentSource })}
            >
              Crop
            </small>
          )}
        </div>
      )}
      <img
        src={src}
        className="ml-preview-image"
        style={{ height: 80, width: 100 }}
        alt=""
      />
      <small>{smartString(file.name)}</small>
      <small role="button">
        Size: <b>{sizeText}</b>
      </small>
    </div>
  );
};

PreviewElement.propTypes = {
  file: PropTypes.object.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  src: PropTypes.string.isRequired,
  sizeText: PropTypes.string.isRequired,
  remove: PropTypes.func.isRequired,
  uploading: PropTypes.bool.isRequired,
};

Upload.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object),
  setFiles: PropTypes.func,
  previews: PropTypes.arrayOf(PropTypes.object),
  setPreviews: PropTypes.func,
  multiple: PropTypes.bool,
  uploading: PropTypes.bool,
  upload: PropTypes.func,
};

Upload.defaultProps = {
  files: [],
  setFiles: null,
  previews: [],
  setPreviews: null,
  multiple: false,
  uploading: false,
  upload: null,
};
export default Upload;
