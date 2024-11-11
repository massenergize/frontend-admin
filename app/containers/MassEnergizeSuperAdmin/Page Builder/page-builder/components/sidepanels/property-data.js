import { PROPERTY_TYPES } from "./PBPropertyTypes";

const STYLE_DEFS = {
  append: true,
  propAccessor: "style",
  propIsObj: true,
};

const TEXT_PROPS = [
  {
    // ...STYLE_DEFS,
    _type: PROPERTY_TYPES.INPUT,
    text: "Text Content",
    name: "text",
    // placeholder: "0",
    type: "text",
    label: "Add text",
    placeholder: "Enter text here...",
    propAccessor: "text",
  },
];
const BASIC_PROPS = [
  {
    _type: PROPERTY_TYPES.INPUT_GROUP,
    text: "Dimensions(px)",
    group: [
      {
        ...STYLE_DEFS,
        name: "width",
        placeholder: "0",
        type: "number",
        label: "Width",

        accessor: "width",
        unit: "px",
      },
      {
        ...STYLE_DEFS,
        name: "height",
        placeholder: "0",
        type: "number",
        label: "Height",

        accessor: "height",
        unit: "px",
      },
    ],
  },
  {
    _type: PROPERTY_TYPES.INPUT_GROUP,
    name: "padding",
    text: "Padding (%)",
    group: [
      {
        ...STYLE_DEFS,
        label: "Left",
        placeholder: "0",
        type: "number",
        name: "pl",
        cssKey: "paddingLeft",
      },
      {
        ...STYLE_DEFS,
        label: "Right",
        placeholder: "0",
        type: "number",
        name: "pr",
        accessor: "paddingRight",
      },
      {
        ...STYLE_DEFS,
        label: "Top",
        placeholder: "0",
        type: "number",
        name: "pt",
        accessor: "paddingTop",
      },
      {
        ...STYLE_DEFS,
        label: "Bottom",
        placeholder: "0",
        type: "number",
        name: "pb",
        accessor: "paddingBottom",
      },
    ],
  },
  {
    _type: PROPERTY_TYPES.INPUT_GROUP,
    name: "margin",
    text: "Margin (%)",
    group: [
      {
        ...STYLE_DEFS,
        label: "Left",
        placeholder: "0",
        type: "number",
        name: "pl",
        accessor: "marginLeft",
      },
      {
        ...STYLE_DEFS,
        label: "Right",
        placeholder: "0",
        type: "number",
        name: "pr",
        accessor: "marginRight",
      },
      {
        ...STYLE_DEFS,
        label: "Top",
        placeholder: "0",
        type: "number",
        name: "pt",
        accessor: "marginTop",
      },
      {
        ...STYLE_DEFS,
        label: "Bottom",
        placeholder: "0",
        type: "number",
        name: "pb",
        accessor: "marginBottom",
      },
    ],
  },
];

const ALIGNMENTS_PROPS = [
  {
    ...STYLE_DEFS,
    _type: PROPERTY_TYPES.DROPDOWN,
    name: "v-alignment",
    text: "Vertical Alignment",
    accessor: "justifyContent",
    value: "flex-start",
    data: [
      { name: "Center", value: "center" },
      { name: "Top", value: "flex-start" },
      { name: "Bottom", value: "flex-end" },
    ],
  },
  {
    ...STYLE_DEFS,
    _type: PROPERTY_TYPES.DROPDOWN,
    name: "h-alignment",
    text: "Horizontal Alignment",
    accessor: "alignItems",
    value: "flex-start",
    data: [
      { name: "Center", value: "center" },
      { name: "Left", value: "flex-start" },
      { name: "Right", value: "flex-end" },
    ],
  },
];

const BACKGROUND_PROPS = [
  {
    ...STYLE_DEFS,
    _type: PROPERTY_TYPES.COLOR_PICKER,
    name: "background",
    text: "Background Color",
    accessor: "background",
    value: "#dddddd",
  },
];
const TEXT_COLOR_PROPS = [
  {
    ...STYLE_DEFS,
    _type: PROPERTY_TYPES.COLOR_PICKER,
    name: "color",
    text: "Text Color",
    accessor: "color",
    value: "#000000",
  },
];
export const DEFAULT_PROPERTIES = [
  {
    _type: PROPERTY_TYPES.INPUT,
    text: "Text Content",
    name: "text",
    // placeholder: "0",
    type: "text",
    label: "Add text",
    placeholder: "Enter text here...",
    propAccessor: "text",
  },
  ...BASIC_PROPS,
  {
    ...STYLE_DEFS,
    _type: PROPERTY_TYPES.COLOR_PICKER,
    name: "background",
    text: "Background Color",
    accessor: "background",
    value: "#dddddd",
  },
  ...ALIGNMENTS_PROPS,
];

export const VIDEO_PROPS = [
  {
    _type: PROPERTY_TYPES.INPUT,
    text: "Video Source",
    name: "src",
    // placeholder: "0",
    type: "text",
    label: "Add video link(Eg. Youtube)",
    placeholder: "Add link here...",
    propAccessor: "src",
  },
  ...BASIC_PROPS,
];
export const BUTTON_PROPS = [
  ...TEXT_PROPS,
  ...BASIC_PROPS,
  ...BACKGROUND_PROPS,
  ...TEXT_COLOR_PROPS,
  ...ALIGNMENTS_PROPS,
];
export const LINK_PROPS = [
  ...TEXT_PROPS,
  {
    _type: PROPERTY_TYPES.INPUT,
    text: "URL",
    name: "url",
    // placeholder: "0",
    type: "text",
    label: "URL Definition",
    placeholder: "Insert link here...",
    propAccessor: "href",
  },
  ...BASIC_PROPS,
  ...BACKGROUND_PROPS,
  ...TEXT_COLOR_PROPS,
  ...ALIGNMENTS_PROPS,
];
