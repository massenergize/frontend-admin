import React, { useEffect, useMemo, useState } from "react";
import MEPaperBlock from "../ME  Tools/paper block/MEPaperBlock";
import { Button, Link, Paper, TextField, Tooltip, Typography } from "@mui/material";
import BrandCustomization from "./BrandCustomization";
import { useDispatch, useSelector } from "react-redux";
import {
  reduxAddMenuConfiguration,
  reduxToggleUniversalModal,
  reduxToggleUniversalToast
} from "../../../redux/redux-actions/adminActions";
import CreateAndEditMenu, { INTERNAL_LINKS } from "./CreateAndEditMenu";
import { EXAMPLE_MENU_STRUCTURE } from "../ME  Tools/media library/shared/utils/values";
import Loading from "dan-components/Loading";
import MEDropdown from "../ME  Tools/dropdown/MEDropdown";
import { apiCall } from "../../../utils/messenger";
import { fetchParamsFromURL, smartString } from "../../../utils/common";
import { FLAGS } from "../../../components/FeatureFlags/flags";
import Feature from "../../../components/FeatureFlags/Feature";

const NAVIGATION = "navigation";
const FOOTER = "footer";
const BRAND = "brand";
const INIT = "INIT";
const RESET = "RESET";
const UP = "up";
const DOWN = "down";

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
  const [trackEdited, setEdited] = useState({});
  const [status, setLoadingStatus] = useState({});
  const [activeStash, setActiveStash] = useState({});
  const [menuProfileStash, stashMenuProfiles] = useState([]);
  const [error, setError] = useState(null);
  const [brandForm, setBrandForm] = useState({});
  // ----- For Dragging and Dropping ------
  const [dragged, setBeingDragged] = useState(null);
  const [mouse, setMouse] = useState([]);
  const [dropZone, setDropZone] = useState(null);

  const menuHeap = useSelector((state) => state.getIn(["menuConfigurations"]));
  const { comId: community_id } = fetchParamsFromURL(window.location, "comId");
  const dispatch = useDispatch();
  const keepInRedux = (menuProfiles, options) =>
    dispatch(
      reduxAddMenuConfiguration({
        ...menuHeap,
        [community_id]: { data: menuProfiles, ...(options || {}) }
      })
    );

  const recreateProfileFromList = (updatedList) => {
    const profile = { ...activeStash, content: updatedList };
    const rem = menuProfileStash.filter((m) => dm?.id !== profile?.id);
    return [...rem, profile];
  };

  const placeDetails = (menuObject) => {
    setMenu(menuObject?.content || []);
    setActiveStash(menuObject);
    gatherBrandInfo(menuObject);
    // set footer details too here...
  };

  const loadContent = () => {
    setLoading(INIT, true);
    apiCall("menus.listForAdmins", { community_id })
      .then((response) => {
        setLoading(INIT, false);
        if (!response?.success) return setError(response?.message);
        const menuProfiles = response?.data || [];
        // dispatch(reduxAddMenuConfiguration({ ...menuHeap, [community_id]: data }));
        stashMenuProfiles(menuProfiles);
        keepInRedux(menuProfiles);
        const activeMenu = menuProfiles[0];
        placeDetails(activeMenu);
      })
      .catch((er) => {
        setLoading(INIT, false);
        setError(er?.toString());
      });
  };

  useEffect(() => {
    const reduxObj = (menuHeap || {})[community_id];
    const menuProfiles = reduxObj?.data || [];
    if (!menuProfiles?.length) return loadContent();
    const menuObj = menuProfiles[0];
    setEdited(reduxObj?.changeTree || {});
    placeDetails(menuObj);
  }, []);

  // Add mouse move handler
  useEffect(() => {
    const handler = (e) => {
      setMouse([e.x, e.y]);
    };
    document.addEventListener("mousemove", handler);
    return () => document.removeEventListener("mousemove", handler);
  }, []);

  // Track closest drop-zone to dragged item
  useEffect(() => {
    if (dragged !== null) {
      // get all drop-zones
      const elements = Array.from(document.getElementsByClassName("nav-drop-zone"));
      const parentIds = elements.map((e) => e.getAttribute("data-parent-ids"));
      const indexes = elements.map((e) => e.getAttribute("data-index"));
      const where = elements.map((e) => e.getAttribute("data-position"));
      const idsOfItems = elements.map((e) => e.getAttribute("data-id"));
      // get all drop-zones' y-axis position
      const positions = elements.map((e) => e.getBoundingClientRect().top);
      // get the difference with the mouse's y position
      const absDifferences = positions.map((v) => Math.abs(v - mouse[1]));
      // get the index of the dropzone closest to the mouse
      let result = absDifferences.indexOf(Math.min(...absDifferences));
      const placement = where[result];
      setDropZone({
        parentIds: parentIds[result],
        index: indexes[result], // The index of the item that is currently at the position that we are trying to drop the dragged item
        uniqueId: `${parentIds[result]}->${indexes[result]}->${placement}`,
        id: idsOfItems[result],
        placement //up or down : Helps determine whether to add or subtract from index
      });
    }
  }, [dragged, mouse]);

  useEffect(() => {
    const handler = (e) => {
      if (!dragged) return;
      e.preventDefault();
      setBeingDragged(null);
      reorder();
    };
    document.addEventListener("mouseup", handler);
    return () => document.removeEventListener("mouseup", handler);
  });

  /**
   *
   * @param {*} dragObject - Item that is set in the state when drage starts
   * @param {*} list -  original list of menu items
   * @returns
   */
  const removeDraggedItem = (dragObject, list) => {
    if (!dragObject) return list;
    const { item, parents } = dragObject;
    const parentsArr = Object.values(parents);
    const isTopLevelItem = parentsArr?.length === 0;
    if (isTopLevelItem) return list.filter((m) => m?.id !== item?.id);
    const immediateParent = parentsArr[parentsArr.length - 1];
    let sibblings = immediateParent?.children || [];
    sibblings = sibblings.filter((s) => s?.id !== item?.id);
    parents[(immediateParent?.id)] = { ...immediateParent, children: sibblings };
    const newObj = rollUp(Object.entries(parents));
    return insertIntoTopLevelList(newObj, list);
  };
  const unWrapTo = (parentIdList, mother) => {
    const tracker = { [mother?.id]: { ...mother, children: [...(mother?.children || [])] } };
    parentIdList = parentIdList.slice(1);
    let current = mother;
    for (let i = 0; i < parentIdList.length; i++) {
      const key = parentIdList[i];
      const found = current?.children?.find((m) => m?.id === key);
      tracker[(found?.id)] = found;
      current = found;
    }
    return tracker;
  };

  const dragIntoNewPosition = (positionInformation, topLevelList) => {
    const { parentIds, index, placement } = positionInformation;
    const newPosition = placement === UP ? index : Number(index) + 1;
    const pIds = (parentIds?.split(":") || []).filter(Boolean);
    const isTopLevelItem = pIds.length === 0;
    if (isTopLevelItem) {
      const sibblings = [...topLevelList];
      sibblings.splice(newPosition, 0, dragged?.item);
      return sibblings;
    }
    const mother = topLevelList?.find((m) => m?.id === pIds[0]);
    const parentsAsObject = unWrapTo(pIds, mother);
    const immediateParent = Object.values(parentsAsObject)[pIds.length - 1];
    const sibblings = immediateParent?.children || [];
    sibblings.splice(newPosition, 0, dragged?.item);
    immediateParent.children = sibblings;
    parentsAsObject[(immediateParent?.id)] = immediateParent;
    const newObj = rollUp(Object.entries(parentsAsObject));
    return insertIntoTopLevelList(newObj, topLevelList);
  };

  const reorder = () => {
    if (!dropZone || dropZone?.id === dragged?.item?.id) return;
    // Dragged item has been removed, top level list is modified, and ready for insertion
    const listAfterDraggedIsRemoved = removeDraggedItem(dragged, [...menuItems]);
    const listAfterDragInsertion = dragIntoNewPosition(dropZone, listAfterDraggedIsRemoved);
    setStateAndExport(listAfterDragInsertion, trackEdited);
  };

  const updateForm = (key, value, reset = false) => {
    if (reset) return setForm({});
    setForm({ ...form, [key]: value });
  };
  const setLoading = (key, value) => setLoadingStatus({ ...status, [key]: value });
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
    const newChangeObject = { ...trackEdited, [changedVersion?.id]: createChangeObject(changedVersion, options) };
    setEdited(newChangeObject);
    return newChangeObject;
    // resetActivityContext();
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
    const newChanges = trackChanges(linkObj, options);
    addToTopLevelMenu(newObj, newChanges);
    // trackChanges(linkObj, options);
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
  const insertIntoTopLevelList = (obj, array) => {
    array = [...array];
    const ind = array.findIndex((m) => m?.id === obj?.id);
    if (ind === -1) array.push(obj);
    else array[ind] = obj;
    return array;
  };
  const setStateAndExport = (newState, changeTree = null) => {
    setMenu(newState);
    const profileList = recreateProfileFromList(newState);
    keepInRedux(profileList, { changeTree });
  };
  const addToTopLevelMenu = (obj, changeTree = null) => {
    const copied = insertIntoTopLevelList(obj, menuItems);
    setStateAndExport(copied, changeTree);
  };

  const removeItem = (itemObj, parents, options = {}) => {
    closeModal();
    parents = Object.entries(parents);
    const dealingWithAChild = parents.length > 0;
    if (!dealingWithAChild) {
      const newMenu = menuItems.filter((m) => m?.id !== itemObj?.id);
      // trackChanges(itemObj, { ...options, context: ACTIVITIES.remove.key });
      return setMenu(newMenu);
    }
    let parentAsObj = itemObj;
    const lastIndex = parents.length - 1;
    const [id, immediateParent] = parents[lastIndex];
    let family = immediateParent?.children || [];
    family = family.filter((f) => f?.id !== itemObj?.id);
    parents[lastIndex] = [id, { ...immediateParent, children: [...family] }];
    //if you want to remove the item from the state, uncomment the  code below
    parentAsObj = rollUp(parents);
    addToTopLevelMenu(parentAsObj);
    // trackChanges(itemObj, { ...options, context: ACTIVITIES.remove.key });
  };

  const resetToDefault = () => {
    toggleModal({
      show: true,
      title: "Reset to default",
      component: <div>Are you sure you want to reset the menu to the default configuration?</div>,
      onConfirm: () => makeRequestToReset(),
      onCancel: () => closeModal()
    });
  };

  const addOrEdit = (itemObj, parents = {}, options = {}) => {
    // setItemBeforeEdit(itemObj);
    const { children, isEdit } = options || {};
    toggleModal({
      show: true,
      noTitle: true,
      fullControl: true,
      component: (
        <CreateAndEditMenu
          isEdit={isEdit}
          children={children}
          parents={parents}
          cancel={closeModal}
          insertNewLink={(obj) => insertNewLink(obj, parents, { ...options, itemBefore: itemObj })}
          updateForm={updateForm}
          data={itemObj}
        />
      )
    });
  };

  const combineKeysWithDelimiter = (keys, delimiter = ":") => keys.join(delimiter);
  const renderMenuItems = (items, margin = 0, parents = {}, options = {}) => {
    if (!items?.length) return [];
    return items.map(({ children, ...rest }, index) => {
      const { parentTraits } = options || {};
      const editTrail = trackEdited[(rest?.id)];
      let activity = editTrail ? ACTIVITIES[(editTrail?.activity)] : null;
      const isRemoved = activity?.key === ACTIVITIES.remove.key;
      const isBeingDragged = dragged?.item?.id === rest?.id;

      const parentKeys = combineKeysWithDelimiter(Object.keys(parents));
      const isFirstItem = index === 0;

      return (
        <div key={index} style={{ marginLeft: margin, position: "relative", opacity: isBeingDragged ? 0.4 : 1 }}>
          {margin ? <LComponent /> : <></>}
          <OneMenuItem
            dragged={dragged}
            dropZone={dropZone}
            setBeingDragged={setBeingDragged}
            parentKeys={parentKeys}
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
            // isTheFirstItem={index === 0}
            isTheFirstItem={isFirstItem}
            isTheLastItem={index === items?.length - 1}
            index={index}
            moveUp={(up) => moveUp(up, { ...rest, children }, parents, { index, sibblings: items })}
          />
          {/* <div
            // style={{ marginBottom: 10 }}
            className={`nav-drop-zone ${
              !dragged || dropZone?.uniqueId !== `${parentKeys}->${index}->up` ? "nav-hidden" : ""
            }`}
            data-parent-ids={parentKeys}
            data-index={index}
            data-position="up"
          /> */}
          {/* -- I'm spreading "children" here to make sure that we create a copy of the children. We want to make sure we control when the changes show up for the user */}
          {children &&
            renderMenuItems(
              children,
              40,
              { ...parents, [rest?.id]: { ...rest, children: [...children] } },
              { parentTraits: { isRemoved, isPublished: rest?.is_published, isChild: true }, ...(options || {}) }
            )}
        </div>
      );
    });
  };

  const moveUp = (up, item, parents = {}, options = {}) => {
    let { index, sibblings } = options || {};
    const newIndex = up ? index - 1 : index + 1;
    parents = Object.entries(parents);
    const dealingWithAChild = parents.length > 0;
    if (!dealingWithAChild) {
      sibblings = [...sibblings];
      sibblings = sibblings.filter((s, i) => i !== index);
      sibblings.splice(newIndex, 0, item);
      return setMenu(sibblings);
    }

    const lastIndex = parents.length - 1;
    const [id, immediateParent] = parents[lastIndex];
    let family = [...(immediateParent?.children || [])];
    family = family.filter((f) => f?.id !== item?.id);
    family.splice(newIndex, 0, item);
    parents[lastIndex] = [id, { ...immediateParent, children: [...family] }];
    const parentAsObj = rollUp(parents);
    addToTopLevelMenu(parentAsObj, trackEdited);
  };

  const gatherBrandInfo = (profile) => {
    const { community_logo_link, community } = profile || {};
    setBrandForm({ link: community_logo_link, media: [community?.logo] });
  };
  const makeRequestToReset = () => {
    setLoading(NAVIGATION, true);
    closeModal();
    apiCall("menus.reset", { id: activeStash?.id })
      .then((response) => {
        setLoading(NAVIGATION, false);
        const data = response?.data;
        if (!response?.success) return notify(response?.error);
        const profiles = [data];
        placeDetails(data);
        keepInRedux(profiles, { changeTree: null });
        setEdited({});
        notify("Menu reset successful!", true);
      })
      .catch((er) => {
        setLoading(NAVIGATION, false);
        notify(er?.toString());
      });
  };

  const pushChangesToBackend = (data, scope) => {
    setLoading(scope, true);
    const [media] = brandForm?.media || [];
    const form = {
      id: activeStash?.id,
      community_logo_link: brandForm?.link,
      community_logo_id: media?.id,
      ...(data || {})
    };

    apiCall("menus.update", form)
      .then((response) => {
        setLoading(scope, false);
        if (!response?.success) return notify(response?.error);
        let data = response?.data;
        if (scope === BRAND) {
          notify(`Details updated successfully`, true);
          gatherBrandInfo(data);
          const { content, footer_content, ...rest } = data;
          keepInRedux([{ ...activeStash, ...rest }], { changeTree: trackEdited });
          return;
        }
        notify(`Menu updated successfully`, true);
        const profiles = [data];
        placeDetails(data);
        keepInRedux(profiles, { changeTree: null });
        setEdited({});
      })
      .catch((er) => {
        setLoading(scope, false);
        notify(er?.toString());
      });
  };
  const pageIsLoading = status[INIT];
  const isLoading = status[NAVIGATION];
  const isResetting = status[RESET];

  if (pageIsLoading) return <Loading />;
  if (error)
    return (
      <Paper style={{ padding: 40 }}>
        <Typography variant="body" style={{ color: "#b93131" }}>
          {error}
        </Typography>
      </Paper>
    );

  const addNew = () =>
    addOrEdit({ id: new Date().getTime()?.toString(), is_published: true }, {}, { context: ACTIVITIES.add.key });

  return (
    <div>
      <MEPaperBlock title="Community Logo">
        {/* <h4>This is what the custom navigation configuration page will look like</h4> */}
        <BrandCustomization
          loading={status[BRAND]}
          saveChanges={() => pushChangesToBackend(null, BRAND)}
          onChange={(key, value) => setBrandForm({ ...(brandForm || {}), [key]: value })}
          form={brandForm}
        />
      </MEPaperBlock>

      <MEPaperBlock title="Customize Navigation">
        <Typography variant="body" style={{ marginBottom: 10 }}>
          Customize your site's navigation here. You can edit, remove and
          <span
            onClick={() => addNew()}
            className="touchable-opacity"
            style={{ fontWeight: "bold", color: "var(--app-purple)", marginLeft: 5 }}
          >
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
          <div>
            {dragged !== null && (
              <div
                style={{
                  left: `${mouse[0] - 10}px`,
                  top: `${mouse[1] - 20}px`,
                  cursor: "grabbing",
                  padding: "10px 20px",
                  fontWeight: "bold",
                  minWidth: 450
                }}
                className="drag-float"
              >
                <i
                  className=" fa fa-grip-horizontal"
                  style={{ color: "#e3e3e3", marginRight: 10, fontSize: 20, cursor: "grab" }}
                />
                {dragged?.item?.name}
              </div>
            )}
            {/* <div
              // className={`nav-drop-zone ${!dragged || dropZone?.uniqueId !== "->topmost" ? "nav-hidden" : ""}`}
              className={`nav-drop-zone ${!dragged ? "nav-hidden" : ""}`}
              data-parent-ids={""}
              data-index={"topmost"}
            /> */}

            {renderMenuItems(menuItems)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ height: 40, border: "dashed 0px #eeeeee", borderLeftWidth: 2 }} />
            <Button color="secondary" variant="contained" onClick={() => addNew()}>
              <Tooltip title={`Add a new menu item`}>
                <b>Add New Item</b>
              </Tooltip>
            </Button>
          </div>
        </div>

        <br />
        <div style={{ border: "dashed 1px #61616129", padding: "20px 30px", display: "flex", flexDirection: "row" }}>
          <Button
            disabled={isResetting}
            onClick={() => {
              pushChangesToBackend({ content: JSON.stringify(menuItems) }, NAVIGATION);
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
              {isResetting ? <i className="fa fa-spinner fa-spin" /> : <b>Reset menu to default</b>}
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
  item,
  parents,
  activity,
  parentTraits,
  isTheFirstItem,
  isTheLastItem,
  moveUp,
  setBeingDragged,
  index,
  dropZone,
  dragged,
  parentKeys
}) => {
  const { name, link, id, is_link_external, is_published } = item || {};

  // const parentKeys = combineKeysWithDelimiter(Object.keys(parents));
  const uniqueId = `${parentKeys}->${index}`;

  const parentIsNotLive = !parentTraits?.isPublished;
  const isChild = parentTraits?.isChild;
  const hasChildren = children?.length > 0;
  const getBackColor = () => {
    if (activity) return activity?.color;
    if (parentTraits?.isRemoved) return ACTIVITIES.remove.color;
    return "white";
  };
  const removeMenuItem = () => {
    // const hasChildren = children?.length > 0;
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
  const editItem = () =>
    addOrEdit({ ...item, children }, parents, { context: ACTIVITIES.edit.key, children, isEdit: true });
  const createNewSubItem = () =>
    addOrEdit({ id: new Date().getTime()?.toString(), is_published: true }, parentsForNewItem, {
      context: ACTIVITIES.add.key
    });

  const itemIsLive = () => {
    if (isChild) return !parentIsNotLive && is_published;
    return is_published;
  };

  const disabledBecauseOfParent = parentIsNotLive && is_published;
  const notInTheSamePosition = dropZone?.id !== dragged?.item?.id;

  const renderLiveVisuals = () => {
    return (
      <Tooltip
        title={
          itemIsLive()
            ? // ? `Live ${mother_is_not_live ? "but parent item is not live" : ""}`
              `Live`
            : disabledBecauseOfParent
            ? `Not live because parent is disabled`
            : `Not Live, all sub items will also not show `
        }
      >
        <i
          onClick={() => editItem()}
          className={`fa fa-eye${itemIsLive() ? "" : "-slash"} touchable-opacity`}
          style={{ marginRight: 20, color: itemIsLive() ? "var(--app-purple)" : "grey", fontSize: 20 }}
        />
      </Tooltip>
    );
  };
  const dropdownItems = useMemo(() => {
    return [
      { key: "edit", label: "Edit", icon: "fa-edit", color: "rgb(117 154 210)", onClick: editItem },
      { key: "add", label: "Add Child Item", icon: "fa-plus", color: "rgb(104 180 95)", onClick: createNewSubItem },
      { key: "remove", label: "Remove", icon: "fa-trash", color: "rgb(227 151 151)", onClick: removeMenuItem }
    ];
  }, []);
  // const dropdownItems = [
  //   { key: "edit", label: "Edit", icon: "fa-edit", color: "rgb(117 154 210)", onClick: editItem },
  //   { key: "add", label: "Add Child Item", icon: "fa-plus", color: "rgb(104 180 95)", onClick: createNewSubItem },
  //   { key: "remove", label: "Remove", icon: "fa-trash", color: "rgb(227 151 151)", onClick: removeMenuItem }
  // ];

  return (
    <>
      {isTheFirstItem && notInTheSamePosition && (
        <div
          // style={{ marginBottom: 10 }}
          className={`nav-drop-zone ${
            !dragged || dropZone?.uniqueId !== `${uniqueId}->up` ? "nav-hidden" : "closest-dropzone"
          }`}
          // className={`nav-drop-zone ${!dragged ? "nav-hidden" : isCloseToUpZone ? "closest-dropzone" : ""}`}
          data-parent-ids={parentKeys}
          data-index={index}
          data-position="up"
        />
      )}
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
          // marginTop: !dragged ? 10 : 0,
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
          <Feature
            name={FLAGS.DRAGGABLE_NAVIGATION_ITEMS}
            // community={[]}
            fallback={
              <>
                {!isTheFirstItem && (
                  <Tooltip title={`Move up`}>
                    <i
                      onClick={() => moveUp(true)}
                      className=" fa fa-long-arrow-up touchable-opacity"
                      style={{ color: "var(--app-cyan)", marginRight: 10, fontSize: 20 }}
                    />
                  </Tooltip>
                )}
                {!isTheLastItem && (
                  <Tooltip onClick={() => moveUp(false)} title={`Move down`}>
                    <i
                      className=" fa fa-long-arrow-down touchable-opacity"
                      style={{ color: "var(--app-purple)", marginRight: 10, fontSize: 20 }}
                    />
                  </Tooltip>
                )}
              </>
            }
          >
            <Tooltip
              onMouseDown={(e) => {
                e.preventDefault();
                setBeingDragged({ item: { ...item, children }, parents, index });
              }}
              title={`Drag & Reorder`}
            >
              <i
                className=" fa fa-grip-horizontal"
                style={{ color: "#e3e3e3", marginRight: 10, fontSize: 20, cursor: "grab" }}
              />
            </Tooltip>
          </Feature>

          <Tooltip title={activity ? activity?.description : ""}>
            <b>{name}</b>
          </Tooltip>
          {is_link_external && !hasChildren && (
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
            <a
              onClick={(e) => {
                e.preventDefault();
                if (is_link_external) return window.open(link, "_blank");
              }}
              // href={link}
              target="_blank"
            >
              <span
                className="touchable-opacity"
                style={{
                  opacity: 0.5,
                  marginLeft: 15,
                  textDecoration: "underline",
                  fontWeight: "bold",
                  color: "grey",
                  marginRight: 10
                }}
              >
                {smartString(link, 40)}

                {is_link_external && <i className="fa fa-external-link" style={{ margin: "0px 8px" }} />}
              </span>
            </a>
          )}
        </Typography>

        <Feature
          name={FLAGS.DROPDOWN_VIEW_FOR_NAV_CONTROL}
          fallback={
            !isRemoved && (
              <div style={{ marginLeft: "auto" }}>
                {renderLiveVisuals()}
                <Tooltip title={`New: Add a sub-menu item to "${name}"`}>
                  <i
                    // onClick={() =>
                    //   addOrEdit({ id: new Date().getTime()?.toString(), is_published: true }, parentsForNewItem, {
                    //     context: ACTIVITIES.add.key
                    //   })
                    // }
                    onClick={() => createNewSubItem()}
                    className=" fa fa-plus touchable-opacity"
                    style={{ marginRight: 20, color: "green", fontSize: 20 }}
                  />
                </Tooltip>
                <Tooltip title={`Edit: Make changes to "${name}"`}>
                  <i
                    onClick={() => editItem()}
                    className=" fa fa-edit touchable-opacity"
                    style={{ fontSize: 20, color: "var(--app-cyan)" }}
                  />
                </Tooltip>
                <span style={{ margin: "0px 8px", fontSize: 20, color: "#ededed" }}>|</span>
                <Tooltip title={`Remove "${name}"`}>
                  <i
                    onClick={() => removeMenuItem()}
                    className=" fa fa-trash touchable-opacity"
                    style={{ color: "#e87070", marginRight: 10, fontSize: 20 }}
                  />
                </Tooltip>
              </div>
            )
          }
        >
          <div style={{ marginLeft: "auto" }}>
            {renderLiveVisuals()}
            <MEDropdown
              fullControl
              renderChild={(child, index) => (
                <p
                  className="drop-pro-child"
                  key={index?.toString()}
                  onClick={() => child?.onClick()}
                  style={{
                    padding: "5px 15px",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    fontSize: 14,
                    fontWeight: "bold",
                    margin: 0
                  }}
                >
                  <i
                    className={`fa ${child?.icon}`}
                    style={{ fontSize: 13, marginRight: 5, color: child?.color || "#cccccc" }}
                  />
                  {child?.label}
                </p>
              )}
              labelExtractor={(item) => item.label}
              valueExtractor={(item) => item.key}
              data={dropdownItems}
              noCaret
              onHeaderRender={() => {
                return <i className="fa fa-ellipsis-v" style={{ fontSize: 16, color: "grey" }} />;
              }}
            />
          </div>
        </Feature>
      </div>

      {notInTheSamePosition && (
        <div
          className={`nav-drop-zone ${
            !dragged || dropZone?.uniqueId !== `${uniqueId}->down` ? "nav-hidden" : "closest-dropzone"
          }`}
          data-parent-ids={parentKeys}
          data-index={index}
          data-position="down"
          data-id={id}
        />
      )}
    </>
  );
};
