import React, { useRef } from "react";
import "./Upload.css";
import PropTypes from "prop-types";
import uploadDummy from "./up_img.png";
import {
  EXTENSIONS,
  getFilesFromTransfer,
  getFileSize,
  getRandomStringKey,
  readContentOfSelectedFile,
  smartString,
} from "../../utils/utils";
import { spinner } from "../../utils/values";
import MLButton from "../button/MLButton";

function Upload({
  files,
  setFiles,
  previews,
  setPreviews,
  multiple,
  uploading,
  upload, // the upload function
  accept
}) {
  const dragBoxRef = useRef(null);
  const fileOpenerRef = useRef(null);

  const processForPreview = async (_files) => {
    for (let i = 0; i < _files.length; i++) {
      const fileObj = _files[i];
      readContentOfSelectedFile(fileObj.file).then((baseImage) => {
        const obj = {
          ...fileObj,
          src: baseImage,
          sizeText: getFileSize(fileObj.file),
        };
        if (multiple) setPreviews((previous) => [...previous, obj]);
        else setPreviews([obj]);
      });
    }
  };

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
        accept={ accept || EXTENSIONS.join(", ")}
        multiple={multiple}
      />
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
          <>
            <p>
              Upload ({files.length}) File
              {files.length === 1 ? "" : "s"}
            </p>
            {uploading ? (
              <img src={spinner} style={{ height: 70 }} alt="" />
            ) : (
              <MLButton
                style={{
                  height: "auto",
                  borderRadius: 4,
                  padding: "17px 40px",
                  marginBottom: 5,
                }}
                backColor="green"
                onClick={() => upload()}
              >
                UPLOAD
              </MLButton>
            )}
          </>
        ) : (
          <>
            <img src={uploadDummy} style={{ width: 110, height: 66 }} alt="" />
          </>
        )}
        {uploading ? (
          <p style={{ color: "#de8b28" }}>Uploading, please be patient...</p>
        ) : (
          <p>
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
          </p>
        )}
      </div>
      {/* ----------------- PREVIEW AREA --------------- */}
      <div className="ml-preview-area">
        {previews.map((prev) => (
          <React.Fragment key={prev.id.toString()}>
            <PreviewElement
              {...prev}
              remove={removeAnImage}
              uploading={uploading}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

const PreviewElement = ({ file, id, src, sizeText, remove, uploading }) => (
  <div
    style={{
      flexDirection: "column",
      display: "flex",
      margin: 10,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <img src={src} className="ml-preview-image" alt="" />
    <small>{smartString(file.name)}</small>
    <small role="button">
      Size: <b>{sizeText}</b>
    </small>
    {!uploading && (
      <small className="ml-prev-el-remove" onClick={() => remove(id)}>
        Remove
      </small>
    )}
  </div>
);
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
