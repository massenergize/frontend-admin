import React, { useCallback, useEffect, useState } from "react";
import PBModal from "../components/modal/PBModal";

export const usePBModal = () => {
  const [open, setOpen] = useState(false);
  const [modalProps, setModalProps] = useState(null);

  const close = () => setOpen(false);
  const openModal = (options) => {
    setOpen(true);
    if (options) setModalProps(options);
  };

  const init = useCallback(({ modalProps, open }) => {
    setModalProps(modalProps);
    setOpen(open || false);
  }, []);

  const Modal = useCallback(
    ({ children, ...rest }) => {
      if (!open) return null;
      return (
        <PBModal close={close} {...(modalProps || {})} {...rest}>
          {children}
        </PBModal>
      );
    },
    [modalProps, open],
  );

  return { isOpen: open, Modal, close, init, open: openModal, modalProps, setModalProps };
};
