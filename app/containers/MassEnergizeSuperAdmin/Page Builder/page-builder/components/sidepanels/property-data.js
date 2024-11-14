import { PROPERTY_TYPES } from "./PBPropertyTypes";

const STYLE_DEFS = {
  append: true,
  propAccessor: "style",
  propIsObj: true
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
    _resetValue: "",
    propAccessor: "text"
  }
];

const DIMENSIONS = [
  {
    _type: PROPERTY_TYPES.INPUT_GROUP,
    text: "Dimensions",
    group: [
      {
        ...STYLE_DEFS,
        name: "width",
        placeholder: "0",
        type: "number",
        label: "Width(%)",
        accessor: "width",
        value: 100,
        _resetValue: 0,
        unit: "%"
      },
      {
        ...STYLE_DEFS,
        name: "height",
        placeholder: "0",
        type: "number",
        label: "Height(px)",
        accessor: "height",
        _resetValue: 0,
        unit: "px"
      }
    ]
  }
];

const MARGIN = [
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
        name: "ml",
        _resetValue: 0,
        accessor: "marginLeft"
      },
      {
        ...STYLE_DEFS,
        label: "Right",
        placeholder: "0",
        type: "number",
        name: "mr",
        _resetValue: 0,
        accessor: "marginRight"
      },
      {
        ...STYLE_DEFS,
        label: "Top",
        placeholder: "0",
        type: "number",
        name: "mt",
        _resetValue: 0,
        accessor: "marginTop"
      },
      {
        ...STYLE_DEFS,
        label: "Bottom",
        placeholder: "0",
        type: "number",
        name: "mb",
        _resetValue: 0,
        accessor: "marginBottom"
      }
    ]
  }
];

const PADDING = [
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
        _resetValue: 0,
        accessor: "paddingLeft"
      },
      {
        ...STYLE_DEFS,
        label: "Right",
        placeholder: "0",
        type: "number",
        name: "pr",
        _resetValue: 0,
        accessor: "paddingRight"
      },
      {
        ...STYLE_DEFS,
        label: "Top",
        placeholder: "0",
        type: "number",
        name: "pt",
        _resetValue: 0,
        accessor: "paddingTop"
      },
      {
        ...STYLE_DEFS,
        label: "Bottom",
        placeholder: "0",
        type: "number",
        name: "pb",
        _resetValue: 0,
        accessor: "paddingBottom"
      }
    ]
  }
];

const SNAP_TO_FULL_WIDTH = [
  {
    _type: PROPERTY_TYPES.FIXED_CHECKBOX,
    text: "Full Width",
    ...STYLE_DEFS,
    name: "full-width",
    label: "Snap to full width",
    accessor: "width",
    _resetValue: "50",
    value: "100",
    checkedValue: "100",
    unit: "%"
  }
];
const BASIC_PROPS_WITH_FULL_WIDTH_SNAP = [...DIMENSIONS, ...SNAP_TO_FULL_WIDTH, ...MARGIN, ...PADDING];
const BASIC_PROPS = [...DIMENSIONS, ...MARGIN, ...PADDING];

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
      { name: "Bottom", value: "flex-end" }
    ]
  },
  {
    ...STYLE_DEFS,
    _type: PROPERTY_TYPES.DROPDOWN,
    name: "h-alignment",
    text: "Horizontal Alignment",
    accessor: "alignItems",
    value: "flex-start",
    _resetValue: "flex-start",
    data: [
      { name: "Center", value: "center" },
      { name: "Left", value: "flex-start" },
      { name: "Right", value: "flex-end" }
    ]
  }
];

const BACKGROUND_PROPS = [
  {
    ...STYLE_DEFS,
    _type: PROPERTY_TYPES.COLOR_PICKER,
    name: "background",
    text: "Background Color",
    accessor: "background",
    value: "#dddddd",
    _resetValue: "#dddddd"
  }
];
const FONT_SIZE_PROPS = [
  {
    ...STYLE_DEFS,
    _type: PROPERTY_TYPES.INPUT,
    name: "font-size",
    text: "Text Size",
    label: "Change text size",
    type: "number",
    accessor: "fontSize",
    value: 22,
    _resetValue: 22,
    unit: "px"
  }
];
const TEXT_COLOR_PROPS = [
  {
    ...STYLE_DEFS,
    _type: PROPERTY_TYPES.COLOR_PICKER,
    name: "color",
    text: "Text Color",
    accessor: "color",
    value: "#000000",
    _resetValue: "#000000"
  }
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
    propAccessor: "text"
  },
  ...BASIC_PROPS,
  {
    ...STYLE_DEFS,
    _type: PROPERTY_TYPES.COLOR_PICKER,
    name: "background",
    text: "Background Color",
    accessor: "background",
    value: "#dddddd",
    _resetValue: "#dddddd"
  },
  ...ALIGNMENTS_PROPS
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
    _resetValue: "",
    propAccessor: "src"
  },
  ...BASIC_PROPS
];
export const BUTTON_PROPS = [
  ...TEXT_PROPS,
  ...BASIC_PROPS,
  ...FONT_SIZE_PROPS,
  ...BACKGROUND_PROPS,
  ...TEXT_COLOR_PROPS,
  ...ALIGNMENTS_PROPS
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
    _resetValue: "",
    propAccessor: "href"
  },
  ...BASIC_PROPS,
  ...FONT_SIZE_PROPS,
  ...BACKGROUND_PROPS,
  ...TEXT_COLOR_PROPS,
  ...ALIGNMENTS_PROPS
];

export const RICH_TEXT_PROPS = [
  {
    _type: PROPERTY_TYPES.RICH_TEXT,
    text: "Add Rich Text",
    name: "text",
    // placeholder: "0",
    type: "richtext",
    label: "Add text",
    // placeholder: "Enter text here...",
    propAccessor: "__html"
  },
  ...BASIC_PROPS
];

export const TITLE_PROPS = [
  ...TEXT_PROPS,
  ...BASIC_PROPS,
  ...FONT_SIZE_PROPS,
  ...BACKGROUND_PROPS,
  ...TEXT_COLOR_PROPS,
  ...ALIGNMENTS_PROPS
];

export const IMAGE_PROPS = [
  ...BASIC_PROPS_WITH_FULL_WIDTH_SNAP,
  {
    _type: PROPERTY_TYPES.MEDIA,
    text: "Select Image",
    name: "src",
    label: "Add image",
    propAccessor: "src"
  },
  {
    ...STYLE_DEFS,
    _type: PROPERTY_TYPES.DROPDOWN,
    name: "fill",
    text: "Image Fill",
    accessor: "objectFit",
    value: "cover",
    _resetValue: "cover",
    data: [
      { name: "Fill", value: "cover" },
      { name: "Show as is", value: "contain" }
      // { name: "Right", value: "flex-end" }
    ]
  }
];
