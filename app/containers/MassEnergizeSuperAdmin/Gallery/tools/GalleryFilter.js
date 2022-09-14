import { Button, withStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import MEDropdown from "../../ME  Tools/dropdown/MEDropdown";
import { filterStyles } from "./../styles";
function GalleryFilter({
  classes,
  children,
  label,
  scopes,
  tags,
  onChange,
  selections,
  reset,
  apply,
  style,
  className,
  dropPosition = "right",
}) {
  const [showDrop, setShowDrop] = useState(false);

  useEffect(() => {}, [selections]);

  const handleChange = (key, value) => {
    const newFilters = { ...selections, [key]: value };
    if (onChange) return onChange(newFilters);
  };
  const calculateNumberOfSelectedFilters = () => {
    const scopeCount = (selections.scope || []).length || 0;
    const tags = Object.values(selections.tags || {});
    var tagCount = 0;
    for (let t of tags) tagCount += t.length;

    return scopeCount + tagCount;
  };
  const numberOfFilters = calculateNumberOfSelectedFilters();
  return (
    <div className={classes.root}>
      {children}
      <div
        className={`${classes.toggleWrapper} ${className || ""}`}
        style={style || {}}
        onClick={() => setShowDrop(true)}
      >
        <i className="fa fa-filter" />
        {label ? (
          label
        ) : (
          <small style={{ margin: "0px 7px" }}>More Filters</small>
        )}
        {numberOfFilters ? (
          <span
            style={{
              padding: "3px 7px",
              fontSize: 9,
              borderRadius: 55,
              color: "white",
              background: "rgb(0 188 212)",
            }}
          >
            {numberOfFilters}
          </span>
        ) : (
          <></>
        )}
      </div>
      {showDrop && (
        <>
          <div
            className={`${classes.ghostCurtain}`}
            onClick={() => setShowDrop(false)}
          />
          <div
            className={`${classes.contentArea} me-fade-in-down`}
            style={{ [dropPosition]: 0 }}
          >
            <div className={classes.content}>
              <div className={classes.dropdownTop}>
                <small>Scope</small>
                <small
                  onClick={() => handleChange("scope", [])}
                  className={classes.resetOneFilter}
                >
                  Reset
                </small>
              </div>

              <MEDropdown
                defaultValue={(selections || {})["scope"] || []}
                data={scopes || []}
                valueExtractor={(it) => it && it.value}
                labelExtractor={(it) => it && it.name}
                multiple
                onItemSelected={(items) => handleChange("scope", items)}
              />
              <br />
              {(tags || []).map((collection) => {
                const defaults = selections["tags"] || {};
                return (
                  <>
                    <div className={classes.dropdownTop}>
                      <small>{collection.name}</small>
                      <small
                        onClick={() => {
                          const filters = selections["tags"];
                          handleChange("tags", {
                            ...(filters || {}),
                            [collection.id.toString()]: [],
                          });
                        }}
                        className={classes.resetOneFilter}
                      >
                        Reset
                      </small>
                    </div>

                    <MEDropdown
                      data={collection.tags || []}
                      valueExtractor={(it) => it && it.id}
                      labelExtractor={(it) => it && it.name}
                      defaultValue={defaults[collection.id.toString()]}
                      onItemSelected={(items) => {
                        const filters = selections["tags"];
                        handleChange("tags", {
                          ...(filters || {}),
                          [collection.id.toString()]: items,
                        });
                      }}
                      multiple
                    />
                  </>
                );
              })}
            </div>
            <div className={classes.filterFooter}>
              <Button
                onClick={() => reset && reset()}
                variant="contained"
                color="primary"
                style={{
                  width: "100%",
                  borderRadius: 0,
                  textTransform: "capitalize",
                  flex: "1",
                }}
              >
                Reset
              </Button>
              <Button
                onClick={() => {
                  apply && apply();
                  setShowDrop(false);
                }}
                variant="contained"
                color="secondary"
                style={{
                  width: "100%",
                  borderRadius: 0,
                  textTransform: "capitalize",
                  flex: "1",
                }}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default withStyles(filterStyles)(GalleryFilter);
