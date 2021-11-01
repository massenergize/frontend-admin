export default function getAspectRatioFloat(aspectRatio) {
  const arr = aspectRatio.split(':');
  return parseFloat(arr[0]) / parseFloat(arr[1]);
}
