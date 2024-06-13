import React from "react";
import MEPaperBlock from "../ME  Tools/paper block/MEPaperBlock";
import MEAccordion from "../../../components/Accordion/MEAccordion";
import { Button, TextField, Typography } from "@mui/material";
import BrandCustomization from "./BrandCustomization";
import { useDispatch, useSelector } from "react-redux";
import { reduxToggleUniversalModal } from "../../../redux/redux-actions/adminActions";
import CreateAndEditMenu from "./CreateAndEditMenu";

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
    order: 7,
    children: [
      {
        is_live: true,
        id: 14,
        name: "Sub-About Us",
        url: "https://example.com/item/14",
        parent: "category-b",
        order: 5,
        children: [
          {
            is_live: true,
            id: 16,
            name: "Sub-Sub-About Us",
            url: "https://example.com/item/16",
            parent: "category-b",
            order: 5
          },
          {
            is_live: true,
            id: 17,
            name: "Sub-Sub-About Us",
            url: "https://example.com/item/17",
            parent: "category-b",
            order: 6
          }
        ]
      },
      {
        is_live: true,
        id: 15,
        name: "Sub-About Us",
        url: "https://example.com/item/15",
        parent: "category-b",
        order: 6
      }
    ]
  }
];

const LComponent = () => {
  return (
    <div
      style={{
        position: "absolute",
        height: 25,
        width: 24,
        border: "dashed 0px #e0e0e0",
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        opacity: 0.5,
        top: 10,
        left: -25
      }}
    />
  );
};
function CustomNavigationConfiguration() {
  const dispatch = useDispatch();

  const toggleModal = (props) => dispatch(reduxToggleUniversalModal(props));
  const closeModal = () => toggleModal({ show: false, component: null });

  const renderMenuItems = (margin = 0, items) => {
    if (!items?.length) return [];
    return items.map(({ children, ...rest }, index) => {
      return (
        <div key={index} style={{ marginLeft: margin, position: "relative" }}>
          {margin ? <LComponent /> : <></>}
          <OneMenuItem
            {...rest}
            children={children}
            remove={toggleModal}
            openModal={toggleModal}
            closeModal={closeModal}
          />
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
        <Typography variant="body" style={{ marginBottom: 10 }}>
          Add and customize your site's navigation here. You can add, edit, and remove menu items.
        </Typography>
        <div
          style={{
            border: "dashed 1px #61616129",
            padding: 20,
            margin: "10px 0px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "#fafafa"
          }}
        >
          <div>{renderMenuItems(0, ITEMS)}</div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ height: 40, border: "dashed 0px #eeeeee", borderLeftWidth: 2 }} />
            <Button color="secondary" variant="contained">
              Add New Item
            </Button>
          </div>
        </div>

        <br />
        <div style={{ border: "dashed 1px #61616129", padding: "20px 30px", display: "flex", flexDirection: "row" }}>
          <Button variant="contained" style={{ marginRight: 10 }}>
            Save Changes
          </Button>
          <Button
            style={{ marginRight: 10, textDecoration: "underline", color: "#d22020", textTransform: "capitalize" }}
          >
            Reset all menus to default
          </Button>
        </div>
      </MEPaperBlock>

      {/* <MEPaperBlock title="Customize Footer" /> */}
    </div>
  );
}

export default CustomNavigationConfiguration;

const OneMenuItem = ({ name, url, children, openModal }) => {
  const removeMenuItem = () => {
    openModal({
      show: true,
      title: "Remove Item Confirmation",
      component: (
        <div>
          If you remove items, all it's ({children?.length || ""}) children will be removed as well. Are you sure you
          want to continue?
        </div>
      ),
      onConfirm: () => console.log("Remove item")
    });
  };
  const edit = () => {
    openModal({
      show: true,
      noTitle: true,
      fullControl: true,
      component: <CreateAndEditMenu />
    });
  };
  return (
    <div
      className=" elevate-float"
      style={{
        padding: "10px 20px",
        display: "inline-flex",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        borderRadius: 3,
        marginTop: 10,
        background: "white"
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
        <i
          onClick={() => removeMenuItem()}
          className=" fa fa-trash touchable-opacity"
          style={{ color: "#e87070", marginRight: 10, fontSize: 12 }}
        />
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
        <i
          onClick={() => edit()}
          className=" fa fa-edit touchable-opacity"
          style={{ fontSize: 20, color: "var(--app-cyan)" }}
        />
      </div>
    </div>
  );
};
