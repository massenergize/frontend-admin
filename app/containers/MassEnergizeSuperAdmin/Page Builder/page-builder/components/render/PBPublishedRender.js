import React, { useEffect, useMemo, useRef } from "react";
import { renderSection, serializeBlock } from "../../utils/engine/engine";

function PBPublishedRender({ sections }) {
  const iframeRef = useRef();
  const contRef = useRef();

  const html = useMemo(
    () =>
      sections
        .map(({ block }) => {
          return serializeBlock(block?.template);
        })
        ?.join(""),
    [sections]
  );

  useEffect(() => {
    const adjustHeight = () => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        const iframeDocument = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
        const height = iframeDocument.body.scrollHeight;
        contRef.current.style.height = height + "px";
        iframeRef.current.style.height = iframeDocument.body.scrollHeight + "px";
      }
    };
    // Adjust height initially and when content changes
    iframeRef.current.onload = adjustHeight;
    return () => {
      if (iframeRef.current) {
        iframeRef.current.onload = null;
      }
    };
  }, []);

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
    <div ref={contRef} style={{ width: "100%", overflowY: "scroll" }}>
      <iframe ref={iframeRef} style={{ width: "100%", borderWidth: 0, overflowY: "scroll" }} />
    </div>
  );
}

export default PBPublishedRender;
