import React from "react";
import MEPaperBlock from "../ME  Tools/paper block/MEPaperBlock";
import MEAccordion from "../../../components/Accordion/MEAccordion";
import { TextField, Typography } from "@mui/material";
import BrandCustomization from "./BrandCustomization";

const ITEMS = [
  {
    is_live: true,
    id: 5,
    name: "Home",
    url: "https://example.com/item/5",
    parent: "category-b",
    order: 4,
    children: [
      {
        is_live: true,
        id: 6,
        name: "Sub-Home",
        url: "https://example.com/item/6",
        parent: "category-b",
        order: 5
      },
      {
        is_live: true,
        id: 7,
        name: "Sub-Home",
        url: "https://example.com/item/7",
        parent: "category-b",
        order: 6
      }
    ]
  },
  {
    is_live: true,
    id: 1,
    name: "Actions",
    url: "https://example.com/item/1",
    parent: "category-a",
    order: 1
  },
  {
    is_live: false,
    id: 2,
    name: "Teams",
    url: "https://example.com/item/2",
    parent: "category-b",
    order: 2,
    children: [
      {
        is_live: true,
        id: 10,
        name: "Sub-Teams",
        url: "https://example.com/item/10",
        parent: "category-b",
        order: 5
      },
      {
        is_live: true,
        id: 11,
        name: "Sub-Teams",
        url: "https://example.com/item/11",
        parent: "category-b",
        children: [
          {
            is_live: true,
            id: 12,
            name: "Sub-Sub-Teams",
            url: "https://example.com/item/12",
            parent: "category-b",
            order: 5
          },
          {
            is_live: true,
            id: 13,
            name: "Sub-Sub-Teams",
            url: "https://example.com/item/13",
            parent: "category-b",
            order: 6
          }
        ],
        order: 6
      }
    ]
  },
  {
    is_live: true,
    id: 3,
    name: "Events",
    url: "https://example.com/item/3",
    parent: "category-a",
    order: 3,
    children: [
      {
        is_live: true,
        id: 8,
        name: "Sub-Events",
        url: "https://example.com/item/8",
        parent: "category-b",
        order: 5
      },
      {
        is_live: true,
        id: 9,
        name: "Sub-Events",
        url: "https://example.com/item/9",
        parent: "category-b",
        order: 6
      }
    ]
  },
  {
    is_live: false,
    id: 4,
    name: "About Us",
    url: "https://example.com/item/4",
    parent: "category-c",
    order: 7
  }
];

function CustomNavigationConfiguration() {
  const renderMenuItems = (margin = 0, items) => {
    if (!items?.length) return [];
    return items.map(({ children, ...rest }, index) => {
      // if (children) return renderMenuItems(margin + 20, children);
      return (
        <div key={index} style={{ marginLeft: margin }}>
          <OneMenuItem {...rest} children={children} />
          {children && renderMenuItems(40, children)}
        </div>
      );
    });
  };

  return (
    <div>
      <MEPaperBlock title="Brand Customization">
        {/* <h4>This is what the custom navigation configuration page will look like</h4> */}
        <BrandCustomization />
      </MEPaperBlock>

      <MEPaperBlock title="Customize Navigation">
        {renderMenuItems(0, ITEMS)}
        {/* {[1, 2, 3, 4, 5].map((item, index) => {
          return (
            <div key={index} style={{ marginLeft: item % 2 === 0 ? 20 : 0 }}>
              <OneMenuItem />
            </div>
          );
        })} */}
      </MEPaperBlock>

      <MEPaperBlock title="Customize Footer" />
    </div>
  );
}

export default CustomNavigationConfiguration;
const OneMenuItem = ({ name, url, children }) => {
  return (
    <div
      className=" elevate-float"
      style={{
        padding: "10px 20px",
        display: "inline-flex",
        flexDirection: "row",
        alignItems: "center",
        width: "60%",
        borderRadius: 3,
        marginTop: 10
      }}
    >
      <Typography
        variant="body"
        // className="touchable-opacity"
        style={{
          margin: 0,
          fontWeight: "bold",

          display: "flex",
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <i className=" fa fa-trash touchable-opacity" style={{ color: "#e87070", marginRight: 10, fontSize: 12 }} />
        {name}
        {!children && (
          <span
            className="touchable-opacity"
            style={{ opacity: 0.5, marginLeft: 15, textDecoration: "underline", fontWeight: "bold", color: "grey" }}
          >
            {url} <i className="fa fa-external-link" />
          </span>
        )}
      </Typography>
      <div style={{ marginLeft: "auto" }}>
        {/* <i className=" fa fa-trash touchable-opacity" style={{ marginRight: 15, fontSize: 20 }} /> */}
        <i className=" fa fa-plus touchable-opacity" style={{ marginRight: 20, color: "green", fontSize: 20 }} />
        <i className=" fa fa-edit touchable-opacity" style={{ fontSize: 20, color: "var(--app-cyan)" }} />
      </div>
    </div>
  );
};

const CreateAndEditMenuItem = () => {
  return (
    <div
      style={{
        padding: "25px 30px",
        border: "solid 2px #f5f4f9",
        marginBottom: 10,
        borderTopColor: "white",
        minHeight: 200,
        width: "100%"
      }}
    >
      <div />
      <TextField
        style={{ width: "100%" }}
        label="Name"
        placeholder="Name"
        InputLabelProps={{
          shrink: true
        }}
        inputProps={{ style: { padding: "12px 20px", width: "100%" } }}
        variant="outlined"
      />
    </div>
  );
};
const Header = ({ toggle, name, is_live, url, parent, order }) => {
  return (
    <div
      // onClick={() => toggle()}
      className="touchable-opacity elevate-float"
      style={{
        padding: "10px 20px",
        display: "inline-flex",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        borderRadius: 3,
        marginTop: 10
      }}
    >
      <Typography variant="body" onClick={() => toggle()} style={{ margin: 0, width: "90%", fontWeight: "bold" }}>
        <span style={{ marginRight: 10, opacity: 0.3, fontWeight: "bold", color: "var(--app-purple)" }}>#{order}</span>
        {name || "..."}
      </Typography>
      <div style={{ marginLeft: "auto", display: "flex", flexDirection: "row", alignItems: "center" }}>
        <i className="fa fa-plus-square" style={{ marginRight: 15, fontSize: 21, color: "var(--app-purple)" }} />
        <i className="fa fa-caret-down" onClick={() => toggle()} />
      </div>
    </div>
  );
};
