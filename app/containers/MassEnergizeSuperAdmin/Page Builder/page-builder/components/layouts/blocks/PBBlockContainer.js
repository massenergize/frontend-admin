import React from "react";
import "./../pb-layout.css";
import {
  BTN_BLOCK,
  ICON_BLOCK,
  IMAGE_BLOCK,
  LINK_BLOCK,
  PARAGRAPH_BLOCK,
  RICH_TEXT_BLOCK,
  SECTION_BLOCK,
  TITLE_BLOCK,
  VIDEO_BLOCK
} from "../../../utils/engine/data";
import {
  BUTTON_PROPS,
  DEFAULT_PROPERTIES,
  FAKE_PROPERTIES,
  IMAGE_PROPS,
  LINK_PROPS,
  RICH_TEXT_PROPS,
  TITLE_PROPS,
  VIDEO_PROPS
} from "../../sidepanels/property-data";
import { BLOCKS } from "../../../utils/engine/blocks";

function PBBlockContainer({ onItemSelected }) {
  return (
    <div className="pb-block-root" style={{ padding: 20 }}>
      {BLOCKS.map((block) => (
        <div
          key={block.key}
          // onClick={() => onItemSelected({ block: { id: block?.template?.element?.id, ...block } })}
          onClick={() => onItemSelected({ block: { id: Date.now(), ...block } })}
          className="pb-block-item"
        >
          <i className={`fa ${block.icon}`} />
          <p>{block.name}</p>
        </div>
      ))}
    </div>
  );
}

export default PBBlockContainer;
