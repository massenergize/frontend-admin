import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import { Field } from 'redux-form/immutable';
import Select from '@material-ui/core/Select';
import Radio from '@material-ui/core/Radio';
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

const renderRadioGroup = ({ input, ...rest }) => (
  <RadioGroup
    {...input}
    {...rest}
    valueselected={input.value}
    onChange={(event, value) => input.onChange(value)}
  />
);


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
  }


  async componentDidMount() {
    const { formJson } = this.props;
    await this.setStateAsync({ formJson });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  onEditorStateChange = async (name, editorState) => {
    await this.setStateAsync({
      formData: { [name]: editorState }
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
    this.setState({
      formData: { [name]: value }
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
    const newVal = parseInt(value, 10);
    const pos = theList.indexOf(newVal);
    if (pos > -1) {
      theList.splice(pos, 1);
    }

    if (!selectMany) {
      theList = [newVal];
    } else {
      theList.push(newVal);
    }

    await this.setStateAsync({
      formData: { ...formData, [name]: theList }
    });
  };


  /**
   * Returns what value was entered in the form for this fieldName
   */
  getValue = (name) => {
    const { formData } = this.state;
    const val = formData[name];
    return val;
  }

  handleCloseStyle = (event, reason) => {
    event.preventDefault();
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ successMsg: null, error: null });
  };


  /**
   * This handles the form data submission
   */
  submitForm = async (event) => {
    event.preventDefault();

    // lets set the startCircularSpinner Value so the spinner starts spinning
    await this.setStateAsync({ startCircularSpinner: true });

    // let's sow the data together
    const { formData, formJson } = this.state;
    const cleanedValues = {};
    const tmpFormValues = { ...formData };
    let hasMediaFiles = false;
    formJson.fields.forEach(field => {
      const fieldValueInForm = tmpFormValues[field.name];
      if (fieldValueInForm) {
        switch (field.type) {
          case FieldTypes.HTMLField:
            cleanedValues[field.dbName] = draftToHtml(convertToRaw(fieldValueInForm.getCurrentContent()));
            break;
          case FieldTypes.File:
            hasMediaFiles = true;
            cleanedValues[field.dbName] = fieldValueInForm;
            break;
          default:
            cleanedValues[field.dbName] = fieldValueInForm;
        }
      }
    });

    // let's make an api call to send the data
    let response = null;
    if (hasMediaFiles) {
      response = await apiCallWithMedia(formJson.method, cleanedValues);
    } else {
      response = await apiCall(formJson.method, cleanedValues);
    }

    if (response && response.success) {
      // the api call was executed without any issues
      console.log(response.data);
      await this.setStateAsync({
        successMsg: `Successfully Created the Resource with Id: ${response.data.id}. Want to Create a new one?  Modify the fields`,
        error: null,
        startCircularSpinner: false,
        formData: {}
      });
    } else if (response && !response.success) {
      // we got an error from the backend so let's set it so the snackbar can pick it up
      console.log(response);
      await this.setStateAsync({
        error: response.error,
        successMsg: null,
        startCircularSpinner: false
      });
    }
  }

  isThisSelectedOrNot = (formData, fieldName, value) => {
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
    switch (field.type) {
      case FieldTypes.Checkbox:
        return (
          <div>
            <div className={classes.field} key={field.name + field.dbName}>
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
                      label={field.label}
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
          <FormControl className={classes.field} key={field.name + field.dbName}>
            <InputLabel htmlFor={field.name}>{field.label}</InputLabel>
            <Select
              native
              name={field.name}
              onChange={async (newValue) => { await this.updateForm(field.name, newValue.target.value); }}
              inputProps={{
                id: 'age-native-simple',
              }}
            >
              <option value={this.getValue(field.name)}>{this.getDisplayName(field.name, field.dataMemberDisplayName, field.data)}</option>
              { field.data
                && field.data.map(c => (
                  <option value={c.id} key={c.id}>{c[field.dataMemberDisplayName]}</option>
                ))
              }
            </Select>
            {field.child && this.getValue(field.name) === field.child.valueToCheck && this.renderField(field.child)}
          </FormControl>
        );
      case FieldTypes.File:
        return (
          <Fragment key={field.name + field.dbName}>
            <MaterialDropZone
              acceptedFiles={['image/jpeg', 'image/png', 'image/jpg', 'image/bmp', 'image/svg']}
              files={this.getValue(field.name)}
              showPreviews
              maxSize={5000000}
              filesLimit={field.fieldsLimit}
              text={field.label}
              addToState={this.updateForm}
            />
          </Fragment>
        );
      case FieldTypes.HTMLField:
        return (
          <Grid item xs={12} style={{ borderColor: '#EAEAEA', borderStyle: 'solid', borderWidth: 'thin' }} key={field.name + field.dbName}>
            <Typography>{field.label}</Typography>
            <Editor
              editorState={this.getValue(field.name)}
              editorClassName="editorClassName"
              onEditorStateChange={(e) => this.onEditorStateChange(field.name, e)}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
            />
          </Grid>
        );
      case FieldTypes.Radio:
        return (
          <div className={classes.fieldBasic} key={field.name + field.dbName}>
            <FormLabel component="label">{field.label}</FormLabel>
            <Field name={field.name} className={classes.inlineWrap} component={renderRadioGroup}>
              {field.data.map(d => (
                <FormControlLabel value={d.id} name={field.name} control={<Radio />} label={d.dataMemberDisplayName} onClick={this.radioSelect} />
              ))}
            </Field>
            <div>{field.description}</div>
            {field.child && (this.getValue(field.name) === field.child.valueToCheck) && this.renderField(field.child)}
          </div>
        );
      case FieldTypes.TextField:
        return (
          <div key={field.name + field.dbName}>
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
        return <div />;
    }
  }

  /**
   * Takes a list of fields and renders them one by depending on which type
   * by making use of a helper function
   */
  renderFields = (fields) => (
    (
      <div>
        {fields.map(field => this.renderField(field))}
      </div>
    )
  )


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

export default withStyles(styles, { withTheme: true })(MassEnergizeForm);
