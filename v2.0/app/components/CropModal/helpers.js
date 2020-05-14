export function getAspectRatioFloat(aspectRatio) {
  const arr = aspectRatio.split(':');
  return parseFloat(arr[0]) / parseFloat(arr[1]);
}

export function fileObjToDataURL(fileObj, cb) {
  const fr = new FileReader();
  fr.readAsDataURL(fileObj);
  fr.onload = () => {
    cb(fr.result);
  };
}
