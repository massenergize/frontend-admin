import { Blocks } from "./blocks";
import React from "react";
const X = "x";
const Y = "y";
export const DIRECTIONS = { X, Y };

const layoutFlow = (direction) => {
  return { display: "flex", flexDirection: direction === DIRECTIONS.X ? "row" : "column" };
};

const renderElement = (element) => {
  const { type, props, direction } = element;
  let Element = Blocks[type] || Blocks.div;
  return <Element {...(props || {})} style={{ ...props?.style, ...layoutFlow(direction, Y) }} />;
};

export const renderSection = (block) => {
  const { direction, element, content, children: childElements } = block || {};
  const { type } = element || {};
  const { text } = element?.props || {};
  if (!element) return null;
  let Tag = Blocks[type] || Blocks.div;
  const Element = ({ style, children, ...rest }) => {
    const containerStyle = { ...style, ...layoutFlow(direction) };
    return (
      <Tag {...rest} style={containerStyle}>
        {children}
      </Tag>
    );
  };
  if (!text && !content) return <Element {...element?.props} />;
  const innerHTML = content || childElements;
  return (
    <Element {...element?.props}>
      {text && text}
      {innerHTML && innerHTML?.map((el) => <React.Fragment key={el?.key}>{renderSection(el)}</React.Fragment>)}
    </Element>
  );
};
