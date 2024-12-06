import React, { useState } from "react";

export const useRenderEngine = () => {
  const [sections, setSection] = useState([]);

  return {
    sections,
    setSection,
  };
};
