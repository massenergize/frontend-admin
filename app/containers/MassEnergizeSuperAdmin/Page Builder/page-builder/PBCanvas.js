import React from "react";
import "./assets/css/pb-index.css";
import PBSidePanel from "./components/sidepanels/PBSidePanel";
import PBBottomSheet from "./components/bottom-sheet/PBBottomSheet";
import PBModal from "./components/modal/PBModal";
function PBCanvas({ children }) {
  return <div className="pb-canvas">{children}</div>;
}

export default PBCanvas;
