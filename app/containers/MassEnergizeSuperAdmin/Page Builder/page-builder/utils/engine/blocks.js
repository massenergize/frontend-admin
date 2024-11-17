import React, { useEffect, useRef } from "react";
import {
  BUTTON_PROPS,
  IMAGE_PROPS,
  LINK_PROPS,
  RICH_TEXT_PROPS,
  TITLE_PROPS,
  VIDEO_PROPS
} from "../../components/sidepanels/property-data";
import { BTN_BLOCK, IMAGE_BLOCK, LINK_BLOCK, RICH_TEXT_BLOCK, TITLE_BLOCK, VIDEO_BLOCK } from "./data";

export const BLOCKS = [
  { name: "Title", icon: "fa-font", key: "title", template: TITLE_BLOCK, properties: TITLE_PROPS },
  { name: "Button", icon: "fa-square", key: "button", template: BTN_BLOCK, properties: BUTTON_PROPS },
  {
    name: "Rich Text",
    icon: "fa-paragraph",
    key: "richtext",
    template: RICH_TEXT_BLOCK,
    properties: RICH_TEXT_PROPS
  },
  { name: "Link", icon: "fa-link", key: "link", template: LINK_BLOCK, properties: LINK_PROPS },
  // { name: "Section", icon: "fa-square-o", key: "section", template: SECTION_BLOCK },
  { name: "Video", icon: "fa-play-circle", key: "video", template: VIDEO_BLOCK, properties: VIDEO_PROPS },
  { name: "Image", icon: "fa-image", key: "image", template: IMAGE_BLOCK, properties: IMAGE_PROPS }
  // { name: "Icon", icon: "fa-circle-o", key: "icon", template: ICON_BLOCK, properties: DEFAULT_PROPERTIES }
];

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
  const { children, __html, style, ...rest } = props || {};
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
        style={{ width: "100%", border: "none", height: "auto", pointerEvents: "none", ...(style || {}) }}
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

const youtubeLink = (src) => {
  if (!src) return `https://www.youtube.com/embed/J3oijWs-dCs`;
  return `https://www.youtube.com/embed/${src}`;
};
export const YoutubeVideo = (props) => {
  const { style, src, ...rest } = props || {};
  return (
    <div
      {...rest}
      style={{ position: "relative", paddingBottom: "56.25%", height: 600, overflow: "hidden", ...(style || {}) }}
    >
      <iframe
        src={youtubeLink(src)}
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
  richtext: RichText,
  button: Button
};

export const Tags = {
  div: { type: "div" },
  img: { type: "img" },
  p: { type: "p" },
  span: { type: "span" },
  h2: { type: "h2" },
  video: { type: "iframe" },
  link: { type: "a" },
  icon: { type: "i" },
  richtext: { type: "div" },
  button: {
    type: "a",
    style: {
      "border-radius": "4px",
      cursor: "pointer",
      background: "#9fddeb47",
      border: "solid 0px #0b9edc",
      padding: "10px 20px",
      color: "#0b9edc",
      "font-weight": "bold"
    }
  }
};
