export const SECTION_BLOCK = {
  element: {
    // id: Date.now(),
    type: "div",
    props: { className: "first-container", style: { padding: 20 } }
  },
  direction: "x",
  content: [
    {
      element: { id: new Date().getMilliseconds(), type: "div", props: { className: "container" } },
      direction: "y",
      content: [
        {
          element: { id: new Date().getMilliseconds(), type: "div", props: { className: "container" } },
          direction: "x",
          content: [
            {
              element: {
                id: new Date().getMilliseconds(),
                type: "img",
                props: { src: "https://via.placeholder.com/150", alt: "Placeholder content" }
              }
            },
            {
              element: {
                id: new Date().getMilliseconds(),
                text: "The frog is playing piano",
                type: "p",
                props: { style: { fontWeight: "bold", color: "white" } }
              }
            }
          ]
        }
      ]
    },
    {
      element: { id: new Date().getMilliseconds(), type: "div", props: { className: "container" } },
      direction: "y",
      content: [
        {
          element: {
            id: new Date().getMilliseconds(),
            type: "img",
            props: {
              src: "https://via.placeholder.com/50",
              style: { borderRadius: "50%" },
              alt: "Other image placeholder"
            }
          }
        }
      ]
    }
  ]
};

export const TITLE_BLOCK = {
  element: {
    type: "h2",
    props: { style: { padding: 0, fontSize: 22 }, text: "New title here..." }
  }
};
export const RICH_TEXT_BLOCK = {
  element: {
    type: "richtext",
    props: { style: { padding: 0, margin: 0 }, text: "Add rich text here..." }
  }
};
export const PARAGRAPH_BLOCK = {
  element: {
    type: "p",
    props: { style: { padding: 0, margin: 0 }, text: "Start adding your paragraph here..." }
  }
};
export const BTN_BLOCK = {
  element: {
    type: "button",
    props: {
      className: "pb-block-btn touchable-opacity",
      style: { width: "100%", alignItems: "center" },
      text: "Click Me",
      target: "_blank"
    }
  }
};
export const IMAGE_BLOCK = {
  element: {
    // id: Date.now(),
    type: "img",
    props: {
      style: { padding: 0, objectFit: "contain", width: "100%", height: 250 },
      src: "https://via.placeholder.com/300",
      alt: "Placeholder content"
    }
  }
};
export const VIDEO_BLOCK = {
  element: {
    // id: Date.now(),
    type: "video",
    props: { style: { padding: 10 }, src: "J3oijWs-dCs", alt: "Placeholder content" }
  }
};
export const LINK_BLOCK = {
  element: {
    // id: Date.now(),
    type: "link",

    props: {
      text: "Here is a link, change the url in right panel...",
      style: {},
      href: "https://www.massenergize.org/",
      target: "_blank"
    }
  }
};
export const ICON_BLOCK = {
  element: {
    // id: Date.now(),
    type: "icon",
    props: { style: { color: "#0b9edc" } }
  }
};
