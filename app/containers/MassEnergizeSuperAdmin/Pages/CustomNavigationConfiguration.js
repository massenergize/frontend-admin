import React, { useEffect, useState } from "react";
import MEPaperBlock from "../ME  Tools/paper block/MEPaperBlock";
import MEAccordion from "../../../components/Accordion/MEAccordion";
import { Button, Link, TextField, Tooltip, Typography } from "@mui/material";
import BrandCustomization from "./BrandCustomization";
import { useDispatch, useSelector } from "react-redux";
import { reduxToggleUniversalModal } from "../../../redux/redux-actions/adminActions";
import CreateAndEditMenu, { INTERNAL_LINKS } from "./CreateAndEditMenu";
import MEDropdown from "../ME  Tools/dropdown/MEDropdown";
import { isEqual } from "lodash";
const ITEMS = [
  {
    is_published: true,
    id: 5,
    name: "Home",
    link: "https://example.com/item/5",
    is_link_external: false,
    parent: "category-b",
    order: 0,
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

const ACTIVITIES = {
  edit: { key: "edit", description: "This item was edited, and unsaved!", color: "#fffcf3" },
  add: { key: "add", description: "This item is new, and unsaved!", color: "#f4fff4" },
  remove: { key: "remove", description: "This item is removed, but changes are not saved yet!", color: "#ffeded" }
};
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
  const [activityContext, setActivityContext] = useState(null);
  const [trackEdited, setEdited] = useState({});
  const [itemBeforeEdit, setItemBeforeEdit] = useState({});

  const dispatch = useDispatch();
  const updateForm = (key, value, reset = false) => {
    if (reset) return setForm({});
    setForm({ ...form, [key]: value });
  };
  const toggleModal = (props) => dispatch(reduxToggleUniversalModal(props));
  const closeModal = () => toggleModal({ show: false, component: null });

  const assembleIntoObject = (parentObj, child) => {
    if (!child) return parentObj;
    const index = parentObj?.children?.findIndex((p) => p?.id === child?.id);
    if (index > -1) parentObj.children[index] = child;
    return parentObj;
  };

  const createChangeObject = (changedVersion, options = {}) => {
    return { data: { ...changedVersion }, activity: options?.context };
  };

  const resetActivityContext = () => {
    setItemBeforeEdit({});
    setActivityContext(null);
  };

  const hasChanged = (oldObj, newObj) => {
    const keys = Object.keys(oldObj);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (oldObj[key] !== newObj[key]) return true;
    }
  };

  const trackChanges = (changedVersion, options) => {
    const { context, itemBefore } = options || {};
    // Checks if an item has been edited, and if it has, it marks it as edited
    // When  a new item is added or one is removed, it is marked as such
    if (context === ACTIVITIES.edit.key) {
      const itemHasChanged = hasChanged(changedVersion, itemBefore);
      if (!itemHasChanged) return resetActivityContext();
    }
    setEdited({ ...trackEdited, [changedVersion?.id]: createChangeObject(changedVersion, options) });
    resetActivityContext();
  };

  const insertNewLink = (linkObj, parents, options = {}) => {
    closeModal();
    let newObj = linkObj;
    parents = Object.entries(parents);
    const dealingWithAChild = parents.length > 0;
    if (dealingWithAChild) {
      const lastIndex = parents.length - 1;
      const [key, obj] = parents[lastIndex];
      const siblings = [...(obj?.children || [])];
      const index = siblings.findIndex((s) => s?.id === linkObj?.id);
      if (index > -1) siblings[index] = { ...linkObj };
      else siblings.push({ ...linkObj });
      parents[lastIndex] = [key, { ...obj, children: [...siblings] }];
      newObj = rollUp(parents);
    }
    addToTopLevelMenu(newObj);
    trackChanges(linkObj, options);
  };

  const rollUp = (parents) => {
    const reversed = [...parents].reverse();
    let acc = reversed[0][1];
    for (let i = 0; i < reversed.length; i++) {
      if (i === reversed.length - 1) break; // Exit the loop when reaching the end of the array
      const nextIndex = i + 1;
      const next = reversed[nextIndex];
      acc = assembleIntoObject(next[1], acc);
    }
    return acc;
  };
  const addToTopLevelMenu = (obj) => {
    const ind = menuItems.findIndex((m) => m?.id === obj?.id);
    const copied = [...menuItems];
    if (ind === -1) copied.push(obj);
    else copied[ind] = obj;
    setMenu(copied);
  };

  const removeItem = (itemObj, parents, options = {}) => {
    closeModal();
    parents = Object.entries(parents);
    const dealingWithAChild = parents.length > 0;
    if (!dealingWithAChild) {
      const newMenu = menuItems.filter((m) => m?.id !== itemObj?.id);
      trackChanges(itemObj, { ...options, context: ACTIVITIES.remove.key });

      // return setMenu(newMenu); Unccomment when we want to remove the item from the state
      return;
    }
    let parentAsObj = itemObj;
    const lastIndex = parents.length - 1;
    const [id, immediateParent] = parents[lastIndex];
    let family = immediateParent?.children || [];
    family = family.filter((f) => f?.id !== itemObj?.id);
    parents[lastIndex] = [id, { ...immediateParent, children: [...family] }];
    //if you want to remove the item from the state, uncomment the  code below
    // parentAsObj = rollUp(parents);
    // addToTopLevelMenu(parentAsObj);
    trackChanges(itemObj, { ...options, context: ACTIVITIES.remove.key });
  };

  const resetToDefault = () => {
    toggleModal({
      show: true,
      title: "Reset Custom Menu",
      component: <div>Are you sure you want to reset the menu to the default configuration?</div>,
      onConfirm: () => setMenu(ITEMS),
      onCancel: () => console.log("Cancelled")
    });
  };

  const addOrEdit = (itemObj, parents = {}, options = {}) => {
    setItemBeforeEdit(itemObj);
    toggleModal({
      show: true,
      noTitle: true,
      fullControl: true,
      component: (
        <CreateAndEditMenu
          insertNewLink={(obj) => insertNewLink(obj, parents, { ...options, itemBefore: itemObj })}
          updateForm={updateForm}
          data={itemObj}
        />
      )
    });
  };

  const renderMenuItems = (items, margin = 0, parents = {}) => {
    if (!items?.length) return [];
    items = items.sort((a, b) => a?.order - b?.order);
    return items.map(({ children, ...rest }, index) => {
      const editTrail = trackEdited[(rest?.id)];

      return (
        <div key={index} style={{ marginLeft: margin, position: "relative" }}>
          {margin ? <LComponent /> : <></>}
          <OneMenuItem
            item={rest}
            children={children}
            // remove={toggleModal}
            openModal={toggleModal}
            closeModal={closeModal}
            updateForm={updateForm}
            formData={form}
            parents={parents}
            insertNewLink={insertNewLink}
            addOrEdit={addOrEdit}
            performDeletion={removeItem}
            editTrail={editTrail}
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
              onClick={() => addOrEdit({ id: new Date().getTime()?.toString() }, {}, { context: ACTIVITIES.add.key })}
            >
              <Tooltip title={`Add a new menu item`}>
                <b>Add New Item</b>
              </Tooltip>
            </Button>
          </div>
        </div>

        <br />
        <div style={{ border: "dashed 1px #61616129", padding: "20px 30px", display: "flex", flexDirection: "row" }}>
          <Button variant="contained" style={{ marginRight: 10 }}>
            <Tooltip title={`Save all changes you have made to the menu`}>
              <b>Save Changes</b>
            </Tooltip>
          </Button>
          <Button
            style={{ marginRight: 10, textDecoration: "underline", color: "#d22020", textTransform: "capitalize" }}
            onClick={() => resetToDefault()}
          >
            <Tooltip title={`Reverse all  custom changes you have made`}>
              <b>Reset menu to default</b>
            </Tooltip>
          </Button>
        </div>
      </MEPaperBlock>
    </div>
  );
}

export default CustomNavigationConfiguration;

const OneMenuItem = ({
  performDeletion,
  addOrEdit,
  children,
  openModal,
  updateForm,
  formData,
  item,
  parents,
  insertNewLink,
  editTrail
  // removeChildrenToo
}) => {
  let activity = editTrail ? ACTIVITIES[(editTrail?.activity)] : null;
  const { name, link, id, is_link_external } = item || {};
  const removeMenuItem = () => {
    const hasChildren = children?.length > 0;
    let message = `Are you sure you want to remove "${item?.name}" from the menu?`;
    if (hasChildren)
      message = `If you remove "${item?.name}", all it's (${children?.length ||
        ""}) children will be removed. Are you sure you want to continue?`;
    openModal({
      show: true,
      title: "Delete Confirmation",
      component: <div>{message}</div>,
      onConfirm: () => performDeletion(item, parents)
    });
  };

  const parentsForNewItem = { ...(parents || {}), [item?.id]: { ...item, children: [...(children || [])] } };

  const isRemoved = activity?.key === ACTIVITIES.remove.key;
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
        background: activity ? activity.color : "white",
        textDecoration: isRemoved ? "line-through" : "none"
      }}
    >
      <Typography
        variant="body"
        style={{
          margin: 0,
          fontWeight: "bold",

          display: "flex",
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <Tooltip title={`Remove "${name}"`}>
          <i
            onClick={() => removeMenuItem()}
            className=" fa fa-trash touchable-opacity"
            style={{ color: "#e87070", marginRight: 10, fontSize: 12 }}
          />
        </Tooltip>
        <Tooltip title={activity ? activity?.description : ""}>
          <b>{name}</b>
        </Tooltip>
        {is_link_external && (
          <span
            style={{
              fontWeight: "bold",
              border: "solid 1px var(--app-purple)",
              padding: "0px 5px",
              marginLeft: 10,
              fontSize: 10,
              color: "var(--app-purple)",
              borderRadius: 2
            }}
          >
            <Tooltip title={`This is an external link`}>
              <b>EXT</b>
            </Tooltip>
          </span>
        )}
        {!children && (
          <a href={link} target="_blank">
            <span
              className="touchable-opacity"
              style={{ opacity: 0.5, marginLeft: 15, textDecoration: "underline", fontWeight: "bold", color: "grey" }}
            >
              {link}
              <i className="fa fa-external-link" />
            </span>
          </a>
        )}
      </Typography>
      {!isRemoved && (
        <div style={{ marginLeft: "auto" }}>
          <Tooltip title={`New: Add a sub-menu item to "${name}"`}>
            <i
              onClick={() =>
                addOrEdit({ id: new Date().getTime()?.toString() }, parentsForNewItem, { context: ACTIVITIES.add.key })
              }
              className=" fa fa-plus touchable-opacity"
              style={{ marginRight: 20, color: "green", fontSize: 20 }}
            />
          </Tooltip>

          <Tooltip title={`Edit: Make changes to "${name}"`}>
            <i
              onClick={() => addOrEdit({ ...item, children }, parents, { context: ACTIVITIES.edit.key })}
              className=" fa fa-edit touchable-opacity"
              style={{ fontSize: 20, color: "var(--app-cyan)" }}
            />
          </Tooltip>
        </div>
      )}
    </div>
  );
};
