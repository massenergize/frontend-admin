import React, { useState } from "react";
import "./IconDialog.css";
const ICONS = require("./icon_files.json");

function IconDialog({
  perPage = 50,
  placeholder,
  onIconSelected,
  defaultValue,
  value,
}) {
  const icons = ICONS.ICON_FILES;
  const [iconSet, setIconSet] = useState(icons.slice(0, perPage));
  const [searched, setSearched] = useState([]);
  const pages = Math.round(icons.length / perPage);
  const [page, setPage] = useState(1);
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(defaultValue || value || null);

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

  const search = (e) => {
    const text = e.target.value.trim();
    if (!text) return setSearched([]);
    const found = icons.filter((name) => name.includes(text));
    setSearched(found);
  };

  const selectIcon = (iconName) => {
    setSelected(iconName);
    onIconSelected && onIconSelected(iconName);
    setShow(false);
  };

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
            data,
            searched,
            search,
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

const Dialog = ({
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
  return (
    <>
      <div className="icon-d-ghost-curtain" onClick={close} />
      <div className="anime-load-in icon-d-main-wrapper">
        <div>
          <input
            placeholder="Enter text that describes icon..."
            className="icon-d-textbox"
            onChange={search}
          />
        </div>
        <div className="icon-container">
          {data.map((ic, index) => {
            return (
              <span
                className="d-icon-span"
                key={index.toString()}
                onClick={() => selectIcon("fa " + ic)}
              >
                <i className={` fa d-icon ${ic}`} />
              </span>
            );
          })}
        </div>
        {!searched.length && (
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
