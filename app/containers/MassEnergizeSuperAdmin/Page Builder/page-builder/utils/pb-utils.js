export const pruneProperties = (properties) => {
    let grouped = {};
    properties.forEach((prop) => {
      const { _type, name, value, group } = prop;
      if (group) grouped = { ...grouped, ...pruneProperties(group) };
      if (name) grouped[name] = { name, type: _type, value: value || null };
    });
    return grouped;
  };