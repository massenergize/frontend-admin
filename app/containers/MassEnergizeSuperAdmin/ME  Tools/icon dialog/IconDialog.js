import React, { useState } from "react";
import "./IconDialog.css";
import debounce from "lodash.debounce";
import { smartString } from "../../../../utils/common";
const ICONS = require("./icon_files.json");
const RECENT_ICONS_KEY = "RECENT_ICONS_KEY";
const MAX_RECENTS = 10; // number of icons that should be kept in the recent list
function IconDialog({
  perPage = 50,
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
  const storedRecents = JSON.parse(localStorage.getItem(iconsStorageKey));
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
  return (
    <div className="icon-d-root">
      <div className="icon-d-trigger-area">
        <div className="default-trigger" onClick={() => setShow(true)}>
          {selected ? (
            <>
              <i
                className={`fa ${selected}`}
                style={{
                  border: "solid 2px black",
                  borderRadius: 3,
                  padding: "8px",
                }}
              />
            </>
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
  const userSearchedAnThereAreNoIcons = text && !searched.length;

  const renderIcons = (iconSet) => {
    return (iconSet || []).map((ic, index) => {
      var name = ic.split(" ") || [];
      name = (name[1] || "").split("-") || [];
      name = name.slice(1).join(" ") || "";
      return (
        <span style={{ display: "flex", flexDirection: "column" }}>
          <span
            className="d-icon-span"
            key={index.toString()}
            onClick={() => selectIcon(ic)}
          >
            <i className={` d-icon ${ic}`} />
          </span>
          <small style={{ fontSize: 9 }}>{smartString(name, 12)}</small>
        </span>
      );
    });
  };
  return (
    <>
      <div className="icon-d-ghost-curtain" onClick={close} />
      <div className="anime-load-in icon-d-main-wrapper">
        <div>
          <input
            placeholder="Enter text that describes the icon..."
            className="icon-d-textbox"
            onChange={search}
          />
        </div>
        {recents && recents.length ? (
          <div className="recents-container">
            <div style={{ padding: "0px 15px" }}>
              <small style={{ fontSize: 8, color: "#bbbbbb" }}>
                RECENTLY USED
              </small>
            </div>
            <div className="content">{renderIcons(recents)}</div>
          </div>
        ) : (
          <></>
        )}
        <div className="icon-container">
          {userSearchedAnThereAreNoIcons ? (
            <div className="no-icons-found">
              <i className="fas fa-search" />
              <small>
                Sorry, no icons were found with the{" "}
                <b style={{ color: "black" }}>"{text}"</b> description...
              </small>
            </div>
          ) : (
            renderIcons(data)
          )}
        </div>
        {!searched.length && !userSearchedAnThereAreNoIcons && (
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
