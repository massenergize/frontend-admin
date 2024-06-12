import React from "react";
import MEPaperBlock from "../ME  Tools/paper block/MEPaperBlock";
import MEAccordion from "../../../components/Accordion/MEAccordion";
import { Checkbox, TextField, Typography } from "@mui/material";

const ITEMS = [
  {
    is_live: true,
    id: 5,
    name: "Home",
    url: "https://example.com/item/5",
    parent: "category-b",
    order: 4
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
    order: 2
  },
  {
    is_live: true,
    id: 3,
    name: "Events",
    url: "https://example.com/item/3",
    parent: "category-a",
    order: 3
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
  return (
    <div>
      <MEPaperBlock title="Brand Customization">
        {/* <h4>This is what the custom navigation configuration page will look like</h4> */}
      </MEPaperBlock>

      <MEPaperBlock title="Customize Navigation">
        {[1,2, 3, 4, 5].map((item, index) => {
          return (
            <div key={index} style={{ marginLeft: item % 2 === 0 ? 20 : 0 }}>
              <OneMenuItem />
            </div>
          );
        })}
      </MEPaperBlock>

      <MEPaperBlock title="Customize Footer" />
    </div>
  );
}

export default CustomNavigationConfiguration;
const OneMenuItem = () => {
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
      <Typography variant="body" style={{ margin: 0, fontWeight: "bold" }}>
        Actions
        <span style={{ marginLeft: 15, textDecoration: "underline", fontWeight: "bold", color: "#579ece" }}>
          www.google.com/plenty-words-here <i className="fa fa-external-link" />
        </span>
      </Typography>
      <div style={{ marginLeft: "auto" }}>
        <i className=" fa fa-trash touchable-opacity" style={{ marginRight: 15, fontSize: 20 }} />
        <i className=" fa fa-plus touchable-opacity" style={{ marginRight: 15, fontSize: 20 }} />
        <i className=" fa fa-edit touchable-opacity" style={{ fontSize: 20 }} />
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
