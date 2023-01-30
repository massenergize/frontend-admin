import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@mui/styles";
import classNames from 'classnames';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form/immutable';
import { Checkbox, TextField } from 'redux-form-material-ui';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ArrowForward from '@mui/icons-material/ArrowForward';
import AllInclusive from '@mui/icons-material/AllInclusive';
import Brightness5 from '@mui/icons-material/Brightness5';
import People from '@mui/icons-material/People';
import Icon from '@mui/material/Icon';
import Hidden from '@mui/material/Hidden';
import brand from 'dan-api/dummy/brand';
import logo from 'dan-images/logo.png';
import styles from './user-jss';

// validation functions
const required = value => (value == null ? 'Required' : undefined);
const email = value => (
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email'
    : undefined
);

const passwordsMatch = (value, allValues) => {
  if (value !== allValues.get('password')) {
    return 'Passwords dont match';
  }
  return undefined;
};

class RegisterForm extends React.Component {
  state = {
    tab: 0,
  };

  handleClickShowPassword = () => {
    const { showPassword } = this.state;
    this.setState({ showPassword: !showPassword });
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  handleChangeTab = (event, value) => {
    this.setState({ tab: value });
  };

  render() {
    const {
      classes,
      handleSubmit,
      pristine,
      submitting,
      deco
    } = this.props;
    const { tab } = this.state;
    return (
      <Fragment>
        <Hidden mdUp>
          <NavLink to="/" className={classNames(classes.brand, classes.outer)}>
            <img src={logo} alt={brand.name} />
            {brand.name}
          </NavLink>
        </Hidden>
        <Paper className={classNames(classes.paperWrap, deco && classes.petal)}>
          <Hidden smDown>
            <div className={classes.topBar}>
              <NavLink to="/" className={classes.brand}>
                <img src={logo} alt={brand.name} />
                {brand.name}
              </NavLink>
              <Button size="small" className={classes.buttonLink} component={NavLink} to="/login">
                <Icon className={classes.icon}>arrow_forward</Icon>
                Already have account ?
              </Button>
            </div>
          </Hidden>
          <Typography variant="h4" className={classes.title} gutterBottom>
            Register
          </Typography>
          <Typography variant="caption" className={classes.subtitle} gutterBottom align="center">
            You can only register an account if you have received an invitation
          </Typography>
          <Tabs
            value={tab}
            onChange={this.handleChangeTab}
            indicatorColor="secondary"
            textColor="secondary"
            centered
            className={classes.tab}
          >
            <Tab label="With Email" />
            {/* <Tab label="With Social Media" /> */}
          </Tabs>
          {tab === 0 && (
            <section className={classes.formWrap}>
              <form onSubmit={handleSubmit}>
                <div>
                  <FormControl className={classes.formControl}>
                    <Field
                      name="name"
                      component={TextField}
                      placeholder="Username"
                      label="Username"
                      required
                      className={classes.field}
                    />
                  </FormControl>
                </div>
                <div>
                  <FormControl className={classes.formControl}>
                    <Field
                      name="email"
                      component={TextField}
                      placeholder="Your Email"
                      label="Your Email"
                      required
                      validate={[required, email]}
                      className={classes.field}
                    />
                  </FormControl>
                </div>
                <div>
                  <FormControl className={classes.formControl}>
                    <Field
                      name="community_subdomain"
                      component={TextField}
                      placeholder="wayland.massenergize.org"
                      label="Community Domain"
                      required
                      className={classes.field}
                    />
                  </FormControl>
                </div>
                <div>
                  <FormControl className={classes.formControl}>
                    <Field
                      name="invitation_code"
                      component={TextField}
                      placeholder="eg. AC-2r45Hj-H"
                      label="Invitation Code"
                      required
                      className={classes.field}
                    />
                  </FormControl>
                </div>
                <div>
                  <FormControl className={classes.formControl}>
                    <Field
                      name="password"
                      component={TextField}
                      type="password"
                      label="Your Password"
                      required
                      validate={[required, passwordsMatch]}
                      className={classes.field}
                    />
                  </FormControl>
                </div>
                <div>
                  <FormControl className={classes.formControl}>
                    <Field
                      name="passwordConfirm"
                      component={TextField}
                      type="password"
                      label="Re-type Password"
                      required
                      validate={[required, passwordsMatch]}
                      className={classes.field}
                    />
                  </FormControl>
                </div>
                <div>
                  <FormControlLabel control={<Field name="checkbox" component={Checkbox} className={classes.agree} />} label="Agree with" />
                  <a href="#" className={classes.link}>Terms &amp; Condition</a>
                </div>
                <div className={classes.btnArea}>
                  <Button variant="contained" color="primary" type="submit">
                    Continue
                    <ArrowForward className={classNames(classes.rightIcon, classes.iconSmall)} disabled={submitting || pristine} />
                  </Button>
                </div>
              </form>
            </section>
          )}
          {tab === 1 && (
            <section className={classes.socmedFull}>
              <Button fullWidth variant="outlined" size="large" className={classes.redBtn} type="button">
                <AllInclusive className={classNames(classes.leftIcon, classes.iconSmall)} />
                Socmed 1
              </Button>
              <Button fullWidth variant="outlined" size="large" className={classes.blueBtn} type="button">
                <Brightness5 className={classNames(classes.leftIcon, classes.iconSmall)} />
                Socmed 2
              </Button>
              <Button fullWidth variant="outlined" size="large" className={classes.cyanBtn} type="button">
                <People className={classNames(classes.leftIcon, classes.iconSmall)} />
                Socmed 3
              </Button>
            </section>
          )}
        </Paper>
      </Fragment>
    );
  }
}

RegisterForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  deco: PropTypes.bool.isRequired,
};

const RegisterFormReduxed = reduxForm({
  form: 'immutableExample',
  enableReinitialize: true,
})(RegisterForm);

const reducer = 'ui';
const RegisterFormMapped = connect(
  state => ({
    force: state,
    deco: state.getIn([reducer, 'decoration'])
  }),
)(RegisterFormReduxed);

export default withStyles(styles)(RegisterFormMapped);
