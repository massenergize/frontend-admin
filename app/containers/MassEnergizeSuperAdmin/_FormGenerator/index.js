import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import Select from "@mui/material/Select";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import dayjs from "dayjs"; // don't remove this
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import MomentUtils from "@date-io/moment";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { Link, withRouter } from "react-router-dom";
import { MaterialDropZone } from "dan-components";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
// import { Editor as TinyEditor } from "@tinymce/tinymce-react";
import TinyEditor from "./TinyMassEnergizeEditor";

import { MenuItem, Alert } from "@mui/material";
import TextField from "@mui/material/TextField";
// import Icon from '@mui/material/Icon';
import moment from "moment";
import { apiCall } from "../../../utils/messenger";
import FieldTypes from "./fieldTypes";
import Modal from "./Modal";
// import PreviewModal from './PreviewModal';
import Loading from "dan-components/Loading";
import IconDialog from "../ME  Tools/icon dialog/IconDialog";
import FormMediaLibraryImplementation from "./media library/FormMediaLibraryImplementation";
import LightAutoComplete from "../Gallery/tools/LightAutoComplete";
import { isValueEmpty } from "../Community/utils";
import { getRandomStringKey } from "../ME  Tools/media library/shared/utils/utils";
import AsyncDropDown from "./AsyncCheckBoxDropDown";
import MEDropDown from "./MEDropDown";

const TINY_MCE_API_KEY = process.env.REACT_APP_TINY_MCE_KEY;
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
    margin: theme.spacing(4),
    textAlign: "center",
  },
});

const ITEM_HEIGHT = 60;
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
      requiredFields: {},
      // activeModal: null,
      // activeModalTitle: null,
      refreshKey: "default-form-state", // Change this value to any different string force a re-render in the form.
    };
    this.updateForm = this.updateForm.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.resetForm = this.resetForm.bind(this);
    //this.closePreviewModal = this.closePreviewModal.bind(this);
  }

  async componentDidMount() {
    const { formJson } = this.props;
    const formData = this.initialFormData(formJson.fields);
    const readOnly = this.props.readOnly;
    await this.setStateAsync({ formJson, formData, readOnly: readOnly });
  }

  componentWillUnmount() {
    const { unMount } = this.props;
    if (unMount) unMount(this.state);
  }
  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.formJson !== prevState.formJson) {
      return { formJson: nextProps.formJson };
    }
    return null;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.formJson !== prevState.formJson) {
      return { formJson: nextProps.formJson };
    }
    return null;
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
      if (field.conditionalDisplays) {
        (field.conditionalDisplays || []).forEach((item) => {
          const cFormData = this.initialFormData(item.fields);
          Object.keys(cFormData).forEach((k) => {
            formData[k] = cFormData[k];
          });
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
  handleFormDataChange = (event, field) => {
    const { target } = event;
    if (!target) return;
    const { name, value } = target;
    const { formData } = this.state;
    const { onChangeMiddleware } = field || {};
    const setValueInForm = (newContent) =>
      this.setState({
        formData: { ...formData, [name]: value, ...(newContent || {}) },
      });

    if (onChangeMiddleware)
      return onChangeMiddleware({
        field,
        newValue: value,
        formData,
        setValueInForm,
      });
    this.setState({
      formData: { ...formData, [name]: value },
    });
  };



  setValueInForm = (content)=>{
    this.setState({
      formData:{...this.state.formData, ...(content||{})}
    })
  }

  handleSubDomainChange = async (event) => {
    const { target } = event;
    if (!target) return;

    const { formData } = this.state;
    const { name, value } = target;

    if (!value) return;

    // does not leave international characters like ä
    const newValue = value
      .replaceAll(" ", "_")
      .replaceAll(/[^a-zA-Z0-9_]/g, "");

    event.target.value = newValue;
    await this.setStateAsync({
      formData: { ...formData, [name]: newValue },
    });
  };

  /**
   * Handle checkboxes when they are clicked
   */
  handleCheckBoxSelect = async (event, selectMany, field) => {
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
    const setValueInForm = (newContent) => {
      this.setState({
        formData: { ...formData, [name]: theList, ...(newContent || {}) },
      });
    };

    if (field?.onChangeMiddleware)
      return field?.onChangeMiddleware({
        field,
        newValue: theList,
        formData,
        setValueInForm: setValueInForm,
      });
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
    formData[name] = formData[name] === "true" ? "false" : "true";
    this.setState({
      formData: { ...formData },
    });
  };
  /**
   * Returns what value was entered in the form for this fieldName
   */
  getValue = (name, defaultValue = null, field = null) => {
    let { formData } = this.state;
    let val = formData[name];
    if (field?.fieldType === FieldTypes.TextField && !val) return ""; // Now needed because I've had to make TextFields controlled inputs.[Makes sure that when field is cleared out, defalut value is not retrieved again]
    if (!val) {
      formData = { ...formData, [name]: defaultValue };
      // this.setState({ formData });
      val = defaultValue;
    }
    // If valueExtractor is passed into any field object, it means we want to step in the middle
    // and process the value before it shows.
    if (field && field.valueExtractor) {
      const passValueOnToState = (newValue) =>
        this.setState({ formData: { ...formData, [name]: newValue } });
      return field.valueExtractor(formData, field, passValueOnToState);
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
      const [result] = data.filter(
        (d) => d.id && d.id.toString() === id && id.toString()
      );
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

  requiredValuesAreProvided(formData, fields) {
    formData = formData || {};
    var culprits = {};
    fields.forEach((field) => {
      if (field.children) {
        const result = this.requiredValuesAreProvided(formData, field.children);
        culprits = { ...culprits, ...result[1] };
      } else if (field.child) {
        let value = this.getValue(field.name);
        if (value === field?.child?.valueToCheck) {
          const result = this.requiredValuesAreProvided(
            formData,
            field?.child.fields
          );
          culprits = { ...culprits, ...result[1] };
        }
      } else {
        const value = formData[field.name]; //field.name is what is used to set value, b4 cleaned up onSubmit
        // if field is readOnly - ignore the isRequired if present
        if (field.isRequired && !field.readOnly) {
          if (isValueEmpty(value)) {
            culprits = {
              ...culprits,
              [field.name]: {
                name: field.name,
                dbName: field.dbName,
              },
            };
          }
        }
      }
    });

    return [Object.keys(culprits).length, culprits];
  }

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
            cleanedValues[field.dbName] = fieldValueInForm;
            break;
          case FieldTypes.DateTime:
            cleanedValues[field.dbName] = (
              moment.utc(fieldValueInForm) || moment.now()
            ).format();
            break;
          case FieldTypes.Checkbox:
            // If two or more items have the same dbName, the get combined into an array
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
        const selectedSet =
          field.conditionalDisplays.find(
            (f) => fieldValueInForm === f.valueToCheck
          ) || {};
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

  setError(error) {
    this.setState({ error: error, startCircularSpinner: false });
  }

  resetForm(defaults = { formData: {} }) {
    const refreshKey = getRandomStringKey();
    this.setState({ ...defaults, refreshKey });
    //More to come, on uncontrolled fields (when needed)
  }
  /**
   * This handles the form data submission
   */
  submitForm = async (event) => {
    event.preventDefault();
    const { formData, formJson } = this.state;
    this.setState({ requiredFields: {} });
    const [No, culprits] = this.requiredValuesAreProvided(
      formData,
      formJson.fields
    );
    if (No) return this.setState({ requiredFields: culprits });

    // lets set the startCircularSpinner Value so the spinner starts spinning
    await this.setStateAsync({ startCircularSpinner: true });
    // let's clean up the data
    const { onComplete, validator, clearProgress } = this.props;
    let [cleanedValues, hasMediaFiles] = this.cleanItUp(
      formData,
      formJson.fields
    );

    if (formJson.preflightFxn) {
      cleanedValues = formJson.preflightFxn(
        cleanedValues,
        this.setError.bind(this)
      );
    }

    // if validator is provided, it means we want to make some form of unique custom validation first
    // before submiting the form
    if (validator) {
      const [validationPassed, _err] = validator(
        cleanedValues,
        formJson.fields,
        this.setError.bind(this)
      );
      if (!validationPassed) return this.setError(_err);
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

      if (onComplete)
        onComplete(
          response.data,
          response && response.success,
          this.resetForm.bind(this)
        );

      if (clearProgress) clearProgress(this.resetForm);

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
    return fieldValues.indexOf(value.toString()) > -1;
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

  renderGeneralContent(field) {
    const requiredFields = this.state.requiredFields || {};
    const isRequiredButEmpty = requiredFields[field.name];
    if (isRequiredButEmpty) {
      return (
        <small
          className="error-notifications"
          style={{ color: "red", fontWeight: "bold" }}
        >
          The field below is required but no value is provided *
        </small>
      );
    }
    return <></>;
  }
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
        if (field?.isAsync) {
          return (
            <AsyncDropDown
              field={field}
              renderGeneralContent={this.renderGeneralContent}
              getValue={this.getValue}
              getDisplayName={this.getDisplayName}
              isThisSelectedOrNot={this.isThisSelectedOrNot}
              handleCheckBoxSelect={this.handleCheckBoxSelect}
              handleCheckboxToggle={this.handleCheckboxToggle}
              MenuProps={MenuProps}
            />
          );
        }
        if (field.data) {
          return (
            <div key={field.name}>
              <div className={classes.field}>
                <FormControl component="fieldset" required={field.isRequired}>
                  {this.renderGeneralContent(field)}
                  <FormLabel component="legend">{field.label}</FormLabel>

                  <Select
                    multiple
                    displayEmpty
                    name={field.name}
                    value={this.getValue(field.name) || []}
                    input={<Input id="select-multiple-chip" />}
                    onClose={() => field?.onClose && field.onClose(value)}
                    required={field.isRequired}
                    renderValue={(selected) => {
                      return (
                        <div
                          className={classes.chips}
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                          }}
                        >
                          {(selected || []).map((id) => (
                            <Chip
                              key={id}
                              label={this.getDisplayName(
                                field.name,
                                id,
                                field.data
                              )}
                              className={classes.chip}
                              style={{ margin: 5 }}
                            />
                          ))}
                        </div>
                      );
                    }}
                    MenuProps={MenuProps}
                  >
                    {field.data.map((t) => (
                      <MenuItem key={t.id}>
                        <FormControlLabel
                          key={t.id}
                          control={
                            <Checkbox
                              checked={this.isThisSelectedOrNot(
                                field.name,
                                t.id
                              )}
                              onChange={(event) =>
                                this.handleCheckBoxSelect(
                                  event,
                                  field.selectMany,
                                  field
                                )
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
        } else {
          // single checkbox
          const checked = typeof value == "string" ? value === "true" : value;
          return (
            <div key={field.name + field.label}>
              <FormControlLabel
                label={field.label}
                control={
                  <Checkbox
                    checked={checked} //{field.isRequired}
                    label={field.label}
                    name={field.name}
                    onChange={this.handleCheckboxToggle}
                    disabled={field.readOnly}
                    required={field.isRequired}
                  />
                }
              />
            </div>
          );
        }
      case FieldTypes.Dropdown:
        return (
          <MEDropDown
            field={field}
            renderGeneralContent={this.renderGeneralContent}
            updateForm={this.updateForm}
            getValue={this.getValue}
            renderFields={this.renderFields}
            getDisplayName={this.getDisplayName}
            formData = {this.state.formData}
            setValueInForm={this.setValueInForm}

          />
        );
      case FieldTypes.Icon:
        return (
          <div key={field.name}>
            {this.renderGeneralContent(field)}
            <InputLabel htmlFor={field.name} style={{ marginBottom: 8 }}>
              {field.label}
            </InputLabel>
            <FormControl className={classes.field} style={{ marginTop: 10 }}>
              <div>
                <IconDialog
                  {...field}
                  onIconSelected={(iconName) => {
                    this.updateForm(field.name, iconName);
                  }}
                />
              </div>
            </FormControl>
          </div>
        );
      case FieldTypes.MediaLibrary:
        return (
          <>
            <div className="imageUploadInstructions">
              {this.renderGeneralContent(field)}
              <h6>Image Upload Instructions:</h6>
              <ul
                style={{
                  listStyleType: "circle",
                  paddingLeft: "30px",
                  fontSize: 14,
                }}
              >
                <p>
                  You have access to all the images that are in use in the
                  communities you manage. Your library contains images that have
                  either been uploaded by you, or other admins of your
                  community. You may also see images that are not from any of
                  your communities, but have been made public by admins of
                  different communities.
                </p>
                <li>Pick an image from the library, or add a new one.</li>
                <li>
                  <b>The final upload size must not exceed 5MB.</b>
                </li>

                {field.extraInstructions &&
                  field.extraInstructions.map((instruction, key) => (
                    <li key={key.toString()}>{instruction}</li>
                  ))}
              </ul>
            </div>
            <br />
            <FormMediaLibraryImplementation
              {...field}
              selected={this.getValue(
                field.name,
                field.selected || field.defaultValue,
                field
              )}
              actionText={field.placeholder}
              onInsert={(files) => {
                const formData = this.state.formData || {};
                const isEmpty = !files || !files.length;
                var ids = files.map((img) => img.id);
                this.setState({
                  formData: {
                    ...formData,
                    [field.name]: isEmpty ? ["reset"] : ids, // so that the backend can know exactly when an existing image needs to be removed, and when the image field is just not available
                  },
                });
              }}
            />
          </>
        );
      case FieldTypes.File:
        // Linter caught this: what is this supposed to be?
        // const files = files && files !== 'None' ? files : [];
        return (
          <div key={field.name}>
            {this.renderGeneralContent(field)}
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
            {this.renderGeneralContent(field)}
            <Grid
              item
              xs={12}
              style={{
                borderColor: "#EAEAEA",
                borderStyle: "solid",
                borderWidth: "thin",
              }}
            >
              <div style={{ padding: 20 }}>
                <Typography>{field.label}</Typography>
                {/* <small>
                  <b>PLEASE NOTE:</b> the wide spacing between two lines
                  in the editor, is not what you will get when you
                  content gets to users.
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
                </small> */}
              </div>

              <TinyEditor
                id={field?.name || "" + field?.dbName || ""}
                value={this.getValue(field.name, null)}
                onEditorChange={(content, editor) => {
                  this.handleEditorChange(content, editor, field.name);
                }}
                // Toolbar Docs:  https://www.tiny.cloud/docs/tinymce/6/migration-from-5x/#things-we-renamed
                toolbar="undo redo | blocks | formatselect | bold italic backcolor forecolor | alignleft aligncenter alignright alignjustify | link | image | bullist numlist outdent indent | fontfamily | fontsize |"
                plugins="advlist autolink lists link image charmap print preview anchor forecolor"
                init={{
                  height: 350,
                  menubar: false,
                  default_link_target: "_blank",
                  forced_root_blocks: true,
                  forced_root_block: false,
                  // next 4 lines test to eliminate tiny cloud errors
                  // selector: "textarea",
                  // init_instance_callback: function(editor) {
                  //   var freeTiny = document.querySelector(
                  //     ".tox .tox-notification--in"
                  //   );
                  //   freeTiny.style.display = "none";
                  // },
                }}
                apiKey={TINY_MCE_API_KEY}
              />
            </Grid>
            <br />
            <br />
          </div>
        );
      case FieldTypes.Radio:
        return (
          <div className={classes.fieldBasic} key={field.name + field.label}>
            {this.renderGeneralContent(field)}
            <FormLabel component="label">{field.label}</FormLabel>
            <RadioGroup
              aria-label={field.label}
              name={field.name}
              className={classes.group}
              value={value}
              onChange={this.handleFormDataChange}
              disabled={field.readOnly || this.state.readOnly}
            >
              {field.data.map((d) => (
                <FormControlLabel
                  key={d.id}
                  value={d.id}
                  name={field.name}
                  disabled={field.readOnly || this.state.readOnly}
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
            {this.renderGeneralContent(field)}
            <TextField
              required={field.isRequired}
              name={field.name}
              onChange={(e) =>
                field.name === "subdomain"
                  ? this.handleSubDomainChange(e)
                  : this.handleFormDataChange(e, field)
              }
              label={field.label}
              multiline={field.isMultiline}
              rows={4}
              type={field.contentType}
              placeholder={field.placeholder}
              className={classes.field}
              InputLabelProps={{
                shrink: true,
              }}
              disabled={field.readOnly || this.state.readOnly}
              value={this.getValue(field.name, field.defaultValue, field)}
              inputProps={{ maxLength: field.maxLength }}
              // maxLength={field.maxLength}
              variant="outlined"
            />
          </div>
        );
      case FieldTypes.Section:
        return (
          <div key={field.label}>
            {this.renderGeneralContent(field)}
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
            {this.renderGeneralContent(field)}
            <Typography variant="button" className={classes.divider}>
              {field.label}
            </Typography>
            <div className={classes.picker} style={{ width: "100%" }}>
              <LocalizationProvider
                dateAdapter={AdapterMoment}
                utils={MomentUtils}
                style={{ width: "100%" }}
              >
                <DateTimePicker
                  {...field}
                  renderInput={(props) => <TextField {...props} />}
                  value={this.getValue(field.name, field.defaultValue, field)}
                  onChange={(date) => {
                    this.handleFormDataChange(
                      {
                        target: {
                          name: field.name,
                          value: date,
                        },
                      },
                      field
                    );
                  }}
                  label="" // don't put label in the box {field.label}
                  // mask="MM/DD/YYYY, h:mm a"
                  inputFormat="MM/DD/YYYY HH:mm:ss"
                  mask={"__/__/____ __:__:__"}
                />
              </LocalizationProvider>
            </div>

            <br />
            <br />
          </div>
        );
      case FieldTypes.AutoComplete:
        return (
          <div key={field.name}>
            <FormLabel component="label">{field.label}</FormLabel>
            <LightAutoComplete
              {...field}
              defaultSelected={this.getValue(field.name) || []}
              onChange={(selected) =>
                this.handleFormDataChange({
                  target: { value: selected, name: field.name },
                })
              }
            />
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
    if (toRender && toRender.fields) return this.renderFields(toRender.fields);
  };

  /**
   * Takes a list of fields and renders them one by depending on which type
   * by making use of a helper function
   */
  renderFields = (fields) =>
    fields.map((field, key) => (
      <div key={`${field.name}-${key.toString()}`}>
        <div style={{ marginBottom: 15 }}>{this.renderModalText(field)}</div>

        {this.renderField(field)}
      </div>
    ));

  render() {
    const { classes, enableCancel, cancel, noBack } = this.props;
    const {
      formJson,
      error,
      successMsg,
      startCircularSpinner,
      readOnly,
      requiredFields,
    } = this.state;
    if (!formJson) return <Loading />;
    return (
      <div key={this.state.refreshKey}>
        <Grid
          container
          alignItems="flex-start"
          direction="row"
          justify="center"
        >
          <Grid item xs={12} md={12}>
            <Paper className={classes.root}>
              <Typography variant="h5" component="h3">
                {formJson.title}
              </Typography>
              {!noBack && (
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    this.props.history.goBack();
                  }}
                >
                  Go Back
                </Link>
              )}

              {readOnly ? (
                <Typography variant="h7" component="h3">
                  <em>
                    ReadOnly : This content is a Template or shared from a
                    community you are not an admin of.
                  </em>
                </Typography>
              ) : null}

              {/* Code to display error messages in case submission causes errors */}
              {error && (
                <div>
                  <Snackbar
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    open={error != null}
                    autoHideDuration={6000}
                    onClose={this.handleCloseStyle}
                  >
                    <Alert
                      onClose={this.handleCloseStyle}
                      severity={"error"}
                      sx={{ width: "100%" }}
                    >
                      <small style={{ marginLeft: 15, fontSize: 15 }}>
                        {error}
                      </small>
                    </Alert>
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
                    <Alert
                      onClose={this.handleCloseStyle}
                      severity={"success"}
                      sx={{ width: "100%" }}
                    >
                      <small style={{ marginLeft: 15, fontSize: 15 }}>
                        {successMsg}
                      </small>
                    </Alert>
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
                  {/* {formJson && formJson.cancelLink && (
                    <Link to={formJson.cancelLink}>Cancel</Link>
                  )} */}
                  {"    "}
                  {enableCancel && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={(e) => {
                        e.preventDefault();
                        const { clearProgress } = this.props;
                        if (clearProgress) clearProgress(this.resetForm);
                        if (cancel) return cancel();
                        this.props.history.goBack();
                      }}
                      style={{ marginRight: 15, background: "#cf4949" }}
                    >
                      Cancel
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    disabled={this.state.readOnly}
                  >
                    Submit
                  </Button>
                </div>
                {Object.keys(requiredFields).length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 10,
                    }}
                  >
                    <Alert severity="warning">
                      Oops! Looks like you missed these required fields{" "}
                      {Object.keys(requiredFields).map((key, index) => (
                        <span style={{ color: "tomato" }} key={key}>
                          {key}{" "}
                          {index !== Object.keys(requiredFields).length - 1 &&
                            ", "}
                        </span>
                      ))}
                      . Please fill them out.
                    </Alert>
                  </div>
                )}
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
  enableCancel: PropTypes.bool,
  // cancel: PropTypes.func,
  /**
   * Any function you want to run when the form successfully does its job
   */
  onComplete: PropTypes.func,
  /**
   * Enable or disable back button on form generator
   */
  noBack: PropTypes.bool,
};
MassEnergizeForm.defaultProps = {
  readOnly: false,
  enableCancel: false,
  noBack: false,
};

export default withStyles(styles, { withTheme: true })(
  withRouter(MassEnergizeForm)
);
