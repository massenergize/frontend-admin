import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Select2 from '@material-ui/core/Select';
import { reduxForm } from 'redux-form/immutable';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import MySnackbarContentWrapper from '../../../components/SnackBar/SnackbarContentWrapper';

import { apiCall } from '../../../utils/messenger';
import { initAction, clearAction } from '../../../actions/ReduxFormActions';

const renderRadioGroup = ({ input, ...rest }) => (
  <RadioGroup
    {...input}
    {...rest}
    valueselected={input.value}
    onChange={(event, value) => input.onChange(value)}
  />
);

// validation functions
const required = value => (value == null ? 'Required' : undefined);

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

});


class CreateNewGoalForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      communities: [],
      teams: [],
      is_community_goal: true,
      error: null,
      successMsg: null
    };
  }


  async componentDidMount() {
    const teamsResponse = await apiCall('/teams.listForSuperAdmin');
    const communitiesResponse = await apiCall('/communities.listForSuperAdmin');
    if (teamsResponse && teamsResponse.success) {
      this.setStateAsync({ teams: teamsResponse.data });
    }

    if (communitiesResponse && communitiesResponse.success) {
      this.setStateAsync({ communities: communitiesResponse.data });
    }
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
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
    const { name, value } = target;
    const { formData } = this.state;
    this.setState({
      formData: { ...formData, [name]: value }
    });
  }

  handleCloseStyle = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ successMsg: null, error: null });
  };

  submitForm = async (event) => {
    event.preventDefault();
    const { formData } = this.state;
    const cleanedValues = { ...formData };
    if (cleanedValues.community) {
      cleanedValues.community_id = cleanedValues.community;
    }
    if (cleanedValues.team) {
      cleanedValues.team_id = cleanedValues.team;
    }
    delete cleanedValues.community;
    delete cleanedValues.team;

    const response = await apiCall('/goals.create', cleanedValues);
    if (response && !response.success) {
      await this.setStateAsync({ error: response.error, successMsg: null });
    } else if (response && response.success) {
      await this.setStateAsync({ successMsg: 'Successfully Created this Goal', error: null });
      window.location.href = `/admin/edit/${response.data.id}/goal`;
    }
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
      formData, communities, teams, is_community_goal, error, successMsg
    } = this.state;
    const { community, team } = formData;
    let communitySelected = communities.filter(c => c.id === community)[0];
    communitySelected = communitySelected ? communitySelected.name : '';
    let teamSelected = teams.filter(t => t.id === team)[0];
    teamSelected = teamSelected ? teamSelected.id : '';

    return (
      <div>
        <Grid container spacing={24} alignItems="flex-start" direction="row" justify="center">
          <Grid item xs={12} md={6}>
            <Paper className={classes.root}>
              <div style={{ margin: 30 }} />
              <Typography variant="h5" component="h3">
                 New Goal
              </Typography>
              <div style={{ margin: 50 }} />
              <form onSubmit={this.submitForm}>
                <div>
                  <div>
                    <Snackbar
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
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

                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={is_community_goal}
                        onChange={async () => await this.setStateAsync({ is_community_goal: !is_community_goal })}
                        value={'' + is_community_goal}
                        name="is_community_goal"

                      />
                    )}
                    label="This is a Community Goal"
                  />

                  {is_community_goal
                    && (
                      <FormControl className={classes.field}>
                        <InputLabel htmlFor="community_id">Community</InputLabel>
                        <Select2
                          native
                          name="community_id"
                          onChange={async (newValue) => { await this.updateForm('community_id', parseInt(newValue.target.value, 10)); }}
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


                {!is_community_goal

                  && (
                    <div>
                      <FormControl className={classes.field}>
                        <InputLabel htmlFor="team_id">Team</InputLabel>
                        <Select2
                          native
                          name="team_id"
                          onChange={async (newValue) => { await this.updateForm('team_id', parseInt(newValue.target.value, 10)); }}
                          inputProps={{
                            id: 'age-native-simple',
                          }}
                        >
                          <option value={team}>{teamSelected}</option>
                          { teams
                                && teams.map(c => (
                                  <option value={c.id} key={c.id}>{c.name}</option>
                                ))
                          }
                        </Select2>
                      </FormControl>
                    </div>
                  )
                }

                <TextField
                  id="outline-required"
                  required
                  name="name"
                  onChange={this.handleFormDataChange}
                  label="Name"
                  placeholder="eg. Take 10,000 actions"
                  className={classes.field}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  name="attained_number_of_actions"
                  type="number"
                  placeholder="eg 100"
                  label="Attained Number of Actions"
                  className={classes.field}
                  onChange={this.handleFormDataChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  name="attained_number_of_households"
                  placeholder="eg. 250"
                  type="number"
                  label="Attained Number of Households"
                  className={classes.field}
                  onChange={this.handleFormDataChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  name="attained_carbon_footprint_reduction"
                  placeholder="eg. 250"
                  type="number"
                  label="Attained Carbon Footprint Reduction"
                  className={classes.field}
                  onChange={this.handleFormDataChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  name="target_number_of_actions"
                  placeholder="eg 100"
                  label="Target Number of Actions"
                  type="number"
                  className={classes.field}
                  onChange={this.handleFormDataChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  name="target_number_of_households"
                  placeholder="eg. 250"
                  type="number"
                  label="Target Number of Households"
                  className={classes.field}
                  onChange={this.handleFormDataChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  name="target_carbon_footprint_reduction"
                  placeholder="eg. 250"
                  type="number"
                  label="Target Carbon Footprint Reduction"
                  className={classes.field}
                  onChange={this.handleFormDataChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  name="description"
                  className={classes.field}
                  placeholder="eg. Description ..."
                  label="Describe this Goal"
                  multiline={trueBool}
                  rows={4}
                  onChange={this.handleFormDataChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
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

renderRadioGroup.propTypes = {
  input: PropTypes.object.isRequired,
};


const mapDispatchToProps = dispatch => ({
  init: bindActionCreators(initAction, dispatch),
  clear: () => dispatch(clearAction),
});

const ReduxFormMapped = reduxForm({
  form: 'immutableExample',
  enableReinitialize: true,
})(CreateNewGoalForm);

const reducer = 'initval';
const FormInit = connect(
  state => ({
    force: state,
    initialValues: state.getIn([reducer, 'formValues'])
  }),
  mapDispatchToProps,
)(ReduxFormMapped);

export default withStyles(styles, { withTheme: true })(FormInit);
