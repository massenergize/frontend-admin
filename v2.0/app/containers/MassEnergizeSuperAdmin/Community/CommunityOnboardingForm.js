import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Field, reduxForm } from 'redux-form/immutable';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import {
  Checkbox,
  Select,
  TextField,
  Switch
} from 'redux-form-material-ui';
import MomentUtils from '@date-io/moment';
import { DateTimePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
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

const initData = {
  name: 'Wayland',
  community_admin_email: 'community_admin@wayland.com',
  subdomain: 'wayland.massenergize.org',
  community_admin_name: 'Ellen Tohn',
  community_admin_phone: '508-609-9002',
  is_tech_savvy: 'Yes',
  geographical_focus: 'DISPERSED',
  checkbox: true,
  about_you: 'We are a town located in Massachussets and looking to engage our community in take climate change actions'
};

class CommunityOnboardingForm extends Component {
  render() {
    const trueBool = true;
    const {
      classes,
      handleSubmit,
      pristine,
      reset,
      submitting,
      init,
      clear
    } = this.props;

    return (
      <div>
        <Grid container spacing={24} alignItems="flex-start" direction="row" justify="center">
          <Grid item xs={12} md={6}>
            <Paper className={classes.root}>
              <Typography variant="h5" component="h3">
                Community Onboarding Form
              </Typography>
              <Typography component="p">
                Please complete this form to the best of your knowledge.
              </Typography>
              <div className={classes.buttonInit}>
                <Button onClick={() => init(initData)} color="secondary" type="button">
                  Load Sample Data
                </Button>
                <Button onClick={() => clear()} type="button">
                  Clear Data
                </Button>
              </div>
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
                  />
                </div>
                <div>
                  <Field
                    name="subdomain"
                    component={TextField}
                    placeholder="eg. subdomain.massenergize.org"
                    label="Subdomain For your Community Portal"
                    required
                    validate={[required]}
                    className={classes.field}
                  />
                </div>
                <h1>About the Community Admin</h1>
                <div>
                  <Field
                    name="community_admin_name"
                    component={TextField}
                    placeholder="Community Admin Name eg. Ellen Tohn"
                    label="Community Adminstrator's Name"
                    required
                    validate={[required]}
                    className={classes.field}
                  />
                </div>
                <div>
                  <Field
                    name="community_admin_email"
                    component={TextField}
                    placeholder="eg. admin@wayland.com"
                    label="Community Adminstrator's Email"
                    required
                    validate={[required, email]}
                    className={classes.field}
                  />
                </div>
                <div>
                  <Field
                    name="community_admin_phone"
                    component={TextField}
                    placeholder="eg. 508 889 1334"
                    label="Community Adminstrator's Phone"
                    required
                    validate={[required]}
                    className={classes.field}
                  />
                </div>
                <div className={classes.field}>
                  <Field
                    name="about_you"
                    className={classes.field}
                    component={TextField}
                    placeholder="Tell us about you"
                    label="Tell Us About You"
                    multiline={trueBool}
                    rows={4}
                  />
                </div>
                <div className={classes.fieldBasic}>
                  <FormLabel component="label">Are you Tech Savvy?</FormLabel>
                  <Field name="is_tech_savvy" className={classes.inlineWrap} component={renderRadioGroup}>
                    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="No" control={<Radio />} label="No" />
                  </Field>
                </div>
                <div className={classes.fieldBasic}>
                  <FormLabel component="label">Geographic Focus</FormLabel>
                  <Field name="geographical_focus" className={classes.inlineWrap} component={renderRadioGroup}>
                    <FormControlLabel value="DISPERSED" control={<Radio />} label="Geographically Dispersed" />
                    <FormControlLabel value="FOCUSED" control={<Radio />} label="Geographically Focused" />
                  </Field>
                </div>
                <div className={classes.fieldBasic}>
                  <FormLabel component="label">Terms and Conditions</FormLabel>
                  <div className={classes.inlineWrap}>
                    <FormControlLabel control={<Field name="accepted_terms_and_conditions" component={Checkbox} />} label="I have read and accepted all the terms and conditions" />
                  </div>
                </div>
                <div>
                  <Button variant="contained" color="secondary" type="submit" disabled={submitting}>
                    Submit
                  </Button>
                  <Button
                    type="button"
                    disabled={pristine || submitting}
                    onClick={reset}
                  >
                    Reset
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

CommunityOnboardingForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  init: PropTypes.func.isRequired,
  clear: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  init: bindActionCreators(initAction, dispatch),
  clear: () => dispatch(clearAction),
});

const ReduxFormMapped = reduxForm({
  form: 'immutableExample',
  enableReinitialize: true,
})(CommunityOnboardingForm);

const reducer = 'initval';
const FormInit = connect(
  state => ({
    force: state,
    initialValues: state.getIn([reducer, 'formValues'])
  }),
  mapDispatchToProps,
)(ReduxFormMapped);

export default withStyles(styles)(FormInit);
