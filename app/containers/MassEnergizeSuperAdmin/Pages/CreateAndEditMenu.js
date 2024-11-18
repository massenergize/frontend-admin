import { CheckBox } from "@mui/icons-material";
import { Button, Checkbox, FormControlLabel, TextField, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import MEDropdown from "../ME  Tools/dropdown/MEDropdown";
import { useDispatch, useSelector } from "react-redux";
import { apiCall } from "../../../utils/messenger";
import { reduxAddInternalLinkList } from "../../../redux/redux-actions/adminActions";
import Loading from "dan-components/Loading";
import { isValidURL } from "../../../utils/common";

function CreateAndEditMenu({ data, cancel, insertNewLink, children, isEdit }) {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const internalLinks = useSelector((state) => state.getIn(["internalLinks"]));
  const keepInRedux = (data) => dispatch(reduxAddInternalLinkList(data));
  const isParent = children?.length;

  useEffect(() => {
    setForm(data);
  }, []);

  const updateForm = (obj) => {
    setForm({ ...form, ...obj });
  };

  useEffect(() => {
    if (internalLinks?.length) return;
    fetchInternalLinks();
  }, []);

  const fetchInternalLinks = () => {
    setLoading(true);
    apiCall("links.internal.get")
      .then((response) => {
        setLoading(false);
        if (!response?.success) {
          return setError(response?.error);
        }
        keepInRedux(response?.data);
      })
      .catch((err) => {
        console.log("Error fetching internal links", err);
        setLoading(false);
      });
  };
  const formIsValid = () => {
    if (linkIsExternal) {
      return isParent ? Boolean(name) : name && link && linkIsValid;
    }

    return isParent ? Boolean(name) : name && link;
  };
  const { is_published, name, link, is_link_external: linkIsExternal, is_custom_page: isCustomPage } = form || {};
  const linkIsValid = isValidURL(link);
  const readyToSave = formIsValid();

  const renderLinkItems = () => {
    if (isParent) return <Typography style={{ fontWeight: "bold", color: "var(--app-purple)" }}>Is Parent</Typography>;

    return linkIsExternal ? (
      <>
        <TextField
          disabled={isParent}
          style={{ width: "100%", marginTop: 10 }}
          label="URL"
          placeholder="Example: https://www.massenergize.org"
          InputLabelProps={{
            shrink: true
          }}
          inputProps={{ style: { padding: "10px 20px", width: "100%" } }}
          variant="outlined"
          onChange={(e) => updateForm({ link: e.target.value })}
          value={link}
        />
        {link && (
          <Typography
            variant="body2"
            style={{
              marginTop: 8,
              fontWeight: "bold",
              color: linkIsValid ? "rgb(54 150 54)" : "rgb(205, 49, 49)"
            }}
          >
            <i className={`fa ${linkIsValid ? "fa-check-circle" : "fa-times-circle"}`} style={{ marginRight: 0 }} /> URL
            should be like this{" "}
            <span style={{ textDecoration: "underline", fontWeight: "bold" }}>https://www.massenergize.org</span>
          </Typography>
        )}
      </>
    ) : (
      <MEDropdown
        data={internalLinks}
        defaultValue={link ? [link] : []}
        onItemSelected={(items) => {
          const link = items[0];
          updateForm({ link });
        }}
        labelExtractor={(l) => l?.name}
        valueExtractor={(l) => l?.link}
        placeholder="Link to a page within your site"
      />
    );
  };

  return (
    <div style={{ padding: 20, width: 500 }}>
      <Typography variant="h5" style={{ color: "var(--app-purple)", fontWeight: "bold" }} gutterBottom>
        {isEdit ? "Edit Menu Item" : "Create New Menu Item"}
      </Typography>
      {error ? (
        <Typography variant="body" style={{ color: "#b93131" }}>
          {error}
        </Typography>
      ) : (
        <div style={{ border: "dashed 1px #8e24aa45", padding: 20 }}>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: "5px 10px" }}>
            <div>
              <FormControlLabel
                control={
                  <input
                    type="checkbox"
                    onChange={() => updateForm({ is_published: !is_published })}
                    checked={is_published}
                    style={{ color: "var(--app-purple)" }}
                  />
                }
                label="Is Live"
              />
            </div>

            {/* <a href="#" variant="caption" style={{ marginLeft: "auto", color: "#cd3131", fontWeight: "bold" }}>
              {" "}
              Delete{" "}
            </a> */}
          </div>
          <TextField
            style={{ width: "100%", marginTop: 10 }}
            label="Name"
            placeholder="Name"
            InputLabelProps={{
              shrink: true
            }}
            inputProps={{ style: { padding: "10px 20px", width: "100%" } }}
            variant="outlined"
            onChange={(e) => updateForm({ name: e.target.value })}
            value={name}
          />

          {/* --------- EXTERNAL & INTERNAL LINKS ----------- */}
          <div style={{ border: "dashed 0px #8e24aa45", padding: "10px 0px", margin: "10px 0px" }}>
            {!isParent && (
              <div style={{ marginLeft: 10, marginBottom: 10 }}>
                <FormControlLabel
                  control={
                    <input
                      onChange={() => updateForm({ is_link_external: !linkIsExternal })}
                      type="checkbox"
                      checked={!linkIsExternal}
                      style={{ color: "var(--app-purple)" }}
                    />
                  }
                  style={{ marginRight: 30 }}
                  label="Internal"
                />
                <FormControlLabel
                  control={
                    <input
                      onChange={() => updateForm({ is_link_external: !linkIsExternal, is_custom_page: false })}
                      checked={linkIsExternal}
                      type="checkbox"
                      style={{ color: "var(--app-purple)" }}
                    />
                  }
                  style={{}}
                  label="External"
                />
                {/* <FormControlLabel
                  control={
                    <input
                      onChange={() => updateForm({ is_custom_page: !isCustomPage })}
                      checked={isCustomPage}
                      type="checkbox"
                      style={{ color: "var(--app-purple)" }}
                    />
                  }
                  style={{}}
                  label="Custom Page"
                /> */}
              </div>
            )}
            <div style={{ marginBottom: 10 }}>
              {loading && !isParent && (
                <span style={{ color: "var(--app-purple)" }}>
                  <i className="fa fa-spinner fa-spin" /> Fetching internal links...
                </span>
              )}
              {!isCustomPage && renderLinkItems()}
            </div>
            {!linkIsExternal && (
              <div style={{ margin: "0px 10px", display: "flex", flexDirection: "row", alignItems: "center" }}>
                <FormControlLabel
                  control={
                    <input
                      onChange={() => updateForm({ is_custom_page: !isCustomPage })}
                      checked={isCustomPage}
                      type="checkbox"
                      style={{ color: "var(--app-purple)" }}
                    />
                  }
                  style={{}}
                  label="I want to build my own page"
                />

                {!isParent && !linkIsExternal && isCustomPage && (
                  <a
                    href={`/admin/community/configure/navigation/custom-pages`}
                    target="_blank"
                    style={{ fontWeight: "bold" }}
                  >
                    Edit with page builder
                  </a>
                )}
              </div>
            )}
          </div>
          {/* <TextField
          style={{ width: "100%", marginTop: 15 }}
          label="Order (Indicate the order of the menu item)"
          placeholder="Order Example: 1"
          InputLabelProps={{
            shrink: true
          }}
          inputProps={{ style: { padding: "10px 20px", width: "100%" }, type: "number" }}
          variant="outlined"
          onChange={(e) => updateForm({ order: e.target.value })}
          value={order}
        /> */}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
        <Button onClick={() => cancel()} variant="contained" style={{ marginRight: 10, background: "#cd3131" }}>
          Cancel
        </Button>
        <Button
          // disabled={!readyToSave}
          variant="contained"
          style={!readyToSave ? { background: "#eeeeee", boxShadow: "000" } : {}}
          onClick={() => {
            if (!readyToSave) return;
            insertNewLink(form);
          }}
        >
          <Tooltip
            title={
              !readyToSave
                ? "Please make sure you have provided all details"
                : "'OK' lets you see how it looks, its not saved yet."
            }
            placement="top"
          >
            <span>OK</span>
          </Tooltip>
        </Button>
      </div>
    </div>
  );
}

export default CreateAndEditMenu;
