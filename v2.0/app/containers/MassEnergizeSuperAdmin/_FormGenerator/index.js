import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import { Field, reduxForm } from 'redux-form/immutable';
import Select from '@material-ui/core/Select';
import Radio from '@material-ui/core/Radio';
// import Field from '@material-ui/core/Field';
import RadioGroup from '@material-ui/core/RadioGroup';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import { MaterialDropZone } from 'dan-components';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import TextField from '@material-ui/core/TextField';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw } from 'draft-js';
import { apiCall, apiCallWithMedia } from '../../../utils/messenger';
import MySnackbarContentWrapper from '../../../components/SnackBar/SnackbarContentWrapper';
import FieldTypes from './fieldTypes';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 30
  },
  field: {
    width: '100%',
    marginBottom: 20
  },
  fieldBasic: {
    width: '100%',
    marginBottom: 20,
    marginTop: 10
  },
  inlineWrap: {
    display: 'flex',
    flexDirection: 'row'
  },
  buttonInit: {
    margin: theme.spacing.unit * 4,
    textAlign: 'center'
  },
});


class MassEnergizeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      startCircularSpinner: false,
      successMsg: null,
      error: null,
      formJson: null
    };
    this.updateForm = this.updateForm.bind(this);
  }


  async componentDidMount() {
    const { formJson } = this.props;
    const formData = this.initialFormData(formJson.fields);
    await this.setStateAsync({ formJson, formData });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

    /**
   * Given the field, it renders the actual component
   */
    initialFormData = (fields) => {
      const formData = {};
      fields.forEach(field => {
        switch (field.fieldType) {
          case FieldTypes.Checkbox:
            formData[field.name] = [];
            break;
          case FieldTypes.File:
            formData[field.name] = [];
            break;
          case FieldTypes.HTMLField:
            formData[field.name] = EditorState.createEmpty();
            break;
          default:
            formData[field.name] = field.defaultValue || null;
            break;
        }
      }
      );
      return formData;
    }


  /**
   * ============ HELPER FUNCTIONS FOR INPUTS
   */
  onEditorStateChange = async (name, editorState) => {
    const { formData } = this.state;
    await this.setStateAsync({
      formData: { ...formData, [name]: editorState }
    });
  };


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
      formData: { [name]: value }
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
      formData: { ...formData, [name]: value }
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
      formData: { ...formData, [name]: theList }
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
  }

  handleCloseStyle = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ successMsg: null, error: null });
  };

  getDisplayName = (fieldName, id, data) => {
    const { formData } = this.state;
    const val = formData[fieldName];
    if (!val) {
      return 'Please select an option';
    }
    const searchRes = data.filter(d => d.id === val);
    const [first] = searchRes;

    if (first) {
      return first.name || first.title || ('' + id);
    }
    return ('Unknown Resource with ID: ' + id);
  }


  /**
   * This is a recursive function traversing all the fields and their children
   * and extracting their values from the form
   */
  cleanItUp = (formData, fields) => {
    const cleanedValues = {};
    let hasMediaFiles = false;
    fields.forEach(field => {
      const fieldValueInForm = formData[field.name];
      if (fieldValueInForm) {
        switch (field.fieldType) {
          case FieldTypes.HTMLField:
            cleanedValues[field.dbName] = draftToHtml(convertToRaw(fieldValueInForm.getCurrentContent()));
            break;
          case FieldTypes.Checkbox:
            if (cleanedValues[field.dbName]) {
              cleanedValues[field.dbName] = cleanedValues[field.dbName].concat(fieldValueInForm);
            } else {
              cleanedValues[field.dbName] = fieldValueInForm;
            }
            break;
          case FieldTypes.File:
            hasMediaFiles = true;
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

      if (field.child) {
        const [childCleanValues, childHasMediaFiles] = this.cleanItUp(formData, field.child.fields);
        if (childHasMediaFiles) {
          hasMediaFiles = childHasMediaFiles || hasMediaFiles;
        }
        Object.keys(childCleanValues).forEach(k => {
          cleanedValues[k] = childCleanValues[k];
        });
      }
    });

    return [cleanedValues, hasMediaFiles];
  }


  /**
   * This handles the form data submission
   */
  submitForm = async (event) => {
    event.preventDefault();

    // lets set the startCircularSpinner Value so the spinner starts spinning
    await this.setStateAsync({ startCircularSpinner: true });

    // let's clean up the data
    const { formData, formJson } = this.state;
    const [cleanedValues, hasMediaFiles] = this.cleanItUp(formData, formJson.fields);

    // let's make an api call to send the data
    let response = null;
    if (hasMediaFiles) {
      response = await apiCallWithMedia(formJson.method, cleanedValues);
    } else {
      response = await apiCall(formJson.method, cleanedValues);
    }

    if (response && response.success) {
      // the api call was executed without any issues
      // const initialFormData = this.initialFormData(formJson.fields);
      // await this.setStateAsync({ formJson, formData });
      await this.setStateAsync({
        successMsg: `Successfully Created the Resource with Id: ${response.data.id}. Want to Create a new one?  Modify the fields`,
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
        startCircularSpinner: false
      });
    }
  }

  isThisSelectedOrNot = (fieldName, value) => {
    const { formData } = this.state;
    const fieldValues = formData[fieldName];
    if (!fieldValues) return false;
    // if (!Array.isArray(fieldValues)) return false;
    return fieldValues.indexOf(value) > -1;
  }

  async updateForm(fieldName, value) {
    const { formData } = this.state;
    await this.setStateAsync({
      formData: {
        ...formData,
        [fieldName]: value
      }
    }
    );
  }


  /**
   * Given the field, it renders the actual component
   */
  renderField = (field) => {
    const { classes } = this.props;
    switch (field.fieldType) {
      case FieldTypes.Checkbox:
        return (
          <div key={field.name}>
            <div className={classes.field}>
              <FormControl component="fieldset">
                <FormLabel component="legend">{field.label}</FormLabel>
                <FormGroup>
                  {field.data.map(t => (
                    <FormControlLabel
                      key={t.id}
                      control={(
                        <Checkbox
                          checked={this.isThisSelectedOrNot(field.name, t.id)}
                          onChange={(event) => this.handleCheckBoxSelect(event, field.selectMany)}
                          value={t.id}
                          name={field.name}
                        />
                      )}
                      label={t.displayName}
                    />
                  ))}
                </FormGroup>
              </FormControl>
              <br />
            </div>
          </div>
        );
      case FieldTypes.Dropdown:
        return (
          <div key={field.name}>
            <FormControl className={classes.field}>
              <InputLabel htmlFor={field.name}>{field.label}</InputLabel>
              <Select
                native
                name={field.name}
                onChange={async (newValue) => { await this.updateForm(field.name, newValue.target.value); }}
                inputProps={{
                  id: 'age-native-simple',
                }}
              >
                <option value={this.getValue(field.name)}>{this.getDisplayName(field.name, this.getValue(field.name), field.data)}</option>
                { field.data
                  && field.data.map(c => (
                    <option value={c.id} key={c.id}>{c.displayName}</option>
                  ))
                }
              </Select>
              {field.child && this.getValue(field.name) === field.child.valueToCheck && this.renderField(field.child)}
            </FormControl>
          </div>
        );
      case FieldTypes.File:
        return (
          <div key={field.name}>
            <Fragment>
              <MaterialDropZone
                acceptedFiles={['image/jpeg', 'image/png', 'image/jpg', 'image/bmp', 'image/svg']}
                files={this.getValue(field.name, [])}
                showPreviews
                maxSize={5000000}
                filesLimit={field.filesLimit}
                text={field.label}
                addToState={this.updateForm}
              />
            </Fragment>
          </div>
        );
      case FieldTypes.HTMLField:
        return (
          <div key={field.name + field.label}>
            <Grid item xs={12} style={{ borderColor: '#EAEAEA', borderStyle: 'solid', borderWidth: 'thin' }}>
              <Typography>{field.label}</Typography>
              <Editor
                editorState={this.getValue(field.name, EditorState.createEmpty())}
                editorClassName="editorClassName"
                onEditorStateChange={(e) => this.onEditorStateChange(field.name, e)}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
              />
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
              value={this.getValue(field.name)}
              onChange={this.handleFormDataChange}
            >
              {field.data.map(d => (
                <FormControlLabel key={d.id} value={d.id} name={field.name} control={<Radio />} label={d.value} />
              ))}
            </RadioGroup>
            <div>{field.description}</div>
            {field.child && (this.getValue(field.name) === field.child.valueToCheck) && this.renderFields(field.child.fields)}
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
              type={field.contentType}
              placeholder={field.placeholder}
              className={classes.field}
              InputLabelProps={{
                shrink: true,
              }}
              defaultValue={field.defaultValue}
            />
          </div>

        );
      default:
        return <div key={field.name + field.label} />;
    }
  }

  /**
   * Takes a list of fields and renders them one by depending on which type
   * by making use of a helper function
   */
  renderFields = (fields) => fields.map(field => this.renderField(field))


  render() {
    const { classes } = this.props;
    const {
      formJson, error, successMsg, startCircularSpinner
    } = this.state;

    if (!formJson) return <div />;
    return (
      <div>
        <Grid container spacing={24} alignItems="flex-start" direction="row" justify="center">
          <Grid item xs={12} md={12}>
            <Paper className={classes.root}>
              <Typography variant="h5" component="h3">
                {formJson.title}
              </Typography>

              {/* Code to display error messages in case submission causes errors */}
              {error
              && (
                <div>
                  <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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
                  <p style={{ color: 'red' }}>{error}</p>
                </div>
              )}

              {/* Code to display success messages in case submission is successful */}
              {successMsg
              && (
                <div>
                  <Snackbar
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
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
                  <p style={{ color: 'green' }}>{successMsg}</p>
                </div>
              )}

              {/* Generating the Actual Form */}
              <form onSubmit={this.submitForm}>

                {/* render the fields from the formJson */}
                {this.renderFields(formJson.fields)}

                {startCircularSpinner
                && (
                  <div>
                    <h5>Sending Data ...</h5>
                    <InputLabel>This might take a minute ...</InputLabel>
                    <CircularProgress className={classes.progress} />
                  </div>
                )
                }
                <div>
                  <Button variant="contained" color="secondary" type="submit">
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

MassEnergizeForm.propTypes = {
  classes: PropTypes.object.isRequired,
  formJson: PropTypes.object.isRequired,
};

const ReduxFormMapped = reduxForm({ form: 'immutableExample' })(MassEnergizeForm);

export default withStyles(styles, { withTheme: true })(ReduxFormMapped);
