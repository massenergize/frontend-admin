import React from 'react';
import Outer from '../../Templates/Outer';
import Login from '../../MassEnergizeSuperAdmin/LoginAndRegistration/Login';

class LoginDedicated extends React.Component {
  render() {
    const {
      user, error, signOutFxn, loginWithFacebookFxn, loginWithGoogleFxn, normalLoginFxn
    } = this.props;

    if (user) {
      window.location = '/dash-summary';
    }

    return (
      <Outer>
        <Login
          error={error}
          signOutFxn={signOutFxn}
          loginWithFacebookFxn={loginWithFacebookFxn}
          normalLoginFxn={normalLoginFxn}
          loginWithGoogleFxn={loginWithGoogleFxn}
        />
      </Outer>
    );
  }
}

export default LoginDedicated;
