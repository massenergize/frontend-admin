import React from "react";
import "./pb-section.css";
import { usePBModal } from "../../hooks/usePBModal";
import PBRender from "../render/PBRender";
function PBSection({ readOnly, onButtonClick, openBlockModal, sections, focusOnBlock, blockInFocus, removeBlockItem }) {
  const hasSections = sections.length > 0;

  const renderAddSectionButton = (props, config) => {
    if (readOnly) return null;
    const { text } = config || {};
    return (
      <div className="pb-add-area">
        <button
          onClick={() => onButtonClick({ position: sections?.length, ...(props || {}) })}
          className="pb-add-section touchable-opacity"
        >
          {text || "Add Block"}
        </button>
      </div>
    );
  };
  return (
    <>
      {hasSections && renderAddSectionButton({ position: 0 }, { text: "Add to Top" })}
      {hasSections ? (
        sections?.map(({ block }, position) => (
          <PBRender
            readOnly={readOnly}
            inFocus={blockInFocus?.block?.id === block?.id}
            // onBlockClick={() => focusOnBlock({ block, options: { position } })}
            onBlockClick={() => focusOnBlock({ block, options: {} })}
            // onBlockClick={() => focusOnBlock({ block, options: {} })}
            json={block}
            onClick={() => onButtonClick({ position: position + 1 })}
            // onClick={() => onButtonClick()}
            remove={() => removeBlockItem({ blockId: block?.id })}
          />
        ))
      ) : (
        <EmptySection open={() => openBlockModal({ position: 0 })} />
      )}
      {renderAddSectionButton()}
    </>
  );
}

export default PBSection;

export const EmptySection = ({ open }) => {
  return (
    <div className="pb-sectionizer">
      <i className="fa fa-plus pb-sectionizer-plus-icon touchable-opacity" onClick={() => open && open()} />
      <small>Add Block</small>
    </div>
  );
};
