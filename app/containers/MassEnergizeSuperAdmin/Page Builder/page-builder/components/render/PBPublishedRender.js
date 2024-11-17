import React, { useEffect, useMemo, useRef } from "react";
import { renderSection, serializeBlock } from "../../utils/engine/engine";

function PBPublishedRender({ sections }) {
  console.log("SECTIONS", sections);
  const iframeRef = useRef();
  const html = useMemo(
    () =>
      sections
        .map(({ block }) => {
          console.log("LE BLOCK", block);
          return serializeBlock(block?.template);
        })
        ?.join(""),
    [sections]
  );

  console.log("LEts see html", html);

  useEffect(() => {
    if (iframeRef?.current) {
      const doc = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document;
      doc.open();
      doc.write(`
        <html>
          <head>
          </head>
          <body>${html}</body>
        </html>
      `);
      doc.close();
    }
  }, [html]);

  return (
    <div style={{ width: "100%" }}>
      <iframe ref={iframeRef} style={{ width: "100%", height: "auto", borderWidth: 0 }} />
    </div>
  );
}

export default PBPublishedRender;
