export const EXTENSIONS = [
  "image/jpg",
  "image/png",
  "image/jpeg",
  "application/pdf",
];
export const getRandomInteger = (limit = 9999999) =>
  Math.floor(Math.random() * limit);

export const getRandomItem = (arr = []) =>
  arr[getRandomInteger(arr.length - 1)];

export const getFilesFromTransfer = (transferItems) => {
  if (!transferItems) return [];
  const arr = [];

  for (let i = 0; i < transferItems.length; i++) {
    const item = transferItems[i];
    if (item.kind === "file") {
      const file = item.getAsFile();
      if (EXTENSIONS.includes(file.type)) arr.push(file);
      else console.log(`Sorry file type ${file.type} isnt supported`);
    }
  }
  return arr;
};

export const readContentOfSelectedFile = (file, cb) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (cb) cb(reader.result);
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const getRandomStringKey = (limit = 9999999) =>
  Math.random(limit).toString();

const MEGA = 1000000;
const KILO = 1000;
export const getFileSize = (file) => {
  if (!file) return "";

  const { size } = file;
  if (size < MEGA) return Math.round(size / KILO).toString() + " KB";
  return Math.round(size / MEGA).toString() + " MB";
};

export const smartString = (string, limit = 15) => {
  if (!string) return "...";
  if (string.length > limit) return string.substr(0, limit) + "...";
  return string;
};
/**
 * Rebuilds a low resolution version of a given image source
 * @param {string} source  base64 image string
 * @param {object} options  Eg. {quality:0.5}
 * @param {func} cb function that will receive the rebuilt image in "source"
 *
 * returns an object { source:...., canvas:...}
 */
export const createLowResolutionImage = (source, options, cb) => {
  const { quality, file } = options || {}; //"file" here is the "File Blob" representation of the same image source you are passing
  const image = new Image();
  image.src = source;
  const canvas = document.createElement("canvas");
  image.onload = () => {
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height);
    const source = canvas.toDataURL("image/jpeg", quality || 0.5);

    cb &&
      cb({ source, canvas, file: toFile(source, { name: file && file.name }) });
  };
};
/**
 * rebuilds a base64String image to a file object
 * @param {string} base64String
 * @param {object} options contains info like the name to be given to the new file Blob created
 * @returns
 */
const toFile = (base64String, options = {}) => {
  const { name } = options || {};
  var arr = base64String.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], name || "New Image File - " + getRandomStringKey(), {
    type: mime,
  });
};
