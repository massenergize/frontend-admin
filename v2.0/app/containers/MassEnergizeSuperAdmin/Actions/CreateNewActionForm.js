import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import { reduxForm } from 'redux-form/immutable';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Select2 from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import { MaterialDropZone } from 'dan-components';
import Snackbar from '@material-ui/core/Snackbar';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import TextField from '@material-ui/core/TextField';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertFromRaw, EditorState, convertToRaw } from 'draft-js';
import { apiCall, apiCallWithMedia } from '../../../utils/messenger';
import { initAction, clearAction } from '../../../actions/ReduxFormActions';
import MySnackbarContentWrapper from '../../../components/SnackBar/SnackbarContentWrapper';

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


class CreateNewActionForm extends Component {
  constructor(props) {
    super(props);

    this.updateForm = this.updateForm.bind(this);
    this.state = {
      formData: { tagsSelected: [], vendorsSelected: [], image: [] },
      vendors: [],
      communities: [],
      tagCollections: [],
      submitIsClicked: false,
      stepsToTake: EditorState.createEmpty(),
      aboutThisAction: EditorState.createEmpty(),
      successMsg: null,
      error: null
    };
  }


  async componentDidMount() {
    const tagCollections = await apiCall('/tag_collections.listForSuperAdmin');
    const vendors = await apiCall('/vendors.listForSuperAdmin');
    const communities = await apiCall('/communities.listForSuperAdmin');

    if (tagCollections) {
      const tags = [];
      Object.values(tagCollections.data).forEach(tCol => {
        Object.values(tCol.tags).forEach(t => {
          tags.push({ ...t, tagCollection: tCol.name });
        });
      });
      await this.setStateAsync({ tags });
      await this.setStateAsync({ tagCollections: tagCollections.data });
      const s = new Set();
      tagCollections.data.filter(tc => !tc.allow_multiple).map(l => (
        l.tags.map(t => s.add(t.id))
      ));
      await this.setStateAsync({ singleSelectIDs: s });
    }

    if (vendors) {
      this.setStateAsync({ vendors: vendors.data });
    }

    if (communities) {
      this.setStateAsync({ communities: communities.data });
    }
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  onEditorStateChange = async (name, editorState) => {
    await this.setStateAsync({
      [name]: editorState,
    });
  };

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

  handleFormDataChange = (event) => {
    const { target } = event;
    if (!target) return;
    const { formData } = this.state;
    const { name, value } = target;
    this.setState({
      formData: { ...formData, [name]: value }
    });
  };

  handleCheckBoxSelect = async (event) => {
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
      theList.splice(pos, pos + 1);
    }


    if (name.includes('single')) {
      theList = [newVal];
    } else if (name.includes('multiple')) {
      theList.push(newVal);
    } else {
      theList.push(newVal);
    }

    await this.setStateAsync({
      formData: { ...formData, [name]: theList }
    });
  };

  handleIsTemplateCheckbox = async (event) => {
    const { target } = event;
    if (!target) return;
    const { formData } = this.state;
    const oldValue = formData.is_global;
    const { name } = target;
    if (oldValue !== 'true') {
      delete formData.community;
    }
    await this.setStateAsync({
      formData: { ...formData, [name]: oldValue === 'true' ? 'false' : 'true' }
    });
  };

  handleCloseStyle = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ successMsg: null, error: null });
  };

  submitForm = async (event) => {
    event.preventDefault();
    await this.setStateAsync({submitIsClicked: true})
    const { formData, stepsToTake, aboutThisAction } = this.state;
    const cleanedValues = { ...formData };
    cleanedValues.steps_to_take = draftToHtml(convertToRaw(stepsToTake.getCurrentContent()));
    cleanedValues.about = draftToHtml(convertToRaw(aboutThisAction.getCurrentContent()));

    if (cleanedValues.vendors) {
      cleanedValues.vendors = cleanedValues.vendorsSelected;
    }
    cleanedValues.vendors = cleanedValues.vendorsSelected;
    delete cleanedValues.tagsSelected;
    delete cleanedValues.vendorsSelected;
    delete cleanedValues.undefined;
    cleanedValues.is_global = cleanedValues.is_global === 'true';

    if (cleanedValues.community) {
      cleanedValues.community_id = cleanedValues.community;
      delete cleanedValues.community;
    }

    if (cleanedValues.image && cleanedValues.image[0]) {
      cleanedValues.image = cleanedValues.image[0];
    } else {
      delete cleanedValues.image;
    }

    if (cleanedValues.is_global === 'true') {
      delete cleanedValues.community;
    }

    let tags = [];
    Object.keys(cleanedValues).forEach(name => {
      if (name.includes('tag')) {
        tags = tags.concat(cleanedValues[name]);
        delete cleanedValues[name];
      }
    });
    if (tags) {
      cleanedValues.tags = tags;
    }

    console.log(cleanedValues);

    let response = null;
    // await this.setStateAsync({ ...this.state, submitIsClicked: true });
    if (cleanedValues.image) {
      response = await apiCallWithMedia('/actions.create', cleanedValues);
    } else {
      response = await apiCall('/actions.create', cleanedValues);
    }

    if (response && response.success) {
      console.log(response.data);
      await this.setStateAsync({
        successMsg: `Successfully Created ${response.data.title} Action. Want to Create a new one?  Modify the fields`,
        error: null,
        submitIsClicked: false,
        formData: { tagsSelected: [], vendorsSelected: [], image: [], title: null }
      });
    }

    if (response && !response.success) {
      await this.setStateAsync({ error: response.error, successMsg: null, submitIsClicked: false });
    }
    console.log(response);
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


  render() {
    const trueBool = true;
    const {
      classes,
      submitting,
    } = this.props;
    const {
      formData, error, successMsg, communities, vendors, tagCollections, submitIsClicked, stepsToTake, aboutThisAction
    } = this.state;
    const {
      vendorsSelected, community, title, average_carbon_score, is_global
    } = formData;
    let communitySelected = communities.filter(c => c.id === community)[0];
    communitySelected = communitySelected ? communitySelected.name : '';

    return (
      <div>
        <Grid container spacing={24} alignItems="flex-start" direction="row" justify="center">
          <Grid item xs={12} md={12}>
            <Paper className={classes.root}>
              <Typography variant="h5" component="h3">
                 New Action
              </Typography>
              <div>
                {error
                && (
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
                )}

                {successMsg
                && (
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
                )}

                {error
                  && (
                    <p style={{ color: 'red' }}>{error}</p>
                  )
                }
                { successMsg
                  && (
                    <p style={{ color: 'green' }}>{successMsg}</p>
                  )
                }
              </div>

              <form onSubmit={this.submitForm}>
                <TextField
                  id="outline-required"
                  required
                  name="title"
                  onChange={this.handleFormDataChange}
                  label="Title"
                  placeholder="eg. Take Solar Action"
                  className={classes.field}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  defaultValue={title}
                />

                <div>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={is_global === 'true'}
                        onChange={this.handleIsTemplateCheckbox}
                        value="true"
                        name="is_global"
                      />
                    )}
                    label="Is this action a global/template action?"
                  />
                </div>
                <div>
                  {is_global !== 'true'
                    && (
                      <FormControl className={classes.field}>
                        <InputLabel htmlFor="community">Community</InputLabel>
                        <Select2
                          native
                          name="community"
                          onChange={async (newValue) => { await this.updateForm('community', parseInt(newValue.target.value, 10)); }}
                          inputProps={{
                            id: 'age-native-simple',
                          }}
                        >
                          <option value={community}>{communitySelected}</option>
                          { communities
                            && communities.map(c => (
                              <option value={c.id} key={c.id}>{c.name}</option>
                            ))
                          }
                        </Select2>
                      </FormControl>
                    )
                  }
                </div>
                <div className={classes.field}>
                  <FormControl className={classes.formControl}>
                    <Select2
                      multiple
                      displayEmpty
                      value={vendorsSelected}
                      onChange={this.handleFormDataChange}
                      input={<Input id="select-multiple-checkbox" />}
                      renderValue={selected => {
                        if (selected.length === 0) {
                          return (
                            <em>
                             Please Select Vendors
                            </em>
                          );
                        }
                        const names = selected.map(s => vendors.filter(t => t.id === s)[0].name);
                        return 'Vendors: ' + names.join(', ');
                      }}
                      MenuProps={MenuProps}
                    >
                      {vendors.map(t => (
                        <MenuItem key={t.id} value={t.id}>
                          <Checkbox
                            checked={vendorsSelected.indexOf(t.id) > -1}
                            onChange={this.handleCheckBoxSelect}
                            value={'' + t.id}
                            name="vendorsSelected"
                          />
                          <ListItemText primary={`${t.name}`} />
                        </MenuItem>
                      ))}
                    </Select2>
                  </FormControl>
                </div>

                <TextField
                  id="outline-required"
                  name="average_carbon_score"
                  placeholder="eg. 500"
                  type="number"
                  onChange={this.handleFormDataChange}
                  label="Average Carbon Score"
                  className={classes.field}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  defaultValue={title}
                />


                <Grid item xs={12} style={{ borderColor: '#EAEAEA', borderStyle: 'solid', borderWidth: 'thin' }}>
                  <Typography>About this Action:</Typography>
                  <Editor
                    editorState={aboutThisAction}
                    editorClassName="editorClassName"
                    onEditorStateChange={(e) => this.onEditorStateChange('aboutThisAction', e)}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                  />
                </Grid>
                <br />
                <br />

                <Grid item xs={12} style={{ borderColor: '#EAEAEA', borderStyle: 'solid', borderWidth: 'thin' }}>
                  <Typography>Steps To Take :</Typography>
                  <Editor
                    editorState={stepsToTake}
                    editorClassName="editorClassName"
                    onEditorStateChange={(e) => this.onEditorStateChange('stepsToTake', e)}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                  />
                </Grid>
                <br />
                <br />
                {tagCollections.map(tc => (
                  <div className={classes.field} key={tc.id}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">{`${tc.name} ${tc.allow_multiple ? '' : '(Only one selection allowed)'}`}</FormLabel>
                      <FormGroup>
                        {tc.tags.map(t => (
                          <FormControlLabel
                            key={t.id}
                            control={(
                              <Checkbox
                                checked={this.isThisSelectedOrNot(formData, `tag-${tc.name.toLowerCase()}--${tc.allow_multiple ? 'multiple' : 'single'}`, t.id)}
                                onChange={this.handleCheckBoxSelect}
                                value={'' + t.id}
                                name={`tag-${tc.name.toLowerCase()}--${tc.allow_multiple ? 'multiple' : 'single'}`}
                              />
                            )}
                            label={t.name}
                          />
                        ))}
                      </FormGroup>
                    </FormControl>
                    <br />
                    <br />
                    <br />
                  </div>
                ))}

                <Fragment>
                  <div>
                    <MaterialDropZone
                      acceptedFiles={['image/jpeg', 'image/png', 'image/jpg', 'image/bmp', 'image/svg']}
                      files={this.state.formData.image}
                      showPreviews
                      maxSize={5000000}
                      filesLimit={1}
                      text="Please Upload the Display Image for this Action"
                      addToState={this.updateForm}
                    />
                  </div>
                </Fragment>

                {submitIsClicked
                  && (
                    <div>
                      <h5>Creating your Action ...</h5>
                      <InputLabel>This might take a minute ...</InputLabel>
                      <CircularProgress className={classes.progress} />
                    </div>
                  )
                }


                <div>
                  <Button variant="contained" color="secondary" type="submit" disabled={submitting}>
                    Submit
                  </Button>
                </div>
              </form>


              <div>
                <br />
                <br />
                <Button variant="contained" color="secondary">
                  <Link to="/admin/read/actions" style={{ color: 'white' }}>
                    See All Actions
                  </Link>
                </Button>
              </div>

            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

CreateNewActionForm.propTypes = {
  classes: PropTypes.object.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const mapDispatchToProps = dispatch => ({
  init: bindActionCreators(initAction, dispatch),
  clear: () => dispatch(clearAction),
});

const ReduxFormMapped = reduxForm({
  form: 'immutableExample',
  enableReinitialize: true,
})(CreateNewActionForm);

const reducer = 'initval';
const FormInit = connect(
  state => ({
    force: state,
    initialValues: state.getIn([reducer, 'formValues'])
  }),
  mapDispatchToProps,
)(ReduxFormMapped);

export default withStyles(styles, { withTheme: true })(FormInit);
