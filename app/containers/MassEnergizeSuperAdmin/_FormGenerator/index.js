import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { DateTimePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import MomentUtils from "@date-io/moment";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import { Link } from "react-router-dom";
import { MaterialDropZone } from "dan-components";
import Snackbar from "@material-ui/core/Snackbar";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Editor as TinyEditor } from "@tinymce/tinymce-react";
import { MenuItem } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
// import Icon from '@material-ui/core/Icon';
import moment from "moment";
import { apiCall } from "../../../utils/messenger";
import MySnackbarContentWrapper from "../../../components/SnackBar/SnackbarContentWrapper";
import FieldTypes from "./fieldTypes";
import Modal from "./Modal";
// import PreviewModal from './PreviewModal';
import MEMediaLibraryImplementation from "../Gallery/tools/MEMediaLibraryImplementation";
const TINY_MCE_API_KEY = "3fpefbsmtkh71yhtjyykjwj5ezs3a5cac5ei018wvnlg2g0r";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    padding: 30,
  },
  field: {
    width: "100%",
    marginBottom: 20,
  },
  fieldBasic: {
    width: "100%",
    marginBottom: 20,
    marginTop: 10,
  },
  inlineWrap: {
    display: "flex",
    flexDirection: "row",
  },
  buttonInit: {
    margin: theme.spacing.unit * 4,
    textAlign: "center",
  },
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

class MassEnergizeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      startCircularSpinner: false,
      successMsg: null,
      error: null,
      formJson: null,
      readOnly: false,
      // activeModal: null,
      // activeModalTitle: null,
    };
    this.updateForm = this.updateForm.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    //this.closePreviewModal = this.closePreviewModal.bind(this);
    const { ICON_FILES } = require("./icon_files.json");
    this.iconFiles = ICON_FILES;
  }

  async componentDidMount() {
    const { formJson } = this.props;
    const formData = this.initialFormData(formJson.fields);

    const readOnly = this.props.readOnly;
    await this.setStateAsync({ formJson, formData, readOnly: readOnly });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  // showPreviewModal() {
  //  const fieldName = this.state.activeModal;
  //  if (fieldName !== null) {
  //    const HTML_CONTENT = this.getValue(fieldName);
  //    return (
  //      <PreviewModal
  //        content={HTML_CONTENT}
  //        title={this.state.activeModalTitle}
  //        closeModal={this.closePreviewModal}
  //      />
  //    );
  //  }
  // }

  // closePreviewModal() {
  //  this.setState({ activeModal: null });
  // }

  // 0921
  // initializeHtmlField = (content) => {
  //  if (!content || content === "<p></p>\n") {
  //    return EditorState.createEmpty();
  //  }
  //  return EditorState.createWithContent(stateFromHTML(content));
  // };

  /**
   * Given the field, it renders the actual component
   */

  initialFormData = (fields) => {
    const formData = {};
    fields.forEach((field) => {
      switch (field.fieldType) {
        case FieldTypes.Checkbox:
          formData[field.name] = field.defaultValue || [];
          break;
        case FieldTypes.File:
          formData[field.name] = [];
          break;
        case FieldTypes.DateTime:
          formData[field.name] = field.defaultValue
            ? moment(field.defaultValue)
            : moment.now();
          break;
        case FieldTypes.HTMLField:
          formData[field.name] = field.defaultValue;
          break;
        case FieldTypes.Section: {
          if (!field.children) break;
          const cFormData = this.initialFormData(field.children);
          Object.keys(cFormData).forEach((k) => {
            formData[k] = cFormData[k];
          });
          break;
        }
        default:
          formData[field.name] = field.defaultValue || field.value || null;
          break;
      }
      if (field.child) {
        const cFormData = this.initialFormData(field.child.fields);
        Object.keys(cFormData).forEach((k) => {
          formData[k] = cFormData[k];
        });
      }
    });
    return formData;
  };

  /**
   * ============ HELPER FUNCTIONS FOR INPUTS
   */
  handleEditorChange = async (content, editor, name) => {
    const { formData } = this.state;
    await this.setStateAsync({
      formData: { ...formData, [name]: content },
    });
  };

  // 0921
  // onEditorStateChange = async (name, editorState) => {
  //  const { formData } = this.state;
  //  await this.setStateAsync({
  //    formData: { ...formData, [name]: editorState },
  //  });
  // };

  /**
   * Handle multi select
   */
  handleChangeMultiple = (event) => {
    const { target } = event;
    const { name, options } = target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    this.setState({
      formData: { [name]: value },
    });
  };

  /**
   * Handles general input
   */
  handleFormDataChange = (event) => {
    const { target } = event;
    if (!target) return;
    const { name, value } = target;
    const { formData } = this.state;
    this.setState({
      formData: { ...formData, [name]: value },
    });
  };

  /**
   * Handle checkboxes when they are clicked
   */
  handleCheckBoxSelect = async (event, selectMany) => {
    const { target } = event;
    if (!target) return;
    const { formData } = this.state;
    const { name, value } = target;
    if (!value) return;
    let theList = formData[name];
    if (!theList) {
      theList = [];
    }

    const pos = theList.indexOf(value);
    if (pos > -1) {
      theList.splice(pos, 1);
    } else if (!selectMany) {
      theList = [value];
    } else if (selectMany) {
      theList.push(value);
    }

    await this.setStateAsync({
      formData: { ...formData, [name]: theList },
    });
  };

   /**
   * toggle a single Checkbox
   */
    handleCheckboxToggle = (event) => {
      const { target } = event;
      if (!target) return;
      const { name, value } = target;
      const { formData } = this.state;
      formData[name] = (formData[name] === "true") ? "false" : "true";
      this.setState({
        formData: { ...formData },
      });
    };
   /**
   * Returns what value was entered in the form for this fieldName
   */
  getValue = (name, defaultValue = null) => {
    let { formData } = this.state;
    let val = formData[name];
    if (!val) {
      formData = { ...formData, [name]: defaultValue };
      // this.setState({ formData });
      val = defaultValue;
    }
    return val;
  };

  handleCloseStyle = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ successMsg: null, error: null });
  };

  getDisplayName = (fieldName, id, data) => {
    const { formData } = this.state;
    if (id) {
      const [result] = data.filter((d) => d.id === id);
      if (result) {
        return result.displayName;
      }
    }

    const val = formData[fieldName];
    if (!val) {
      return "Please select an option";
    }

    // careful if one of val or id is a number
    const searchRes = data.filter((d) => String(d.id) === String(val));
    const [first] = searchRes;
    if (first) {
      return first.displayName;
    }
    return "Please select an option";
  };

  /**
   * This is a recursive function traversing all the fields and their children
   * and extracting their values from the form
   */

  cleanItUp = (formData, fields) => {
    const cleanedValues = {};
    let hasMediaFiles = false;
    fields.forEach((field) => {
      const fieldValueInForm = formData[field.name];
      if (fieldValueInForm || fieldValueInForm === "") {
        switch (field.fieldType) {
          case FieldTypes.HTMLField:
            // cleanedValues[field.dbName] = stateToHTML(
            //   fieldValueInForm.getCurrentContent(),
            //   htmlLinkOptions
            // );
            cleanedValues[field.dbName] = fieldValueInForm;
            break;
          case FieldTypes.DateTime:
            cleanedValues[field.dbName] = (
              moment.utc(fieldValueInForm) || moment.now()
            ).format();
            break;
          case FieldTypes.Checkbox:
            if (cleanedValues[field.dbName]) {
              cleanedValues[field.dbName] = cleanedValues[field.dbName].concat(
                fieldValueInForm
              );
            } else {
              cleanedValues[field.dbName] = fieldValueInForm;
            }
            break;
          case FieldTypes.File:
            hasMediaFiles = true;
            if (fieldValueInForm === "None") {
              // When we want to reset the value of an image field
              cleanedValues[field.dbName] = fieldValueInForm;
              break;
            }
            if (field.filesLimit === 1 && fieldValueInForm.length > 0) {
              const [file] = fieldValueInForm;
              cleanedValues[field.dbName] = file;
            } else {
              cleanedValues[field.dbName] = fieldValueInForm;
            }
            break;
          default:
            cleanedValues[field.dbName] = fieldValueInForm;
        }
      }
      // field.conditional displays is just a way to display form items based on a selected
      // radio button. Similar to the `field.child` but allows more options

      if (field.conditionalDisplays && field.conditionalDisplays.length) {
        const selectedSet = field.conditionalDisplays.filter(
          (f) => fieldValueInForm === f.valueToCheck
        )[0];
        const [childCleanValues, childHasMediaFiles] = this.cleanItUp(
          formData,
          selectedSet.fields || []
        );
        if (childHasMediaFiles) {
          hasMediaFiles = childHasMediaFiles || hasMediaFiles;
        }
        Object.keys(childCleanValues).forEach((k) => {
          cleanedValues[k] = childCleanValues[k];
        });
      }

      if (field.child) {
        const [childCleanValues, childHasMediaFiles] = this.cleanItUp(
          formData,
          field.child.fields
        );
        if (childHasMediaFiles) {
          hasMediaFiles = childHasMediaFiles || hasMediaFiles;
        }
        Object.keys(childCleanValues).forEach((k) => {
          cleanedValues[k] = childCleanValues[k];
        });
      } else if (field.fieldType === FieldTypes.Section && field.children) {
        const [childCleanValues, childHasMediaFiles] = this.cleanItUp(
          formData,
          field.children
        );
        if (childHasMediaFiles) {
          hasMediaFiles = childHasMediaFiles || hasMediaFiles;
        }

        Object.keys(childCleanValues).forEach((k) => {
          cleanedValues[k] = childCleanValues[k];
        });
      }
    });
    return [cleanedValues, hasMediaFiles];
  };

  /**
   * This handles the form data submission
   */
  submitForm = async (event) => {
    event.preventDefault();

    // lets set the startCircularSpinner Value so the spinner starts spinning
    await this.setStateAsync({ startCircularSpinner: true });

    // let's clean up the data
    const { formData, formJson } = this.state;
    let [cleanedValues, hasMediaFiles] = this.cleanItUp(
      formData,
      formJson.fields
    );

    if (formJson.preflightFxn) {
      cleanedValues = formJson.preflightFxn(cleanedValues);
    }

    // let's make an api call to send the data
    let response = null;
    if (hasMediaFiles) {
      response = await apiCall(formJson.method, cleanedValues);
    } else {
      response = await apiCall(formJson.method, cleanedValues);
    }

    if (response && response.success) {
      // the api call was executed without any issues
      // const initialFormData = this.initialFormData(formJson.fields);
      // await this.setStateAsync({ formJson, formData });
      await this.setStateAsync({
        successMsg: `Successfully Created/Updated the Resource with Id: ${response.data &&
          response.data.id}.`,
        error: null,
        startCircularSpinner: false,
        // formData: initialFormData
      });

      if (formJson.successRedirectPage) {
        window.location.href = formJson.successRedirectPage;
      }
    } else if (response && !response.success) {
      // we got an error from the backend so let's set it so the snackbar can pick it up
      await this.setStateAsync({
        error: response.error,
        successMsg: null,
        startCircularSpinner: false,
      });
    }
  };

  isThisSelectedOrNot = (fieldName, value) => {
    const { formData } = this.state;
    const fieldValues = formData[fieldName];
    if (!fieldValues) return false;
    // if (!Array.isArray(fieldValues)) return false;
    return fieldValues.indexOf(value) > -1;
  };

  // what does this do?
  takeContentFrom;

  resetFileField(fieldName) {
    this.updateForm(fieldName, "None");
  }

  async updateForm(fieldName, value) {
    const { formData } = this.state;
    await this.setStateAsync({
      formData: {
        ...formData,
        [fieldName]: value,
      },
    });
  }

  renderModalText = (field) => {
    if (field && field.modalText) {
      return <Modal title={field.modalTitle} text={field.modalText} />;
    }
    return <div />;
  };

  /**
   * Given the field, it renders the actual component
   */
  renderField = (field) => {
    const { classes } = this.props;
    const value = this.getValue(field.name, []);

    // just a guess what this is supposed to be
    const files = []; //field.value !== 'None' ? [field.value] : [];

    switch (field.fieldType) {
      case FieldTypes.Checkbox:
        if (field.data) {
          return (
            <div key={field.name}>
              <div className={classes.field}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">{field.label}</FormLabel>
                  <Select
                    multiple
                    displayEmpty
                    name={field.name}
                    value={this.getValue(field.name)}
                    input={<Input id="select-multiple-chip" />}
                    renderValue={(selected) => (
                      <div className={classes.chips}>
                        {selected.map((id) => (
                          <Chip
                            key={id}
                            label={this.getDisplayName(
                              field.name,
                              id,
                              field.data
                            )}
                            className={classes.chip}
                          />
                        ))}
                      </div>
                    )}
                    MenuProps={MenuProps}
                  >
                    {field.data.map((t) => (
                      <MenuItem key={t.id}>
                        <FormControlLabel
                          key={t.id}
                          control={
                            <Checkbox
                              checked={this.isThisSelectedOrNot(field.name, t.id)}
                              onChange={(event) =>
                                this.handleCheckBoxSelect(event, field.selectMany)
                              }
                              value={t.id}
                              name={field.name}
                            />
                          }
                          label={t.displayName}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <br />
              </div>
            </div>
          );
  
        }
        else {
          // single checkbox
          const checked = (typeof value == "string") ? (value === "true") : value;
          return (
            <div key={field.name + field.label}>

            <FormControlLabel 
              label={field.label} 
              control=
              {
                <Checkbox
                  checked={checked} //{field.isRequired}
                  label={field.label}
                  name={field.name}
                  onChange={this.handleCheckboxToggle}
                  disabled={field.readOnly}
                />
              }
              />
            </div>
          );
  
        }
      case FieldTypes.Dropdown:
        return (
          <div key={field.name}>
            <FormControl className={classes.field}>
              <InputLabel htmlFor={field.name}>{field.label}</InputLabel>
              <Select
                native
                name={field.name}
                onChange={async (newValue) => {
                  await this.updateForm(field.name, newValue.target.value);
                }}
                inputProps={{
                  id: "age-native-simple",
                }}
              >
                <option value={this.getValue(field.name)}>
                  {this.getDisplayName(
                    field.name,
                    this.getValue(field.name),
                    field.data
                  )}
                </option>
                {field.data &&
                  field.data.map((c) => (
                    <option value={c.id} key={c.id}>
                      {c.displayName}
                    </option>
                  ))}
              </Select>
              {field.child &&
                this.getValue(field.name) === field.child.valueToCheck &&
                this.renderFields(field.child.fields)}
            </FormControl>
          </div>
        );
      case FieldTypes.Icon:
        return (
          <div key={field.name}>
            <FormControl className={classes.field}>
              <InputLabel htmlFor={field.name}>{field.label}</InputLabel>
              <Select
                native
                name={field.name}
                onChange={async (newValue) => {
                  await this.updateForm(field.name, newValue.target.value);
                }}
                inputProps={{
                  id: "age-native-simple",
                }}
              >
                <option value={this.getValue(field.name)}>
                  {this.getDisplayName(
                    field.name,
                    this.getValue(field.name),
                    this.iconFiles
                  )}
                </option>
                {this.iconFiles.map((c) => (
                  <option value={c} key={c}>
                    {c}
                  </option>
                ))}
              </Select>
              {field.child &&
                this.getValue(field.name) === field.child.valueToCheck &&
                this.renderFields(field.child.fields)}
            </FormControl>
          </div>
        );
      case FieldTypes.MediaLibrary:
        return (
          <MEMediaLibraryImplementation
            {...field}
            selected={this.getValue(field.name) || []}
            onInsert={(files) => {
              const formData = this.state.formData || {};
              this.setState({ formData: { ...formData, [field.name]: files } });
            }}
          />
        );
      case FieldTypes.File:
        // Linter caught this: what is this supposed to be?
        // const files = files && files !== 'None' ? files : [];
        return (
          <div key={field.name}>
            {value === "None" && (
              <p style={{ color: "maroon" }}>
                <i>
                  Image will be completely removed after you submit your changes
                </i>
              </p>
            )}
            {field.previewLink && value !== "None" && (
              <div>
                <h6>Current Image:</h6>
                <img
                  style={{ maxWidth: "400px", maxHeight: "300px" }}
                  src={field.previewLink}
                  alt={field.label}
                />
                <br />

                {field.allowReset && (
                  <>
                    <a
                      href="#void"
                      onClick={(e) => {
                        e.preventDefault();
                        this.resetFileField(field.name);
                      }}
                    >
                      Remove Image
                    </a>
                    <br />
                  </>
                )}

                <br />
              </div>
            )}
            <div className="imageUploadInstructions">
              <h6>Image Upload Instructions:</h6>
              <ul
                style={{
                  listStyleType: "circle",
                  paddingLeft: "30px",
                  fontSize: 14,
                }}
              >
                <li>
                  Drag an image to the box or click on it to browse your
                  computer. Only image files will be accepted.
                </li>
                <li>The final upload size must not exceed 5MB.</li>
                <li>
                  {field.imageAspectRatio ? (
                    <span>
                      The aspect ratio required for this image destination is{" "}
                      <i>{field.imageAspectRatio}</i>. After selecting an image,
                      a cropping tool will open.
                    </span>
                  ) : (
                    <span>
                      After an image is chosen, a cropping tool will open to
                      allow you to customize the image zoom and dimensions.
                    </span>
                  )}
                </li>
                {field.extraInstructions &&
                  field.extraInstructions.map((instruction, key) => (
                    <li key={key.toString()}>{instruction}</li>
                  ))}
              </ul>
            </div>
            <br />
            <Fragment>
              <MaterialDropZone
                acceptedFiles={[
                  "image/jpeg",
                  "image/png",
                  "image/jpg",
                  "image/bmp",
                  "image/svg",
                ]}
                files={files}
                showPreviews
                maxSize={5000000}
                imageAspectRatio={
                  field.imageAspectRatio ? field.imageAspectRatio : null
                }
                name={field.name}
                filesLimit={field.filesLimit}
                text={field.label}
                addToState={this.updateForm}
              />
            </Fragment>
          </div>
        );
      case FieldTypes.HTMLField:
        // const previewStyle = this.state.activeModal === field.name
        //  ? { display: 'block' }
        //  : { display: 'none' };
        return (
          <div key={field.name + field.label}>
            {/* <div style={previewStyle}>{this.showPreviewModal()}</div> */}
            <Grid
              item
              xs={12}
              style={{
                borderColor: "#EAEAEA",
                borderStyle: "solid",
                borderWidth: "thin",
              }}
            >
              <div style={{ padding: 20, color: "#d28818" }}>
                <Typography>{field.label}</Typography>
                <small>
                  <b>PLEASE NOTE:</b> the wide spacing between two lines in the
                  editor, is not what you will get when you content gets to
                  users.
                  <br />
                  If you need a{" "}
                  <b>
                    <i>gap </i>
                  </b>
                  between two lines, press your <b>Enter Key twice </b> or more,
                  instead of <b>once</b>
                  <br />
                  <b>
                    Pressing Once, will only show items right on the next line,
                    without any gap
                  </b>
                </small>
              </div>
              {/* <Editor
                editorState={this.getValue(field.name, EditorState.createEmpty())}
                editorClassName="editorClassName"
                onEditorStateChange={(e) => this.onEditorStateChange(field.name, e)}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
              /> */}

              <TinyEditor
                value={this.getValue(field.name, null)}
                onEditorChange={(content, editor) => {
                  this.handleEditorChange(content, editor, field.name);
                }}
                init={{
                  height: 350,
                  menubar: false,

                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor forecolor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                  ],
                  toolbar:
                    "undo redo | formatselect | bold italic backcolor forecolor | alignleft aligncenter alignright alignjustify | link | image | bullist numlist outdent indent |  fontselect | fontsizeselect",
                }}
                apiKey={TINY_MCE_API_KEY}
              />

              {/* <Button
                style={{ width: '100%' }}
                color="default"
                onClick={() => {
                  this.setState({
                    activeModal: field.name,
                    activeModalTitle: field.label,
                  });
                }}
              >
                <Icon style={{ marginRight: 6 }}>remove_red_eye</Icon>
                Show Me A Preview
                {' '}
              </Button> */}
            </Grid>
            <br />
            <br />
          </div>
        );
      case FieldTypes.Radio:
        return (
          <div className={classes.fieldBasic} key={field.name + field.label}>
            <FormLabel component="label">{field.label}</FormLabel>
            <RadioGroup
              aria-label={field.label}
              name={field.name}
              className={classes.group}
              value={value}
              onChange={this.handleFormDataChange}
              disabled={field.readOnly  || this.state.readOnly}
            >
              {field.data.map((d) => (
                <FormControlLabel
                  key={d.id}
                  value={d.id}
                  name={field.name}
                  disabled={field.readOnly || this.state.readOnly }
                  control={<Radio />}
                  label={d.value}
                />
              ))}
            </RadioGroup>
            <div>{field.description}</div>
            {field.child &&
              this.getValue(field.name) === field.child.valueToCheck &&
              this.renderFields(field.child.fields)}
            {this.renderConditionalDisplays(field)}
          </div>
        );
      case FieldTypes.TextField:
        return (
          <div key={field.name + field.label}>
            <TextField
              required={field.isRequired}
              name={field.name}
              onChange={this.handleFormDataChange}
              label={field.label}
              multiline={field.isMultiline}
              rows={4}
              type={field.contentType}
              placeholder={field.placeholder}
              className={classes.field}
              InputLabelProps={{
                shrink: true,
              }}
              disabled={field.readOnly || this.state.readOnly }
              defaultValue={field.defaultValue}
              maxLength={field.maxLength}
            />
          </div>
        );
      case FieldTypes.Section:
        return (
          <div key={field.label}>
            <br />
            <div
              style={{
                border: "1px solid rgb(229, 238, 245)",
                padding: 15,
                borderRadius: 6,
              }}
            >
              <p>{field.label}</p>
              {field.children && this.renderFields(field.children)}
            </div>
            <br />
            <br />
          </div>
        );
      case FieldTypes.DateTime:
        return (
          <div key={field.label}>
            <Typography variant="button" className={classes.divider}>
              {field.label}
            </Typography>
            <div className={classes.picker} style={{ width: "100%" }}>
              <MuiPickersUtilsProvider
                utils={MomentUtils}
                style={{ width: "100%" }}
              >
                <DateTimePicker
                  value={this.getValue(field.name, moment.now())}
                  onChange={(date) =>
                    this.handleFormDataChange({
                      target: { name: field.name, value: date },
                    })
                  }
                  label="" // don't put label in the box {field.label}
                  format="MM/DD/YYYY, h:mm a"
                />
              </MuiPickersUtilsProvider>
            </div>

            <br />
            <br />
          </div>
        );
      default:
        return <div key={field.name + field.label} />;
    }
  };

  renderConditionalDisplays = (field) => {
    // use conditional displays to render other fields based on user's radio btn selection
    // you can have as many conditions as possible defined in the user form json props
    if (!field || !field.conditionalDisplays) return;
    const toRender = field.conditionalDisplays.filter(
      (f) => this.getValue(field.name) === f.valueToCheck
    )[0];
    if (toRender && toRender.fields) this.renderFields(toRender.fields);
  };

  /**
   * Takes a list of fields and renders them one by depending on which type
   * by making use of a helper function
   */
  renderFields = (fields) =>
    fields.map((field, key) => (
      <div key={`${field.name}-${key.toString()}`}>
        {this.renderModalText(field)}
        {this.renderField(field)}
      </div>
    ));

  render() {
    const { classes } = this.props;
    const { formJson, error, successMsg, startCircularSpinner, readOnly } = this.state;

    if (!formJson) return <div />;
    return (
      <div>
        <Grid
          container
          spacing={24}
          alignItems="flex-start"
          direction="row"
          justify="center"
        >
          <Grid item xs={12} md={12}>
            <Paper className={classes.root}>
            <Typography variant="h5" component="h3">
                {formJson.title}
              </Typography>

              {readOnly ? (

                <Typography variant="h7" component="h3">
                  <em>ReadOnly : This content is a Template and can only be changed by a super-Admin</em>
                </Typography>
                ) : null
              }

              {/* Code to display error messages in case submission causes errors */}
              {error && (
                <div>
                  <Snackbar
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    open={error != null}
                    autoHideDuration={6000}
                    onClose={this.handleCloseStyle}
                  >
                    <MySnackbarContentWrapper
                      onClose={this.handleCloseStyle}
                      variant="error"
                      message={`Error Occurred: ${error}`}
                    />
                  </Snackbar>
                  <p style={{ color: "red" }}>{error}</p>
                </div>
              )}

              {/* Code to display success messages in case submission is successful */}
              {successMsg && (
                <div>
                  <Snackbar
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    open={successMsg != null}
                    autoHideDuration={6000}
                    onClose={this.handleCloseStyle}
                  >
                    <MySnackbarContentWrapper
                      onClose={this.handleCloseStyle}
                      variant="success"
                      message={successMsg}
                    />
                  </Snackbar>
                  <p style={{ color: "green" }}>{successMsg}</p>
                </div>
              )}

              {/* Generating the Actual Form */}
              <form onSubmit={this.submitForm}>
                {/* render the fields from the formJson */}
                {this.renderFields(formJson.fields)}

                {startCircularSpinner && (
                  <div>
                    <h5>Sending Data ...</h5>
                    <InputLabel>This might take a minute ...</InputLabel>
                    <CircularProgress className={classes.progress} />
                  </div>
                )}
                <div>
                  {formJson && formJson.cancelLink && (
                    <Link to={formJson.cancelLink}>Cancel</Link>
                  )}
                  {"    "}
                  <Button variant="contained" color="secondary" type="submit" disabled={this.state.readOnly}>
                    Submit
                  </Button>
                </div>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

MassEnergizeForm.FieldTypes = FieldTypes;
MassEnergizeForm.propTypes = {
  classes: PropTypes.object.isRequired,
  formJson: PropTypes.object.isRequired,
};
MassEnergizeForm.defaultProps ={
  readOnly : false,
}

export default withStyles(styles, { withTheme: true })(MassEnergizeForm);
