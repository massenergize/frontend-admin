import React from "react";
import MEPaperBlock from "../ME  Tools/paper block/MEPaperBlock";
import MEAccordion from "../../../components/Accordion/MEAccordion";

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
        <div style={{ width: "60%" }}>
          {ITEMS.map((item, index) => {
            return (
              <MEAccordion
                key={index}
                header={(props) => <Header {...props} {...item} />}
                render={() => <CreateAndEditMenuItem />}
              />
            );
          })}
        </div>
      </MEPaperBlock>
    </div>
  );
}

export default CustomNavigationConfiguration;

const CreateAndEditMenuItem = () => {
  return (
    <div
      style={{ border: "solid 2px #f5f4f9", marginBottom: 10, borderTopColor: "white", minHeight: 200, width: "100%" }}
    >
      <ul>
        <li>Sunday</li>
        <li>Monday</li>
        <li>Tuesday</li>
      </ul>
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
      <h5 onClick={() => toggle()} style={{ margin: 0, width: "90%" }}>
        <span style={{ marginRight: 10, opacity: 0.3, fontWeight: "bold", color: "var(--app-purple)" }}>#{order}</span>
        {name || "..."}
      </h5>
      <div style={{ marginLeft: "auto", display: "flex", flexDirection: "row", alignItems: "center" }}>
        <i className="fa fa-plus-square" style={{ marginRight: 15, fontSize: 21, color: "var(--app-purple)" }} />
        <i className="fa fa-caret-down" onClick={() => toggle()} />
      </div>
    </div>
  );
};
