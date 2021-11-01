export default function isImage(file) {
  const fileName = file.name || file.path;
  const arr = fileName.split('.');
  let suffix;
  if (arr.length > 1) {
    suffix = arr.slice(-1)[0].toLowerCase();
  }
  if (suffix && (suffix === 'jpg' || suffix === 'jpeg' || suffix === 'bmp' || suffix === 'png')) {
    return true;
  }
  return false;
}
