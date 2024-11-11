import React from "react";
import "./pb-section.css";
import { usePBModal } from "../../hooks/usePBModal";
import PBRender from "../render/PBRender";
function PBSection({ onButtonClick, openBlockModal, sections, focusOnBlock, blockInFocus, removeBlockItem }) {
  const hasSections = sections.length > 0;

  return (
    <>
      {hasSections ? (
        sections?.map(({ block }, position) => (
          <PBRender
            onBlockClick={() => focusOnBlock({ block, options: { position } })}
            json={block}
            onClick={() => onButtonClick({ position: position + 1 })}
            remove={() => removeBlockItem({ blockId: block?.id })}
          />
        ))
      ) : (
        <EmptySection open={() => openBlockModal({ position: 0 })} />
      )}
      <div className="pb-add-area">
        <button
          onClick={() => onButtonClick({ position: sections?.length })}
          className="pb-add-section touchable-opacity"
        >
          Add Section
        </button>
      </div>
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
