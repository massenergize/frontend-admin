import { BLOCKS } from "./engine/blocks";

export const pruneProperties = (properties) => {
  let grouped = {};
  properties.forEach((prop) => {
    const { _type, name, value, group } = prop;
    if (group) grouped = { ...grouped, ...pruneProperties(group) };
    if (name) grouped[name] = { name, type: _type, value: value || null };
  });
  return grouped;
};

export const pruneSections = (sections) => {
  // This function detaches the bulky properties array from the sections so that the payload of an api request will be small
  // While doing that, it keeps track of the value of each property so that it can be reattached later
  return sections.map((section) => {
    const { options, block } = section || {};
    const grouped = pruneProperties(section?.block?.properties);
    return {
      ...section,
      block: { ...(block || {}), properties: null },
      options: { ...options, _propertValues: grouped }
    };
  });
};

const inflateBlock = (block, valuesJson) => {
  const sourceBlock = BLOCKS.find((b) => b.key === block?.key);
  const sourceProperties = sourceBlock?.properties || [];

  const addValue = (property) => {
    const { name, group } = property;
    if (group) {
      const grouped = group.map((prop) => addValue(prop));
      return { ...property, group: grouped };
    }
    return { ...property, value: valuesJson[name]?.value || null };
  };
  const properties = sourceProperties.map((prop) => addValue(prop));

  return { ...block, properties };
};
export const reconfigurePruned = (sections) => {
  // This function reattaches the properties array to the sections with the values that the user prefers
  return sections?.map((section) => {
    const { options, block } = section || {};
    const { _propertValues } = options || {};

    const inflatedBlock = inflateBlock(block, _propertValues);
    return { ...section, block: inflatedBlock, options: { ...options, _propertValues: null } };
  });
};
