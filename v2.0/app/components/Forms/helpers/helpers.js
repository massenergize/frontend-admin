export default function isImage(file) {
  const fileName = file.name || file.path;
  const suffix = fileName.split('.').slice(-1)[0].toLowerCase();
  if (suffix === 'jpg' || suffix === 'jpeg' || suffix === 'bmp' || suffix === 'png') {
    return true;
  }
  return false;
}