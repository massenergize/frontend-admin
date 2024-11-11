import React, { useCallback, useMemo, useState } from "react";
import PBBottomSheet from "../components/bottom-sheet/PBBottomSheet";

const DEFAULT_HEIGHT = "80vh";
export const usePBBottomSheet = () => {
  const [open, setOpen] = useState(false);
  const [sheetOptions, setSheetOptions] = useState({});
  const [toggledHeight, setToggledHeight] = useState(null);

  const toggleHeight = useCallback(() => {
    if (toggledHeight === DEFAULT_HEIGHT) return setToggledHeight(null);
    setToggledHeight(DEFAULT_HEIGHT);
  }, [setToggledHeight, toggledHeight]);

  const close = () => setOpen(false);
  const openModal = () => setOpen(!open);
  const toggled = useMemo(() => toggledHeight === DEFAULT_HEIGHT, [toggledHeight]);

  const init = useCallback(({ sheetOptions, open }) => {
    setSheetOptions(sheetOptions);
    setOpen(open || false);
  }, []);

  const Sheet = useCallback(
    ({ children }) => {
      if (!open) return null;
      return (
        <PBBottomSheet
          height={toggledHeight}
          toggled={toggled}
          toggleHeight={toggleHeight}
          close={close}
          {...(sheetOptions || {})}
        >
          {children}
        </PBBottomSheet>
      );
    },
    [open, sheetOptions, toggled, toggledHeight, toggleHeight],
  );

  return {
    init,
    close,
    isOpen: open,
    BottomSheet: Sheet,
    open: openModal,
    heightIsToggled: toggled,
  };
};
