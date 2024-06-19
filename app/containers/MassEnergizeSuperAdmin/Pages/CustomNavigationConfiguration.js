import React, { useEffect, useState } from "react";
import MEPaperBlock from "../ME  Tools/paper block/MEPaperBlock";
import { Button, Link, TextField, Tooltip, Typography } from "@mui/material";
import BrandCustomization from "./BrandCustomization";
import { useDispatch, useSelector } from "react-redux";
import { reduxToggleUniversalModal, reduxToggleUniversalToast } from "../../../redux/redux-actions/adminActions";
import CreateAndEditMenu, { INTERNAL_LINKS } from "./CreateAndEditMenu";
import { EXAMPLE_MENU_STRUCTURE } from "../ME  Tools/media library/shared/utils/values";

const NAVIGATION = "navigation";
const FOOTER = "footer";
const BRAND = "brand";

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
  const [menuItems, setMenu] = useState([]);
  const [form, setForm] = useState({});
  // const [activityContext, setActivityContext] = useState(null);
  const [trackEdited, setEdited] = useState({});
  // const [itemBeforeEdit, setItemBeforeEdit] = useState({});
  const [status, setLoadingStatus] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    setMenu(EXAMPLE_MENU_STRUCTURE?.data?.menu_items);
  }, []);

  const updateForm = (key, value, reset = false) => {
    if (reset) return setForm({});
    setForm({ ...form, [key]: value });
  };
  // const setLoading = (key, value) => setLoadingStatus({ ...status, [key]: value });
  const toggleModal = (props) => dispatch(reduxToggleUniversalModal(props));
  const notify = (message, success = false) => {
    dispatch(reduxToggleUniversalToast({ open: true, message, variant: success ? "success" : "error" }));
  };
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
    // setItemBeforeEdit({});
    // setActivityContext(null);
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
      title: "Reset to default",
      component: <div>Are you sure you want to reset the menu to the default configuration?</div>,
      onConfirm: () => setMenu(ITEMS),
      onCancel: () => console.log("Cancelled")
    });
  };

  const addOrEdit = (itemObj, parents = {}, options = {}) => {
    // setItemBeforeEdit(itemObj);
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

  console.log("WE SEE MENU ITEMS", menuItems);

  const renderMenuItems = (items, margin = 0, parents = {}, options = {}) => {
    if (!items?.length) return [];
    items = items.sort((a, b) => a?.order - b?.order);
    return items.map(({ children, ...rest }, index) => {
      const { parentTraits } = options || {};
      const editTrail = trackEdited[(rest?.id)];
      let activity = editTrail ? ACTIVITIES[(editTrail?.activity)] : null;
      const isRemoved = activity?.key === ACTIVITIES.remove.key;

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
            activity={activity}
            parentTraits={parentTraits || {}}
          />
          {/* -- I'm spreading "children" here to make sure that we create a copy of the children. We want to make sure we control when the changes show up for the user */}
          {children &&
            renderMenuItems(
              children,
              40,
              { ...parents, [rest?.id]: { ...rest, children: [...children] } },
              { parentTraits: { isRemoved }, ...(options || {}) }
            )}
        </div>
      );
    });
  };

  const sendChangesToServer = () => {
    console.log("Sending changes to the server", trackEdited);
  };

  const isLoading = status[NAVIGATION];
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
          Customize your site's navigation here. You can edit, remove and
          <span className="touchable-opacity" style={{ fontWeight: "bold", color: "var(--app-purple)", marginLeft: 5 }}>
            <i className="fa fa-plus" style={{ margin: "0px 5px" }} />
            Add new menu items{" "}
          </span>
          here
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
          <Button
            onClick={() => {
              sendChangesToServer();
            }}
            variant="contained"
            style={{ marginRight: 10 }}
          >
            <Tooltip title={`Save all changes you have made to the menu`}>
              {isLoading ? <i className=" fa fa-spinner fa-spin" /> : <b>Save Changes</b>}
            </Tooltip>
          </Button>
          <Button
            disabled={isLoading}
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

const OneMenuItem = ({ performDeletion, addOrEdit, children, openModal, item, parents, activity, parentTraits }) => {
  const { name, link, id, is_link_external } = item || {};

  const getBackColor = () => {
    if (activity) return activity?.color;
    if (parentTraits?.isRemoved) return ACTIVITIES.remove.color;
    return "white";
  };
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

  const isRemoved = parentTraits?.isRemoved || activity?.key === ACTIVITIES.remove.key;
  return (
    <div
      className=" elevate-float"
      style={{
        padding: "10px 20px",
        display: "inline-flex",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        minWidth: 450,
        borderRadius: 3,
        marginTop: 10,
        background: getBackColor(),
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
        {!children?.length && link && (
          <a href={link} target="_blank">
            <span
              className="touchable-opacity"
              style={{ opacity: 0.5, marginLeft: 15, textDecoration: "underline", fontWeight: "bold", color: "grey" }}
            >
              {link}
              <i className="fa fa-external-link" style={{ margin: "0px 4px" }} />
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
