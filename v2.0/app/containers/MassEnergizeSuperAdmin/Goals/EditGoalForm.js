import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Select2 from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import { Field, reduxForm } from 'redux-form/immutable';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ErrorIcon from '@material-ui/icons/Error';
import Input from '@material-ui/core/Input';

import {
  TextField,
} from 'redux-form-material-ui';
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
  buttonInit: {
    margin: theme.spacing.unit * 4,
    textAlign: 'center'
  },
});

const variantIcon = {
  error: ErrorIcon,
};

const styles1 = theme => ({
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});
const MySnackbarContentWrapper = withStyles(styles1)(SnackbarContent);


class CreateNewGoalForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      communities: [],
      teams: [],
      is_community_goal: true,
      error: null
    };
  }


  async componentDidMount() {
    const teamsResponse = await apiCall('/teams.listForSuperAdmin');
    const communitiesResponse = await apiCall('/communities.listForSuperAdmin');
    const { id } = this.props.match.params;
    const goalResponse = await apiCall('/goals.info', { goal_id: id });
    if (teamsResponse && teamsResponse.success) {
      await this.setStateAsync({ teams: teamsResponse.data });
    }

    if (communitiesResponse && communitiesResponse.success) {
      await this.setStateAsync({ communities: communitiesResponse.data });
    }

    if (goalResponse && goalResponse.success) {
      await this.setStateAsync({ ...this.state, formData: goalResponse.data });
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

  submitForm = async (event) => {
    event.preventDefault();
    const { formData } = this.state;
    const cleanedValues = { ...formData };
    const response = await apiCall('/goals.update', cleanedValues, '/admin/read/goals');
    if (response && !response.success) {
      await this.setStateAsync({ error: response.error });
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
      formData, communities, teams, is_community_goal, error
    } = this.state;
    const { community, team, name } = formData;
    let communitySelected = communities.filter(c => c.id === community)[0];
    communitySelected = communitySelected ? communitySelected.name : '';
    let teamSelected = teams.filter(t => t.id === team)[0];
    teamSelected = teamSelected ? teamSelected.id : '';

    console.log(name)
    return (
      <div>
        <Grid container spacing={24} alignItems="flex-start" direction="row" justify="center">
          <Grid item xs={12} md={6}>
            <Paper className={classes.root}>
              <div style={{ margin: 30 }} />
              <Typography variant="h5" component="h3">
                 Edit Goal
              </Typography>
              <div style={{ margin: 50 }} />
              <form onSubmit={this.submitForm}>
                <div>

                  {error
                  && (
                    <Snackbar
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      autoHideDuration={6000}
                      onClose={this.handleCloseStyle}
                    >
                      <MySnackbarContentWrapper
                        variant="error"
                        message={error}
                      />
                    </Snackbar>
                  )
                  }

                  {error
                  && (
                    <p style={{color: 'red'}}>{error}</p>
                  )
                  }

                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={is_community_goal}
                        onChange={async () => await this.setStateAsync({ is_community_goal: !is_community_goal })}
                        value={''+is_community_goal}
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

                <div>
                  <Field
                    name="name"
                    component={TextField}
                    placeholder="Name"
                    label="Name"
                    validate={required}
                    required
                    className={classes.field}
                    onChange={this.handleFormDataChange}
                  />
                </div>
                <div>
                  <Field
                    name="target_number_of_actions"
                    component={TextField}
                    placeholder="eg 100"
                    label="Target Number of Actions"
                    validate={required}
                    required
                    ref={this.saveRef}
                    className={classes.field}
                    onChange={this.handleFormDataChange}
                  />
                </div>
                <div>
                  <Field
                    name="target_number_of_households"
                    component={TextField}
                    placeholder="eg. 250"
                    label="Target Number of Households"
                    validate={required}
                    required
                    ref={this.saveRef}
                    className={classes.field}
                    onChange={this.handleFormDataChange}
                  />
                </div>
                <div className={classes.field}>
                  <Field
                    name="description"
                    className={classes.field}
                    component={TextField}
                    placeholder="eg. Description ..."
                    label="Describe this Goal"
                    multiline={trueBool}
                    rows={4}
                    onChange={this.handleFormDataChange}
                  />
                </div>
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
