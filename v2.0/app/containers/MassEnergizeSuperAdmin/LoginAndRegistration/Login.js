import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { LoginForm } from 'dan-components';
import styles from 'dan-components/Forms/user-jss';
import { apiCall } from '../../../utils/messenger';

class Login extends React.Component {
  submitForm = async (values) => {
    await apiCall('auth.login', values.entries(), '/admin');
  }


  render() {
    const title = brand.name + ' - Login';
    const description = brand.desc;
    const {
      classes, started, signOutFxn, loginWithFacebookFxn, loginWithGoogleFxn, normalLoginFxn, error
    } = this.props;

    return (
      <div className={classes.root}>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>

        <div className={classes.container}>
          <div className={classes.userFormWrap}>
            <LoginForm
              started={started}
              signOutFxn={signOutFxn}
              loginWithFacebookFxn={loginWithFacebookFxn}
              normalLoginFxn={normalLoginFxn}
              err={error}
              onSubmit={this.submitForm}
              loginWithGoogleFxn={loginWithGoogleFxn}
            />
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};
const mapDispatchToProps = dispatch => ({});

const LoginMapped = connect(
  mapDispatchToProps
)(Login);
export default withStyles(styles)(LoginMapped);
