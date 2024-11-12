import React, { useEffect, useRef } from "react";

export const Div = (props) => {
  const { children, ...rest } = props || {};
  return <div {...rest}>{children}</div>;
};

export const Image = (props) => {
  //   const { children, ...rest } = props || {};
  return <img alt="default media alt" {...props} />;
};

export const Paragraph = (props) => {
  const { children, ...rest } = props || {};
  return <p {...rest}>{children}</p>;
};
export const RichText = (props) => {
  const iframeRef = useRef();
  const { children, __html, ...rest } = props || {};
  // return <div className="rogue-div" {...rest} dangerouslySetInnerHTML={{ __html }} />;

  useEffect(() => {
    const adjustHeight = () => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        const iframeDocument = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
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
          <body>${__html || "<p>Add your rich text here...</p>"}</body>
        </html>
      `);
      doc.close();
    }
  }, [__html]);
  return (
    <div style={{ position: "relative" }}>
      <iframe
        ref={iframeRef}
        title="Rich Text Display"
        style={{ width: "100%", border: "none", height: "auto", pointerEvents: "none" }}
      />
    </div>
  );
};
export const Title = (props) => {
  const { children, ...rest } = props || {};
  return <h2 {...rest}>{children}</h2>;
};
export const Span = (props) => {
  const { children, ...rest } = props || {};
  return <span {...rest}>{children}</span>;
};
export const Link = (props) => {
  const { children, style, ...rest } = props || {};
  return (
    <a target="_blank" style={{ width: "fit-content", ...(style || {}) }} {...rest}>
      {children}
    </a>
  );
};
export const Button = (props) => {
  const { children, text, ...rest } = props || {};
  return <a {...rest}>{text || children}</a>;
};
export const Icon = (props) => {
  const { faIcon, ...rest } = props || {};
  return (
    <span>
      <i className={`fa ${faIcon || "fa-globe"}`} {...rest} />
    </span>
  );
};
export const YoutubeVideo = (props) => {
  const { style, src, ...rest } = props || {};
  return (
    <div
      {...rest}
      style={{ position: "relative", paddingBottom: "56.25%", height: 600, overflow: "hidden", ...(style || {}) }}
    >
      <iframe
        src={src || `https://www.youtube.com/embed/J3oijWs-dCs`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
          pointerEvents: "none"
        }}
      />
    </div>
  );
};

export const Blocks = {
  div: Div,
  img: Image,
  p: Paragraph,
  span: Span,
  h2: Title,
  video: YoutubeVideo,
  link: Link,
  icon: Icon,
  richtext: RichText
};
