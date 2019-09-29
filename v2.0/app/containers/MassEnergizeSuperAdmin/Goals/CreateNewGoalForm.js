import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Select2 from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import { Field, reduxForm } from 'redux-form/immutable';
import Grid from '@material-ui/core/Grid';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import {
  TextField,
} from 'redux-form-material-ui';
import { fetchData, sendJson } from '../../../utils/messenger';
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


class CreateNewGoalForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: { admins: [], members: [] },
      communities: [],
      teams: [],
      is_community_goal: true
    };
  }


  async componentDidMount() {
    const teams = await fetchData('v2/teams');
    const communities = await fetchData('v2/communities');

    if (teams && teams.success) {
      this.setStateAsync({ teams: teams.data });
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
    const response = await sendJson(cleanedValues, '/v2/teams', '/admin/read/goals');
    console.log(response);
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
      formData, communities, teams, is_community_goal
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

                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={is_community_goal}
                        onChange={async () => await this.setStateAsync({ is_community_goal: !is_community_goal })}
                        value={is_community_goal}
                        name="is_community_goal"

                      />
                    )}
                    label="This is a Community Goal"
                  />

                  {is_community_goal
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


                {!is_community_goal 

                  && (
                    <div>
                      <FormControl className={classes.field}>
                        <InputLabel htmlFor="team">Team</InputLabel>
                        <Select2
                          native
                          name="team"
                          onChange={async (newValue) => { await this.updateForm('team', parseInt(newValue.target.value, 10)); }}
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
