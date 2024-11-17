const INLINE_KEYS = {
  alignItems: "align-items",
  flexDirection: "flex-direction",
  justifyContent: "justify-content",
  flexWrap: "flex-wrap",
  flexBasis: "flex-basis",
  objectFit: "object-fit"
};
export const serializeCss = (inLinObj) => {
  return Object.entries(inLinObj)
    .map(([key, value]) => {
      key = INLINE_KEYS[key] || key;
      return `${key}: ${value};`;
    })
    .join(" ");
};
