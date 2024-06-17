import React, { useState } from "react";
import MEPaperBlock from "../ME  Tools/paper block/MEPaperBlock";
import MEAccordion from "../../../components/Accordion/MEAccordion";
import { Button, TextField, Typography } from "@mui/material";
import BrandCustomization from "./BrandCustomization";
import { useDispatch, useSelector } from "react-redux";
import { reduxToggleUniversalModal } from "../../../redux/redux-actions/adminActions";
import CreateAndEditMenu, { INTERNAL_LINKS } from "./CreateAndEditMenu";
import MEDropdown from "../ME  Tools/dropdown/MEDropdown";
const ITEMS = [
  {
    is_published: true,
    id: 5,
    name: "Home",
    link: "https://example.com/item/5",
    is_link_external: false,
    parent: "category-b",
    order: 4,
    children: [
      {
        is_published: true,
        id: 6,
        name: "Introduction",
        link: "https://external-site.com/item/6",
        is_link_external: true,
        parent: "category-b",
        order: 5
      },
      {
        is_published: true,
        id: 7,
        name: "Overview",
        link: "https://example.com/item/7",
        is_link_external: false,
        parent: "category-b",
        order: 6
      }
    ]
  },
  {
    is_published: true,
    id: 1,
    name: "Actions",
    link: "https://example.com/item/1",
    is_link_external: false,
    parent: "category-a",
    order: 1
  },
  {
    is_published: false,
    id: 2,
    name: "Teams",
    link: "https://example.com/item/2",
    is_link_external: false,
    parent: "category-b",
    order: 2,
    children: [
      {
        is_published: true,
        id: 10,
        name: "Team A",
        link: "https://external-site.com/item/10",
        is_link_external: true,
        parent: "category-b",
        order: 5
      },
      {
        is_published: true,
        id: 11,
        name: "Team B",
        link: "https://example.com/item/11",
        is_link_external: false,
        parent: "category-b",
        children: [
          {
            is_published: true,
            id: 12,
            name: "Team B1",
            link: "https://example.com/item/12",
            is_link_external: false,
            parent: "category-b",
            order: 5
          },
          {
            is_published: true,
            id: 13,
            name: "Team B2",
            link: "https://external-site.com/item/13",
            is_link_external: true,
            parent: "category-b",
            order: 6
          }
        ],
        order: 6
      }
    ]
  },
  {
    is_published: true,
    id: 3,
    name: "Events",
    link: "https://example.com/item/3",
    is_link_external: false,
    parent: "category-a",
    order: 3,
    children: [
      {
        is_published: true,
        id: 8,
        name: "Upcoming Events",
        link: "https://external-site.com/item/8",
        is_link_external: true,
        parent: "category-b",
        order: 5
      },
      {
        is_published: true,
        id: 9,
        name: "Past Events",
        link: "https://example.com/item/9",
        is_link_external: false,
        parent: "category-b",
        order: 6
      }
    ]
  },
  {
    is_published: false,
    id: 4,
    name: "About Us",
    link: "https://example.com/item/4",
    is_link_external: false,
    parent: "category-c",
    order: 7,
    children: [
      {
        is_published: true,
        id: 14,
        name: "Our Story",
        link: "https://example.com/item/14",
        is_link_external: false,
        parent: "category-b",
        order: 5,
        children: [
          {
            is_published: true,
            id: 16,
            name: "Founding",
            link: "https://external-site.com/item/16",
            is_link_external: true,
            parent: "category-b",
            order: 5
          },
          {
            is_published: true,
            id: 17,
            name: "Milestones",
            link: "https://example.com/item/17",
            is_link_external: false,
            parent: "category-b",
            order: 6
          }
        ]
      },
      {
        is_published: true,
        id: 15,
        name: "Mission & Vision",
        link: "https://external-site.com/item/15",
        is_link_external: true,
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
  const [menuItems, setMenu] = useState(ITEMS);
  const [form, setForm] = useState({});
  const dispatch = useDispatch();
  const updateForm = (key, value, reset = false) => {
    if (reset) return setForm({});
    setForm({ ...form, [key]: value });
  };
  const toggleModal = (props) => dispatch(reduxToggleUniversalModal(props));
  const closeModal = () => toggleModal({ show: false, component: null });

  const assembleIntoObject = (parentObj, child) => {
    if (!child) return parentObj;
    const index = parentObj.findIndex((p) => p?.id === child?.id);
    parentObj[index] = child;
    return parentObj;
  };
  const insertNewLink = (linkObj, parents) => {
    closeModal();
    let newObj = linkObj;
    // Convert the parents object into an array of [key, value] pairs
    parents = Object.entries(parents);
    const dealingWithAChild = parents.length > 0;

    // Update the last parent entry with the modified children

    if (dealingWithAChild) {
      // Get the last index in the parents array
      const lastIndex = parents.length - 1;
      // Destructure the key and object from the last parent entry
      const [key, obj] = parents[lastIndex];
      // Get the children of the last parent object, or initialize to an empty array if not present
      const siblings = obj?.children || [];
      // Find the index of an existing child with the same ID as linkObj
      const index = siblings.findIndex((s) => s?.id === linkObj?.id);
      // If a child with the same ID is found, replace it with linkObj; otherwise, add linkObj as a new child
      if (index > -1) siblings[index] = { ...linkObj };
      else siblings.push(linkObj);
      parents[lastIndex] = [key, { ...obj, children: siblings }];
      // Reverse the parents array to facilitate building the updated parent structure
      const reversed = [...parents].reverse();
      // Initialize the accumulator with the first parent's object
      let acc = reversed[0][1];
      // Reassemble the parent objects back into the original structure
      for (let i = 0; i < reversed.length; i++) {
        if (i === reversed.length - 1) break; // Exit the loop when reaching the end of the array
        const nextIndex = i + 1;
        const next = reversed[nextIndex];
        const current = reversed[i];
        // Rebuild the object by nesting the current parent into the next
        acc = assembleIntoObject(next, current);
      }
      newObj = acc;
    }

    // Find the index of the top-level menu item that corresponds to the updated structure
    const ind = menuItems.findIndex((m) => m?.id === newObj?.id);
    // Create a copy of the menu items array to avoid mutating the original state
    const copied = [...menuItems];

    if (ind === -1) copied.push(newObj);
    else copied[ind] = newObj;

    setMenu(copied);
  };

  const addOrEdit = (itemObj, parents = []) => {
    // if (!itemObj) itemObj = { id: new Date().toString() };
    toggleModal({
      show: true,
      noTitle: true,
      fullControl: true,
      component: (
        <CreateAndEditMenu
          insertNewLink={(obj) => insertNewLink(obj, parents)}
          updateForm={updateForm}
          data={itemObj}
        />
      )
    });
  };

  const renderMenuItems = (items, margin = 0, parents = []) => {
    if (!items?.length) return [];
    return items.map(({ children, ...rest }, index) => {
      return (
        <div key={index} style={{ marginLeft: margin, position: "relative" }}>
          {margin ? <LComponent /> : <></>}
          <OneMenuItem
            item={rest}
            children={children}
            remove={toggleModal}
            openModal={toggleModal}
            closeModal={closeModal}
            updateForm={updateForm}
            formData={form}
            parents={parents}
            insertNewLink={insertNewLink}
            addOrEdit={addOrEdit}
          />
          {/* -- I'm spreading "children" here to make sure that we create a copy of the children. We want to make sure we control when the changes show up for the user */}
          {children && renderMenuItems(children, 40, { ...parents, [rest?.id]: { ...rest, children: [...children] } })}
        </div>
      );
    });
  };

  return (
    <div>
      <MEPaperBlock title="Brand Customization">
        {/* <h4>This is what the custom navigation configuration page will look like</h4> */}
        <BrandCustomization />
        {/* <MEDropdown
          data={INTERNAL_LINKS}
          labelExtractor={(l) => l?.name}
          valueExtractor={(l) => l?.link}
          placeholder="Link to a page within your site"
          smartDropdown={false}
        /> */}
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
          <div>{renderMenuItems(menuItems)}</div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ height: 40, border: "dashed 0px #eeeeee", borderLeftWidth: 2 }} />
            <Button
              color="secondary"
              variant="contained"
              onClick={() => addOrEdit({ id: new Date().getTime()?.toString() })}
            >
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

const OneMenuItem = ({ addOrEdit, children, openModal, updateForm, formData, item, parents, insertNewLink }) => {
  const { name, link } = item || {};
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
            {link} <i className="fa fa-external-link" />
          </span>
        )}
      </Typography>
      <div style={{ marginLeft: "auto" }}>
        <i
          onClick={() =>
            addOrEdit({ id: new Date().getTime()?.toString(), children }, [
              { ...item, children: [...(children || [])] }
            ])
          }
          className=" fa fa-plus touchable-opacity"
          style={{ marginRight: 20, color: "green", fontSize: 20 }}
        />
        <i
          onClick={() => addOrEdit({ ...item, children }, parents)}
          className=" fa fa-edit touchable-opacity"
          style={{ fontSize: 20, color: "var(--app-cyan)" }}
        />
      </div>
    </div>
  );
};
