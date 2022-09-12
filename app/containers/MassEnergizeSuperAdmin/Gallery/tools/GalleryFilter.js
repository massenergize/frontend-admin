import { Button, withStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import MEDropdown from "../../ME  Tools/dropdown/MEDropdown";
import { filterStyles } from "./../styles";
function GalleryFilter({
  classes,
  children,
  scopes,
  tags,
  onChange,
  selections,
  reset,
  apply,
}) {
  const [showDrop, setShowDrop] = useState(true);
  // const [filters, setfilters] = useState(selections || {});

  console.log("Whats in", selections);
  useEffect(() => {}, [selections]);

  const handleChange = (key, value) => {
    const newFilters = { ...selections, [key]: value };
    // setfilters(newFilters);
    if (onChange) return onChange(newFilters);
  };
  return (
    <div className={classes.root}>
      {children}
      <div className={classes.toggleWrapper} onClick={() => setShowDrop(true)}>
        <i className="fa fa-filter" />
        <small>More Filters</small>
      </div>
      {showDrop && (
        <>
          <div
            className={`${classes.ghostCurtain}`}
            onClick={() => setShowDrop(false)}
          />
          <div className={`${classes.contentArea} me-fade-in-down`}>
            <div className={classes.content}>
              <small>Scope</small>
              <MEDropdown
                defaultValue={selections["scope"]}
                data={scopes}
                valueExtractor={(it) => it.value}
                labelExtractor={(it) => it.name}
                multiple
                onItemSelected={(items) => handleChange("scope", items)}
              />
              <br />
              {(tags || []).map((collection) => {
                const defaults = selections["tags"] || {};
                return (
                  <>
                    <small>{collection.name}</small>
                    <MEDropdown
                      data={collection.tags || []}
                      valueExtractor={(it) => it.id}
                      labelExtractor={(it) => it.name}
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
                onClick={() => apply && apply()}
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
