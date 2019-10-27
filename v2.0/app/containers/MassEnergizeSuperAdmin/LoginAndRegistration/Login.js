import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { LoginForm } from 'dan-components';
import styles from 'dan-components/Forms/user-jss';
import { sendJson } from '../../../utils/messenger';
import CircularProgress from '@material-ui/core/CircularProgress';
import purple from '@material-ui/core/colors/purple';
// import { bindActionCreators } from 'redux';

class Login extends React.Component {
  submitForm = (values) => {
    sendJson(values.entries(), '/v2/users', '/admin');
  }


  render() {
    const title = brand.name + ' - Login';
    const description = brand.desc;
    const {
      classes, signOutFxn, loginWithFacebookFxn, loginWithGoogleFxn, normalLoginFxn, error
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
const mapStateToProps = (store) => {
  auth: store.auth
};

const LoginMapped = connect(
  mapDispatchToProps
)(Login);
export default withStyles(styles)(LoginMapped);
