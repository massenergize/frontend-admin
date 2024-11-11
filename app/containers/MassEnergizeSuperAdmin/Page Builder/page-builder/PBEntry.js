import React, { useCallback, useRef, useState } from "react";
import PBCanvas from "./PBCanvas";
import "./assets/css/pb-index.css";
import PBSidePanel from "./components/sidepanels/PBSidePanel";
import { usePBModal } from "./hooks/usePBModal";
import { usePBBottomSheet } from "./hooks/usePBBottomSheet";
import PBRichTextEditor from "./components/richtext/PBRichTextEditor";
import PBFloatingFooter from "./components/floating-footer/PBFloatingFooter";
import PBSection from "./components/sectionizer/PBSectionizer";
import PBBlockContainer from "./components/layouts/blocks/PBBlockContainer";
import PBPageSettings from "./pages/PBPageSettings";
const PAGE_SETTINGS_KEY = "PAGE_SETTINGS";
function PBEntry() {
  const { Modal, open: openModal, close, modalProps, setModalProps } = usePBModal();
  const { BottomSheet, open: openBottomSheet, heightIsToggled } = usePBBottomSheet();
  const [sections, setSection] = useState([]);
  const [blockInFocus, setBlockInFocus] = useState(null);
  const recentlyUsedFieldRef = useRef();

  const onFocused = useCallback((target) => {
    recentlyUsedFieldRef.current = target;
  }, []);

  const handlePropertyChange = (properties, options) => {
    const { isGrouped, rawValue, cssKey, groupIndex, propertyIndex } = options || {};
    const newProperties = [...properties];
    if (isGrouped) {
      const p = newProperties[propertyIndex];
      const { group } = p;
      const newGroup = [...group];
      const item = group[groupIndex];
      const newItem = { ...item, value: rawValue };
      newGroup.splice(groupIndex, 1, newItem);
      const newProp = { ...p, group: newGroup };
      newProperties.splice(propertyIndex, 1, newProp);
      return newProperties;
    }
    let propItem = properties[propertyIndex];
    propItem = { ...propItem, value: rawValue };
    newProperties.splice(propertyIndex, 1, propItem);
    return newProperties;
  };

  const mergeProps = (oldProps, valueObj, options) => {
    const { propAccessor, append, propIsObj, rawValue } = options || {};
    const newProps = { ...oldProps };
    let prop = oldProps[propAccessor] || {};
    if (propIsObj) {
      if (append) prop = { ...prop, ...valueObj };
      else prop = { ...valueObj };
    } else prop = rawValue;
    newProps[propAccessor] = prop;
    return newProps;
  };

  const applyProps = (block, valueObj, options) => {
    const { data } = options || {};

    const { block: blockItem, group, ...rest } = block;
    const { template, properties } = blockItem || {};
    //  ---- Handling Properties -----
    const newProperties = handlePropertyChange(properties, options);
    //  ---- Applying Properties to block
    const { element } = template || {};
    const { props } = element || {};
    const newProps = mergeProps(props, valueObj, options);
    const newElement = { ...element, props: { ...props, ...newProps } };
    const newBlock = {
      ...rest,
      block: { ...blockItem, properties: newProperties, template: { ...template, element: newElement } },
    };
    return newBlock;
  };

  const whenPropertyChanges = (data) => {
    const newSectionList = [...sections];
    const block = newSectionList.find((section) => section.block.id === data?.blockId);
    const valueTrain = { [data?.prop?.accessor]: data?.prop?.value };
    console.log("What DATA LOOKS LIKE", data);
    const newBlock = applyProps(blockInFocus, valueTrain, data?.prop);
    newSectionList.splice(block?.options?.position, 1, newBlock);
    setSection(newSectionList);
    setBlockInFocus(newBlock);
  };

  const selectBlock = (blockJson) => {
    const { position } = modalProps || {};
    const newSection = [...sections];
    const oldOptions = blockJson?.options || {};
    newSection.splice(position, 0, { ...blockJson, options: { ...oldOptions, position } });
    setSection(newSection);
    close();
  };

  const openSpecificModal = (modalKey) => {
    setModalProps({ ...modalProps, modalKey });
    openModal();
  };
  const closeModalWithKey = () => {
    setModalProps({ ...modalProps, modalKey: null });
    close();
  };

  const removeBlockItem = ({ blockId }) => {
    const newSection = sections.filter((section) => section.block.id !== blockId);
    setSection(newSection);
  };
  const IS_PAGE_SETTINGS = modalProps?.modalKey === PAGE_SETTINGS_KEY;
  return (
    <div className="pb-root">
      <Modal style={{ minHeight: 300 }}>
        {IS_PAGE_SETTINGS ? <PBPageSettings /> : <PBBlockContainer onItemSelected={selectBlock} />}
      </Modal>
      <PBCanvas>
        <PBSection
          blockInFocus={blockInFocus}
          focusOnBlock={setBlockInFocus}
          sections={sections}
          onButtonClick={openModal}
          openBlockModal={openModal}
          removeBlockItem={removeBlockItem}
        />
      </PBCanvas>
      <BottomSheet>
        <div style={{ width: "70%" }}>
          <PBRichTextEditor height={heightIsToggled ? 500 : 300} />
        </div>
      </BottomSheet>
      <div className="pb-right-panel">
        <PBSidePanel
          onFocused={onFocused}
          lastFocus={recentlyUsedFieldRef?.current}
          onPropertyChange={whenPropertyChanges}
          block={blockInFocus?.block}
        />
      </div>
      <PBFloatingFooter
        save={() => console.log("FINAL PAYLOAD: ", sections)}
        close={closeModalWithKey}
        openPageSettings={() => openSpecificModal(PAGE_SETTINGS_KEY)}
      />
    </div>
  );
}

export default PBEntry;
