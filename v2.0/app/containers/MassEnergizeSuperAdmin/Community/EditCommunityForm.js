import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Field, reduxForm } from 'redux-form/immutable';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputLabel from '@material-ui/core/InputLabel';
import {
  Checkbox,
  TextField
} from 'redux-form-material-ui';
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
const email = value => (
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email'
    : undefined
);

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


class EditCommunityForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLocation: false
    };
  }

  getInitData = (community) => ({
    name: community.name,
    subdomain: community.subdomain,
    about_community: community.about_community,
    owner_name: community.owner_name,
    owner_email: community.owner_email,
    geographical_focus: community.is_geographically_focused ? 'FOCUSED' : 'DISPERSED',
    ...community.location
  });

  render() {
    const trueBool = true;
    const {
      classes,
      handleSubmit,
      submitting,
      init,
      community,
      submitIsClicked
    } = this.props;

    init(this.getInitData(community));

    return (
      <div>
        <Grid container spacing={24} alignItems="flex-start" direction="row" justify="center">
          <Grid item xs={12} md={6}>
            <Paper className={classes.root}>
              <Typography variant="h5" component="h3">
                Edit
                {`for ${community.name} (ID: ${community.id})`}
              </Typography>
              <Typography component="p">
                Please complete this form to the best of your knowledge.
              </Typography>
              <form onSubmit={handleSubmit}>
                <div>
                  <Field
                    name="name"
                    component={TextField}
                    placeholder="Community Name eg. Wayland"
                    label="Community Name"
                    required
                    validate={[required]}
                    className={classes.field}
                    value={community.name}
                  />
                </div>
                <div>
                  <Field
                    name="subdomain"
                    component={TextField}
                    placeholder="eg. You will need your subdomain to access your community portal through subdomain.massenergize.org"
                    label="Subdomain For your Community Portal"
                    required
                    validate={[required]}
                    className={classes.field}
                    value={community.name}
                  />
                </div>
                <h1>About the Community Admin</h1>
                <div>
                  <Field
                    name="owner_name"
                    component={TextField}
                    placeholder="Community Admin Name eg. Ellen Tohn"
                    label="Community Administrator's Name"
                    required
                    validate={[required]}
                    className={classes.field}
                  />
                </div>
                <div>
                  <Field
                    name="owner_email"
                    component={TextField}
                    placeholder="eg. admin@wayland.com"
                    label="Community Administrator's Email"
                    required
                    validate={[required, email]}
                    className={classes.field}
                  />
                </div>
                <div className={classes.field}>
                  <Field
                    name="about_community"
                    className={classes.field}
                    component={TextField}
                    placeholder="Tell us about you"
                    label="Tell Us About You"
                    multiline={trueBool}
                    rows={4}
                  />
                </div>
                <div className={classes.fieldBasic}>
                  <FormLabel component="label">Geographic Focus</FormLabel>
                  <Field name="geographical_focus" className={classes.inlineWrap} component={renderRadioGroup}>
                    <FormControlLabel value="DISPERSED" control={<Radio />} label="Geographically Dispersed" onClick={() => { this.setState({ ...this.sate, showLocation: false }); }} />
                    <FormControlLabel value="FOCUSED" control={<Radio />} label="Geographically Focused" onClick={() => { this.setState({ ...this.sate, showLocation: true }); }} />
                  </Field>
                </div>
                {this.state.showLocation
                  && (

                    <Grid container spacing={24}>
                      <Grid item xs={12}>
                        <Field
                          name="address1"
                          component={TextField}
                          placeholder="eg. 9 Fields Lane"
                          label="Address Line 1"
                          className={classes.field}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          name="address2"
                          component={TextField}
                          placeholder="eg. Apt 4"
                          label="Address Line 2"
                          className={classes.field}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          name="city"
                          component={TextField}
                          placeholder="eg. Wayland"
                          label="City"
                          className={classes.field}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          name="state"
                          component={TextField}
                          placeholder="eg. New York"
                          label="State"
                          className={classes.field}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          name="zip"
                          component={TextField}
                          placeholder="eg. 10120"
                          label="Zip / Postal Code"
                          className={classes.field}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          name="country"
                          component={TextField}
                          placeholder="eg. Ghana"
                          label="Country"
                          className={classes.field}
                        />
                      </Grid>
                    </Grid>
                  )
                }
                <div>
                  {submitIsClicked
                    && (
                      <div>
                        <h5>Updating this Community ...</h5>
                        <InputLabel>This might take a minute ...</InputLabel>
                        <CircularProgress className={classes.progress} />
                      </div>
                    )
                  }
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

EditCommunityForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  init: PropTypes.func.isRequired,
  clear: PropTypes.func.isRequired,
  community: PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => ({
  init: bindActionCreators(initAction, dispatch),
  clear: () => dispatch(clearAction),
});

const ReduxFormMapped = reduxForm({
  form: 'immutableExample',
  enableReinitialize: true,
})(EditCommunityForm);

const reducer = 'initval';
const FormInit = connect(
  state => ({
    force: state,
    initialValues: state.getIn([reducer, 'formValues'])
  }),
  mapDispatchToProps,
)(ReduxFormMapped);

export default withStyles(styles)(FormInit);
