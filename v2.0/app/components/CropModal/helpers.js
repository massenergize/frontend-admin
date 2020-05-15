export function getAspectRatioFloat(aspectRatio) {
  const arr = aspectRatio.split(':');
  return parseFloat(arr[0]) / parseFloat(arr[1]);
}

export function fileToBase64(file, cb) {
  const fr = new FileReader();
  fr.readAsDataURL(file);
  fr.onload = () => {
    cb(fr.result);
  };
}
