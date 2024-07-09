import React, { useState } from "react";
import "./IconDialog.css";
import debounce from "lodash.debounce";
import { parseJSON, smartString } from "../../../../utils/common";

const ICONS = require("./icon_files.json");
const RECENT_ICONS_KEY = "RECENT_ICONS_KEY";
const MAX_RECENTS = 10; // number of icons that should be kept in the recent list
const COMMONLY_USED = [
  "fa fa-leaf",
  "fa fa-calendar",
  "fa fa-quote-left",
  "fa fa-map-pin",
  "fa fa-exclamation",
  "fas fa-asterisk",
  "fa fa-home",
  "fa fa-book",
  "fa fa-sun",
  "fa fa-calendar",
];
function IconDialog({
  perPage = 200,
  placeholder,
  onIconSelected,
  defaultValue,
  value,
  maxRecents,
  recentItemsStorageKey,
}) {
  const icons = ICONS.ICON_FILES;
  const [iconSet, setIconSet] = useState(icons.slice(0, perPage));
  const [searched, setSearched] = useState([]);
  const [text, setText] = useState("");
  const pages = Math.round(icons.length / perPage);
  const [page, setPage] = useState(1);
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(defaultValue || value || null);
  const maximumNumberOfRecentItems = maxRecents || MAX_RECENTS;
  const iconsStorageKey = recentItemsStorageKey || RECENT_ICONS_KEY;
  const storedRecents = parseJSON(localStorage.getItem(iconsStorageKey));
  const [recents, setRecents] = useState(storedRecents || []);

  const nextPage = () => {
    if (page >= pages) return;
    const newStartIndex = perPage * page;
    const endIndex = newStartIndex + perPage;
    const nextSet = icons.slice(newStartIndex, endIndex);
    setIconSet(nextSet);
    setPage(page + 1);
  };

  const prevPage = () => {
    if (page <= 1) return;
    const endIndex = perPage * (page - 1);
    const newStartIndex = endIndex - perPage;
    const nextSet = icons.slice(newStartIndex, endIndex);
    setIconSet(nextSet);
    setPage(page - 1);
  };

  const search = (text) => {
    setText(text);
    if (!text) return setSearched([]);
    const found = icons.filter((name) => name.includes(text));
    setSearched(found);
  };

  const addToRecents = (iconName) => {
    const rem = recents.filter((ic) => ic !== iconName);
    var content = [iconName, ...rem];
    if (content.length > maximumNumberOfRecentItems)
      content = content.slice(0, maximumNumberOfRecentItems);
    setRecents(content);
    localStorage.setItem(iconsStorageKey, JSON.stringify(content));
  };

  const selectIcon = (iconName) => {
    setSelected(iconName);
    onIconSelected && onIconSelected(iconName);
    iconName && addToRecents(iconName);
    setShow(false);
  };

  const searchForIconWhenUserPausesTyping = debounce(search, 200);

  const isLastPage = page >= pages;
  const isFirstPage = page <= 1;

  const data = searched.length ? searched : iconSet;

  const showDialog = () => {
    setShow(true);
  };
  return (
    <div className="icon-d-root">
      <div className="icon-d-trigger-area">
        <div className="default-trigger" onClick={() => showDialog()}>
          {selected ? (
            <div className="icon-d-selected-area">
              <i className={`fa ${selected}`} />
              <small>{makeNameFromIcon(selected)}</small>
            </div>
          ) : (
            <>
              <i className="fa fa-search" />
              <p>{placeholder || "Click To Select A Font Awesome Icon..."}</p>
            </>
          )}
        </div>
        {selected && (
          <span
            onClick={() => {
              selectIcon(null);
              setShow(true);
            }}
            style={{
              textDecoration: "underline",
              color: "red",
              fontSize: 12,
              cursor: "pointer",
              marginTop: 5,
            }}
          >
            Clear
          </span>
        )}
      </div>
      {show && (
        <Dialog
          {...{
            recents,
            text,
            data,
            searched,
            search: (e) => searchForIconWhenUserPausesTyping(e.target.value),
            isLastPage,
            isFirstPage,
            prevPage,
            nextPage,
            page,
            pages,
            close: () => setShow(false),
            selectIcon,
          }}
        />
      )}
    </div>
  );
}

export default IconDialog;

// --------------------------------------------------------------------------------------
const Dialog = ({
  recents,
  text,
  data,
  searched,
  isFirstPage,
  isLastPage,
  search,
  page,
  pages,
  prevPage,
  nextPage,
  close,
  selectIcon,
}) => {
  const userSearchedAndThereAreNoIcons = text && !searched.length;

  const renderIcons = (iconSet, classes = "") => {
    return (iconSet || []).map((ic, index) => {
      return (
        <span
          className={`d-icon-span ${classes}`}
          onClick={() => selectIcon(ic)}
        >
          <span key={index.toString()} style={{ textAlign: "center" }}>
            <i className={` d-icon ${ic}`} />
          </span>
          <small>{smartString(makeNameFromIcon(ic), 40)}</small>
        </span>
      );
    });
  };

  return (
    <>
      <div className="icon-d-ghost-curtain" onClick={close} />
      <div
        className={`anime-load-in icon-d-main-wrapper`}
        id="icon-d-main-wrapper"
      >
        <div className="icon-d-search-wrapper">
          <i className="fa fa-search" />
          <input
            placeholder="Search for icon by name"
            className="icon-d-textbox"
            onChange={search}
          />
        </div>
        {/* {recents && recents.length ? (
          <div className="recents-container">
            <div style={{ padding: "0px 55px" }}>
              <small style={{ fontSize: 8, color: "#bbbbbb" }}>
                RECENTLY USED
              </small>
            </div>
            <div className="content">{renderIcons(recents)}</div>
          </div>
        ) : (
          <></>
        )} */}

        <div className="icon-container">
          {userSearchedAndThereAreNoIcons ? (
            <div className="no-icons-found">
              <i className="fas fa-search" />
              <small>
                Sorry, no icons were found with the{" "}
                <b style={{ color: "black" }}>"{text}"</b> description...
              </small>
            </div>
          ) : (
            <>
              {isFirstPage && !searched.length && (
                <div
                  style={{
                    border: "solid 0px rgb(246 246 246)",
                    borderBottomWidth: 2,
                    marginBottom: 15,
                  }}
                >
                  <small style={{ fontSize: 11, color: "#bbbbbb" }}>
                    COMMONLY USED ICONS
                  </small>
                  <div className="commons-container">
                    {renderIcons(COMMONLY_USED, "commonly-used-color")}
                  </div>
                </div>
              )}
              {renderIcons(data)}
            </>
          )}
        </div>
        {!searched.length && !userSearchedAndThereAreNoIcons && (
          <div className="icon-d-footer">
            <span
              className={`d-icon-control ${isFirstPage ? "disabled" : ""}`}
              onClick={() => prevPage()}
            >
              <i className={` fa d-icon fa-angle-left`} />
            </span>
            <span>
              {page}/{pages}
            </span>
            <span
              className={`d-icon-control ${isLastPage ? "disabled" : ""}`}
              onClick={() => nextPage()}
            >
              <i className={`  fa d-icon fa-angle-right`} />
            </span>
          </div>
        )}
      </div>
    </>
  );
};

const makeNameFromIcon = (ic) => {
  var name = ic.split(" ") || [];
  name = (name[1] || "").split("-") || [];
  name = name.slice(1).join(" ") || "";

  return name;
};
