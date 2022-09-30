import _spinner from "../images/loading-gif.gif";
import _blank from "../images/blank_canvas.png";
import _libraryImage from "../images/lib.png";
export const spinner = _spinner;
export const blank = _blank;
export const libraryImage = _libraryImage;
export const dummyImages = [
  { url: "https://i.pravatar.cc/300?img=3", id: 1 },
  { url: "https://i.pravatar.cc/300?img=5", id: 12 },
  { url: "https://i.pravatar.cc/300?img=9", id: 14 },
  { url: "https://i.pravatar.cc/300?img=1", id: 15 },
  { url: "https://i.pravatar.cc/300?img=6", id: 16 },
  { url: "https://i.pravatar.cc/300?img=31", id: 18 },
  { url: "https://i.pravatar.cc/300?img=17", id: 19 },
  { url: "https://i.pravatar.cc/300?img=30", id: 11 },
  { url: "https://i.pravatar.cc/300?img=8", id: 32 },
];

export const TABS = {
  UPLOAD_TAB: "upload",
  LIBRARY_TAB: "library",
  CROPPING_TAB: "crop",
};

export const IMAGE_QUALITY = {
  LOW: { key: "LOW", value: 0.2 },
  MEDIUM: { key: "MEDIUM", value: 0.5 },
  HIGH: { key: "HIGH", value: 0.75 },
};

export const DEFAULT_FILE_LIMIT = 10; // There is no significant reason for 10 as the default number. We can change it to anything later...

export const DEFFAULT_MAX_SIZE = 1500000 // like 1.5MB