import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import { Editor } from 'react-draft-wysiwyg';
// import draftToHtml from 'draftjs-to-html';
// import { convertFromRaw, EditorState, convertToRaw } from 'draft-js';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Select2 from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';

import { reduxForm } from 'redux-form/immutable';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import { MaterialDropZone } from 'dan-components';
import CircularProgress from '@material-ui/core/CircularProgress';

import { fetchData, sendFormWithMedia } from '../../../utils/messenger';
import { initAction, clearAction } from '../../../actions/ReduxFormActions';

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

class EditActionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: { tagsSelected: [], vendorsSelected: [], image: [] },
      tags: [],
      vendors: [],
      communities: [],
      tagCollections: [],
      uploadedImage: null,
      submitIsClicked: false
    };
    this.updateForm = this.updateForm.bind(this);
  }


  async componentDidMount() {
    const { id } = this.props.match.params;
    const tagCollections = await fetchData('v2/tag-collections');
    const vendors = await fetchData('v2/vendors');
    const communities = await fetchData('v2/communities');
    const action = await fetchData(`v2/action/${id}`);

    if (tagCollections) {
      const tags = [];
      Object.values(tagCollections.data).forEach(tCol => {
        Object.values(tCol.tags).forEach(t => {
          tags.push({ ...t, tagCollection: tCol.name });
        });
      });
      this.setStateAsync({ tags });
      this.setStateAsync({ tagCollections: tagCollections.data });
    }

    if (vendors) {
      await this.setStateAsync({ vendors: vendors.data });
    }

    if (communities) {
      await this.setStateAsync({ communities: communities.data });
    }

    if (action) {
      await this.setStateAsync({ formData: this.getFormDataFromAction(action.data) });
      await this.setStateAsync({ uploadedImage: action.data.image });
    }
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  getFormDataFromAction = (action) => {
    const res = {
      id: action.id,
      title: action.title,
      about: action.about,
      is_global: action.is_global ? 'true' : 'false',
      average_carbon_score: action.average_carbon_score,
      image: [],
      steps_to_take: action.steps_to_take,
      tagsSelected: action.tags.map(t => t.id),
      vendorsSelected: action.vendors.map(v => v.id)
    };
    if (action.community) {
      res.community = action.community.id;
    }
    return res;
  }


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

  handleCheckBoxSelect = async (event) => {
    const { target } = event;
    if (!target) return;
    const { formData } = this.state;
    const { name, value } = target;
    const theList = formData[name];
    const newVal = parseInt(value, 10);
    const pos = theList.indexOf(newVal);
    if (pos > -1) {
      theList.splice(pos, pos + 1);
    } else {
      theList.push(newVal);
    }
    await this.setStateAsync({
      formData: { ...formData, [name]: theList }
    });
  };

  submitForm = async (event) => {
    event.preventDefault();
    const { formData } = this.state;
    const cleanedValues = { ...formData };
    cleanedValues.tags = cleanedValues.tagsSelected;
    cleanedValues.vendors = cleanedValues.vendorsSelected;
    delete cleanedValues.tagsSelected;
    delete cleanedValues.vendorsSelected;
    delete cleanedValues.undefined;

    if (cleanedValues.image && cleanedValues.image[0]) {
      cleanedValues.image = cleanedValues.image[0];
    } else {
      delete cleanedValues.image;
    }
    if (cleanedValues.is_global === 'true') {
      delete cleanedValues.community;
    }
    await sendFormWithMedia(cleanedValues, `/v2/action/${formData.id}`, `/admin/read/action/${cleanedValues.id}/edit`);
    await this.setStateAsync({ ...this.state, submitIsClicked: true });
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
    console.log(this.state);
  }

  render() {
    const trueBool = true;
    const {
      classes,
      submitting,
    } = this.props;
    const {
      formData, communities, vendors, tagCollections, uploadedImage, submitIsClicked, 
    } = this.state;
    const { 
      id, tagsSelected, vendorsSelected, community, title, is_global,
      steps_to_take, about, average_carbon_score
    } = formData;
    let communitySelected = communities.filter(c => c.id === community)[0];
    communitySelected = communitySelected ? communitySelected.name : '';

    if (!id) {
      return (
        <Grid container spacing={24} alignItems="flex-start" direction="row" justify="center">
          <Grid item xs={12} md={6}>
            <Paper className={classes.root}>
              <div className={classes.root}>
                <LinearProgress />
                <h1>Fetching all data for this Action</h1>
                <br />
                <LinearProgress color="secondary" />
              </div>
            </Paper>
          </Grid>
        </Grid>
      );
    }
    return (
      <div>
        <Grid container spacing={24} alignItems="flex-start" direction="row" justify="center">
          <Grid item xs={12} md={6}>
            <Paper className={classes.root}>
              <Typography variant="h5" component="h3">
                 Edit Action { id ? ` with id: ${id}` : '' }
              </Typography>
              <div>
                <img src={uploadedImage ? uploadedImage.url : ""} className={classes.img} alt={"Title"} />
              </div>
              <form onSubmit={this.submitForm}>
                <div>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="title">Title</InputLabel>
                    <Input id="title" value={title} name="title" onChange={this.handleFormDataChange} />
                  </FormControl>
                </div>
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
                    &&
                    (
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
                    <InputLabel htmlFor="steps_to_take">Steps to Take</InputLabel>
                    <Input
                      id="steps_to_take"
                      value={steps_to_take} 
                      name="steps_to_take"
                      onChange={this.handleFormDataChange}
                      multiline={trueBool}
                      rows={4}
                    />
                  </FormControl>
                </div>
                {/* <Grid item xs={12}>
                  <Editor
                    editorState={editorState}
                    editorClassName={classes.textEditor}
                    toolbarClassName={classes.toolbarEditor}
                    onEditorStateChange={this.onEditorStateChange}
                  />
                </Grid> */}
                <div className={classes.field}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="about">About this Action</InputLabel>
                    <Input
                      id="about"
                      value={about}
                      name="about"
                      onChange={this.handleFormDataChange}
                      multiline={trueBool}
                      rows={4}
                    />
                  </FormControl>
                </div>
                <div className={classes.field}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="average_carbon_score">Average Carbon Score</InputLabel>
                    <Input
                      id="average_carbon_score"
                      value={average_carbon_score} 
                      name="average_carbon_score"
                      placeholder="eg. 5"
                      onChange={this.handleFormDataChange}
                    />
                  </FormControl>
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
                      {vendors.map(t => {
                        return (
                          <MenuItem key={t.id} value={t.id}>
                            <Checkbox
                              checked={vendorsSelected.indexOf(t.id) > -1}
                              onChange={this.handleCheckBoxSelect}
                              value={'' + t.id}
                              name="vendorsSelected"
                            />
                            <ListItemText primary={`${t.name}`} />
                          </MenuItem>
                        );
                      })}
                    </Select2>
                  </FormControl>
                </div>

                {tagCollections.map(tc => (
                  <div className={classes.field} key={tc.id}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">{tc.name}</FormLabel>
                      <FormGroup>
                        {tc.tags.map(t => (
                          <FormControlLabel
                            key={t.id}
                            control={(
                              <Checkbox
                                checked={tagsSelected.indexOf(t.id) > -1}
                                onChange={this.handleCheckBoxSelect}
                                value={'' + t.id}
                                name="tagsSelected"
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
                      <h5>Updating this Action ...</h5>
                      <InputLabel>This could take a few seconds ...</InputLabel>
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
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

EditActionForm.propTypes = {
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
})(EditActionForm);

const reducer = 'initval';
const FormInit = connect(
  state => ({
    force: state,
    initialValues: state.getIn([reducer, 'formValues'])
  }),
  mapDispatchToProps,
)(ReduxFormMapped);

export default withStyles(styles, { withTheme: true })(FormInit);
